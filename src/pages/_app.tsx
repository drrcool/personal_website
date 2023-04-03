import type { AppProps } from "next/app";
import ThemeContextProvider from "../components/hooks/ThemeContextProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}

export default MyApp;
