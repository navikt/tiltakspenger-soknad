import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/validators';
import { FormPeriode } from '@/types/FormPeriode';

interface KvpStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function deltarIKvpValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i kvalifiseringsprogrammet');
}

function deltarIIntroprogrammetValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i introduksjonsprogrammet');
}

function borPåInstitusjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du bor på institusjon');
}

function påkrevdKvpPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i kvalifiseringsprogrammet');
}

function påkrevdIntroprogramPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i introduksjonsprogrammet');
}

export default function KvpSteg({ onCompleted, onGoToPreviousStep }: KvpStegProps) {
    const { watch } = useFormContext();

    const watchDeltarIKvp = watch('deltarIKvp');
    const watchDeltarIIntroprogrammet = watch('deltarIIntroprogrammet');

    return (
        <Step
            title="Kvalifiseringsprogrammet, introduksjonsprogrammet og institusjonsopphold"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={2}
            guide={
                <React.Fragment>
                    <p>
                        Hvis du deltar i kvalifiseringsprogrammet eller introduksjonsprogrammet har du <b>ikke</b> rett
                        på tiltakspenger. Du må derfor svare på spørsmål om dette.
                    </p>
                    <p>
                        Bor du på en institusjon med gratis opphold, mat og drikke når du deltar i et
                        arbeidsmarkedstiltak, har du som regel ikke rett til tiltakspenger. En institusjon kan for
                        eksempel være et sykehus eller et fengsel.
                    </p>
                    <p></p>
                </React.Fragment>
            }
        >
            <>
                <JaNeiSpørsmål
                    name="deltarIKvp"
                    validate={deltarIKvpValidator}
                    hjelpetekst={{
                        tittel: 'Hva er kvalifiseringsprogrammet?',
                        tekst: (
                            <>
                                <p>
                                    Kvalifiseringsprogrammet arrangeres av NAV. Det kan være aktuelt for personer som
                                    har levd på sosialhjelp over lang tid, eller står i fare for å komme i en slik
                                    situasjon. Programmet er et tilbud om opplæring og arbeidstrening, og oppfølging for
                                    å komme i arbeid eller meningsfull aktivitet.
                                </p>

                                <p>
                                    Hvis du er med i kvalifiseringsprogrammet har du fått et brev fra NAV-kontoret om
                                    dette. Du kan også få utbetalt kvalifiseringsstønad. Ta kontakt med ditt NAV-kontor
                                    hvis du er usikker på om du er med i kvalifiseringsprogrammet.
                                </p>

                                <p>Les mer om kvalifiseringsprogrammet på (LENKE)</p>
                            </>
                        ),
                    }}
                >
                    Deltar du i kvalifiseringsprogrammet?
                </JaNeiSpørsmål>
                {watchDeltarIKvp && (
                    <Periodespørsmål
                        name="periodeMedKvp"
                        validate={[gyldigPeriodeValidator, påkrevdKvpPeriodeValidator]}
                    >
                        Når deltar du i kvalifiseringsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål
                    name="deltarIIntroprogrammet"
                    validate={deltarIIntroprogrammetValidator}
                    hjelpetekst={{
                        tittel: 'Hva er introduksjonsprogrammet?',
                        tekst: (
                            <>
                                <p>Hva er introduksjonsprogrammet?</p>
                                <p>
                                    Introduksjonsprogrammet avtales med kommunen du bor i. Det er en ordning for
                                    nyankomne flyktninger. Hvis du er med i Introduksjonsprogrammet har du fått et brev
                                    fra kommunen du bor i om dette. Du kan også få utbetalt introduksjonsstønad. Ta
                                    kontakt med kommunen din hvis du er usikker på om du er med i
                                    Introduksjonsprogrammet.
                                </p>
                                <p>Du kan lese mer om introduksjonsprogrammet på (LENKE til IMDI)</p>
                            </>
                        ),
                    }}
                >
                    Deltar du i introduksjonsprogrammet?
                </JaNeiSpørsmål>
                {watchDeltarIIntroprogrammet && (
                    <Periodespørsmål
                        name="periodeMedIntroprogrammet"
                        validate={[gyldigPeriodeValidator, påkrevdIntroprogramPeriodeValidator]}
                    >
                        Når deltar du i introduksjonsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål
                    name="borPåInstitusjon"
                    validate={borPåInstitusjonValidator}
                    hjelpetekst={{
                        tittel: 'Unntak for barnevernsinstitusjoner og overgangsbolig',
                        tekst: 'Bor du på barnevernsinstitusjon eller i en overgangsbolig har du likevel rett til å få tiltakspenger. Da kan du krysse «nei» på spørsmålet.',
                    }}
                >
                    Bor du i en institusjon med gratis opphold, mat og drikke i perioden du søker om tiltakspenger for?
                </JaNeiSpørsmål>
            </>
        </Step>
    );
}
