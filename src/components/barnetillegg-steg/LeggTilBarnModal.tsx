import {Add} from '@navikt/ds-icons';
import {Alert, Button, Heading, Link, Modal, ReadMore, TextField} from '@navikt/ds-react';
import React, {useEffect, useRef, useState} from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import {v4 as uuidv4} from 'uuid';

import Datovelger from '../datovelger/Datovelger';

import styles from './Barnetillegg.module.css';
import {ExternalLinkIcon} from '@navikt/aksel-icons';
import {påkrevdJaNeiSpørsmålValidator} from '@/utils/validators';
import FileUploader from "@/components/file-uploader/FIleUploader";
import {useFormContext} from "react-hook-form";
import Søknad from "@/types/Søknad";
import Image from "next/image"
import veiledningsBilde from "../../public/veiledning/vedleggsveiledning.png"
import {ScanningGuide} from "@/components/veiledning/ScanningGuide";

export const LeggTilBarnModal = () => {
    const {control} = useFormContext<Søknad>();

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
                icon={<Add aria-hidden/>}
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
                    <TextField label="Fornavn og mellomnavn"/>
                    <TextField label="Etternavn"/>
                    <Datovelger onDateChange={() => {
                    }} label="Fødselsdato"/>
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
                                    <span style={{display: 'block', marginTop: '1rem'}}>
                                        <Link
                                            href="https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-utlandet/relatert-informasjon/eos-landene"
                                            target="_blank"
                                        >
                                            Du kan lese mer om hvile land som er med i EØS her.
                                            <ExternalLinkIcon title="a11y-title"/>
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
                        className={styles.knappAvbrytModal}
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                    <div/>
                    <Button
                        onClick={() => setOpen(true)}
                        className={styles.knappLagreModal}
                        variant="primary"
                    >
                        Lagre
                    </Button>

                    <Alert variant="info">
                        Du må legge ved:
                        <ul>
                            <li>
                                Bekreftelse på at du er forelder til barnet, og fra når (fødselstidspunkt eller
                                adopsjonstidspunkt). Dette kan for eksempel være fødselsattest eller
                                adopsjonsdokumenter.
                            </li>
                        </ul>
                        Dersom du må ettersende vedlegg kan du sende disse pr post.
                    </Alert>
                    <p>
                        Hvis du har vedlegg på papir, kan du skanne det inn og laste det opp. Hvis du ikke har skanner,
                        kan du i stedet ta bilde av dokumentet med mobiltelefonen din.
                    </p>
                    <ReadMore header="Slik tar du et godt bilde av dokumentet">
                        <div style={{display: 'flex', justifyContent: 'center', backgroundColor: 'white'}}>
                            <ScanningGuide/>
                        </div>
                    </ReadMore>

                    <div style={{marginTop: '2rem'}}>
                        <FileUploader name="vedlegg" kategori="fødselsattest" control={control}/>
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
};
