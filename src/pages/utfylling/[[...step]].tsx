import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import { Stepper } from '@navikt/ds-react';
import Innledningssteg from '@/components/innledningssteg/Innledningssteg';
import Tiltakssteg from '@/components/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/components/andre-utbetalinger-steg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/components/barnetillegg-steg/BarnetilleggSteg';

export default function Utfylling() {
    const router = useRouter();
    const { step } = router.query;
    const formMethods = useForm({
        defaultValues: {
            barnUnderSeksten: [{ fornavn: '', etternavn: '', fdato: '', bostedsland: '' }],
            borPåInstitusjon: undefined,
            mottarEllerSøktPensjonsordningEllerEtterlønn: undefined,
            søkerOmBarnetillegg: undefined,
            deltarIKvp: undefined,
            deltarIIntroprogrammet: undefined,
        },
    });

    const resolveStepNumber = (stepString: any) => {
        switch (stepString ? stepString[0] : '') {
            case 'innledning':
                return 1;
            case 'tiltak':
                return 2;
            case 'andreutbetalinger':
                return 3;
            case 'barnetillegg':
                return 4;
            case 'oppsummering':
                return 5;
            default:
                return 1;
        }
    };
    const navigerBrukerTilIntroside = () => router.push('/');
    const navigerBrukerTilInnledningssteg = () => router.push('/utfylling/innledning');
    const navigerBrukerTilTiltakssteg = () => router.push('/utfylling/tiltak');
    const navigerBrukerTilAndreUtbetalingerSteg = () => router.push('/utfylling/andreutbetalinger');
    const navigerBrukerTilBarnetilleggSteg = () => router.push('/utfylling/barnetillegg');
    const navigerBrukerTilOppsummeringssteg = () => router.push('/utfylling/oppsummering');

    const sendSøknad = console.log;

    return (
        <>
            <Stepper aria-labelledby="stepper-heading" activeStep={resolveStepNumber(step)} orientation="horizontal">
                <Stepper.Step as="button" onClick={navigerBrukerTilInnledningssteg}>
                    Innledning
                </Stepper.Step>
                <Stepper.Step as="button" onClick={navigerBrukerTilTiltakssteg}>
                    Tiltak
                </Stepper.Step>
                <Stepper.Step as="button" onClick={navigerBrukerTilAndreUtbetalingerSteg}>
                    Andre utbetalinger
                </Stepper.Step>
                <Stepper.Step as="button" onClick={navigerBrukerTilBarnetilleggSteg}>
                    Barnetillegg
                </Stepper.Step>
                <Stepper.Step as="button" onClick={navigerBrukerTilOppsummeringssteg}>
                    Oppsummering
                </Stepper.Step>
            </Stepper>
            <FormProvider {...formMethods}>
                {step && step[0] === 'innledning' && (
                    <Innledningssteg
                        onCompleted={navigerBrukerTilTiltakssteg}
                        onGoToPreviousStep={navigerBrukerTilIntroside}
                    />
                )}
                {step && step[0] === 'tiltak' && (
                    <Tiltakssteg
                        onCompleted={navigerBrukerTilAndreUtbetalingerSteg}
                        onGoToPreviousStep={navigerBrukerTilInnledningssteg}
                    />
                )}
                {step && step[0] === 'andreutbetalinger' && (
                    <AndreUtbetalingerSteg
                        onCompleted={navigerBrukerTilBarnetilleggSteg}
                        onGoToPreviousStep={navigerBrukerTilTiltakssteg}
                    />
                )}
                {step && step[0] === 'barnetillegg' && (
                    <BarnetilleggSteg
                        onCompleted={navigerBrukerTilOppsummeringssteg}
                        onGoToPreviousStep={navigerBrukerTilAndreUtbetalingerSteg}
                    />
                )}
                {step && step[0] === 'oppsummering' && <Oppsummeringssteg onCompleted={sendSøknad} />}
            </FormProvider>
        </>
    );
}
