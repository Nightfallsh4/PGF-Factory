import { useAccount } from "wagmi"
import NFTCard from "../components/NFTCard"
import PushSupportChat from "../../notifications/supportChat"

export default function ListedContracts() {
    const { address, isConnected } = useAccount()

    return (
        <>
            {isConnected ? (
                <div>
                    <div>
                        <PushSupportChat userAddress={address} />
                    </div>
                    <div className="grid grid-cols-4 justify-center items-center gap-4 p-4">
                        <NFTCard
                            nftImage={
                                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                            }
                            nftDetails={
                                "This NFT is perfect for modern cyberpunks, crypto bros, degens and for people who love crypto for the tech."
                            }
                            nftTitle={"Sofa Contract"}
                            funding={"0.03"}
                            duration={"3"}
                            isListed={true}
                        />
                    </div>
                </div>
            ) : (
                <div>Please Connect Wallet</div>
            )}
        </>
    )
}
