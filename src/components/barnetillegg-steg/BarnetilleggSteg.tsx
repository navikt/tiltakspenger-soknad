import React, {useState} from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import Step from '@/components/step/Step';
import {Alert, BodyLong, Button, Heading, ReadMore} from '@navikt/ds-react';
import {Personalia} from '@/types/Personalia';
import Søknad from '@/types/Søknad';
import styles from './Barnetillegg.module.css';

import BarnetilleggRegistrertBarn from '@/components/barnetillegg-steg/BarnetilleggRegistrertBarn';
import {LeggTilBarnModal} from './LeggTilBarnModal';
import BarneInfo from "@/components/barnetillegg-steg/BarneInfo";

interface BarnetilleggStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    personalia: Personalia;
}

export default function BarnetilleggSteg({onCompleted, onGoToPreviousStep, personalia}: BarnetilleggStegProps) {
    const {watch, control, getValues} = useFormContext<Søknad>();
    const {fields, remove} = useFieldArray<Søknad>({
        name: 'svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor',
        control
    });
    const watchSøkerOmBarnetillegg = watch('svar.barnetillegg.søkerOmBarnetillegg');
    const watchØnskerÅSøkeBarnetilleggForAndreBarn = useState();
    const barnFraApi = personalia.barn;
    const selvregistrerteBarn = getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor')
    const harIngenBarnÅViseFraApi = (!barnFraApi || barnFraApi.length === 0) && watchSøkerOmBarnetillegg;

    return (
        <Step
            title="Barnetillegg"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={4}
            guide={
                <>
                    Når du har rett til tiltakspenger, kan du også ha rett på barnetillegg.
                    <ul>
                        <li>
                            Du kan få barnetillegg for egne barn under 16 år som du forsørger. Dette gjelder også for
                            barn du har bidragsplikt for, selv om du ikke betaler bidrag akkurat nå.
                        </li>
                        <li className={styles.marginTop}>
                            Hvis både du og den andre forelderen mottar tiltakspenger, gis barnetillegget bare til en av
                            dere.
                        </li>
                        <li className={styles.marginTop}>
                            Du får ikke barnetillegg hvis barnet oppholder seg utenfor EØS i over 90 dager i løpet av en
                            tolvmånedersperiode eller er bosatt utenfor EØS.
                        </li>
                    </ul>
                </>
            }
        >
            <Heading className={styles.marginTopHeading} level="3" size="small">Barn vi har funnet registrert på
                deg
            </Heading>
            {barnFraApi && barnFraApi.length > 0 ?
                <>
                    <ReadMore className={styles.marginTop} header={"Hvilke barn viser vi?"}>
                        Vi viser dine barn under 16år som er registrert i folkeregisteret.
                    </ReadMore>
                    <div className={styles.marginTop}>
                        {barnFraApi.map((barn) => (
                            <BarnetilleggRegistrertBarn key={barn.uuid} barn={barn}/>
                        ))}
                    </div>
                </>
                :
                <>
                    <p className={styles.marginTop}>Vi fant ingen barn under 16 år som er registrert på deg i
                        Folkeregisteret.</p>
                </>
            }
            {harIngenBarnÅViseFraApi && (
                <Alert variant="info" style={{marginTop: '2rem', marginBottom: '2rem'}}>
                    Vi har ikke registrert at du har et barn under 16 år. Hvis du likevel har barn, for eksempel hvis du
                    nylig har adoptert, kan du legge dem til her. Vær oppmerksom på at du ikke får barnetillegg for
                    stebarn eller fosterbarn.
                </Alert>
            )}

            <div className={styles.marginTop}>
                {selvregistrerteBarn && selvregistrerteBarn.length > 0 && (
                    <>
                        <Heading className={styles.marginTopHeading} level="3" size="xsmall">
                            Barn lagt til av deg
                        </Heading>
                        <div className={styles.marginTop}>
                            {selvregistrerteBarn.map((barn) => (
                                <div className={styles.barnetillegg}>
                                    <BarneInfo key={barn.uuid} barn={barn} utenforEØS={true}/>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Heading className={styles.marginTopHeading} level="3" size="small">
                Andre barn
            </Heading>
            <BodyLong className={styles.marginTop}>
                Hvis du ønsker å søke om barnetillegg for andre barn enn de som vises i listen, for eksempel hvis du
                nylig har adoptert, kan du legge dem til her.
                <br/>
                <br/>
                Vær oppmerksom på at du ikke får barnetillegg for stebarn eller fosterbarn.
            </BodyLong>
            <LeggTilBarnModal />
        </Step>
    );
}
