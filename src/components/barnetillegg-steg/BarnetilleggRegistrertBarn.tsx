import { Barn } from '@/types/Barn';
import React from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';
import { Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import styles from './Barnetillegg.module.css';
import { formatDate } from '@/utils/formatDate';

interface props {
    barn: Barn;
}

function barnUtenforEØSValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker barnetillegg');
}

export default function BarnInfo({ barn }: props) {
    const { fødselsdato, fornavn, etternavn, mellomnavn, uuid } = barn;
    return (
        <div className={styles.barnetillegg}>
            <p>
                Navn: {fornavn} {mellomnavn} {etternavn}
            </p>
            <p>Fødselsdato: {formatDate(fødselsdato)}</p>
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
                                Hvis barnet ditt oppholder seg utenfor EØS i tiltaksperioden kan det ha betydning for
                                din rett til barnetillegg.
                            </span>
                            <span style={{ display: 'block', marginTop: '1rem' }}>
                                <Link
                                    href="https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-utlandet/relatert-informasjon/eos-landene"
                                    target="_blank"
                                >
                                    Du kan lese mer om hvile land som er med i EØS her.
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
    );
}
