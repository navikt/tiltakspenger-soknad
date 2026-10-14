import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Step from '@/components/step/Step';
import { Alert, BodyLong, BodyShort, Button, ErrorMessage, Heading, Loader, ReadMore } from '@navikt/ds-react';
import Søknad from '@/types/Søknad';
import BarnetilleggRegistrertBarn from '@/components/barnetillegg/BarnetilleggRegistrertBarn';
import { LeggTilBarnModal, LeggTilBarnModalImperativeHandle } from '@/components/barnetillegg/LeggTilBarnModal';
import { SlettBarnModal } from '@/components/barnetillegg/SlettBarnModal';
import BarneInfo from '@/components/barnetillegg/BarneInfo';
import { Barn } from '@/types/Barn';
import { PencilIcon } from '@navikt/aksel-icons';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { UtfyllingSetStateContext } from '@/pages/_app';
import { hentBarnFraFolkeregisteret } from '@/utils/hentBarn';
import styles from './../../components/barnetillegg/Barnetillegg.module.css';

interface BarnetilleggBarnStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

const INGEN_BARN_FEILMELDING =
    'Du har ikke lagt til noen barn. Legg til barnet du vil søke barnetillegg for, eller gå tilbake og svar nei på om du har barn du vil søke barnetillegg for.';

export default function BarnetilleggBarnSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: BarnetilleggBarnStegProps) {
    const { getValues } = useFormContext<Søknad>();
    const { personalia } = use(UtfyllingContext);
    const { setPersonalia } = use(UtfyllingSetStateContext);
    const fieldArray = useFieldArray<Søknad>({ name: 'svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor' });
    const barnFraApi = personalia?.barn;
    const vedlegg = getValues('vedlegg');
    const leggTilBarnModalRef = useRef<LeggTilBarnModalImperativeHandle>(null);
    const ingenBarnFeilRef = useRef<HTMLDivElement>(null);
    const [hentingFeilet, setHentingFeilet] = useState(false);
    const henterBarn = !barnFraApi && !hentingFeilet;
    const [harForsøktÅFortsetteUtenBarn, setHarForsøktÅFortsetteUtenBarn] = useState(false);
    const visIngenBarnFeil = harForsøktÅFortsetteUtenBarn && fieldArray.fields.length === 0;
    const måHenteBarn = personalia !== undefined && personalia.barn === undefined;

    const hentBarn = useCallback(() => {
        hentBarnFraFolkeregisteret()
            .then((barn) => setPersonalia!((forrige) => ({ ...forrige!, barn })))
            .catch(() => setHentingFeilet(true));
    }, [setPersonalia]);

    useEffect(() => {
        if (måHenteBarn) {
            hentBarn();
        }
    }, [måHenteBarn, hentBarn]);

    useEffect(() => {
        if (visIngenBarnFeil) {
            ingenBarnFeilRef.current?.focus();
        }
    }, [visIngenBarnFeil]);

    function prøvÅHenteBarnPåNytt() {
        setHentingFeilet(false);
        hentBarn();
    }

    function fortsett() {
        if (!barnFraApi) {
            return;
        }
        if (barnFraApi.length === 0 && fieldArray.fields.length === 0) {
            setHarForsøktÅFortsetteUtenBarn(true);
            return;
        }
        onCompleted();
    }

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={fortsett}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <>
                    Vi henter kun informasjon om barn som er under 16 år i tiltaksperioden. Hvis du har barn som fyller
                    16 år i perioden, vil du få barnetillegg frem til dette inntreffer.
                </>
            }
        >
            <Heading className="marginTopHeading" level="3" size="small">
                Barn som vi har funnet registrert på deg
            </Heading>
            <ReadMore className="marginTop" header={'Hvilke barn viser vi?'}>
                Vi viser dine barn under 16 år som er registrert i Folkeregisteret.
            </ReadMore>
            {/* Live-området må ligge i DOM-en før teksten settes inn, ellers leser ikke alle skjermlesere den opp. */}
            <div role="status">
                {henterBarn && (
                    <div className={`marginTop ${styles.henterBarn}`}>
                        <Loader aria-hidden />
                        <BodyShort>Henter barn fra Folkeregisteret …</BodyShort>
                    </div>
                )}
            </div>
            {hentingFeilet ? (
                <Alert variant="error" className="marginTop">
                    Vi klarte ikke å hente barna dine fra Folkeregisteret.
                    <div className="marginTop">
                        <Button type="button" variant="secondary" size="small" onClick={prøvÅHenteBarnPåNytt}>
                            Prøv igjen
                        </Button>
                    </div>
                </Alert>
            ) : !barnFraApi ? null : barnFraApi.length > 0 ? (
                <div className="marginTop">
                    {barnFraApi.map((barn) => (
                        <BarnetilleggRegistrertBarn key={barn.uuid} barn={barn} />
                    ))}
                </div>
            ) : (
                <>
                    <p className="marginTop">
                        Vi fant ingen barn under 16 år som er registrert på deg i Folkeregisteret.
                    </p>
                    <Alert variant="info" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        Vi har ikke registrert at du har et barn under 16 år. Hvis du likevel har barn, for eksempel
                        hvis du nylig har adoptert, kan du legge dem til her. Vær oppmerksom på at du ikke får
                        barnetillegg for stebarn eller fosterbarn.
                    </Alert>
                </>
            )}

            <div className="marginTop">
                {fieldArray.fields && fieldArray.fields.length > 0 && (
                    <>
                        <Heading className="marginTopHeading" level="3" size="xsmall">
                            Barn lagt til av deg
                        </Heading>
                        <div className="marginTop">
                            {fieldArray.fields.map((field, index) => {
                                const manglerVedlegg = !vedlegg.find((vedlegg) => vedlegg.uuid === field.uuid);
                                return (
                                    <div className={styles.barnetillegg} key={field.id}>
                                        <BarneInfo
                                            barn={field as Barn}
                                            vedlegg={vedlegg.filter((vedlegg) => vedlegg.uuid === field.uuid)}
                                        />
                                        {manglerVedlegg && (
                                            <Alert
                                                variant={'warning'}
                                                size={'small'}
                                                style={{ margin: '1rem 0 1rem 0' }}
                                            >
                                                Du har ikke dokumentert at du er forelder til barnet. Trykk på "endre
                                                informasjon" hvis du vil legge til dokumentasjon.
                                                <br />
                                                Hvis du skal ettersende dokumentasjon anbefaler vi at du gjør dette så
                                                raskt som mulig.
                                            </Alert>
                                        )}
                                        <div className={styles.knapperEgenregistertBarn}>
                                            <Button
                                                icon={<PencilIcon aria-hidden />}
                                                variant="tertiary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    leggTilBarnModalRef.current?.åpneModal({
                                                        ...(field as Barn),
                                                        index: index,
                                                    });
                                                }}
                                            >
                                                Endre informasjon
                                            </Button>
                                            <SlettBarnModal
                                                barn={field as Barn}
                                                onDelete={() => {
                                                    fieldArray.remove(index);
                                                    leggTilBarnModalRef.current?.slettVedleggUtenTilknytningTilBarn();
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            <Heading className="marginTopHeading" level="3" size="small">
                Andre barn
            </Heading>
            <BodyLong className="marginTop">
                Hvis du ønsker å søke om barnetillegg for andre barn enn de som vises i listen, for eksempel hvis du
                nylig har adoptert, kan du legge dem til her.
                <br />
                <br />
                Vær oppmerksom på at du ikke får barnetillegg for stebarn eller fosterbarn.
            </BodyLong>
            <LeggTilBarnModal fieldArray={fieldArray} ref={leggTilBarnModalRef} />
            {visIngenBarnFeil && (
                <div ref={ingenBarnFeilRef} tabIndex={-1} className="marginTop">
                    <ErrorMessage>{INGEN_BARN_FEILMELDING}</ErrorMessage>
                </div>
            )}
        </Step>
    );
}
