/*import styles from "@/components/barnetillegg-steg/BarnetilleggRegistrertBarn.module.css";*/
import React from "react";
import {Barn} from "@/types/Barn";
import {formatDate} from "@/utils/formatDate";

interface props {
    barn: any //pga FieldArray
    vedlegg?: string[]
}
export default function BarneInfo({barn, vedlegg}: props) {
    const {fødselsdato, fornavn, etternavn, mellomnavn, oppholdUtenforEØS, uuid} = barn;
    console.log(fødselsdato)
    return (
        <div>
            <p><strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}</p>
            <p><strong>Fødselsdato:</strong> {formatDate(fødselsdato)}</p>
            <p><strong>Oppholder barnet seg utenfor EØS i søkandsperioden:</strong>{oppholdUtenforEØS ? " Ja" : " Nei"}</p>
            {vedlegg?.map((vedlegg, index) => (
                <p><strong>{`Vedlegg ${index + 1}: `}</strong>{vedlegg}</p>
            ))}
        </div>
    )
}
