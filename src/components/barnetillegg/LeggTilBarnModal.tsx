import {Add} from '@navikt/ds-icons';
import {Alert, Button, Heading, Link, Modal, Radio, RadioGroup, ReadMore, TextField} from '@navikt/ds-react';
import React, {useEffect, useRef, useState} from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import {v4 as uuidv4} from 'uuid';

import Datovelger from "@/components/datovelger/Datovelger";

import styles from './Barnetillegg.module.css';
import {ExternalLinkIcon} from '@navikt/aksel-icons';
import {påkrevdFritekstfeltValidator, påkrevdJaNeiSpørsmålValidator} from '@/utils/validators';
import FileUploader from "@/components/file-uploader/FIleUploader";
import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import Søknad from "@/types/Søknad";
import {ScanningGuide} from "@/components/veiledning/ScanningGuide";
import {Barn} from "@/types/Barn";
import {formatDate} from "@/utils/formatDate";
import Fritekstspørsmål from "@/components/fritekstspørsmål/Fritekstspørsmål";
import {Personalia} from "@/types/Personalia";

interface LeggTilBarnModalProps {
    fieldArray: UseFieldArrayReturn<Søknad>;
}

export const LeggTilBarnModal = ({fieldArray}: LeggTilBarnModalProps ) => {
    const {trigger, getValues, control, setValue} = useFormContext<Søknad>();
    const [open, setOpen] = useState(false);
    const uuid = useRef(uuidv4())

    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);

    useEffect(() => {
        if (open) {
            uuid.current = uuidv4()
            setValue('svar.barnetillegg.kladd', {fornavn: "", etternavn: "", fødselsdato: "", uuid: uuid.current})
        }
    }, [open]);

    function navnefeltValidator(verdi: string) {
        return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi navn');
    }

    function barnUtenforEØSValidator(verdi: boolean) {
        return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om barnet bor utenfor EØS');
    }

    return (
        <>
            <Button
                onClick={e => {
                    e.preventDefault()
                    setOpen(true)
                }}
                className={styles.knappLeggTilBarn}
                variant="secondary"
                type="button"
                icon={<Add aria-hidden/>}
            >
                Legg til barn
            </Button>

            <Modal
                open={open}
                aria-label="Legg til barn"
                onClose={() => {
                    setOpen(false)
                }}
                aria-labelledby="modal-heading"
                className={styles.modalLeggTilBarn}
            >
                <Modal.Content>
                    <Heading spacing level="1" size="large" id="modal-heading">
                        Andre barn
                    </Heading>

                            <>
                                <Fritekstspørsmål
                                    name={`svar.barnetillegg.kladd.fornavn`}
                                    textFieldProps={{ htmlSize: 45 }}
                                    validate={navnefeltValidator}
                                >
                                    Fornavn og mellomnavn
                                </Fritekstspørsmål>
                                <Fritekstspørsmål
                                    name={`svar.barnetillegg.kladd.etternavn`}
                                    textFieldProps={{ htmlSize: 45 }}
                                    validate={navnefeltValidator}
                                >
                                    Etternavn
                                </Fritekstspørsmål>
                                //TODO: Lar gammel datovelger stå i denne committen for å unngå konflikt.
                                <Datovelger
                                    datoMåVæreIFortid={true}
                                    label="Fødselsdato"
                                    onDateChange={(date) => {
                                    }}
                                />
                                <JaNeiSpørsmål
                                    reverse
                                    name={`svar.barnetillegg.kladd.oppholdUtenforEØS`}
                                    validate={barnUtenforEØSValidator}
                                    hjelpetekst={{
                                        tittel: 'Hvorfor spør vi om dette?',
                                        tekst: (
                                            <>
                                                <span>
                                                    Hvis barnet ditt oppholder seg utenfor EØS i tiltaksperioden kan det ha betydning for
                                                    din rett til barnetillegg.
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
                            </>
                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            setOpen(false)
                        }}
                        className={styles.knappAvbrytModal}
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                    <div/>
                    <Button
                        onClick={async (e) => {
                            e.preventDefault()
                            const harIngenValideringsfeil = await trigger('svar.barnetillegg.kladd')
                            if (harIngenValideringsfeil) {
                                  const barnLagtTil = {
                                    ...getValues('svar.barnetillegg.kladd'), uuid: uuid.current
                                }
                                fieldArray.append(barnLagtTil)
                                setOpen(false)
                            }
                            console.log("Valideringsfeil!")

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
                        <FileUploader name="vedlegg" uuid={uuid.current} knappTekst="Last opp fødselsattest eller adopsjonsbevis" control={control}/>
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
};
