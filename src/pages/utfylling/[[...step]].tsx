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

interface UtfyllingProps {
    tiltak: any;
}

export default function Utfylling({ tiltak }: UtfyllingProps) {
    const router = useRouter();
    const { step } = router.query;
    const formMethods = useForm<Søknad>({
        defaultValues: {
            barnSøktBarnetilleggFor: [{ fornavn: '', etternavn: '', fdato: '', bostedsland: '' }],
            borPåInstitusjon: undefined,
            mottarEllerSøktPensjonsordning: undefined,
            mottarEllerSøktEtterlønn: undefined,
            søkerOmBarnetillegg: undefined,
            deltarIKvp: undefined,
            deltarIIntroprogrammet: undefined,
        },
    });

    const navigerBrukerTilIntroside = () => router.push('/');
    const navigerBrukerTilTiltakssteg = () => router.push('/utfylling/tiltak');
    const navigerBrukerTilKvpSteg = () => router.push('/utfylling/kvp');
    const navigerBrukerTilAndreUtbetalingerSteg = () => router.push('/utfylling/andreutbetalinger');
    const navigerBrukerTilBarnetilleggSteg = () => router.push('/utfylling/barnetillegg');
    const navigerBrukerTilOppsummeringssteg = () => router.push('/utfylling/oppsummering');

    const sendSøknad = (data: Søknad) => {
        const søknadJson = toSøknadJson(data);
        fetch('/api/soknad', {
            method: 'POST',
            body: søknadJson as string,
        });
    };

    return (
        <FormProvider {...formMethods}>
            {step && step[0] === 'tiltak' && (
                <Tiltakssteg onCompleted={navigerBrukerTilKvpSteg} onGoToPreviousStep={navigerBrukerTilIntroside} />
            )}
            {step && step[0] === 'kvp' && (
                <KvpSteg
                    onCompleted={navigerBrukerTilAndreUtbetalingerSteg}
                    onGoToPreviousStep={navigerBrukerTilTiltakssteg}
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
                />
            )}
            {step && step[0] === 'oppsummering' && (
                <Oppsummeringssteg onCompleted={sendSøknad} onGoToPreviousStep={navigerBrukerTilBarnetilleggSteg} />
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

    const backendUrl = process.env.TILTAKSPENGESOKNAD_API_URL;
    try {
        const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
        const tiltakJson = await tiltakResponse.json();
        return {
            props: {
                tiltak: tiltakJson,
            },
        };
    } catch (error) {
        logger.error((error as Error).message);
        return {
            props: {
                tiltak: [],
            },
        };
    }
}
