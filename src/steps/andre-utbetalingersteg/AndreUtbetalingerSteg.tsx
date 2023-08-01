import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, periodenErInnenforTiltaksperiodeValidator } from '@/utils/formValidators';
import { formatPeriode } from '@/utils/formatPeriode';
import Show from '@/components/show/show';
import Datospørsmål from '@/components/datospørsmål/Datospørsmål';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import styles from './andreutbetalinger.module.css';
import {
    alderspensjonValidator,
    etterlønnValidator,
    gjenlevendepensjonValidator,
    jobbsjansenValidator,
    minstEnAnnenUtbetalingHvisJaValidator,
    mottarAndreUtbetalingerValidator,
    pensjonsordningValidator,
    påkrevdAlderspensjonDatofeltValidator,
    påkrevdGjenlevendepensjonPeriodeValidator,
    påkrevdJobbsjansenPeriodeValidator,
    påkrevdSupplerendeStønadFlyktningerPeriodeValidator,
    påkrevdSupplerendeStønadOver67PeriodeValidator,
    påkrevdSykepengerPeriodeValidator,
    supplerendeStønadFlyktningerValidator,
    supplerendeStønadOver67Validator,
    sykepengerValidator,
    lønnetArbeidValidator,
    påkrevdPensjonsordningPeriodeValidator,
} from '@/steps/andre-utbetalingersteg/validation';
import { Link } from '@navikt/ds-react';

interface AndreUtbetalingerStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function AndreUtbetalingerSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: AndreUtbetalingerStegProps) {
    const {
        watch,
        getValues,
        formState: { submitCount },
        trigger,
        setValue,
    } = useFormContext();
    const { valgtTiltak } = useContext(UtfyllingContext);

    const watchMottarAndreUtbetalinger = watch('svar.mottarAndreUtbetalinger');
    const watchSykepenger = watch('svar.sykepenger.mottar');
    const watchGjenlevendepensjon = watch('svar.gjenlevendepensjon.mottar');
    const watchAlderspensjon = watch('svar.alderspensjon.mottar');
    const watchJobbsjansen = watch('svar.jobbsjansen.mottar');
    const watchSupplerendestønadOver67 = watch('svar.supplerendestønadover67.mottar');
    const watchSupplerendestønadFlyktninger = watch('svar.supplerendestønadflyktninger.mottar');
    const watchPensjonsordning = watch('svar.pensjonsordning.mottar');

    const brukerregistrertPeriode = getValues('svar.tiltak.periode');
    const tiltaksperiode = brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode;
    const tiltaksperiodeTekst = formatPeriode(tiltaksperiode);

    const spørsmålbesvarelser = getValues('svar');

    React.useEffect(() => {
        if (submitCount > 0) trigger('svar.mottarAndreUtbetalinger');
    }, [
        watchGjenlevendepensjon,
        watchAlderspensjon,
        watchJobbsjansen,
        watchSupplerendestønadOver67,
        watchSupplerendestønadFlyktninger,
        watchPensjonsordning,
    ]);

    const slettSvar = (formKey: string, brukUndefined?: boolean) => {
        setValue(formKey, brukUndefined ? undefined : {});
    };

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <>
                    <p>
                        Vi trenger å vite om du har lønn fordi det kan ha betydning for din rett til tiltakspenger. Vi
                        trenger også å vite om du har pengestøtte som helt eller delvis skal dekke dine daglige
                        utgifter.
                    </p>
                    <p>Vi spør deg om dette da det ikke er alt vi klarer å hente automatisk fra våre systemer.</p>
                </>
            }
        >
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.lønnetArbeid.erILønnetArbeid"
                    validate={lønnetArbeidValidator}
                    hjelpetekst={{
                        tittel: 'Hvorfor spør vi om du er i lønnet arbeid?',
                        tekst: (
                            <>
                                <p>Du har ikke rett på tiltakspenger hvis du:</p>
                                <ul>
                                    <li>får lønn fra en tiltaksarrangør for tiden du deltar i tiltaket</li>
                                    <li>
                                        blir fulgt opp av en tiltaksarrangør på arbeidsplassen din, og mottar lønn fra
                                        arbeidsgiveren
                                    </li>
                                    <li>gjennomfører lønnet arbeid i stedet for å delta i tiltaket ditt</li>
                                </ul>
                                <p>Du må da krysse «ja» på dette spørsmålet.</p>
                                <p>Du har rett på tiltakspenger hvis du:</p>
                                <ul>
                                    <li>ikke får lønn fra en tiltaksarrangør mens du er i tiltaket</li>
                                    <li>ikke får oppfølging av en tiltaksarrangør i det lønnede arbeidet ditt</li>
                                    <li>får lønn for arbeid som du gjør ved siden av det avtalte tiltaket</li>
                                </ul>
                            </>
                        ),
                    }}
                >
                    Er du i lønnet arbeid når du går på tiltak?
                </JaNeiSpørsmål>
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.etterlønn.mottar"
                    validate={etterlønnValidator}
                    hjelpetekst={{
                        tittel: 'Hva er etterlønn?',
                        tekst: 'Med etterlønn menes penger du mottar i forbindelse med at du slutter i arbeid og ikke jobber.',
                    }}
                >
                    Mottar du etterlønn fra en tidligere arbeidsgiver i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
            </div>
            <div className={watchSykepenger ? styles.blokkUtvidet : styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.sykepenger.mottar"
                    validate={sykepengerValidator}
                    hjelpetekst={{
                        tittel: 'Hva er sykepenger? ',
                        tekst: (
                            <>
                                <p>
                                    Du kan få sykepenger hvis du ikke kan jobbe på grunn av sykdom eller skade. Du kan
                                    også få sykepenger hvis du blir syk mens du mottar dagpenger.
                                </p>
                                <Link href="https://www.nav.no/sykepenger" target="_blank">
                                    Les mer om sykepenger (åpnes i ny fane)
                                </Link>
                            </>
                        ),
                    }}
                    afterOnChange={() => slettSvar('svar.sykepenger.periode')}
                >
                    Har du nylig mottatt sykepenger og er fortsatt sykmeldt i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchSykepenger && (
                    <Periodespørsmål
                        name="svar.sykepenger.periode"
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdSykepengerPeriodeValidator,
                            (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                        ]}
                        minDate={new Date(tiltaksperiode?.fra)}
                        maxDate={new Date(tiltaksperiode?.til)}
                    >
                        I hvilken del av perioden er du sykmeldt?
                    </Periodespørsmål>
                )}
            </div>
            <JaNeiSpørsmål
                name="svar.mottarAndreUtbetalinger"
                validate={[
                    mottarAndreUtbetalingerValidator,
                    (mottarAndreUtbetalinger) =>
                        minstEnAnnenUtbetalingHvisJaValidator(spørsmålbesvarelser, mottarAndreUtbetalinger),
                ]}
                description={
                    <ul tabIndex={0}>
                        <li>Pengestøtte til gjenlevende ektefelle</li>
                        <li>Alderspensjon</li>
                        <li>Supplerende stønad for personer over 67 år</li>
                        <li>Supplerende stønad for uføre flyktninger</li>
                        <li>Pengestøtte fra andre trygde- eller pensjonsordninger</li>
                        <li>Stønad via Jobbsjansen</li>
                    </ul>
                }
                hjelpetekst={{
                    tittel: 'Når du har fått innvilget pengestøtte',
                    tekst: (
                        <>
                            <p>
                                Hvis du er innvilget slik pengestøtte vi spør om her, har du normalt fått et brev eller
                                en digital medling om at du har rett til pengestøtten.
                            </p>
                        </>
                    ),
                }}
                afterOnChange={() => {
                    slettSvar('svar.gjenlevendepensjon');
                    slettSvar('svar.alderspensjon');
                    slettSvar('svar.supplerendestønadover67');
                    slettSvar('svar.supplerendestønadflyktninger');
                    slettSvar('svar.pensjonsordning');
                    slettSvar('svar.jobbsjansen');
                }}
            >
                Mottar du noen av disse pengestøttene i perioden {tiltaksperiodeTekst}?
            </JaNeiSpørsmål>
            <Show if={watchMottarAndreUtbetalinger}>
                <div className={watchGjenlevendepensjon ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.gjenlevendepensjon.mottar"
                        validate={gjenlevendepensjonValidator}
                        hjelpetekst={{
                            tittel: 'Mottar du pengestøtte til gjenlevende ektefelle?',
                            tekst: (
                                <>
                                    <p>
                                        Når ektefellen, samboeren eller partneren din dør, kan du ha rett til
                                        pengestøtte som etterlatt. Det kan være gjenlevendepensjon eller overgangstønad.
                                    </p>
                                    <Link href="https://www.nav.no/gjenlevendepensjon" target="_blank">
                                        Les mer om pengestøtte til gjenlevende ektefelle fra NAV (åpnes i ny fane)
                                    </Link>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.gjenlevendepensjon.periode')}
                    >
                        Mottar du pengestøtte til gjenlevende ektefelle i perioden {tiltaksperiodeTekst}?
                    </JaNeiSpørsmål>
                    {watchGjenlevendepensjon && (
                        <Periodespørsmål
                            name="svar.gjenlevendepensjon.periode"
                            validate={[
                                gyldigPeriodeValidator,
                                påkrevdGjenlevendepensjonPeriodeValidator,
                                (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                            ]}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                        >
                            I hvilken del av perioden mottar du pengestøtte til gjenlevende ektefelle?
                        </Periodespørsmål>
                    )}
                </div>
                <div className={watchAlderspensjon ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.alderspensjon.mottar"
                        validate={alderspensjonValidator}
                        hjelpetekst={{
                            tittel: 'Hva er alderspensjon?',
                            tekst: (
                                <>
                                    <p>Alderspensjon skal sikre deg inntekt når du blir pensjonist.</p>
                                    <Link href="https://www.nav.no/alderspensjon" target="_blank">
                                        Les mer om alderspensjon fra NAV (åpnes i ny fane)
                                    </Link>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.alderspensjon.fraDato', true)}
                    >
                        Mottar du alderspensjon i perioden {tiltaksperiodeTekst}?
                    </JaNeiSpørsmål>
                    {watchAlderspensjon && (
                        <Datospørsmål
                            name="svar.alderspensjon.fraDato"
                            validate={påkrevdAlderspensjonDatofeltValidator}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                            legend="Når begynner din alderspensjon?"
                        >
                            Fra dato
                        </Datospørsmål>
                    )}
                </div>
                <div className={watchSupplerendestønadOver67 ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.supplerendestønadover67.mottar"
                        validate={supplerendeStønadOver67Validator}
                        hjelpetekst={{
                            tittel: 'Hva er supplerende stønad for personer over 67 år med kort botid i Norge?',
                            tekst: (
                                <>
                                    <span>
                                        Du kan motta supplerende stønad hvis du er over 67 år, og ikke har bodd lenge
                                        nok i Norge til å ha rett på alderspensjon.
                                    </span>
                                    <Link href="https://www.nav.no/supplerende-stonad-over-67" target="_blank">
                                        Les mer om supplerende stønad for personer over 67 år med kort botid i Norge
                                        (åpnes i ny fane)
                                    </Link>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.supplerendestønadover67.periode')}
                    >
                        Mottar du supplerende stønad for personer over 67 år med kort botid i Norge i perioden{' '}
                        {tiltaksperiodeTekst}?
                    </JaNeiSpørsmål>
                    {watchSupplerendestønadOver67 && (
                        <Periodespørsmål
                            name="svar.supplerendestønadover67.periode"
                            validate={[
                                gyldigPeriodeValidator,
                                påkrevdSupplerendeStønadOver67PeriodeValidator,
                                (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                            ]}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                        >
                            I hvilken del av perioden mottar du supplerende stønad for personer over 67 år med kort
                            botid i Norge?
                        </Periodespørsmål>
                    )}
                </div>
                <div className={watchSupplerendestønadFlyktninger ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.supplerendestønadflyktninger.mottar"
                        validate={supplerendeStønadFlyktningerValidator}
                        hjelpetekst={{
                            tittel: 'Hva er supplerende stønad for uføre flyktninger?',
                            tekst: (
                                <>
                                    <span>
                                        Du kan motta supplerende stønad hvis du er både ufør og har flyktningstatus. Du
                                        må ha oppholdstillatelse og være bosatt i Norge.
                                    </span>
                                    <Link href="https://www.nav.no/supplerende-stonad-flyktninger" target="_blank">
                                        Les mer om supplerende stønad for uføre flyktninger (åpnes i ny fane)
                                    </Link>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.supplerendestønadflyktninger.periode')}
                    >
                        Mottar du supplerende stønad for uføre flyktninger i perioden {tiltaksperiodeTekst}?
                    </JaNeiSpørsmål>
                    {watchSupplerendestønadFlyktninger && (
                        <Periodespørsmål
                            name="svar.supplerendestønadflyktninger.periode"
                            validate={[
                                gyldigPeriodeValidator,
                                påkrevdSupplerendeStønadFlyktningerPeriodeValidator,
                                (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                            ]}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                        >
                            I hvilken del av perioden mottar du supplerende stønad for uføre flyktninger?
                        </Periodespørsmål>
                    )}
                </div>
                <div className={watchPensjonsordning ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.pensjonsordning.mottar"
                        validate={pensjonsordningValidator}
                        hjelpetekst={{
                            tittel: 'Hva er pengestøtte fra andre trygde- eller pensjonsordninger?',
                            tekst: (
                                <>
                                    <span>
                                        Dette er pengestøtte du får fra andre enn NAV, og som vi ikke har spurt om over.
                                         Det kan for eksempel være:
                                    </span>
                                    <ul>
                                        <li>utbetalinger fra andre land</li>
                                        <li>
                                            alderspensjon fra et arbeidsforhold. Som for eksempel AFP, Statens
                                            pensjonskasse eller KLP.
                                        </li>
                                    </ul>
                                    <span>
                                        Du trenger ikke å fortelle oss om barnepensjon fra NAV, barnetrygd fra NAV eller
                                        sosialstønad fra kommunen.
                                    </span>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.pensjonsordning.periode')}
                    >
                        Mottar du pengestøtte fra andre trygde- eller pensjonsordninger i perioden {tiltaksperiodeTekst}
                        ?
                    </JaNeiSpørsmål>
                    {watchPensjonsordning && (
                        <Periodespørsmål
                            name="svar.pensjonsordning.periode"
                            validate={[
                                gyldigPeriodeValidator,
                                påkrevdPensjonsordningPeriodeValidator,
                                (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                            ]}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                        >
                            I hvilken del av perioden mottar du pengestøtte fra andre trygde- eller pensjonsordninger?
                        </Periodespørsmål>
                    )}
                </div>
                <div className={watchJobbsjansen ? styles.blokkUtvidet : styles.blokk}>
                    <JaNeiSpørsmål
                        name="svar.jobbsjansen.mottar"
                        validate={jobbsjansenValidator}
                        hjelpetekst={{
                            tittel: 'Hva er stønad via jobbsjansen?',
                            tekst: (
                                <>
                                    <span>
                                        Jobbsjansen er en ordning for hjemmeværende innvandrerkvinner. Jobbsjansen skal
                                        styrke mulighetene for arbeid og økonomisk selvstendighet. Du kan få også få
                                        utbetalt jobbsjansenstønad. Hvis du deltar i jobbsjansen, har du avtalt dette
                                        med kommunen du bor i.
                                    </span>
                                    <Link href="https://www.imdi.no/tilskudd/jobbsjansen/" target="_blank">
                                        Les mer om jobbsjansen (åpnes i ny fane)
                                    </Link>
                                </>
                            ),
                        }}
                        afterOnChange={() => slettSvar('svar.jobbsjansen.periode')}
                    >
                        Mottar du stønad via jobbsjansen i perioden {tiltaksperiodeTekst}?
                    </JaNeiSpørsmål>
                    {watchJobbsjansen && (
                        <Periodespørsmål
                            name="svar.jobbsjansen.periode"
                            validate={[
                                gyldigPeriodeValidator,
                                påkrevdJobbsjansenPeriodeValidator,
                                (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                            ]}
                            minDate={new Date(tiltaksperiode?.fra)}
                            maxDate={new Date(tiltaksperiode?.til)}
                        >
                            I hvilken del av perioden mottar du stønad via jobbsjansen?
                        </Periodespørsmål>
                    )}
                </div>
            </Show>
        </Step>
    );
}
