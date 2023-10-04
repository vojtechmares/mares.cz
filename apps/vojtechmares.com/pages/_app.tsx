import { Analytics } from '@vercel/analytics/react';
import { AppProps } from "next/app";

import "@/css/tailwind.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );

}

export default App;
