import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';
import Step from '@/components/step/Step';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';

interface BarnetilleggStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function søkerBarnetilleggValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker barnetillegg');
}

export default function BarnetilleggSteg({ onCompleted, onGoToPreviousStep }: BarnetilleggStegProps) {
    const { watch } = useFormContext();
    const watchSøkerOmBarnetillegg = watch('søkerOmBarnetillegg');
    return (
        <Step title="Barnetillegg" onCompleted={onCompleted} onGoToPreviousStep={onGoToPreviousStep} stepNumber={4}>
            <JaNeiSpørsmål name="søkerOmBarnetillegg" validate={søkerBarnetilleggValidator}>
                Ønsker du å søke om barnetillegg for ett eller flere barn under 16 år som du forsørger?
            </JaNeiSpørsmål>
            {watchSøkerOmBarnetillegg && <VariabelPersonliste name="barnSøktBarnetilleggFor" />}
        </Step>
    );
}
