import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import KvpSteg from '@/components/innledningssteg/KvpSteg';
import Tiltakssteg from '@/components/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/components/andre-utbetalinger-steg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/components/barnetillegg-steg/BarnetilleggSteg';
import Søknad from '@/types/Søknad';

export default function Utfylling() {
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

    const sendSøknad = console.log;

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
