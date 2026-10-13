import { Alert, Button, Modal, ReadMore } from '@navikt/ds-react';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import styles from './Barnetillegg.module.css';
import { PlusIcon } from '@navikt/aksel-icons';
import { påkrevdDatoValidator, påkrevdFritekstfeltValidator } from '@/utils/formValidators';
import BostedSpørsmål, { navnPåBarnet } from '@/components/barnetillegg/BostedSpørsmål';
import FileUploader from '@/components/file-uploader/FileUploader';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import { ScanningGuide } from '@/components/veiledning/ScanningGuide';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Datospørsmål from '@/components/datospørsmål/Datospørsmål';
import { DATOFORMAT_BESKRIVELSE } from '@/components/datovelger/datoFeilmelding';
import { Barn } from '@/types/Barn';

// Grensen for hva vi godtar, satt for å fange grove tastefeil i årstallet.
// Den er ikke en regel om hvem det gis barnetillegg for. Aldersvurderingen hører hjemme i
// saksbehandling, som måler fødselsdato mot tiltaksperioden og periodiserer tillegget fram til
// dagen før barnet fyller 16. Derfor er grensen satt så vidt at den ikke stenger noen ute.
const ANTALL_ÅR_TILBAKE_I_DATOVELGER = 100;

// Nedtrekket viser bare de siste årene, siden barnetillegget gjelder barn under 16.
// Trenger noen et eldre årstall, skriver de det inn — grensen over er fortsatt den som gjelder.
const ANTALL_ÅR_I_NEDTREKK = 20;

interface LeggTilBarnModalProps {
    fieldArray: UseFieldArrayReturn<Søknad>;
}

export interface LeggTilBarnModalImperativeHandle {
    åpneModal: (barn: Barn) => void;
    slettVedleggUtenTilknytningTilBarn: () => void;
}

export const LeggTilBarnModal = React.forwardRef<LeggTilBarnModalImperativeHandle, LeggTilBarnModalProps>(
    function LeggTilBarnModal({ fieldArray }: LeggTilBarnModalProps, ref) {
        const { trigger, getValues, control, setValue, resetField, setFocus, clearErrors, watch } =
            useFormContext<Søknad>();
        const kladdFornavn = watch('svar.barnetillegg.kladd.fornavn');
        const kladdEtternavn = watch('svar.barnetillegg.kladd.etternavn');
        const uuid = useRef(uuidv4());
        const modalRef = useRef<HTMLDialogElement>(null);
        const modalErÅpen = modalRef?.current?.open;
        // useDatepicker leser defaultSelected kun ved montering, og Modal.Body holder innholdet
        // montert også når dialogen er lukket. Vi bytter derfor key på datospørsmålet hver gang
        // modalen åpnes, slik at feltet viser dato for det barnet som faktisk redigeres.
        const [åpningsnummer, setÅpningsnummer] = useState(0);
        const tidligsteFødselsdato = useMemo(
            () => dayjs().subtract(ANTALL_ÅR_TILBAKE_I_DATOVELGER, 'year').startOf('year').toDate(),
            [],
        );
        const tidligsteÅrINedtrekk = useMemo(
            () => dayjs().subtract(ANTALL_ÅR_I_NEDTREKK, 'year').startOf('year').toDate(),
            [],
        );

        React.useEffect(() => {
            // Setter fokus på første felt i modalen når den åpnes slik at bruker kan fylle inn informasjon med en gang.
            // Spesielt nyttig for skjermlesere.
            if (modalErÅpen) {
                setFocus('svar.barnetillegg.kladd.fornavn');
            }
        }, [modalErÅpen, setFocus]);

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
            if (!modalErÅpen) return;
            return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi fornavn');
        }

        function etternavnValidator(verdi: string) {
            if (!modalErÅpen) return;
            return påkrevdFritekstfeltValidator(verdi, 'Du må oppgi etternavn');
        }

        function datofeltValidator(verdi: Date) {
            if (!modalErÅpen) return;
            return påkrevdDatoValidator(verdi, 'Du må oppgi fødselsdato');
        }

        function maks25tegnValidator(verdi: string) {
            if (!modalRef?.current?.open) return;
            if (verdi.length > 25) {
                return 'Du kan ikke skrive inn mer enn 25 tegn';
            }
        }

        const tomtBarn: Barn = {
            fnr: null,
            fornavn: '',
            etternavn: '',
            fødselsdato: '',
            uuid: '',
            index: undefined,
        };

        const åpneModal = (barn: Barn) => {
            const åpneMedUuid = barn.uuid === '' ? uuidv4() : barn.uuid;
            setValue('svar.barnetillegg.kladd', {
                fnr: barn.fnr,
                fornavn: barn.fornavn,
                etternavn: barn.etternavn,
                fødselsdato: barn.fødselsdato,
                borINorge: barn.borINorge,
                borIEøs: barn.borIEøs,
                uuid: åpneMedUuid,
                index: barn.index,
            });
            uuid.current = åpneMedUuid;
            setÅpningsnummer((forrige) => forrige + 1);
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
                            key={åpningsnummer}
                            name="svar.barnetillegg.kladd.fødselsdato"
                            datoMåVæreIFortid={true}
                            minDate={tidligsteFødselsdato}
                            kalenderFraDato={tidligsteÅrINedtrekk}
                            description={DATOFORMAT_BESKRIVELSE}
                            validate={datofeltValidator}
                        >
                            Fødselsdato
                        </Datospørsmål>
                        <BostedSpørsmål
                            barnetsNavn={navnPåBarnet({ fornavn: kladdFornavn, etternavn: kladdEtternavn })}
                            borINorgeName="svar.barnetillegg.kladd.borINorge"
                            borIEøsName="svar.barnetillegg.kladd.borIEøs"
                            skalValideres={() => !!modalRef?.current?.open}
                        />
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
                                label="Last opp fødselsattest eller adopsjonsbevis"
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
