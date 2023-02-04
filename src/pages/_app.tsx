import "@/styles/globals.css"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
const BiconomyContextProvider = dynamic(
	() => import("../components/contexts/BiconomyContext"),
	{
		ssr: false,
	},
)

export default function App({ Component, pageProps }: AppProps) {
	return (
    // useContext(BiconomyContext) to get the account, socialLoginSDK, provider, smart account, connectWeb3 and disconnectWeb3 inside any component
		<BiconomyContextProvider>
			<Component {...pageProps} />
		</BiconomyContextProvider>
	)
}
