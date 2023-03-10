import React from 'react';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, påkrevdPeriodeValidator } from '@/utils/validators';
import { FormPeriode } from '@/types/FormPeriode';

interface TiltaksstegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function påkrevdTiltakstypeValidator(verdi: string) {
    if (verdi !== 'AMO' && verdi !== 'arbeidstrening' && verdi !== 'jobbsøkerkurs' && verdi !== 'annet') {
        return 'Du må oppgi hvilken type tiltak du går på';
    }
}

function påkrevdAntallDagerIUkenValidator(verdi: string) {
    if (verdi !== '1' && verdi !== '2' && verdi !== '3' && verdi !== '4' && verdi !== '5') {
        return 'Du må oppgi hvor mange dager i uken du deltar på tiltaket';
    }
}

function påkrevdTiltaksperiodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar på tiltaket');
}

export default function Tiltakssteg({ onCompleted, onGoToPreviousStep }: TiltaksstegProps) {
    return (
        <Step
            title="Tiltak"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={1}
            guide={
                <>
                    <p>For å ha rett til tiltakspenger må du delta i et arbeidsmarkedstiltak som er godkjent av NAV.</p>
                    <p>
                        Det er ikke registrert noen aktuelle tiltak for deg. Hvis du har avtalt tiltak med veilederen
                        din, kan du legge det inn i søknaden. Veilederen din vil da bli kontaktet.
                    </p>
                    <p>Du kan vanligvis se hvilke arbeidsmarkedstiltak som har blitt avtalt i aktivitetsplanen din.</p>
                </>
            }
        >
            <Flervalgsspørsmål
                alternativer={[
                    { tekst: 'AMO', value: 'AMO' },
                    { tekst: 'Arbeidstrening', value: 'arbeidstrening' },
                    { tekst: 'Jobbsøkerkurs', value: 'jobbsøkerkurs' },
                    { tekst: 'Annet type tiltak', value: 'annet' },
                ]}
                name="tiltak.type"
                validate={påkrevdTiltakstypeValidator}
                hjelpetekst={{
                    tittel: 'Hvordan vet jeg hvilken type tiltak jeg går på?',
                    tekst: 'Her kommer det noe hjelpetekst',
                }}
            >
                Hvilken type tiltak søker du tiltakspenger for?
            </Flervalgsspørsmål>
            <Periodespørsmål name="tiltak.periode" validate={[gyldigPeriodeValidator, påkrevdTiltaksperiodeValidator]}>
                I hvilken periode skal du delta på tiltaket?
            </Periodespørsmål>
            <Flervalgsspørsmål
                name="tiltak.antallDagerIUken"
                alternativer={[
                    { tekst: '1 dag i uken', value: '1' },
                    { tekst: '2 dager i uken', value: '2' },
                    { tekst: '3 dager i uken', value: '3' },
                    { tekst: '4 dager i uken', value: '4' },
                    { tekst: '5 dager i uken', value: '5' },
                ]}
                validate={påkrevdAntallDagerIUkenValidator}
            >
                Hvor mange dager i uken deltar du på tiltaket?
            </Flervalgsspørsmål>
        </Step>
    );
}
