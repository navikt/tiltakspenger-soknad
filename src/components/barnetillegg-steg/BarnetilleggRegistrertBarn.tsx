import {BarnFraAPI} from "@/types/Barn";
import React from "react";
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import {påkrevdJaNeiSpørsmålValidator} from "@/utils/validators";
import {Link} from "@navikt/ds-react";
import {ExternalLinkIcon} from "@navikt/aksel-icons";
import styles from "./BarnetilleggRegistrertBarn.module.css";

interface props {
    barn: BarnFraAPI
}

function barnUtenforEØSValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker barnetillegg');
}

export default function BarnInfo({barn}: props) {
    const {fødselsdato, fornavn, etternavn, mellomnavn, uuid} = barn;
    return (
        <div className={styles.barnetillegg}>
            <p>Navn: {fornavn} {mellomnavn} {etternavn}</p>
            <p>Fødselsdato: {fødselsdato}</p>
            <p>Bosted: Norge</p>
            <JaNeiSpørsmål
                reverse
                name={`svar.barnetillegg.registrerteBarn.oppholdUtenforEØS.${uuid}`}
                validate={barnUtenforEØSValidator}
                hjelpetekst={{
                    tittel: 'Hvorfor spør vi om dette?',
                    tekst: (
                        <>
                                    <span>
                                        Hvis barnet ditt oppholder seg utenfor EØS i tiltaksperioden kan det ha
                                        betydning for din rett til barnetillegg.
                                    </span>
                            <span style={{display: 'block', marginTop: '1rem'}}>
                                        <Link href="www..no" target="_blank">Du kan lese mer om hvile land som er med i EØS her.
                                        <ExternalLinkIcon title="a11y-title" />
                                        </Link>
                                    </span>
                        </>
                    ),
                }}
            >
                Oppholder barnet ditt seg utenfor EØS i tiltaksperioden?
            </JaNeiSpørsmål>
        </div>
    )
}