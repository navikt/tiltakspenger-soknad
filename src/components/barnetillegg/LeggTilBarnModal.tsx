import {Add} from '@navikt/ds-icons';
import {Alert, Button, Heading, Link, Modal, ReadMore} from '@navikt/ds-react';
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import {v4 as uuidv4} from 'uuid';
import styles from './Barnetillegg.module.css';
import {ExternalLinkIcon} from '@navikt/aksel-icons';
import {påkrevdDatoValidator, påkrevdFritekstfeltValidator, påkrevdJaNeiSpørsmålValidator} from '@/utils/formValidators';
import FileUploader from "@/components/file-uploader/FIleUploader";
import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import Søknad from "@/types/Søknad";
import {ScanningGuide} from "@/components/veiledning/ScanningGuide";
import Fritekstspørsmål from "@/components/fritekstspørsmål/Fritekstspørsmål";
import Datospørsmål from "@/components/datospørsmål/Datospørsmål";
import {Barn} from "@/types/Barn";

interface LeggTilBarnModalProps {
    fieldArray: UseFieldArrayReturn<Søknad>;
}

export interface LeggTilBarnModalImperativeHandle {
    åpneModal: (barn: Barn) => void,
    slettVedleggUtenTilknytningTilBarn: () => void,
}

export const LeggTilBarnModal = React.forwardRef<LeggTilBarnModalImperativeHandle, LeggTilBarnModalProps>(function LeggTilBarnModal({fieldArray}: LeggTilBarnModalProps, ref  ) {
    const {trigger, getValues, control, setValue, clearErrors} = useFormContext<Søknad>();
    const [open, setOpen] = useState(false);
    const uuid = useRef(uuidv4())

    useImperativeHandle(ref, () => {
        return {
            åpneModal(barn: Barn) {
                åpneModal(barn)
            },
            slettVedleggUtenTilknytningTilBarn() {
                slettVedleggUtenTilknytningTilBarn()
            }
        };
    }, []);

    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);

    function fornavnValidator(verdi: string) {
        return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi fornavn');
    }

    function etternavnValidator(verdi: string) {
        return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi etternavn');
    }

    function datofeltValidator(verdi: Date) {
        return påkrevdDatoValidator(verdi, 'Du må oppgi fødselsdato');
    }

    function barnUtenforEØSValidator(verdi: boolean) {
        return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om barnet bor utenfor EØS');
    }

    function maks25tegnValidator(verdi: string) {
        if (verdi.length > 25) {
            return 'Du kan ikke skrive inn mer enn 25 tegn';
        }
    }

    const tomtBarn = {
        fornavn: '',
        etternavn: '',
        fødselsdato: '',
        uuid: '',
        index: undefined,
    };

    const åpneModal = (barn: Barn) => {
        const åpneMedUuid = barn.uuid === '' ? uuidv4() : barn.uuid;
        setValue('svar.barnetillegg.kladd', {
            fornavn: barn.fornavn,
            etternavn: barn.etternavn,
            fødselsdato: barn.fødselsdato,
            oppholdInnenforEøs: barn.oppholdInnenforEøs,
            uuid: åpneMedUuid,
            index: barn.index,
        });
        uuid.current = åpneMedUuid;
        setOpen(true);
    };

    const slettVedleggUtenTilknytningTilBarn = () => {
        const barnLagtTil = getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor');
        const vedleggMedTilknytning = getValues('vedlegg').filter(
            vedlegg => barnLagtTil.find(
                barn => barn.uuid === vedlegg.uuid
            )
        );
        setValue('vedlegg', vedleggMedTilknytning);
    }

    const lukkModal = () => {
        clearErrors('svar.barnetillegg.kladd')
        slettVedleggUtenTilknytningTilBarn()
        setOpen(false)
    }

    return (
        <>
            <Button
                onClick={() => åpneModal(tomtBarn)}
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
                onClose={lukkModal}
                aria-labelledby="modal-heading"
                className={styles.modalLeggTilBarn}
            >
                <Modal.Content>
                    <Heading spacing level="1" size="large" id="modal-heading">
                        Andre barn
                    </Heading>
                                <Fritekstspørsmål
                                    name={`svar.barnetillegg.kladd.fornavn`}
                                    textFieldProps={{ htmlSize: 45 }}
                                    validate={[fornavnValidator, maks25tegnValidator]}
                                >
                                    Fornavn og mellomnavn
                                </Fritekstspørsmål>
                                <Fritekstspørsmål
                                    name={`svar.barnetillegg.kladd.etternavn`}
                                    textFieldProps={{ htmlSize: 45 }}
                                    validate={[etternavnValidator, maks25tegnValidator]}
                                >
                                    Etternavn
                                </Fritekstspørsmål>
                                <Datospørsmål
                                    name='svar.barnetillegg.kladd.fødselsdato'
                                    datoMåVæreIFortid={true}
                                    validate={datofeltValidator}
                                >
                                    Fødselsdato
                                </Datospørsmål>
                                <JaNeiSpørsmål
                                    reverse
                                    name={`svar.barnetillegg.kladd.oppholdInnenforEøs`}
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
                                    Oppholder barnet ditt seg innenfor EØS i tiltaksperioden?
                                </JaNeiSpørsmål>
                    <Button
                        onClick={lukkModal}
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
                                if (barnLagtTil.index == undefined) {
                                    fieldArray.append(barnLagtTil)
                                } else {
                                    fieldArray.update(barnLagtTil.index, barnLagtTil)
                                }
                                setOpen(false)
                            }
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
});
