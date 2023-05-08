import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';
import Step from '@/components/step/Step';
import {påkrevdJaNeiSpørsmålValidator} from '@/utils/validators';
import {Alert, BodyLong, Heading} from '@navikt/ds-react';
import {Personalia} from '@/types/Personalia';
import FileUploader from '@/components/file-uploader/FIleUploader';
import Søknad from "@/types/Søknad";

import BarnInfo from "@/components/barnetillegg-steg/BarnetilleggRegistrertBarn";

interface BarnetilleggStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    personalia: Personalia;
}

function søkerBarnetilleggValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker barnetillegg');
}

interface Barn {
    fornavn?: string;
    etternavn?: string;
    fødselsdato: string;
}

export default function BarnetilleggSteg({onCompleted, onGoToPreviousStep, personalia}: BarnetilleggStegProps) {
    const {watch, control} = useFormContext<Søknad>();
    const watchSøkerOmBarnetillegg = watch('svar.barnetillegg.søkerOmBarnetillegg');
    const watchØnskerÅSøkeBarnetilleggForAndreBarn = useState()
    const barnFraApi = personalia.barn;
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
                        <li style={{marginTop: '1rem'}}>
                            Hvis både du og den andre forelderen mottar tiltakspenger, gis barnetillegget bare til en av
                            dere.
                        </li>
                        <li style={{marginTop: '1rem'}}>
                            Du får ikke barnetillegg hvis barnet oppholder seg utenfor EØS i over 90 dager i løpet av en
                            tolvmånedersperiode eller er bosatt utenfor EØS.
                        </li>
                    </ul>
                </>
            }
        >
            {barnFraApi && barnFraApi.length > 0 && (
                <>
                    <h3>Barn vi har funnet registrert på deg</h3>
                    {barnFraApi.map(barn => (
                        <BarnInfo key={barn.uuid} barn={barn}/>
                    ))}
                </>
            )}
            {harIngenBarnÅViseFraApi && (
                <Alert variant="info" style={{marginTop: '2rem', marginBottom: '2rem'}}>
                    Vi har ikke registrert at du har et barn under 16 år. Hvis du likevel har barn, for eksempel hvis du
                    nylig har adoptert, kan du legge dem til her. Vær oppmerksom på at du ikke får barnetillegg for
                    stebarn eller fosterbarn.
                </Alert>
            )}

            <div>
                <Heading level="3" size="medium">
                    Andre barn
                </Heading>
                <BodyLong>
                    Hvis du ønsker å søke om barnetillegg for andre barn enn de som vises i listen, for
                    eksempel hvis du nylig har adoptert, kan du legge dem til her.
                    <br/>
                    <br/>
                    Vær oppmerksom på at du ikke får barnetillegg for stebarn eller fosterbarn.
                </BodyLong>

            </div>

            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <VariabelPersonliste name="svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor"/>
            )}
            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <div style={{marginTop: '2rem'}}>
                    <FileUploader name="vedlegg" kategori="fødselsattest" control={control}/>
                </div>
            )}
        </Step>
    );
}
