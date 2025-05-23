import React, { useContext, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Step from '@/components/step/Step';
import { Alert, BodyLong, Button, Heading, ReadMore } from '@navikt/ds-react';
import Søknad from '@/types/Søknad';
import BarnetilleggRegistrertBarn from '@/components/barnetillegg/BarnetilleggRegistrertBarn';
import { LeggTilBarnModal, LeggTilBarnModalImperativeHandle } from '@/components/barnetillegg/LeggTilBarnModal';
import { SlettBarnModal } from '@/components/barnetillegg/SlettBarnModal';
import BarneInfo from '@/components/barnetillegg/BarneInfo';
import { Barn } from '@/types/Barn';
import { PencilIcon } from '@navikt/aksel-icons';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import styles from './../../components/barnetillegg/Barnetillegg.module.css';

interface BarnetilleggStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function BarnetilleggSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: BarnetilleggStegProps) {
    const { getValues } = useFormContext<Søknad>();
    const { personalia } = useContext(UtfyllingContext);
    const fieldArray = useFieldArray<Søknad>({ name: 'svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor' });
    const barnFraApi = personalia!.barn;
    const vedlegg = getValues('vedlegg');
    const harIngenBarnÅViseFraApi = !barnFraApi || barnFraApi.length === 0;
    const refEndring = useRef<LeggTilBarnModalImperativeHandle>(null);

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <>
                    Når du har rett til tiltakspenger, kan du også ha rett på barnetillegg.
                    <ul>
                        <li>
                            Du kan få barnetillegg for egne barn under 16 år som du forsørger. Dette gjelder også for
                            barn du har bidragsplikt for, selv om du ikke betaler bidrag akkurat nå.
                        </li>
                        <li className="marginTop">
                            Du får ikke barnetillegg hvis barnet oppholder seg utenfor EØS i over 90 dager i løpet av en
                            tolvmånedersperiode eller er bosatt utenfor EØS.
                        </li>
                    </ul>
                </>
            }
        >
            <Heading className="marginTopHeading" level="3" size="small">
                Barn fra Folkeregisteret
            </Heading>
            {barnFraApi && barnFraApi.length > 0 ? (
                <>
                    <ReadMore className="marginTop" header={'Hvilke barn viser vi?'}>
                        Vi viser dine barn under 16 år som er registrert i Folkeregisteret.
                    </ReadMore>
                    <div className="marginTop">
                        {barnFraApi.map((barn) => (
                            <BarnetilleggRegistrertBarn key={barn.uuid} barn={barn} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <p className="marginTop">
                        Vi fant ingen barn under 16 år som er registrert på deg i Folkeregisteret.
                    </p>
                </>
            )}
            {harIngenBarnÅViseFraApi && (
                <Alert variant="info" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    Vi har ikke registrert at du har et barn under 16 år. Hvis du likevel har barn, for eksempel hvis du
                    nylig har adoptert, kan du legge dem til her. Vær oppmerksom på at du ikke får barnetillegg for
                    stebarn eller fosterbarn.
                </Alert>
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
                                                    refEndring.current?.åpneModal({ ...(field as Barn), index: index });
                                                }}
                                            >
                                                Endre informasjon
                                            </Button>
                                            <SlettBarnModal
                                                barn={field as Barn}
                                                onDelete={() => {
                                                    fieldArray.remove(index);
                                                    refEndring.current?.slettVedleggUtenTilknytningTilBarn();
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
            <LeggTilBarnModal fieldArray={fieldArray} ref={refEndring} />
        </Step>
    );
}
