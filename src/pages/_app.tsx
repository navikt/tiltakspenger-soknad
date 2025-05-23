import React, { createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { AppProps } from 'next/app';
import '@navikt/ds-css';
import { initializeFaro } from '@grafana/faro-web-sdk';
import Søknad from '@/types/Søknad';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import { UtfyllingContext } from './utfylling/[[...step]]';
import { NextPage } from 'next';
import defaultValues from '@/defaultValues';
import '../styles/global.css';
import Head from 'next/head';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'tiltakspenger-soknad',
        },
    });
}

interface UtfyllingSetStateContextType {
    setTiltak: Dispatch<SetStateAction<undefined | Tiltak[]>>;
    setPersonalia: Dispatch<SetStateAction<undefined | Personalia>>;
    setValgtTiltak: Dispatch<SetStateAction<undefined | Tiltak>>;
}

export const UtfyllingSetStateContext = createContext<Partial<UtfyllingSetStateContextType>>({});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
    const formMethods = useForm<Søknad>({
        defaultValues: defaultValues,
        mode: 'onSubmit',
    });

    const [valgtTiltak, setValgtTiltak] = useState<Tiltak | undefined>();
    const [personalia, setPersonalia] = useState<Personalia | undefined>();
    const [tiltak, setTiltak] = useState<Tiltak[] | undefined>();

    const getLayout = Component.getLayout || ((page) => page);
    return getLayout(
        <main>
            <Head>
                <title>Søknad om tiltakspenger</title>
            </Head>
            <FormProvider {...formMethods}>
                <UtfyllingContext.Provider value={{ valgtTiltak, personalia, tiltak }}>
                    <UtfyllingSetStateContext.Provider value={{ setValgtTiltak, setPersonalia, setTiltak }}>
                        <Component {...pageProps} />
                    </UtfyllingSetStateContext.Provider>
                </UtfyllingContext.Provider>
            </FormProvider>
        </main>,
    );
}

export default App;
