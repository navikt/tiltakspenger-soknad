import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import Utfyllingssteg from '@/components/utfyllingssteg/Utfyllingssteg';
import {Heading, Stepper} from "@navikt/ds-react";

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
        switch (stepString ? stepString[0] : "") {
            case 'utfylling':
                return 1;
            case 'oppsummering':
                return 2;
            default:
                return 1;
        }
    }
    const navigerBrukerTilOppsummeringssteg = () => router.push('/utfylling/oppsummering');
    const sendSøknad = (data: any) => console.log(data);

    return (
        <>
            <Heading size="medium" spacing level="2" id="stepper-heading">
                Søknadssteg
            </Heading>
            <Stepper
                aria-labelledby="stepper-heading"
                activeStep={resolveStepNumber(step)}
                orientation="horizontal"
            >
                <Stepper.Step as="button" onClick={() => router.push('/utfylling/utfylling')}>Utfylling</Stepper.Step>
                <Stepper.Step as="button" onClick={() => router.push('/utfylling/oppsummering')}>Oppsummering</Stepper.Step>
            </Stepper>
            <FormProvider {...formMethods}>
                {(step && step[0] === 'oppsummering') ?
                        <Oppsummeringssteg onCompleted={sendSøknad} /> :
                        <Utfyllingssteg onCompleted={navigerBrukerTilOppsummeringssteg} />
                }
            </FormProvider>
        </>
    )
}
