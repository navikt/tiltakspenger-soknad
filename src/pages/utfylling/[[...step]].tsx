import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import KvpSteg from '@/components/innledningssteg/KvpSteg';
import Tiltakssteg from '@/components/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/components/andre-utbetalinger-steg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/components/barnetillegg-steg/BarnetilleggSteg';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { GetServerSidePropsContext } from 'next';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import toSøknadJson from '@/utils/toSøknadJson';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import Søknad from '@/types/Søknad';

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
    setPersonaliaData: (personalia: Personalia) => void;
}

export default function Utfylling({ tiltak, personalia, setPersonaliaData }: UtfyllingProps) {
    const router = useRouter();

    React.useEffect(()=> {
        setPersonaliaData(personalia);
    }, [personalia]);

    const { step } = router.query;
    const formMethods = useForm<Søknad>({
        defaultValues: {
            svar: {
                tiltak: {},
                barnetillegg: {
                    registrerteBarnSøktBarnetilleggFor: [],
                    manueltRegistrerteBarnSøktBarnetilleggFor: [
                        { fornavn: '', etternavn: '', fødselsdato: '', bostedsland: '' },
                    ],
                },
                etterlønn: {},
                institusjonsopphold: {},
                introduksjonsprogram: {},
                kvalifiseringsprogram: {},
                pensjonsordning: {},
            },
            vedlegg: [],
        },
    });

    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak | null>(null);
    const valgtAktivitetId = formMethods.watch('svar.tiltak.aktivitetId');
    React.useEffect(() => {
        const matchendeTiltak = tiltak.find(({ aktivitetId }) => aktivitetId === valgtAktivitetId);
        if (matchendeTiltak) {
            setValgtTiltak(matchendeTiltak);
        }
    }, [valgtAktivitetId]);

    function navigateToPath(path: string, shallow: boolean) {
        return router.push(path, undefined, { shallow });
    }

    const navigerBrukerTilIntroside = (shallow: boolean = true) => navigateToPath('/', shallow);
    const navigerBrukerTilTiltakssteg = (shallow: boolean = true) => navigateToPath('/utfylling/tiltak', shallow);
    const navigerBrukerTilKvpSteg = (shallow: boolean = true) => navigateToPath('/utfylling/kvp', shallow);
    const navigerBrukerTilAndreUtbetalingerSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/andreutbetalinger', shallow);
    const navigerBrukerTilBarnetilleggSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/barnetillegg', shallow);
    const navigerBrukerTilOppsummeringssteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/oppsummering', shallow);

    const sendSøknad = async (søknad: Søknad) => {
        const søknadJson = toSøknadJson(søknad.svar, personalia.barn);
        const formData = new FormData();
        formData.append('søknad', søknadJson as string);
        søknad.vedlegg.forEach((vedlegg, index) => {
            formData.append(`vedlegg-${index}`, vedlegg.file);
        });
        try {
            const response = await fetch('/api/soknad', {
                method: 'POST',
                body: formData,
            });
            if (response.status !== 201) {
                return router.push('/feil');
            }
            return router.push('/kvittering');
        } catch {
            return router.push('/feil');
        }
    };

    return (
        <FormProvider {...formMethods}>
            {step && step[0] === 'tiltak' && (
                <Tiltakssteg
                    onCompleted={navigerBrukerTilKvpSteg}
                    onGoToPreviousStep={() => navigerBrukerTilIntroside(false)}
                    tiltak={tiltak}
                    valgtTiltak={valgtTiltak}
                />
            )}
            {step && step[0] === 'kvp' && (
                <KvpSteg
                    onCompleted={navigerBrukerTilAndreUtbetalingerSteg}
                    onGoToPreviousStep={navigerBrukerTilTiltakssteg}
                    valgtTiltak={valgtTiltak!}
                />
            )}
            {step && step[0] === 'andreutbetalinger' && (
                <AndreUtbetalingerSteg
                    onCompleted={navigerBrukerTilBarnetilleggSteg}
                    onGoToPreviousStep={navigerBrukerTilKvpSteg}
                />
            )}
            {step && step[0] === 'barnetillegg' && (
                <BarnetilleggSteg
                    onCompleted={navigerBrukerTilOppsummeringssteg}
                    onGoToPreviousStep={navigerBrukerTilAndreUtbetalingerSteg}
                    personalia={personalia}
                />
            )}
            {step && step[0] === 'oppsummering' && (
                <Oppsummeringssteg
                    onCompleted={sendSøknad}
                    onGoToPreviousStep={navigerBrukerTilBarnetilleggSteg}
                    personalia={personalia}
                    valgtTiltak={valgtTiltak!}
                />
            )}
        </FormProvider>
    );
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
            deltakelsePeriode: { fra: '2025-04-01', til: '2025-04-10' },
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
                    barn: [{ fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() }],
                },
            },
        };
    }
}
