import type { AppProps } from 'next/app';
import '@navikt/ds-css';
import { initializeFaro } from '@grafana/faro-web-sdk';
import { FormProvider, useForm } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import '../styles/global.css';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'tiltakspenger-soknad',
        },
    });
}

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

    return (
        <FormProvider {...formMethods}>
            <Component {...pageProps} />
        </FormProvider>
    );
}

export default App;
