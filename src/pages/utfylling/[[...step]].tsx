import React, { createContext, ReactElement, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getOnBehalfOfToken, redirectToLogin } from '@/utils/authentication';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import Søknad from '@/types/Søknad';
import { Søknadssteg } from '@/types/Søknadssteg';
import { brukerHarFyltUtNødvendigeOpplysninger } from '@/utils/stepValidators';
import AktivtSøknadssteg from '@/components/aktivt-søknadssteg/AktivtSøknadssteg';
import { UtfyllingSetStateContext } from '@/pages/_app';
import SøknadLayout from '@/components/søknad-layout/SøknadLayout';
import { pageWithAuthentication } from '@/utils/pageWithAuthentication';

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
    const { getValues, watch, reset, setValue } = useFormContext<Søknad>();
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
            setValue('svar.tiltak', {
                ...getValues('svar.tiltak'),
                periode: { fra: arenaFra ?? '', til: arenaTil ?? '' },
                arenaRegistrertPeriode: valgtTiltak?.arenaRegistrertPeriode,
            });
        }
    }, [valgtAktivitetId]);

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

    const svar = getValues().svar;
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
        setTimeout(() => reset(getValues(), { keepValues: true }));
        if (!brukerErIGyldigTilstand) {
            navigateTo('/');
        }
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

export const getServerSideProps = pageWithAuthentication(async (context: GetServerSidePropsContext) => {
    let token = null;
    try {
        token = await getOnBehalfOfToken(context.req.headers.authorization!!);
    } catch (error) {
        logger.error('Bruker har ikke tilgang', error);
        return redirectToLogin(context);
    }

    const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;
    const mocketTiltak = [
        {
            aktivitetId: '123',
            type: 'Annen utdanning',
            typeNavn: 'Annen utdanning',
            deltakelsePeriode: { fra: '2025-04-01', til: '2025-04-10' },
            arenaRegistrertPeriode: { fra: '2025-04-01', til: '2025-04-10' },
            arrangør: 'Testarrangør',
            status: 'Aktuell',
        },
        {
            aktivitetId: '12asdad3',
            type: 'Annen utdaasdanning',
            typeNavn: 'Annen utdaasdnning',
            deltakelsePeriode: { fra: '2025-04-02', til: '2025-04-10' },
            arenaRegistrertPeriode: {},
            arrangør: 'Testarrangør',
            status: 'Aktuell',
        },
        {
            aktivitetId: '12sdf3',
            type: 'Annen utdanwerning',
            typeNavn: 'Annen utdweranning',
            deltakelsePeriode: { fra: '2025-04-01', til: '2025-04-10' },
            arenaRegistrertPeriode: { fra: '2025-04-01' },
            arrangør: 'Testarrangør',
            status: 'Aktuell',
        },
    ];

    try {
        logger.info('Hent data om tiltak start');
        const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
        const tiltakJson = await tiltakResponse.json();
        logger.info('Hent data om tiltak OK');
        const svarMedMocketTiltak =
            process.env.NODE_ENV === 'development' && (!tiltakJson.tiltak || tiltakJson.tiltak.length === 0);
        return {
            props: {
                tiltak: svarMedMocketTiltak ? mocketTiltak : tiltakJson.tiltak,
            },
        };
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
            'Noe gikk galt ved henting av tiltak, redirecter bruker til /generell-feil',
            (error as Error).message
        );
        return {
            redirect: {
                destination: '/generell-feil',
                permanent: false,
            },
        };
    }
});
