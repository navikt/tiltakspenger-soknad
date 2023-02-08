import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '@/components/oppsummeringssteg/Oppsummeringssteg';
import Utfyllingssteg from '@/components/utfyllingssteg/Utfyllingssteg';

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

    const navigerBrukerTilOppsummeringssteg = () => router.push('/utfylling/oppsummering');
    const sendSøknad = (data: any) => console.log(data);

    if (step && step[0] === 'oppsummering') {
        return (
            <FormProvider {...formMethods}>
                <Oppsummeringssteg onCompleted={sendSøknad} />
            </FormProvider>
        );
    } else {
        return (
            <FormProvider {...formMethods}>
                <Utfyllingssteg onCompleted={navigerBrukerTilOppsummeringssteg} />
            </FormProvider>
        );
    }
}
