import "@/styles/globals.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import CreateNFT from "./createNft"
import "@biconomy/web3-auth/dist/src/style.css"
// import CampaignDetails from "./CampaignDetails";
import CreateCampaign from "./create"
import Homee from "./Home"

// import 'bootstrap/dist/css/bootstrap.min.css';
import DisplayCampaigns from "./DisplayCampaigns"
import Land from "./Land"

import { ChakraProvider } from "@chakra-ui/react"
import "@rainbow-me/rainbowkit/styles.css"
import Navbar from "./Navbar"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    polygonMumbai,
} from "wagmi/chains"
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { NotificationProvider } from "@web3uikit/core"
import { publicProvider } from "wagmi/providers/public"
// const BiconomyContextProvider = dynamic(
//     () => import("../contexts/BiconomyContext"),
//     { ssr: false }
// )

const { chains, provider } = configureChains(
    [polygonMumbai],
    [
        //   alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider(),
    ]
)

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

export default function App({ Component, pageProps }) {
    return (
        // useContext(BiconomyContext) to get the account, socialLoginSDK, provider, smart account, connectWeb3 and disconnectWeb3 inside any component
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <NotificationProvider>
                        <Navbar />
                        {/* <BrowserRouter>
                        <CreateNFT />
                        </BrowserRouter> */}
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
