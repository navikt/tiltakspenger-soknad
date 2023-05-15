import {Add} from '@navikt/ds-icons';
import {Alert, Button, Heading, Link, Modal, Radio, RadioGroup, ReadMore, TextField} from '@navikt/ds-react';
import React, {useEffect, useRef, useState} from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import {v4 as uuidv4} from 'uuid';

import Datovelger from "@/components/datovelger/Datovelger";

import styles from './Barnetillegg.module.css';
import {ExternalLinkIcon} from '@navikt/aksel-icons';
import {påkrevdJaNeiSpørsmålValidator} from '@/utils/validators';
import FileUploader from "@/components/file-uploader/FIleUploader";
import {useFieldArray, useFormContext} from "react-hook-form";
import Søknad from "@/types/Søknad";
import {ScanningGuide} from "@/components/veiledning/ScanningGuide";
import {Barn} from "@/types/Barn";
import {formatDate} from "@/utils/formatDate";

export const LeggTilBarnModal = () => {
    const {control, getValues} = useFormContext<Søknad>();
    const {fields, append, remove} = useFieldArray({name: 'svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor'})

    const [open, setOpen] = useState(false);
    const barn = useRef<Barn>({fornavn: "", etternavn: "", fødselsdato: "", uuid: ""});

    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);


    return (
        <>
            <Button
                onClick={e => {
                    e.preventDefault()
                    barn.current = {fornavn: "", etternavn: "", fødselsdato: "", uuid: uuidv4()}
                    setOpen(true)
                }}
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

                            <>
                                <TextField
                                    className={styles.modalTextField}
                                    type="text"
                                    label="Fornavn og mellomnavn"
                                    onChange={(event) =>
                                        barn.current.fornavn = event.target.value
                                    }
                                />
                                <TextField
                                    className={styles.modalTextField}
                                    label="Etternavn"
                                    onChange={(event) =>
                                        barn.current.etternavn = event.target.value
                                    }
                                />
                                <Datovelger
                                    datoMåVæreIFortid={true}
                                    label="Fødselsdato"
                                    onDateChange={(date) => {
                                        if (date) {
                                            barn.current.fødselsdato = formatDate(date.toDateString())
                                        }
                                    }}
                                />
                                <RadioGroup
                                    legend="Oppholder barnet ditt seg utenfor EØS i tiltaksperioden?"
                                    onChange={(radioSvar) => console.log("f3")
                                        // barn.current.oppholdUtenforEØS = radioSvar todo: Fikse EØS
                                    }
                                >
                                    <ReadMore header='Hvorfor spør vi om dette?'>
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
                                    </ReadMore>
                                    <Radio value={true}>Ja</Radio>
                                    <Radio value={false}>Nei</Radio>
                                </RadioGroup>
                            </>
                    <Button
                        onClick={() => {
                            setOpen(false)
                        }}
                        className={styles.knappAvbrytModal}
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                    <div/>
                    <Button
                        onClick={() => {
                            append(barn.current)
                            setOpen(false)
                            console.log(getValues())
                        }}
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

                    <div className={styles.marginTop}>
                        <FileUploader name="vedlegg" uuid={barn.current.uuid} knappTekst="Last opp fødselsattest eller adopsjonsbevis" control={control}/>
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
};
