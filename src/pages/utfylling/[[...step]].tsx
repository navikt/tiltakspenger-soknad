import React, { createContext, ReactElement, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getOnBehalfOfToken, redirectToLogin } from '@/utils/authentication';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import { Søknadssteg } from '@/types/Søknadssteg';
import { brukerHarFyltUtNødvendigeOpplysninger } from '@/utils/stepValidators';
import AktivtSøknadssteg from '@/components/aktivt-søknadssteg/AktivtSøknadssteg';
import { UtfyllingSetStateContext } from '@/pages/_app';
import SøknadLayout from '@/components/søknad-layout/SøknadLayout';
import { pageWithAuthentication } from '@/utils/pageWithAuthentication';
import { mocketTiltak } from '@/mocks/mockedTiltak';

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
}

interface UtfyllingContextType {
    tiltak: Tiltak[];
    personalia: Personalia;
    valgtTiltak?: Tiltak;
}

export const UtfyllingContext = createContext<Partial<UtfyllingContextType>>({});

export default function Utfylling({ tiltak }: UtfyllingProps) {
    const router = useRouter();

    const { step } = router.query;
    const { getValues, watch, reset, setValue } = useFormContext();
    const { setTiltak, setValgtTiltak } = useContext(UtfyllingSetStateContext);
    const { valgtTiltak } = useContext(UtfyllingContext);
    const valgtAktivitetId = watch('svar.tiltak.aktivitetId');

    React.useEffect(() => {
        setTiltak!(tiltak);
    }, []);

    React.useEffect(() => {
        const matchendeTiltak = tiltak.find(({ aktivitetId }) => aktivitetId === valgtAktivitetId);
        if (matchendeTiltak) {
            setValgtTiltak!(matchendeTiltak);
            const arenaFra = matchendeTiltak.arenaRegistrertPeriode?.fra;
            const arenaTil = matchendeTiltak.arenaRegistrertPeriode?.til;
            slettSvarVedEndretTiltak();
            setValue('svar.tiltak', {
                ...getValues('svar.tiltak'),
                periode: { fra: arenaFra ?? '', til: arenaTil ?? '' },
                arenaRegistrertPeriode: valgtTiltak?.arenaRegistrertPeriode,
            });
        }
    }, [valgtAktivitetId]);

    const slettSvarVedEndretTiltak = () => {
        setValue('svar.institusjonsopphold', {});
        setValue('svar.introduksjonsprogram', {});
        setValue('svar.kvalifiseringsprogram', {});
        setValue('svar.sykepenger', {});
        setValue('svar.gjenlevendepensjon', {});
        setValue('svar.alderspensjon', {});
        setValue('svar.supplerendestønadover67', {});
        setValue('svar.supplerendestønadflyktninger', {});
        setValue('svar.pensjonsordning', {});
        setValue('svar.etterlønn', {});
        setValue('svar.jobbsjansen', {});
        setValue('svar.mottarAndreUtbetalinger', undefined);
        setValue('svar.harBekreftetAlleOpplysninger', undefined);
        setValue('svar.harBekreftetÅSvareSåGodtManKan', true);
    };

    function utledSøknadsstegFraRoute(route: string | undefined): Søknadssteg | null {
        switch (route) {
            case Søknadssteg.TILTAK:
                return Søknadssteg.TILTAK;
            case Søknadssteg.PROGRAM_DELTAGELSE:
                return Søknadssteg.PROGRAM_DELTAGELSE;
            case Søknadssteg.ANDRE_UTBETALINGER:
                return Søknadssteg.ANDRE_UTBETALINGER;
            case Søknadssteg.INSTITUSJONSOPPHOLD:
                return Søknadssteg.INSTITUSJONSOPPHOLD;
            case Søknadssteg.BARNETILLEGG:
                return Søknadssteg.BARNETILLEGG;
            case Søknadssteg.OPPSUMMERING:
                return Søknadssteg.OPPSUMMERING;
            case Søknadssteg.KVITTERING:
                return Søknadssteg.KVITTERING;
            default:
                return null;
        }
    }

    const søknad = watch();
    const { svar } = søknad;

    const aktivtSøknadssteg = utledSøknadsstegFraRoute(step && step[0]);

    function navigateTo(path: string, shallow: boolean = false) {
        return router.push(path, undefined, { shallow });
    }

    const brukerErPåSteg = (søknadssteg: Søknadssteg | null) => {
        const formStateErGyldig = brukerHarFyltUtNødvendigeOpplysninger(svar, søknadssteg);
        return step && step[0] === søknadssteg && formStateErGyldig;
    };

    if (aktivtSøknadssteg == null) {
        navigateTo('/404');
    }

    const brukerErIGyldigTilstand = brukerErPåSteg(aktivtSøknadssteg);

    React.useEffect(() => {
        // fikser noe timing issues med valideringsmeldinger som dukker opp for tidlig
        const timeoutId = setTimeout(() => {
            reset(søknad, { keepValues: true });
        });
        if (!brukerErIGyldigTilstand) {
            navigateTo('/');
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [step]);

    if (brukerErIGyldigTilstand) {
        return <AktivtSøknadssteg steg={aktivtSøknadssteg} />;
    } else {
        return null;
    }
}

Utfylling.getLayout = function getLayout(page: ReactElement) {
    return <SøknadLayout>{page}</SøknadLayout>;
};

const getServerSidePropsLive = pageWithAuthentication(async (context: GetServerSidePropsContext) => {
    let token = null;
    try {
        token = await getOnBehalfOfToken(context.req.headers.authorization!!);
    } catch (error) {
        logger.error(`Bruker har ikke tilgang. Message ${(error as Error).message}`);
        return redirectToLogin(context);
    }

    const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;

    try {
        logger.info('Hent data om tiltak start');
        const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
        if (tiltakResponse.ok) {
            const tiltakJson = await tiltakResponse.json();
            logger.info('Hent data om tiltak OK');
            const svarMedMocketTiltak =
                process.env.NODE_ENV === 'development' && (!tiltakJson.tiltak || tiltakJson.tiltak.length === 0);
            return {
                props: {
                    tiltak: svarMedMocketTiltak ? mocketTiltak : tiltakJson.tiltak,
                },
            };
        } else {
            throw new Error(`${tiltakResponse.status} ${tiltakResponse.statusText}`);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            logger.error((error as Error).message);
            return {
                props: {
                    tiltak: mocketTiltak,
                },
            };
        }
        logger.error(
            `Noe gikk galt ved henting av tiltak: ${(error as Error).message}, redirecter bruker til /generell-feil`,
        );
        return {
            redirect: {
                destination: '/generell-feil',
                permanent: false,
            },
        };
    }
});

const getServerSidePropsDemo = async () => {
    return {
        props: {
            tiltak: mocketTiltak,
        },
    };
};

export const getServerSideProps = process.env.IS_DEMO_MODE === 'true' ? getServerSidePropsDemo : getServerSidePropsLive;
