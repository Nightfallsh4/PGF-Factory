import SmartAccount from "@biconomy/smart-account"
import SocialLogin from "@biconomy/web3-auth"
import { ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { ChainId } from "../../utils/chainConfig"
import React, {createContext} from "react"

type BiconomyContextType = {
	children: React.ReactNode
}

type BiconomyContextValueType = {
    account:string | undefined,
    provider:any,
    smartAccount: SmartAccount | null,
    socialLoginSDK: SocialLogin | null,
    connectWeb3:() => Promise<SocialLogin | null | undefined>,
    disconnectWeb3: () => Promise<void>
}

export const BiconomyContext = createContext<BiconomyContextValueType | null>(null)
const BiconomyContextProvider = ({children}: BiconomyContextType) =>{
    const [provider, setProvider] = useState<any>()
	const [account, setAccount] = useState<string | undefined>("")
	const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
	const [scwAddress, setScwAddress] = useState("")
	const [scwLoading, setScwLoading] = useState(false)
	const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(null)

	const connectWeb3 = useCallback(async () => {
		if (typeof window === "undefined") return
		console.log("socialLoginSDK", socialLoginSDK)
		if (socialLoginSDK?.provider) {
			const web3Provider = new ethers.providers.Web3Provider(
				socialLoginSDK.provider,
			)
			setProvider(web3Provider)
			const accounts = await web3Provider.listAccounts()
			setAccount(accounts[0])
			return
		}
		if (socialLoginSDK) {
			socialLoginSDK.showWallet()
			return socialLoginSDK
		}
		const sdk = new SocialLogin()
		await sdk.init({ chainId: ethers.utils.hexValue(80001) })
		setSocialLoginSDK(sdk)
		// sdk.showConnectModal()
		sdk.showWallet()
		return socialLoginSDK
	}, [socialLoginSDK])

	// if wallet already connected close widget
	useEffect(() => {
		console.log("hidelwallet")
		if (socialLoginSDK && socialLoginSDK.provider) {
			socialLoginSDK.hideWallet()
		}
	}, [account, socialLoginSDK])

	// after metamask login -> get provider event
	useEffect(() => {
		const interval = setInterval(async () => {
			if (account) {
				clearInterval(interval)
			}
			if (socialLoginSDK?.provider && !account) {
				connectWeb3()
			}
		}, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [account, connectWeb3, socialLoginSDK])

	const disconnectWeb3 = async () => {
		if (!socialLoginSDK || !socialLoginSDK.web3auth) {
			console.error("Web3Modal not initialized.")
			return
		}
		await socialLoginSDK.logout()
		socialLoginSDK.hideWallet()
		setProvider(undefined)
		setAccount(undefined)
		setScwAddress("")
	}

	useEffect(() => {
		async function setupSmartAccount() {
			setScwAddress("")
			setScwLoading(true)
			const smartAccount = new SmartAccount(provider, {
				activeNetworkId: ChainId.POLYGON_MUMBAI,
				supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
				networkConfig: [
					{
						chainId: ChainId.POLYGON_MUMBAI,
						dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_MUMBAI,
						// check in the beginning of the page to play around with testnet common keys
						// customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
					},
				],
			})
			await smartAccount.init()
			const context = smartAccount.getSmartAccountContext()
			setScwAddress(context.baseWallet.getAddress())
			setSmartAccount(smartAccount)
			setScwLoading(false)
		}
		if (!!provider && !!account) {
			setupSmartAccount()
			console.log("Provider...", provider)
		}
	}, [account, provider])

	return <BiconomyContext.Provider value={{account, provider, smartAccount, socialLoginSDK, connectWeb3,disconnectWeb3}}>{children}</BiconomyContext.Provider>
}

export default BiconomyContextProvider