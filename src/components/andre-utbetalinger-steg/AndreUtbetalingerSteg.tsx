import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Steg from '@/components/steg/Steg';

interface AndreUtbetalingerStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function AndreUtbetalingerSteg({ onCompleted, onGoToPreviousStep }: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchPensjonsordningEllerEtterlønn = watch('mottarEllerSøktPensjonsordningEllerEtterlønn');
    return (
        <Steg tittel="Andre utbetalinger" onCompleted={onCompleted} onGoToPreviousStep={onGoToPreviousStep}>
            <JaNeiSpørsmål name="mottarEllerSøktPensjonsordningEllerEtterlønn">
                Har du søkt om eller mottar pensjonsordning eller etterlønn fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchPensjonsordningEllerEtterlønn && (
                <>
                    <Fritekstspørsmål name="pensjonEllerEtterlønn.utbetaler" textFieldProps={{ htmlSize: 45 }}>
                        Hvem utbetaler pensjon eller etterlønn?
                    </Fritekstspørsmål>
                    <Fritekstspørsmål name="pensjonEllerEtterlønn.prosentandel" textFieldProps={{ htmlSize: 5 }}>
                        Oppgi prosentandel (valgfritt)
                    </Fritekstspørsmål>
                    <Periodespørsmål name="pensjonEllerEtterlønn.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
        </Steg>
    );
}
