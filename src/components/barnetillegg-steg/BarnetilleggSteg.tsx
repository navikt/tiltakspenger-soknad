import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';
import Steg from '@/components/steg/Steg';

interface BarnetilleggStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function BarnetilleggSteg({ onCompleted, onGoToPreviousStep }: BarnetilleggStegProps) {
    const { watch } = useFormContext();
    const watchSøkerOmBarnetillegg = watch('søkerOmBarnetillegg');
    return (
        <Steg tittel="Barnetillegg" onCompleted={onCompleted} onGoToPreviousStep={onGoToPreviousStep}>
            <JaNeiSpørsmål name="søkerOmBarnetillegg">
                Ønsker du å søke om barnetillegg for ett eller flere barn under 16 år som du forsørger?
            </JaNeiSpørsmål>
            {watchSøkerOmBarnetillegg && <VariabelPersonliste name="barnSøktBarnetilleggFor" />}
        </Steg>
    );
}
