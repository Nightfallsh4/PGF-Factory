import "@/styles/globals.css"
import { BrowserRouter } from "react-router-dom"
// import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import CreateNFT from "./createNft"
const BiconomyContextProvider = dynamic(
	() => import("../components/contexts/BiconomyContext"),
	{
		ssr: false,
	},
)

export default function App({ Component, pageProps }) {
	return (
    // useContext(BiconomyContext) to get the account, socialLoginSDK, provider, smart account, connectWeb3 and disconnectWeb3 inside any component
		<BiconomyContextProvider>
			<div>
      <BrowserRouter>
        <CreateNFT />
        </BrowserRouter>
    </div>
		</BiconomyContextProvider>
   
	)
}
