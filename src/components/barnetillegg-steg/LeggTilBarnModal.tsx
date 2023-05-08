import { Add } from '@navikt/ds-icons';
import { BodyLong, Button, Heading, Link, Modal, TextField } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { v4 as uuidv4 } from 'uuid';

import Datovelger from '../datovelger/Datovelger';

import styles from './Barnetillegg.module.css';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';

export const LeggTilBarnModal = () => {
    const [open, setOpen] = useState(false);
    const uuid = useRef('');

    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);

    useEffect(() => {
        uuid.current = uuidv4();
    }, [open]);

    function barnUtenforEØSValidator(verdi: boolean) {
        return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker barnetillegg');
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className={styles.knappLeggTilBarn}
                variant="secondary"
                icon={<Add aria-hidden />}
            >
                Legg til barn
            </Button>

            <Modal
                open={open}
                aria-label="Legg til barn"
                onClose={() => setOpen((x) => !x)}
                aria-labelledby="modal-heading"
                className={styles.modalLeggTilBarn}
            >
                <Modal.Content>
                    <Heading spacing level="1" size="large" id="modal-heading">
                        Andre barn
                    </Heading>
                    <TextField label="Fornavn og mellomnavn" />
                    <TextField label="Etternavn" />
                    <Datovelger onDateChange={() => {}} label="Fødselsdato" />
                    <JaNeiSpørsmål
                        reverse
                        name={`svar.barnetillegg.selvregistrertBarn.${uuid.current}.oppholdUtenforEØS`}
                        validate={barnUtenforEØSValidator}
                        hjelpetekst={{
                            tittel: 'Hvorfor spør vi om dette?',
                            tekst: (
                                <>
                                    <span>
                                        Hvis barnet ditt oppholder seg utenfor EØS i tiltaksperioden kan det ha
                                        betydning for din rett til barnetillegg.
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
                    <Button
                        onClick={() => setOpen(true)}
                        className={styles.knappLeggTilBarn}
                        variant="secondary"
                        icon={<Add aria-hidden />}
                    >
                        Avbryt
                    </Button>
                    <div />
                    <Button
                        onClick={() => setOpen(true)}
                        className={styles.knappLeggTilBarn}
                        variant="primary"
                        icon={<Add aria-hidden />}
                    >
                        Lagre
                    </Button>
                </Modal.Content>
            </Modal>
        </>
    );
};
