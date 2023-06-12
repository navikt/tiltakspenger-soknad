import React, { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getOnBehalfOfToken } from '@/utils/authentication';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import Søknad from '@/types/Søknad';
import { Søknadssteg } from '@/types/Søknadssteg';
import { brukerHarFyltUtNødvendigeOpplysninger } from '@/utils/stepValidators';
import AktivtSøknadssteg from '@/components/aktivt-søknadssteg/AktivtSøknadssteg';
import { UtfyllingSetStateContext } from '@/pages/_app';

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

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    let token = null;
    try {
        logger.info('Henter token');
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new Error('Mangler token');
        }
        token = await getOnBehalfOfToken(authorizationHeader);
    } catch (error) {
        logger.info('Bruker har ikke tilgang', error);
        return {
            redirect: {
                destination: '/oauth2/login',
                permanent: false,
            },
        };
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
        const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
        const tiltakJson = await tiltakResponse.json();
        const personaliaResponse = await makeGetRequest(`${backendUrl}/personalia`, token);
        const personaliaJson = await personaliaResponse.json();
        const svarMedMocketTiltak = !tiltakJson.tiltak || tiltakJson.tiltak.length === 0;
        return {
            props: {
                tiltak: svarMedMocketTiltak ? mocketTiltak : tiltakJson.tiltak,
                personalia: {
                    ...personaliaJson,
                    barn: personaliaJson.barn.map((barn: any) => ({
                        ...barn,
                        uuid: uuidv4(),
                    })),
                },
            },
        };
    } catch (error) {
        logger.error((error as Error).message);
        return {
            props: {
                tiltak: mocketTiltak,
                personalia: {
                    fornavn: 'Foo',
                    mellomnavn: 'Bar',
                    etternavn: 'Baz',
                    fødselsnummer: '123',
                    barn: [
                        { fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() },
                        { fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4() },
                    ],
                },
            },
        };
    }
}
