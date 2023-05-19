import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Step from '@/components/step/Step';
import styles from './andreutbetalinger.module.css'
import { påkrevdFritekstfeltValidator, påkrevdJaNeiSpørsmålValidator } from '@/utils/formValidators';

interface AndreUtbetalingerStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
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

function etterlønnutbetalerValidator(verdi: string) {
    return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi hvem som utbetaler etterlønn');
}

export default function AndreUtbetalingerSteg({ onCompleted, onGoToPreviousStep }: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchPensjonsordning = watch('svar.pensjonsordning.jaNei');
    const watchEtterlønn = watch('svar.etterlønn.jaNei');
    const watchSykepenger = watch('svar.sykepenger.jaNei');
    const watchGjenlevendepensjon = watch('svar.gjenlevendepensjon.jaNei');
    const watchAlderspensjon = watch('svar.alderspensjon.jaNei');
    const watchJobbsjansen = watch('svar.jobbsjansen.jaNei');

    return (
        <Step
            title="Andre utbetalinger"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={3}
            guide={
                <>
                    <p>
                        Vi trenger å vite om du har annen pengestøtte som helt eller delvis skal dekke dine daglige
                        utgifter. Derfor spør vi deg om dette.
                    </p>
                    <p>
                        Du må fortelle oss om pengestøtte fra offentlige eller private trygde- og pensjonsordninger.
                        Dette gjelder også hvis du får støtten fra et annet land.
                    </p>
                    <p>Det har ikke betydning hvor mye du mottar i annen pengestøtte.</p>
                    <p>Du trenger ikke å fortelle oss om barnepensjon, barnetrygd eller sosialstønad fra kommunen.</p>
                </>
            }
        >
            <div className={styles.blokk}>
            <JaNeiSpørsmål
                name="svar.sykepenger.jaNei"
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
                <Periodespørsmål name="svar.sykepenger.periode">Når mottar du sykepenger?</Periodespørsmål>
            )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.gjenlevendepensjon.jaNei"
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
                    <Periodespørsmål name="svar.gjenlevende.periode">Når mottar du gjenlevendepensjon?</Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.alderspensjon.jaNei"
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
                    <Periodespørsmål name="svar.alderspensjon.periode">Når mortar du alderspensjon?</Periodespørsmål>
                )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.pensjonsordning.jaNei"
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
                {watchPensjonsordning && (
                    <>
                        <Periodespørsmål name="svar.pensjonsordning.periode">Når mottar du det?</Periodespørsmål>
                    </>
                )}
            </div>
            <div className={styles.blokk}>
            <JaNeiSpørsmål
                name="svar.etterlønn.jaNei"
                validate={etterlønnValidator}
                hjelpetekst={{
                                tittel: 'Hva er etterlønn?',
                                tekst: 'Med etterlønn menes penger du mottar i forbindelse med at du slutter i arbeid og ikke jobber.'
                            }}
            >
                Mottar du etterlønn?
            </JaNeiSpørsmål>
            {watchEtterlønn && (
                <>
                    <Fritekstspørsmål
                        name="svar.etterlønn.utbetaler"
                        textFieldProps={{ htmlSize: 45 }}
                        validate={etterlønnutbetalerValidator}
                    >
                        Hvem utbetaler etterlønn?
                    </Fritekstspørsmål>
                </>
            )}
            </div>
            <div className={styles.blokk}>
                <JaNeiSpørsmål
                    name="svar.jobbsjansen.jaNei"
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
                {watchJobbsjansen && (<Periodespørsmål name="svar.jobbsjansen.periode">Når mottar du det?</Periodespørsmål>)}
            </div>
        </Step>
    );
}
