/*import styles from "@/components/barnetillegg-steg/BarnetilleggRegistrertBarn.module.css";*/
import React from "react";
import {Barn} from "@/types/Barn";

interface props {
    barn: Barn
    utenforEØS?: boolean
}
export default function BarneInfo({barn, utenforEØS}: props) {
    console.log("utenforEØS?", utenforEØS)
    const {fødselsdato, fornavn, etternavn, mellomnavn, uuid} = barn;
    return (
        <div>
            <p><strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}</p>
            <p><strong>Fødselsdato:</strong> {fødselsdato}</p>
            <p><strong>Bosted:</strong>Norge</p>
            <p><strong>Oppholder seg utenfor EØS:</strong>{utenforEØS ? " Ja" : " Nei"}</p>
        </div>
    )
}
