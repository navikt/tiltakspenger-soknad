import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Step from '@/components/step/Step';
import { påkrevdFritekstfeltValidator, påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';

interface AndreUtbetalingerStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function pensjonsordningValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar pensjonsordning');
}

function etterlønnValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar etterlønn');
}

function pensjonsutbetalerValidator(verdi: string) {
    return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi hvem som utbetaler pensjon');
}

function etterlønnutbetalerValidator(verdi: string) {
    return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi hvem som utbetaler etterlønn');
}

export default function AndreUtbetalingerSteg({ onCompleted, onGoToPreviousStep }: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchPensjonsordning = watch('mottarEllerSøktPensjonsordning');
    const watchEtterlønn = watch('mottarEllerSøktEtterlønn');
    return (
        <Step
            title="Andre utbetalinger"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={3}
            guide="Hvis du mottar utbetalinger fra en offentlig eller privat pensjonsordning eller mottar etterlønn fra en
                arbeidsgiver, kan det ha betydning for hva du får utbetalt i tiltakspenger. Du trenger ikke oppgi
                eventuelle ytelser du mottar fra NAV."
        >
            <JaNeiSpørsmål name="mottarEllerSøktPensjonsordning" validate={pensjonsordningValidator}>
                Har du søkt om eller mottar pensjonsordning fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchPensjonsordning && (
                <>
                    <Fritekstspørsmål
                        name="pensjon.utbetaler"
                        textFieldProps={{ htmlSize: 45 }}
                        validate={pensjonsutbetalerValidator}
                    >
                        Hvem utbetaler pensjonsordningen?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="pensjon.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
            <JaNeiSpørsmål name="mottarEllerSøktEtterlønn" validate={etterlønnValidator}>
                Har du søkt om eller mottar etterlønn fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchEtterlønn && (
                <>
                    <Fritekstspørsmål
                        name="etterlønn.utbetaler"
                        textFieldProps={{ htmlSize: 45 }}
                        validate={etterlønnutbetalerValidator}
                    >
                        Hvem utbetaler etterlønn?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="etterlønn.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
        </Step>
    );
}
