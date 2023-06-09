import React from "react";
import {formatDate} from "@/utils/formatDate";
import {Vedlegg} from "@/types/Søknad";
import {Barn} from "@/types/Barn";

interface BarneInfoProps {
    barn: Barn
    vedlegg?: Vedlegg[]
}
export default function BarneInfo({barn, vedlegg}: BarneInfoProps) {
    const {fødselsdato, fornavn, etternavn, mellomnavn, oppholdInnenforEøs} = barn;
    return (
        <div>
            <p><strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}</p>
            <p><strong>Fødselsdato:</strong> {formatDate(fødselsdato)}</p>
            <p><strong>Oppholder barnet seg innenfor EØS i søkandsperioden:</strong>{oppholdInnenforEøs ? " Ja" : " Nei"}</p>
            {vedlegg?.map((vedlegg, index) => (
                <p key={`${vedlegg.uuid}-${index}`}><strong>{`Vedlegg ${index + 1}: `}</strong>{vedlegg.file.name}</p>
            ))}
        </div>
    )
}
