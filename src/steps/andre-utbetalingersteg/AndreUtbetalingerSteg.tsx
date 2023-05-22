import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import Step from '@/components/step/Step';
import {
    påkrevdFritekstfeltValidator,
    påkrevdJaNeiSpørsmålValidator,
} from '@/utils/formValidators';

interface AndreUtbetalingerStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

function pensjonsordningValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(
        verdi,
        'Du må svare på om du har søkt eller mottar pensjonsordning'
    );
}

function etterlønnValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(
        verdi,
        'Du må svare på om du har søkt eller mottar etterlønn'
    );
}

function pensjonsutbetalerValidator(verdi: string) {
    return påkrevdFritekstfeltValidator(
        verdi,
        'Du må oppgi hvem som utbetaler pensjon'
    );
}

function etterlønnutbetalerValidator(verdi: string) {
    return påkrevdFritekstfeltValidator(
        verdi,
        'Du må oppgi hvem som utbetaler etterlønn'
    );
}

export default function AndreUtbetalingerSteg({
    onCompleted,
    onGoToPreviousStep,
}: AndreUtbetalingerStegProps) {
    const { watch } = useFormContext();
    const watchPensjonsordning = watch(
        'svar.pensjonsordning.mottarEllerSøktPensjonsordning'
    );
    const watchEtterlønn = watch('svar.etterlønn.mottarEllerSøktEtterlønn');
    return (
        <Step
            title="Andre utbetalinger"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={3}
            guide={
                <>
                    <p>
                        Vi trenger å vite om du har annen pengestøtte som helt
                        eller delvis skal dekke dine daglige utgifter. Derfor
                        spør vi deg om dette.
                    </p>
                    <p>
                        Du må fortelle oss om pengestøtte fra offentlige eller
                        private trygde- og pensjonsordninger. Dette gjelder også
                        hvis du får støtten fra et annet land.
                    </p>
                    <p>
                        Det har ikke betydning hvor mye du mottar i annen
                        pengestøtte.
                    </p>
                    <p>
                        Du trenger ikke å fortelle oss om barnepensjon,
                        barnetrygd eller sosialstønad fra kommunen.
                    </p>
                </>
            }
        >
            <JaNeiSpørsmål
                name="svar.pensjonsordning.mottarEllerSøktPensjonsordning"
                validate={pensjonsordningValidator}
                hjelpetekst={{
                    tittel: 'Hva er en pensjonsordning?',
                    tekst: 'Her kommer det noe hjelpetekst',
                }}
            >
                Har du søkt om eller mottar pensjonsordning fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchPensjonsordning && (
                <>
                    <Fritekstspørsmål
                        name="svar.pensjonsordning.utbetaler"
                        textFieldProps={{ htmlSize: 45 }}
                        validate={pensjonsutbetalerValidator}
                    >
                        Hvem utbetaler pensjonsordningen?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="svar.pensjonsordning.periode">
                        Oppgi periode
                    </Periodespørsmål>
                </>
            )}
            <JaNeiSpørsmål
                name="svar.etterlønn.mottarEllerSøktEtterlønn"
                validate={etterlønnValidator}
                hjelpetekst={{
                    tittel: 'Hva er etterlønn?',
                    tekst: 'Her kommer det noe hjelpetekst',
                }}
            >
                Har du søkt om eller mottar etterlønn fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchEtterlønn && (
                <>
                    <Fritekstspørsmål
                        name="svar.etterlønn.utbetaler"
                        textFieldProps={{ htmlSize: 45 }}
                        validate={etterlønnutbetalerValidator}
                    >
                        Hvem utbetaler etterlønn?
                    </Fritekstspørsmål>
                    <Periodespørsmål name="svar.etterlønn.periode">
                        Oppgi periode
                    </Periodespørsmål>
                </>
            )}
        </Step>
    );
}
