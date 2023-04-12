import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import KvpSteg from '@/components/innledningssteg/KvpSteg';
import Tiltakssteg from '@/components/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/components/andre-utbetalinger-steg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/components/barnetillegg-steg/BarnetilleggSteg';
import Søknad from '@/types/Søknad';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { GetServerSidePropsContext } from 'next';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import toSøknadJson from '@/utils/toSøknadJson';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
}

export default function Utfylling({ tiltak, personalia }: UtfyllingProps) {
    const router = useRouter();
    const { step } = router.query;
    const formMethods = useForm<Søknad>({
        defaultValues: {
            svar: {
                manueltRegistrerteBarnSøktBarnetilleggFor: [
                    { fornavn: '', etternavn: '', fødselsdato: '', bostedsland: '' },
                ],
                borPåInstitusjon: undefined,
                mottarEllerSøktPensjonsordning: undefined,
                mottarEllerSøktEtterlønn: undefined,
                søkerOmBarnetillegg: undefined,
                deltarIKvp: undefined,
                deltarIIntroprogrammet: undefined,
            },
            vedlegg: [],
        },
    });

    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak | null>(null);
    const valgtAktivitetId = formMethods.watch('valgtAktivitetId');
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

    const sendSøknad = async (data: Søknad) => {
        const søknadJson = toSøknadJson(data.svar);
        const formData = new FormData();
        formData.append('søknad', søknadJson as string);
        formData.append('vedlegg', data.vedlegg[0]);
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

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
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

    const backendUrl = process.env.TILTAKSPENGESOKNAD_API_URL;
    try {
        const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
        const tiltakJson = await tiltakResponse.json();
        const personaliaResponse = await makeGetRequest(`${backendUrl}/personalia`, token);
        const personaliaJson = await personaliaResponse.json();

        // midlertidig fiks for å kunne trykke seg gjennom søknader i test
        if (!tiltakJson.tiltak || tiltakJson.tiltak.length === 0) {
            throw Error('Bruker har ingen tiltak, fallback til testdata');
        }

        return {
            props: {
                tiltak: tiltakJson.tiltak,
                personalia: personaliaJson,
            },
        };
    } catch (error) {
        logger.error((error as Error).message);
        return {
            props: {
                tiltak: [
                    {
                        aktivitetId: '123',
                        type: 'Annen utdanning',
                        deltakelsePeriode: { fom: '2025-04-01', tom: '2025-04-10' },
                        arrangør: 'Testarrangør',
                        status: 'Aktuell',
                    },
                ],
                personalia: {
                    fornavn: 'Foo',
                    mellomnavn: 'Bar',
                    etternavn: 'Baz',
                    fødselsnummer: '123',
                    barn: [{ fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01' }],
                },
            },
        };
    }
}
