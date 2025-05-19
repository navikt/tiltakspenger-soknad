import { Alert, Button, Link, Modal, ReadMore } from '@navikt/ds-react';
import React, { useImperativeHandle, useRef } from 'react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { v4 as uuidv4 } from 'uuid';
import styles from './Barnetillegg.module.css';
import { ExternalLinkIcon, PlusIcon } from '@navikt/aksel-icons';
import {
    påkrevdDatoValidator,
    påkrevdFritekstfeltValidator,
    påkrevdJaNeiSpørsmålValidator,
} from '@/utils/formValidators';
import FileUploader from '@/components/file-uploader/FIleUploader';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import { ScanningGuide } from '@/components/veiledning/ScanningGuide';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Datospørsmål from '@/components/datospørsmål/Datospørsmål';
import { Barn } from '@/types/Barn';

interface LeggTilBarnModalProps {
    fieldArray: UseFieldArrayReturn<Søknad>;
}

export interface LeggTilBarnModalImperativeHandle {
    åpneModal: (barn: Barn) => void;
    slettVedleggUtenTilknytningTilBarn: () => void;
}

export const LeggTilBarnModal = React.forwardRef<LeggTilBarnModalImperativeHandle, LeggTilBarnModalProps>(
    function LeggTilBarnModal({ fieldArray }: LeggTilBarnModalProps, ref) {
        const { trigger, getValues, control, setValue, resetField, clearErrors } = useFormContext<Søknad>();
        const uuid = useRef(uuidv4());
        const modalRef = useRef<HTMLDialogElement>(null);
        const modalErLukket = !modalRef?.current?.open;

        useImperativeHandle(ref, () => {
            return {
                åpneModal(barn: Barn) {
                    åpneModal(barn);
                },
                slettVedleggUtenTilknytningTilBarn() {
                    slettVedleggUtenTilknytningTilBarn();
                },
            };
        }, []);

        function fornavnValidator(verdi: string) {
            if (modalErLukket) return;
            return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi fornavn');
        }

        function etternavnValidator(verdi: string) {
            if (modalErLukket) return;
            return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi etternavn');
        }

        function datofeltValidator(verdi: Date) {
            if (modalErLukket) return;
            return påkrevdDatoValidator(verdi, 'Du må oppgi fødselsdato');
        }

        function barnUtenforEØSValidator(verdi: boolean) {
            if (modalErLukket) return;
            return påkrevdJaNeiSpørsmålValidator(
                verdi,
                'Du må svare på om barnet ditt oppholder seg i Norge eller et annet EØS-land i tiltaksperioden',
            );
        }

        function maks25tegnValidator(verdi: string) {
            if (!modalRef?.current?.open) return;
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
            modalRef?.current?.showModal();
        };

        const slettVedleggUtenTilknytningTilBarn = () => {
            const barnLagtTil = getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor');
            const vedleggMedTilknytning = getValues('vedlegg').filter((vedlegg) =>
                barnLagtTil.find((barn) => barn.uuid === vedlegg.uuid),
            );
            setValue('vedlegg', vedleggMedTilknytning);
        };

        const lukkModal = () => {
            clearErrors('svar.barnetillegg.kladd');
            // TODO Fødselsdato blir ikke resatt til tom..
            resetField('svar.barnetillegg.kladd');
            slettVedleggUtenTilknytningTilBarn();
            modalRef?.current?.close();
        };

        return (
            <>
                <Button
                    onClick={() => åpneModal(tomtBarn)}
                    className={styles.knappLeggTilBarn}
                    variant="secondary"
                    type="button"
                    icon={<PlusIcon aria-hidden />}
                >
                    Legg til barn
                </Button>

                <Modal
                    ref={modalRef}
                    className={styles.modalLeggTilBarn}
                    header={{ heading: 'Andre barn' }}
                    onClose={lukkModal}
                >
                    <Modal.Body role="dialog">
                        <Fritekstspørsmål
                            name={`svar.barnetillegg.kladd.fornavn`}
                            validate={[fornavnValidator, maks25tegnValidator]}
                        >
                            Fornavn og mellomnavn
                        </Fritekstspørsmål>
                        <Fritekstspørsmål
                            name={`svar.barnetillegg.kladd.etternavn`}
                            validate={[etternavnValidator, maks25tegnValidator]}
                        >
                            Etternavn
                        </Fritekstspørsmål>
                        <Datospørsmål
                            name="svar.barnetillegg.kladd.fødselsdato"
                            datoMåVæreIFortid={true}
                            validate={datofeltValidator}
                        >
                            Fødselsdato (dd.mm.åååå)
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
                                            Hvis barnet ditt oppholder seg utenfor EØS i tiltaksperioden kan det ha
                                            betydning for din rett til barnetillegg.
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
                        <Alert variant="info" style={{ marginTop: '1rem' }}>
                            <div style={{ width: 'initial', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                <b>Du må legge ved:</b>
                                <p>
                                    Bekreftelse på at du er forelder til barnet, og fra når (fødselstidspunkt eller
                                    adopsjonstidspunkt). Dette kan for eksempel være fødselsattest eller
                                    adopsjonsdokumenter.
                                </p>
                                Dersom du må ettersende vedlegg kan du sende disse pr post.
                            </div>
                        </Alert>
                        <p>
                            Hvis du har vedlegg på papir, kan du skanne det inn og laste det opp. Hvis du ikke har
                            skanner, kan du i stedet ta bilde av dokumentet med mobiltelefonen din.
                        </p>
                        <ReadMore header="Slik tar du et godt bilde av dokumentet">
                            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'white' }}>
                                <ScanningGuide />
                            </div>
                        </ReadMore>
                        <div className={styles.marginTop}>
                            <FileUploader
                                name="vedlegg"
                                uuid={uuid.current}
                                knappTekst="Last opp fødselsattest eller adopsjonsbevis"
                                control={control}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="secondary" onClick={lukkModal}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={async (e) => {
                                e.preventDefault();
                                const harIngenValideringsfeil = await trigger('svar.barnetillegg.kladd');
                                if (harIngenValideringsfeil) {
                                    const barnLagtTil = {
                                        ...getValues('svar.barnetillegg.kladd'),
                                        uuid: uuid.current,
                                    };
                                    if (barnLagtTil.index == undefined) {
                                        fieldArray.append(barnLagtTil);
                                    } else {
                                        fieldArray.update(barnLagtTil.index, barnLagtTil);
                                    }
                                    modalRef?.current?.close();
                                }
                            }}
                        >
                            Lagre
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    },
);
