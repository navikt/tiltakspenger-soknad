import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';
import {formatPeriode} from "@/utils/formatPeriode";
import {Tiltak} from "@/types/Tiltak";

interface InstitusjonsoppholdProps {
    title: string;
    stepNumber: string;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    valgtTiltak: Tiltak;
}

function borPåInstitusjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du bor på institusjon');
}

function påkrevdInstitusjonsoppholdPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du bor på institusjon');
}

export default function InstitusjonsoppholdSteg({ title, stepNumber, onCompleted, onGoToPreviousStep, valgtTiltak }: InstitusjonsoppholdProps) {
    const { watch } = useFormContext();
    const watchBorPåInstitusjon = watch('svar.institusjonsopphold.borPåInstitusjon');
    const brukerregistrertPeriode = watch('svar.tiltak.periode');
    const tiltaksperiodeTekst = formatPeriode(brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode);

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
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
                </React.Fragment>
            }
        >
            <>
                <JaNeiSpørsmål
                    name="svar.institusjonsopphold.borPåInstitusjon"
                    validate={borPåInstitusjonValidator}
                    hjelpetekst={{
                        tittel: 'Unntak for barnevernsinstitusjoner og overgangsbolig',
                        tekst: 'Bor du på barnevernsinstitusjon eller i en overgangsbolig har du likevel rett til å få tiltakspenger. Da kan du krysse «nei» på spørsmålet.',
                    }}
                >
                    Bor du i en institusjon med gratis opphold, mat og drikke i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchBorPåInstitusjon && (
                    <Periodespørsmål
                        name="svar.institusjonsopphold.periode"
                        validate={[gyldigPeriodeValidator, påkrevdInstitusjonsoppholdPeriodeValidator]}
                    >
                        I hvilken periode bor du på institusjon med gratis opphold, mat og drikke?
                    </Periodespørsmål>
                )}
            </>
        </Step>
    );
}
