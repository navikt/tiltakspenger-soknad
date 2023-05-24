import type { AppProps } from 'next/app';
import '@navikt/ds-css';
import '../styles/global.css';
import { initializeFaro } from '@grafana/faro-web-sdk';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'tiltakspenger-soknad',
        },
    });
}

function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default App;
