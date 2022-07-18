import React from "react";
import "../../styles/globals.css";
import "../../styles/old/tiltakspenger-main.css";
import "@navikt/ds-css";
import type { AppProps } from "next/app";
import { TranslationContext } from "../i18n/i18n";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TranslationContext.Provider value={pageProps.translations}>
      <Component {...pageProps} />
    </TranslationContext.Provider>
  );
}

export default MyApp;
