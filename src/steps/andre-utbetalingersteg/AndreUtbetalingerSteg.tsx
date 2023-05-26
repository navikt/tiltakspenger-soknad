import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import styles from './andreutbetalinger.module.css'
import {
    gyldigPeriodeValidator,
    påkrevdDatoValidator,
    påkrevdJaNeiSpørsmålValidator,
    påkrevdPeriodeValidator
} from '@/utils/formValidators';
import {formatPeriode} from "@/utils/formatPeriode";
import {Tiltak} from "@/types/Tiltak";
import Show from "@/components/show/show";
import {FormPeriode} from "@/types/FormPeriode";
import Datospørsmål from "@/components/datospørsmål/Datospørsmål";

interface AndreUtbetalingerStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    valgtTiltak: Tiltak | null;
}

function sykepengerValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar sykepenger');
}

function gjenlevendepensjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar gjenlevendepensjon');
}

function alderspensjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar alderspensjon');
}

function pensjonsordningValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar pensjonsordning');
}

function jobbsjansenValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar stønad via jobbsjansen');
}

function etterlønnValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar etterlønn');
}

function supplerendeStønadOver67Validator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar supplerende stønad for personer over 67 år');
}

function supplerendeStønadFlyktningerValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar supplerende stønad for uføre flyktninger');
}

function påkrevdSykepengerPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar sykepenger');
}

function påkrevdGjenlevendepensjonPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar gjenlevendepensjon');
}

function påkrevdJobbsjansenPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar jobbsjansen');
}

function påkrevdAlderpensjonPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi når startet  alderspensjonen din');
}

function påkrevdSupplerendeStønadOver67PeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar supplerende stønad for personer over 67 år');
}

function påkrevdSupplerendeStønadFlyktningerPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar supplerende stønad for uføre flyktninger');
}

function påkrevdAlderspensjonDatofeltValidator(verdi: Date) {
    return påkrevdDatoValidator(verdi, 'Du må oppgi fra dato til alderspensjonen');
}

function mottarAndreUtbetalinger(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du mottar andre utbetalinger');
}

export default function AndreUtbetalingerSteg({ title, stepNumber, onCompleted, onGoToPreviousStep, valgtTiltak }: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchMottarAndreUtbetalinger = watch('svar.mottarAndreUtbetalinger');
    const watchSykepenger = watch('svar.sykepenger.mottar');
    const watchGjenlevendepensjon = watch('svar.gjenlevendepensjon.mottar');
    const watchAlderspensjon = watch('svar.alderspensjon.mottar');
    const watchJobbsjansen = watch('svar.jobbsjansen.mottar');
    const watchSupplerendestønadOver67 = watch('svar.supplerendestønadover67.mottar');
    const watchSupplerendestønadFlyktninger = watch('svar.supplerendestønadflyktninger.mottar');
    const brukerregistrertPeriode = watch('svar.tiltak.periode');
    const tiltaksperiodeTekst = formatPeriode(brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode);

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <>
                    <p>
                        Vi trenger å vite om du har annen pengestøtte som helt eller delvis skal dekke dine daglige
                        utgifter. Dette kan være utbetalinger fra:
                    </p>
                    <ul>
                        <li>Offentlige trygde-og pensjonsordninger</li>
                        <li>Private trygde- og pensjonsordninger</li>
                        <li>Utenlandske trygde-og pensjonsordninger</li>
                    </ul>
                    <p>
                        Vi kan hente informajon om nesten alle ytelser fra NAV. Det vi ikke kan hente automatisk, må du svare på spørsmål om under.
                    </p>
                    <p>Du har ikke rett på tiltakspenger:</p>
                    <ul>
                        <li>hvis du mottar annen pengestøtte</li>
                        <li>hvis du deltar i introduksjonsprogrammet eller i kvalifiseringsprogrammet</li>
                    </ul>
                </>
            }
        >
            <div className={styles.blokk}>
            <JaNeiSpørsmål
                name="svar.mottarAndreUtbetalinger"
                validate={mottarAndreUtbetalinger}
                description={(
                    <ul>
                        <li>Sykepenger</li>
                        <li>Gjenlevendepensjon</li>
                        <li>Alderspensjon</li>
                        <li>Supplerende stønad</li>
                        <li>Pengestøtte fra andre trygde- eller pensjonsordninger</li>
                        <li>Etterlønn</li>
                        <li>Stønad via Jobbsjansen</li>
                    </ul>
                )}
            >
                Mottar du noen av disse utbetalingene i perioden {tiltaksperiodeTekst}?
            </JaNeiSpørsmål>
            </div>
            <Show if={watchMottarAndreUtbetalinger}>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.sykepenger.mottar"
                    validate={sykepengerValidator}
                    hjelpetekst={{
                        tittel: 'Hva er sykepenger? ',
                        tekst: (
                            <>
                                <p>Du kan få sykepenger hvis du ikke kan jobbe på grunn av sykdom eller skade.
                                    Du kan også få sykepenger hvis du blir syk mens du mottar dagpenger.
                                </p>
                                <p>Les mer om sykepenger på (LENKE)</p>
                            </>)
                    }}
                >
                    Mottar du sykepenger?
                </JaNeiSpørsmål>
                {watchSykepenger && (
                    <Periodespørsmål
                        name="svar.sykepenger.periode"
                        validate={[gyldigPeriodeValidator, påkrevdSykepengerPeriodeValidator]}
                    >
                        Når mottar du sykepenger?
                    </Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.gjenlevendepensjon.mottar"
                    validate={gjenlevendepensjonValidator}
                    hjelpetekst={{
                        tittel: 'Hva er gjenlevendepensjon? ',
                        tekst: (
                            <>
                                <p>Du kan få gjenlevendepensjon hvis du har mistet din ektefelle, partner eller samboer med felles barn.
                                    Du kan også motta gjenlevendepensjon fra for eksempel Statens Pensjonskasse eller KLP.
                                </p>
                                <p>Les mer om gjenlevendepensjon fra NAV (LENKE)</p>
                            </>
                        )
                    }}
                >
                    Mottar du gjenlevendepensjon?
                </JaNeiSpørsmål>
                {watchGjenlevendepensjon && (
                    <Periodespørsmål
                        name="svar.gjenlevendepensjon.periode"
                        validate={[gyldigPeriodeValidator, påkrevdGjenlevendepensjonPeriodeValidator]}
                    >
                            Når mottar du gjenlevendepensjon?
                    </Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.alderspensjon.mottar"
                    validate={alderspensjonValidator}
                    hjelpetekst={{
                        tittel: 'Når begynner din alderspensjon? ',
                        tekst: (
                            <>
                                <p>Alderspensjon skal sikre deg inntekt når du blir pensjonist.</p>
                                <p>Les mer om alderspensjon fra NAV (LENKE)</p>
                            </>
                        )
                    }}
                >
                    Mottar du alderspensjon?
                </JaNeiSpørsmål>
                {watchAlderspensjon && (
                    <Datospørsmål
                        name='svar.alderspensjon.fraDato'
                        datoMåVæreIFortid={true}
                        validate={påkrevdAlderspensjonDatofeltValidator}
                    >
                        Fra dato
                    </Datospørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.supplerendestønadover67.mottar"
                    validate={supplerendeStønadOver67Validator}
                    hjelpetekst={{ tittel: 'Hva er supplerende stønad for personer over 67 år med kort botid i Norge?',
                        tekst: (
                            <>
                                <span>Du kan motta supplerende stønad hvis du er over 67 år, og ikke har bodd lenge nok i Norge til å ha rett på alderspensjon.</span>
                                <p>Les mer om supplerende stønad for personer over 67 år med kort botid i Norge (LENKE)</p>
                            </>
                        ) }}
                >
                    Mottar du supplerende stønad for personer over 67 år med kort botid i Norge?
                </JaNeiSpørsmål>
                {watchSupplerendestønadOver67 && (
                        <Periodespørsmål
                            name="svar.supplerendestønadover67.periode"
                            validate={[gyldigPeriodeValidator, påkrevdSupplerendeStønadOver67PeriodeValidator]}
                        >
                            Når mottar du det?
                        </Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.supplerendestønadflyktninger.mottar"
                    validate={supplerendeStønadFlyktningerValidator}
                    hjelpetekst={{ tittel: 'Hva er supplerende stønad for uføre flyktninger?',
                        tekst: (
                            <>
                                <span>Du kan motta supplerende stønad hvis du er både ufør og har flyktningstatus. Du må ha oppholdstillatelse og være bosatt i Norge.</span>
                                <p>Les mer om supplerende stønad for uføre flyktninger (LENKE)</p>
                            </>
                        ) }}
                >
                    Mottar du supplerende stønad for uføre flyktninger?
                </JaNeiSpørsmål>
                {watchSupplerendestønadFlyktninger && (
                        <Periodespørsmål
                            name="svar.supplerendestønadflyktninger.periode"
                            validate={[gyldigPeriodeValidator, påkrevdSupplerendeStønadFlyktningerPeriodeValidator]}
                        >
                            Når mottar du det?
                        </Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.pensjonsordning.mottar"
                    validate={pensjonsordningValidator}
                    hjelpetekst={{ tittel: 'Hva er pengestøtte fra andre trygde- eller pensjonsordninger?',
                        tekst: (
                            <>
                            <span>Dette er pengestøtte du får fra andre enn NAV, og som vi ikke har spurt om over.  Det kan for eksempel være:</span>
                            <ul>
                                <li>utbetalinger fra andre land</li>
                                <li>alderspensjon fra et arbeidsforhold. Som for eksempel AFP, Statens pensjonskasse eller KLP.</li>
                            </ul>
                            <span>Du trenger ikke å fortelle oss om barnepensjon fra NAV, barnetrygd fra NAV eller sosialstønad fra kommunen.</span>
                            </>
                            ) }}
                >
                    Mottar du pengestøtte fra andre trygde- eller pensjonsordninger?
                </JaNeiSpørsmål>
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.etterlønn.mottar"
                    validate={etterlønnValidator}
                    hjelpetekst={{
                        tittel: 'Hva er etterlønn?',
                        tekst: 'Med etterlønn menes penger du mottar i forbindelse med at du slutter i arbeid og ikke jobber.'
                    }}
                >
                    Mottar du etterlønn?
                </JaNeiSpørsmål>
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.jobbsjansen.mottar"
                    validate={jobbsjansenValidator}
                    hjelpetekst={{
                        tittel: 'Hva er stønad via jobbsjansen?',
                        tekst: (
                            <>
                                <span>
                                        Jobbsjansen er en ordning for hjemmeværende innvandrerkvinner.
                                        Jobbsjansen skal styrke mulighetene for arbeid og økonomisk selvstendighet.
                                        Du kan få også få utbetalt jobbsjansenstønad.
                                        Hvis du deltar i jobbsjansen, har du avtalt dette med kommunen du bor i.
                                </span>
                                <p>Du kan lese mer om jobbsjansen på (LENKE TIL IMDI)</p>
                            </>
                        )
                    }}
                >
                    Mottar du stønad via jobbsjansen?
                </JaNeiSpørsmål>
                {watchJobbsjansen && (
                    <Periodespørsmål
                        name="svar.jobbsjansen.periode"
                        validate={[gyldigPeriodeValidator, påkrevdJobbsjansenPeriodeValidator]}
                    >Når mottar du det?
                    </Periodespørsmål>
                )}
            </div>
            </Show>
        </Step>
    );
}
