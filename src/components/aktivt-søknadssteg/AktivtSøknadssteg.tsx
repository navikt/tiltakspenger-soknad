import React, { useContext } from 'react';
import { Søknadssteg } from '@/types/Søknadssteg';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import Tiltakssteg from '@/steps/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '@/steps/andre-utbetalingersteg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '@/steps/barnetilleggsteg/BarnetilleggSteg';
import BarnetilleggBarnSteg from '@/steps/barnetilleggsteg/BarnetilleggBarnSteg';
import Oppsummeringssteg from '@/steps/oppsummeringssteg/Oppsummeringssteg';
import Kvitteringsside from '@/components/kvitteringsside/Kvitteringsside';
import { useRouter } from 'next/router';
import { lagFormDataForInnsending, postSøknadMultipart, tolkInnsendingssvar } from '@/utils/innsending';
import { useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import ProgramDeltagelseSteg from '@/steps/programdeltagelsesteg/ProgramDeltagelseSteg';
import InstitusjonsoppholdSteg from '@/steps/institusjonsoppholdsteg/InstitusjonsoppholdSteg';
import TidligereSøknadSteg from '@/steps/tidligere-søknadsteg/TidligereSøknadSteg';
import { forhåndsutfyllFraForrigeSøknad } from '@/utils/forhåndsutfylling';

interface AktivtSøknadsstegProps {
    steg: Søknadssteg | null;
}

const AktivtSøknadssteg = ({ steg }: AktivtSøknadsstegProps) => {
    const router = useRouter();
    const { personalia, valgtTiltak, tiltak } = useContext(UtfyllingContext);
    const { getValues, setValue } = useFormContext<Søknad>();
    const [søknadsinnsendingInProgress, setSøknadsinnsendingInProgress] = React.useState(false);
    const [innsendingstidspunkt, setInnsendingstidspunkt] = React.useState<string>();
    const [avvistUtenEndringer, setAvvistUtenEndringer] = React.useState<{ mottatt: string }>();
    const [forrigeSteg, setForrigeSteg] = React.useState(steg);

    // Feilmeldingen om at søknaden ble avvist gjelder bare innsendingen bruker nettopp gjorde, og fjernes når bruker går til et annet steg.
    if (steg !== forrigeSteg) {
        setForrigeSteg(steg);
        setAvvistUtenEndringer(undefined);
    }

    function gåVidereFraTiltak() {
        const aktivitetId = getValues('svar.tiltak.aktivitetId');
        const harSøktFør = !!tiltak?.find((t) => t.aktivitetId === aktivitetId)?.tidligereSøknad;
        return navigateTo(harSøktFør ? Søknadssteg.TIDLIGERE_SØKNAD : Søknadssteg.PROGRAM_DELTAGELSE);
    }

    function startNySøknadFraForrige() {
        const forrige = valgtTiltak?.tidligereSøknad;
        // Valg av nytt tiltak nullstiller svarene. Er de fortsatt tomme, har vi ikke fylt dem ut før, og overskriver ikke endringer bruker har gjort.
        if (forrige && getValues('svar.introduksjonsprogram.deltar') === undefined) {
            const { barnetillegg, ...svar } = forhåndsutfyllFraForrigeSøknad(forrige.svar, personalia?.barn);
            Object.entries(svar).forEach(([felt, verdi]) => setValue(`svar.${felt}` as 'svar', verdi as never));
            setValue('svar.barnetillegg.søkerOmBarnetillegg', barnetillegg.søkerOmBarnetillegg);
            setValue(
                'svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor',
                barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor,
            );
            setValue('svar.barnetillegg.bostedForBarnFraFolkeregisteret', barnetillegg.bostedForBarnFraFolkeregisteret);
        }
        return navigateTo(Søknadssteg.PROGRAM_DELTAGELSE);
    }

    async function sendInnSøknad() {
        const søknad = getValues();
        const formData = lagFormDataForInnsending(søknad, personalia!, valgtTiltak!);
        try {
            setSøknadsinnsendingInProgress(true);
            setAvvistUtenEndringer(undefined);
            const resultat = await tolkInnsendingssvar(await postSøknadMultipart(formData));
            switch (resultat.type) {
                case 'mottatt':
                    setInnsendingstidspunkt(resultat.innsendingstidspunkt);
                    return navigateTo(Søknadssteg.KVITTERING);
                case 'utenEndringer':
                    setSøknadsinnsendingInProgress(false);
                    return setAvvistUtenEndringer({ mottatt: resultat.mottatt });
                case 'feil':
                    return navigateToError();
            }
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
                    onCompleted={gåVidereFraTiltak}
                    onGoToPreviousStep={navigateToHome}
                />
            );
        case Søknadssteg.TIDLIGERE_SØKNAD:
            return (
                <TidligereSøknadSteg
                    title="Du har allerede søkt for dette tiltaket"
                    stepNumber={1}
                    onCompleted={startNySøknadFraForrige}
                    onGoToPreviousStep={goBack}
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
                    onCompleted={() =>
                        navigateTo(
                            getValues('svar.barnetillegg.søkerOmBarnetillegg')
                                ? Søknadssteg.BARNETILLEGG_BARN
                                : Søknadssteg.OPPSUMMERING,
                        )
                    }
                    onGoToPreviousStep={goBack}
                />
            );
        case Søknadssteg.BARNETILLEGG_BARN:
            return (
                <BarnetilleggBarnSteg
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
                    avvistUtenEndringer={avvistUtenEndringer}
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
