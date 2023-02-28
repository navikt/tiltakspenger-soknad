import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Steg from '@/components/steg/Steg';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/validators';
import { GuidePanel } from '@navikt/ds-react';

interface InnledningsstegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function deltarIKvpValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i kvalifiseringsprogrammet');
}

function deltarIIntroprogrammetValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i introduksjonsprogrammet');
}

function borPåInstitusjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du bor på institusjon');
}

export default function Innledningssteg({ onCompleted, onGoToPreviousStep }: InnledningsstegProps) {
    const { watch } = useFormContext();

    const watchDeltarIKvp = watch('deltarIKvp');
    const watchDeltarIIntroprogrammet = watch('deltarIIntroprogrammet');
    const watchBorPåInstitusjon = watch('borPåInstitusjon');

    return (
        <Steg
            tittel="Innledningsspørsmål"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={1}
        >
            <GuidePanel poster>
                <p>
                    Hvis du deltar på tiltak gjennom kvalifiseringsprogrammet, vil du får kvalifiseringsstønad i stedet
                    for tiltakspenger. Du kan allikevel få tiltakspenger hvis perioden du har kvalifiseringsstønad
                    overlapper med perioden du er i tiltak.
                </p>
                <p>
                    Bor du på en institusjon med fri kost og losji i perioden du deltar på tiltak, har du som regel ikke
                    rett til tiltakspenger. Dette gjelder ikke for barnevernsinstitusjon og overgangsbolig.
                </p>
            </GuidePanel>
            <>
                <JaNeiSpørsmål name="deltarIKvp" validate={deltarIKvpValidator}>
                    Deltar du i kvalifiseringsprogrammet i perioden du søker tiltakspenger for?
                </JaNeiSpørsmål>
                {watchDeltarIKvp && (
                    <Periodespørsmål name="periodeMedKvp">
                        I hvilken periode deltar du i kvalifiseringsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål name="deltarIIntroprogrammet" validate={deltarIIntroprogrammetValidator}>
                    Deltar du i introduksjonsprogrammet i perioden du søker tiltakspenger for?
                </JaNeiSpørsmål>
                {watchDeltarIIntroprogrammet && (
                    <Periodespørsmål name="periodeMedIntroprogrammet">
                        I hvilken periode deltar du i introduksjonsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål name="borPåInstitusjon" validate={borPåInstitusjonValidator}>
                    Bor du på institusjon i tiltaksperioden med fri kost og losji?
                </JaNeiSpørsmål>
                {watchBorPåInstitusjon && (
                    <Flervalgsspørsmål
                        name="institusjonstype"
                        alternativer={[
                            {
                                tekst: 'Barnevernsinstitusjon',
                                value: 'barnevernsinstitusjon',
                            },
                            { tekst: 'Overgangsbolig', value: 'overgangsbolig' },
                            { tekst: 'Annen type institusjon', value: 'annen' },
                        ]}
                    >
                        Hvilken type institusjon bor du på?
                    </Flervalgsspørsmål>
                )}
            </>
        </Steg>
    );
}
