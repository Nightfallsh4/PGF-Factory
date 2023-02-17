import "@/styles/globals.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import CreateNFT from "./createNft"
// import CampaignDetails from "./CampaignDetails";
import CreateCampaign from "./CreateCampaign";
import Homee from "./Home";
import { FundCard } from "./components";
import  DisplayCampaigns from "./DisplayCampaigns";
const BiconomyContextProvider = dynamic(
	() => import("../contexts/BiconomyContext"),
	{
		ssr: false,
	},
)

export default function App({ Component, pageProps }) {
	return (
    // useContext(BiconomyContext) to get the account, socialLoginSDK, provider, smart account, connectWeb3 and disconnectWeb3 inside any component
		<BiconomyContextProvider>
			<BrowserRouter>
			<CreateNFT/>
			<div>
				<Routes>
					{/* <CreateNFT/> */}
          {/* <Route path="/" element={<Homee/>} /> */}
          {/* <Route path="myNfts" element={<Profile />} /> */}
          <Route path="/" element={<CreateCampaign />} />
          {/* <Route path="/contract-details/:id" element={<CampaignDetails/>} /> */}
        </Routes>
				</div>
				</BrowserRouter>
		</BiconomyContextProvider>
   
	)
}
