import React from 'react';
import Step from '@/components/step/Step';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/formValidators';

interface BarnetilleggStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function søkerOmBarnetilleggValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har barn du vil søke barnetillegg for');
}

export default function BarnetilleggSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: BarnetilleggStegProps) {
    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <>
                    Når du har rett til tiltakspenger, kan du også ha rett til barnetillegg.
                    <ul>
                        <li>
                            Du kan få barnetillegg for biologiske eller adopterte barn under 16 år som du forsørger.
                            Dette gjelder også barn du har bidragsplikt for, selv om du ikke betaler bidrag nå.
                        </li>
                        <li className="marginTop">
                            Du får ikke barnetillegg hvis barnet oppholder seg utenfor EØS i over 90 dager i løpet av en
                            tolvmånedersperiode eller er bosatt utenfor EØS.
                        </li>
                    </ul>
                </>
            }
        >
            <JaNeiSpørsmål
                reverse
                name="svar.barnetillegg.søkerOmBarnetillegg"
                validate={søkerOmBarnetilleggValidator}
                hjelpetekst={{
                    tittel: 'Hvis du svarer "Ja"',
                    tekst: 'Hvis du svarer ja, henter vi informasjon om barna dine under 16 år fra Folkeregisteret.',
                }}
            >
                Har du barn du vil søke barnetillegg for?
            </JaNeiSpørsmål>
        </Step>
    );
}
