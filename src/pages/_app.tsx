import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
    RainbowKitProvider,
    getDefaultWallets,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MantineProvider } from "@mantine/core";
import { Provider as UrqlProvider } from "urql";
import { urqlClient } from "../utils/urql";
import Layout from "../components/Layout";

const { chains, provider, webSocketProvider } = configureChains(
    [
        chain.localhost,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
            ? [chain.goerli]
            : []),
    ],
    [
        alchemyProvider({
            // This is Alchemy's default API key.
            // You can get your own at https://dashboard.alchemyapi.io
            apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: "RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <UrqlProvider value={urqlClient}>
                <RainbowKitProvider chains={chains}>
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        theme={{
                            /** Put your mantine theme override here */
                            colorScheme: "light",
                        }}
                    >
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </MantineProvider>
                </RainbowKitProvider>
            </UrqlProvider>
        </WagmiConfig>
    );
}

export default MyApp;
