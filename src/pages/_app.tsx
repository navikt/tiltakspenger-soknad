import type { AppProps } from 'next/app';
import '@navikt/ds-css';
import '../styles/global.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Personalia } from '@/types/Personalia';
import { initializeFaro } from '@grafana/faro-web-sdk';
import SøknadResponse from '@/types/SøknadResponse';

export const defaultPersonalia = {
    fornavn: 'Foo',
    mellomnavn: 'Bar',
    etternavn: 'Baz',
    fødselsnummer: '123',
    barn: [{ fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() }],
};

if (typeof window !== 'undefined') {
    initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'tiltakspenger-soknad',
        },
    });
}

function App({ Component, pageProps }: AppProps) {
    const [personaliaData, setPersonaliaData] = useState<Personalia>(defaultPersonalia);
    const [søknadResponse, setSøknadResponse] = useState<SøknadResponse>();

    return (
        <Component
            {...pageProps}
            setPersonaliaData={setPersonaliaData}
            personalia={personaliaData}
            setSøknadResponse={setSøknadResponse}
            søknadResponse={søknadResponse}
        />
    );
}

export default App;
