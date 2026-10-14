import React from 'react';
import { formatDate } from '@/utils/formatDate';
import { visningsnavnForBarn } from '@/utils/barnetsNavn';
import { Vedlegg } from '@/types/Søknad';
import { Barn } from '@/types/Barn';

function jaNei(svar: boolean | undefined) {
    return svar ? 'Ja' : 'Nei';
}

interface BarneInfoProps {
    barn: Barn;
    vedlegg?: Vedlegg[];
}

export default function BarneInfo({ barn, vedlegg }: BarneInfoProps) {
    const { fødselsdato, borINorge, borIEøs } = barn;
    return (
        <div>
            <p>
                <strong>Navn:</strong> {visningsnavnForBarn(barn)}
            </p>
            <p>
                <strong>Fødselsdato:</strong> {formatDate(fødselsdato)}
            </p>
            <p>
                <strong>Bor i Norge:</strong> {jaNei(borINorge)}
            </p>
            {borINorge === false && (
                <p>
                    <strong>Bor i et EØS-land:</strong> {jaNei(borIEøs)}
                </p>
            )}
            {vedlegg?.map((vedlegg, index) => (
                <p key={`${vedlegg.uuid}-${index}`}>
                    <strong>{`Vedlegg ${index + 1}: `}</strong>
                    {vedlegg.file.name}
                </p>
            ))}
        </div>
    );
}
