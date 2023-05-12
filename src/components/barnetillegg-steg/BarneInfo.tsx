/*import styles from "@/components/barnetillegg-steg/BarnetilleggRegistrertBarn.module.css";*/
import React from "react";
import {Barn} from "@/types/Barn";
import {formatDate} from "@/utils/formatDate";

interface props {
    barn: Barn
    utenforEØS?: boolean
    vedlegg?: string[]
}
export default function BarneInfo({barn, utenforEØS, vedlegg}: props) {
    console.log("utenforEØS?", utenforEØS)
    const {fødselsdato, fornavn, etternavn, mellomnavn, uuid} = barn;
    return (
        <div>
            <p><strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}</p>
            <p><strong>Fødselsdato:</strong> {formatDate(fødselsdato)}</p>
            <p><strong>Oppholder barnet seg utenfor EØS i søkandsperioden:</strong>{utenforEØS ? " Ja" : " Nei"}</p>
            {vedlegg?.map((vedlegg, index) => (
                <p><strong>{`Vedlegg${index + 1}: `}</strong>{vedlegg}</p>
            ))}
        </div>
    )
}
