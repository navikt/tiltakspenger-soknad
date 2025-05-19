import { Barn } from '@/types/Barn';
import React from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/formValidators';
import { Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import styles from './Barnetillegg.module.css';
import { formatDate } from '@/utils/formatDate';

interface BarnetilleggRegistrertBarnProps {
    barn: Barn;
}

function barnUtenforEØSValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(
        verdi,
        'Du må svare på om barnet ditt oppholder seg i Norge eller et annet EØS-land i tiltaksperioden',
    );
}

export default function BarnetilleggRegistrertBarn({ barn }: BarnetilleggRegistrertBarnProps) {
    const { fødselsdato, fornavn, etternavn, mellomnavn, uuid } = barn;
    return (
        <div className={styles.barnetillegg}>
            {fornavn && (
                <p>
                    <strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}
                </p>
            )}
            <p>
                <strong>Fødselsdato:</strong> {formatDate(fødselsdato)}
            </p>
            <JaNeiSpørsmål
                reverse
                name={`svar.barnetillegg.eøsOppholdForBarnFraAPI.${uuid}`}
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
                                    Du kan lese mer om hvilke land som er med i EØS her.
                                    <ExternalLinkIcon title="a11y-title" />
                                </Link>
                            </span>
                        </>
                    ),
                }}
            >
                Oppholder barnet ditt seg i Norge eller et annet EØS-land i tiltaksperioden?
            </JaNeiSpørsmål>
        </div>
    );
}
