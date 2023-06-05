import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, periodenErInnenforTiltaksperiodeValidator } from '@/utils/formValidators';
import { formatPeriode } from '@/utils/formatPeriode';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import {
    borPåInstitusjonValidator,
    påkrevdInstitusjonsoppholdPeriodeValidator,
} from '@/steps/institusjonsoppholdsteg/validation';

interface InstitusjonsoppholdProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function InstitusjonsoppholdSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: InstitusjonsoppholdProps) {
    const { watch } = useFormContext();
    const { valgtTiltak } = useContext(UtfyllingContext);
    const watchBorPåInstitusjon = watch('svar.institusjonsopphold.borPåInstitusjon');
    const brukerregistrertPeriode = watch('svar.tiltak.periode');
    const tiltaksperiode = brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode;
    const tiltaksperiodeTekst = formatPeriode(tiltaksperiode);

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <React.Fragment>
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
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdInstitusjonsoppholdPeriodeValidator,
                            (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                        ]}
                        minDate={new Date(tiltaksperiode?.fra)}
                        maxDate={new Date(tiltaksperiode?.til)}
                    >
                        I hvilken periode bor du på institusjon med gratis opphold, mat og drikke?
                    </Periodespørsmål>
                )}
            </>
        </Step>
    );
}
