import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';
import Step from '@/components/step/Step';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';
import { Alert } from '@navikt/ds-react';
import Checkboxgruppespørsmål from '@/components/checkboxgruppespørsmål/Checkboxgruppespørsmål';
import { formatDate } from '@/utils/formatDate';
import { Personalia } from '@/types/Personalia';
import FileUploader from '@/components/file-uploader/FIleUploader';
import Søknad from '@/types/Søknad';

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

export default function BarnetilleggSteg({ onCompleted, onGoToPreviousStep, personalia }: BarnetilleggStegProps) {
    const { watch, control } = useFormContext<Søknad>();
    const watchSøkerOmBarnetillegg = watch('svar.barnetillegg.søkerOmBarnetillegg');
    const watchØnskerÅSøkeBarnetilleggForAndreBarn = watch('svar.barnetillegg.ønskerÅSøkeBarnetilleggForAndreBarn');
    const barnFraApi = personalia.barn;
    const harIngenBarnÅViseFraApi = (!barnFraApi || barnFraApi.length === 0) && watchSøkerOmBarnetillegg;

    function lagCheckboksTekstForBarn(barn: Barn) {
        const { fornavn, etternavn, fødselsdato } = barn;
        if (fornavn && etternavn) {
            return `${fornavn} ${etternavn} født ${formatDate(fødselsdato)}`;
        }
        return `Barn født ${formatDate(fødselsdato)}`;
    }

    return (
        <Step
            title="Barnetillegg"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={4}
            guide={
                <p>
                    Når du har rett til tiltakspenger, kan du også ha rett på barnetillegg.
                    <ul>
                        <li>
                            Du kan få barnetillegg for egne barn under 16 år som du forsørger. Dette gjelder også for
                            barn du har bidragsplikt for, selv om du ikke betaler bidrag akkurat nå.
                        </li>
                        <li style={{ marginTop: '1rem' }}>
                            Hvis både du og den andre forelderen mottar tiltakspenger, gis barnetillegget bare til en av
                            dere.
                        </li>
                        <li style={{ marginTop: '1rem' }}>
                            Du får ikke barnetillegg hvis barnet oppholder seg utenfor EØS i over 90 dager i løpet av en
                            tolvmånedersperiode eller er bosatt utenfor EØS.
                        </li>
                    </ul>
                </p>
            }
        >
            <JaNeiSpørsmål name="svar.barnetillegg.søkerOmBarnetillegg" validate={søkerBarnetilleggValidator} reverse>
                Ønsker du å søke om barnetillegg for ett eller flere barn som du forsørger?
            </JaNeiSpørsmål>
            {watchSøkerOmBarnetillegg && barnFraApi && barnFraApi.length > 0 && (
                <Checkboxgruppespørsmål
                    alternativer={barnFraApi.map((barn) => ({
                        value: barn.uuid,
                        tekst: lagCheckboksTekstForBarn(barn),
                    }))}
                    name="svar.barnetillegg.registrerteBarnSøktBarnetilleggFor"
                    hjelpetekst={{
                        tittel: 'Hvilke barn vises?',
                        tekst: 'Vi viser dine barn under 16 år som er registrert i Folkeregisteret.',
                    }}
                >
                    Hvilke barn ønsker du å søke barnetillegg for?
                </Checkboxgruppespørsmål>
            )}
            {harIngenBarnÅViseFraApi && (
                <Alert variant="info" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    Vi har ikke registrert at du har et barn under 16 år. Hvis du likevel har barn, for eksempel hvis du
                    nylig har adoptert, kan du legge dem til her. Vær oppmerksom på at du ikke får barnetillegg for
                    stebarn eller fosterbarn.
                </Alert>
            )}
            {barnFraApi && barnFraApi.length > 0 && watchSøkerOmBarnetillegg && (
                <JaNeiSpørsmål
                    name="svar.barnetillegg.ønskerÅSøkeBarnetilleggForAndreBarn"
                    validate={søkerBarnetilleggValidator}
                    hjelpetekst={{
                        tittel: 'Hvilke barn kan du legge til?',
                        tekst: (
                            <>
                                <span>
                                    Hvis du ønsker å søke om barnetillegg for andre barn enn de som vises i listen, for
                                    eksempel hvis du nylig har adoptert, kan du legge dem til her.
                                </span>
                                <span style={{ display: 'block', marginTop: '1rem' }}>
                                    Vær oppmerksom på at du ikke får barnetillegg for stebarn eller fosterbarn.
                                </span>
                            </>
                        ),
                    }}
                >
                    Har du andre barn du ønsker å søke barnetillegg for?
                </JaNeiSpørsmål>
            )}
            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <VariabelPersonliste name="svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor" />
            )}
            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <div style={{ marginTop: '2rem' }}>
                    <FileUploader name="vedlegg" kategori="fødselsattest" control={control} />
                </div>
            )}
        </Step>
    );
}
