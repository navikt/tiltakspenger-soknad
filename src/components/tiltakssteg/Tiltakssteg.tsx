import React from 'react';
import { GuidePanel } from '@navikt/ds-react';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Steg from '@/components/steg/Steg';

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

export default function Tiltakssteg({ onCompleted, onGoToPreviousStep }: TiltaksstegProps) {
    return (
        <Steg tittel="Tiltak" onCompleted={onCompleted} onGoToPreviousStep={onGoToPreviousStep} stepNumber={2}>
            <GuidePanel poster>
                Fyll ut informasjon om tiltaket du vil delta på i feltene under. Hvis du ikke har avtalt tiltaket med
                NAV, vil vi kontakte deg for å avklare om vi kan godkjenne tiltaket.
            </GuidePanel>
            <Flervalgsspørsmål
                alternativer={[
                    { tekst: 'AMO', value: 'AMO' },
                    { tekst: 'Arbeidstrening', value: 'arbeidstrening' },
                    { tekst: 'Jobbsøkerkurs', value: 'jobbsøkerkurs' },
                    { tekst: 'Annet type tiltak', value: 'annet' },
                ]}
                name="tiltak.type"
                validate={påkrevdTiltakstypeValidator}
            >
                Hvilken type tiltak søker du tiltakspenger for?
            </Flervalgsspørsmål>
            <Periodespørsmål name="tiltak.periode">I hvilken periode skal du delta på tiltaket?</Periodespørsmål>
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
        </Steg>
    );
}
