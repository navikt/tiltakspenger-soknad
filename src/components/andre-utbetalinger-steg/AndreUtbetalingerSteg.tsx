import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Steg from '@/components/steg/Steg';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';

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

export default function AndreUtbetalingerSteg({ onCompleted, onGoToPreviousStep }: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchPensjonsordning = watch('mottarEllerSøktPensjonsordning');
    const watchEtterlønn = watch('mottarEllerSøktEtterlønn');
    return (
        <Steg
            tittel="Andre utbetalinger"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={3}
        >
            <JaNeiSpørsmål name="mottarEllerSøktPensjonsordning" validate={pensjonsordningValidator}>
                Har du søkt om eller mottar pensjonsordning fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchPensjonsordning && (
                <>
                    <Fritekstspørsmål name="pensjon.utbetaler" textFieldProps={{ htmlSize: 45 }}>
                        Hvem utbetaler etterlønn?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="pensjon.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
            <JaNeiSpørsmål name="mottarEllerSøktEtterlønn" validate={etterlønnValidator}>
                Har du søkt om eller mottar etterlønn fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchEtterlønn && (
                <>
                    <Fritekstspørsmål name="etterlønn.utbetaler" textFieldProps={{ htmlSize: 45 }}>
                        Hvem utbetaler etterlønn?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="etterlønn.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
        </Steg>
    );
}
