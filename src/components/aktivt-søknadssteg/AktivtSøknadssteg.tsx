import React, { useContext } from 'react';
import { Søknadssteg } from '@/types/Søknadssteg';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import Tiltakssteg from '@/steps/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/steps/andre-utbetalingersteg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/steps/barnetilleggsteg/BarnetilleggSteg';
import Oppsummeringssteg from '@/steps/oppsummeringssteg/Oppsummeringssteg';
import Kvitteringsside from '@/components/kvitteringsside/Kvitteringsside';
import { useRouter } from 'next/router';
import { lagFormDataForInnsending, postSøknadMultipart } from '@/utils/innsending';
import SøknadResponse from '@/types/SøknadResponse';
import { useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import ProgramDeltagelseSteg from '@/steps/programdeltagelsesteg/ProgramDeltagelseSteg';
import InstitusjonsoppholdSteg from '@/steps/institusjonsoppholdsteg/InstitusjonsoppholdSteg';

interface AktivtSøknadsstegProps {
    steg: Søknadssteg | null;
}

const AktivtSøknadssteg = ({ steg }: AktivtSøknadsstegProps) => {
    const router = useRouter();
    const { personalia, valgtTiltak } = useContext(UtfyllingContext);
    const { getValues } = useFormContext<Søknad>();
    const [søknadsinnsendingInProgress, setSøknadsinnsendingInProgress] = React.useState(false);
    const [innsendingstidspunkt, setInnsendingstidspunkt] = React.useState<string>();

    async function sendInnSøknad() {
        const søknad = getValues();
        const formData = lagFormDataForInnsending(søknad, personalia!, valgtTiltak!);
        try {
            setSøknadsinnsendingInProgress(true);
            const response = await postSøknadMultipart(formData);
            if (response.status !== 201) {
                return navigateToError();
            }
            const innsendingstidspunktFraApi = await response
                .json()
                .then((json: SøknadResponse) => json.innsendingTidspunkt);
            setInnsendingstidspunkt(innsendingstidspunktFraApi);
            return navigateTo(Søknadssteg.KVITTERING);
        } catch {
            return navigateToError();
        }
    }

    function navigateToHome() {
        return router.push('/', undefined, { shallow: false });
    }

    const navigateToError = () => router.push('/feil-ved-innsending', undefined, { shallow: false });

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
                    title="Introduksjonsprogrammet og Kvalifiseringsprogrammet"
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
                    søknadsinnsendingInProgress={søknadsinnsendingInProgress}
                    onCompleted={sendInnSøknad}
                />
            );
        case Søknadssteg.KVITTERING:
            return <Kvitteringsside personalia={personalia!} innsendingstidspunkt={innsendingstidspunkt!} />;
        default:
            return <></>;
    }
};

export default AktivtSøknadssteg;
