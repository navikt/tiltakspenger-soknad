import { createContext, Dispatch, SetStateAction, useState } from 'react';
import type { AppProps } from 'next/app';
import '@navikt/ds-css';
import { initializeFaro } from '@grafana/faro-web-sdk';
import { FormProvider, useForm } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import { UtfyllingContext } from './utfylling/[[...step]]';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import '../styles/global.css';

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

function App({ Component, pageProps }: AppProps) {
    const formMethods = useForm<Søknad>({
        defaultValues: {
            svar: {
                tiltak: {},
                barnetillegg: {
                    eøsOppholdForBarnFraAPI: {},
                    manueltRegistrerteBarnSøktBarnetilleggFor: [],
                },
                institusjonsopphold: {},
                introduksjonsprogram: {},
                kvalifiseringsprogram: {},
                sykepenger: {},
                gjenlevendepensjon: {},
                alderspensjon: {},
                supplerendestønadover67: {},
                supplerendestønadflyktninger: {},
                pensjonsordning: {},
                etterlønn: {},
                jobbsjansen: {},
                mottarAndreUtbetalinger: undefined,
                harBekreftetAlleOpplysninger: false,
                harBekreftetÅSvareSåGodtManKan: false,
            },
            vedlegg: [],
        },
        mode: 'onSubmit',
    });

    const [valgtTiltak, setValgtTiltak] = useState<Tiltak | undefined>();
    const [personalia, setPersonalia] = useState<Personalia | undefined>();
    const [tiltak, setTiltak] = useState<Tiltak[] | undefined>();

    return (
        <FormProvider {...formMethods}>
            <UtfyllingContext.Provider value={{ valgtTiltak, personalia, tiltak }}>
                <UtfyllingSetStateContext.Provider value={{ setValgtTiltak, setPersonalia, setTiltak }}>
                    <Component {...pageProps} />
                </UtfyllingSetStateContext.Provider>
            </UtfyllingContext.Provider>
        </FormProvider>
    );
}

export default App;
