import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';
import Step from '@/components/step/Step';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';
import { GuidePanel } from '@navikt/ds-react';
import Checkboxgruppespørsmål from '@/components/checkboxgruppespørsmål/Checkboxgruppespørsmål';
import { formatDate } from '@/utils/formatDate';
import { Personalia } from '@/types/Personalia';
import FileUploader from '@/components/file-uploader/FIleUploader';

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
    const { watch, control } = useFormContext();
    const watchSøkerOmBarnetillegg = watch('søkerOmBarnetillegg');
    const watchØnskerÅSøkeBarnetilleggForAndreBarn = watch('ønskerÅSøkeBarnetilleggForAndreBarn');
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
            guide="Placeholder veiledertekst"
        >
            <JaNeiSpørsmål
                name="søkerOmBarnetillegg"
                validate={søkerBarnetilleggValidator}
                hjelpetekst={{ tittel: 'Når kan man få barnetillegg?', tekst: 'Her kommer det noe hjelpetekst' }}
            >
                Ønsker du å søke om barnetillegg for ett eller flere barn under 16 år som du forsørger?
            </JaNeiSpørsmål>
            {watchSøkerOmBarnetillegg && barnFraApi && barnFraApi.length > 0 && (
                <Checkboxgruppespørsmål
                    alternativer={barnFraApi.map((barn) => ({
                        value: JSON.stringify(barn),
                        tekst: lagCheckboksTekstForBarn(barn),
                    }))}
                    name="registrerteBarnSøktBarnetilleggFor"
                >
                    Hvilke barn ønsker du å søke barnetillegg for?
                </Checkboxgruppespørsmål>
            )}
            {harIngenBarnÅViseFraApi && (
                <GuidePanel style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <p>
                        Vi kunne ikke finne noen barn registrert på deg. Litt lengre ned på siden kan du registrere barn
                        du ønsker å søke barnetillegg for.
                    </p>{' '}
                    <p>
                        Litt senere i søknaden vil du få anledning til å laste opp vedlegg som dokumenterer at du
                        forsørger barnet.
                    </p>
                </GuidePanel>
            )}
            {barnFraApi && barnFraApi.length > 0 && watchSøkerOmBarnetillegg && (
                <JaNeiSpørsmål name="ønskerÅSøkeBarnetilleggForAndreBarn" validate={søkerBarnetilleggValidator}>
                    Har du andre barn du ønsker å søke barnetillegg for?
                </JaNeiSpørsmål>
            )}
            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <VariabelPersonliste name="manueltRegistrerteBarnSøktBarnetilleggFor" />
            )}
            {(watchØnskerÅSøkeBarnetilleggForAndreBarn || harIngenBarnÅViseFraApi) && (
                <div style={{ marginTop: '2rem' }}>
                    <FileUploader name="vedlegg" kategori="fødselsattest" control={control} />
                </div>
            )}
        </Step>
    );
}
