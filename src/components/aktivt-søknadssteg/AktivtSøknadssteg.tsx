import React, { useContext } from 'react';
import { Søknadssteg } from '@/types/Søknadssteg';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import Tiltakssteg from '@/steps/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/steps/andre-utbetalingersteg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/steps/barnetilleggsteg/BarnetilleggSteg';
import Oppsummeringssteg from '@/steps/oppsummeringssteg/Oppsummeringssteg';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import ProgramDeltagelseSteg from '@/steps/programdeltagelsesteg/ProgramDeltagelseSteg';
import InstitusjonsoppholdSteg from '@/steps/institusjonsoppholdsteg/InstitusjonsoppholdSteg';
import {InnsendingContext} from "@/pages/_app";
import {sendInnSøknad} from "@/utils/innsending";

interface AktivtSøknadsstegProps {
    steg: Søknadssteg | null;
}

const AktivtSøknadssteg = ({ steg }: AktivtSøknadsstegProps) => {
    const router = useRouter();
    const { personalia, valgtTiltak } = useContext(UtfyllingContext);
    const {
        søknadsinnsendingInProgress,
        setSøknadsinnsendingInProgress,
        setInnsendingstidspunkt
    } = useContext(InnsendingContext);
    const { getValues } = useFormContext<Søknad>();

    function navigateToHome() {
        return router.push('/', undefined, { shallow: false });
    }

    function navigateTo(søknadssteg: Søknadssteg, shallow: boolean = true) {
        return router.push(`/utfylling/${søknadssteg}`, undefined, { shallow });
    }

    function goBack() {
        return router.back();
    }

    switch (steg) {
        case Søknadssteg.TILTAK:
            return (
                <Tiltakssteg
                    title="Tiltak"
                    stepNumber={1}
                    onCompleted={() => navigateTo(Søknadssteg.PROGRAM_DELTAGELSE)}
                    onGoToPreviousStep={navigateToHome}
                />
            );
        case Søknadssteg.PROGRAM_DELTAGELSE:
            return (
                <ProgramDeltagelseSteg
                    title="Introduksjonsstønad og kvalifiseringsstønad"
                    stepNumber={2}
                    onCompleted={() => navigateTo(Søknadssteg.ANDRE_UTBETALINGER)}
                    onGoToPreviousStep={goBack}
                />
            );
        case Søknadssteg.ANDRE_UTBETALINGER:
            return (
                <AndreUtbetalingerSteg
                    title="Utbetalinger"
                    stepNumber={3}
                    onCompleted={() => navigateTo(Søknadssteg.INSTITUSJONSOPPHOLD)}
                    onGoToPreviousStep={goBack}
                />
            );
        case Søknadssteg.INSTITUSJONSOPPHOLD:
            return (
                <InstitusjonsoppholdSteg
                    title="Institusjonsopphold"
                    stepNumber={4}
                    onCompleted={() => navigateTo(Søknadssteg.BARNETILLEGG)}
                    onGoToPreviousStep={goBack}
                />
            );
        case Søknadssteg.BARNETILLEGG:
            return (
                <BarnetilleggSteg
                    title="Barnetillegg"
                    stepNumber={5}
                    onCompleted={() => navigateTo(Søknadssteg.OPPSUMMERING)}
                    onGoToPreviousStep={goBack}
                />
            );
        case Søknadssteg.OPPSUMMERING:
            return (
                <Oppsummeringssteg
                    title="Oppsummering"
                    stepNumber={6}
                    onGoToPreviousStep={goBack}
                    søknadsinnsendingInProgress={!!søknadsinnsendingInProgress}
                    onCompleted={() => sendInnSøknad(router, getValues(), personalia!, valgtTiltak!, setSøknadsinnsendingInProgress!, setInnsendingstidspunkt!)}
                />
            );
        default:
            return <></>;
    }
};

export default AktivtSøknadssteg;
