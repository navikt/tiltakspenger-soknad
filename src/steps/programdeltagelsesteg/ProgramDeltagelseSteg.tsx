import React from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';
import { formatPeriode } from '@/utils/formatPeriode';
import { Tiltak } from '@/types/Tiltak';

interface ProgramDeltagelseStegProps {
    title: string;
    stepNumber: string;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    valgtTiltak: Tiltak;
}

function deltarIKvpValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i kvalifiseringsprogrammet');
}

function deltarIIntroprogrammetValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i introduksjonsprogrammet');
}

function mottarAndreUtbetalinger(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du mottar andre utbetalinger');
}

function påkrevdKvpPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i kvalifiseringsprogrammet');
}

function påkrevdIntroprogramPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i introduksjonsprogrammet');
}

export default function ProgramDeltagelseSteg({ title, stepNumber, onCompleted, onGoToPreviousStep, valgtTiltak }: ProgramDeltagelseStegProps) {
    const { watch } = useFormContext();

    const brukerregistrertPeriode = watch('svar.tiltak.periode');
    const tiltaksperiodeTekst = formatPeriode(brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode);

    const watchDeltarIKvp = watch('svar.kvalifiseringsprogram.deltar');
    const watchDeltarIIntroprogrammet = watch('svar.introduksjonsprogram.deltar');

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={
                <React.Fragment>
                    <p>
                        Hvis du deltar i kvalifiseringsprogrammet eller introduksjonsprogrammet har du <b>ikke</b> rett
                        på tiltakspenger. Du må derfor svare på spørsmål om dette.
                    </p>
                    <p>
                        Bor du på en institusjon med gratis opphold, mat og drikke når du deltar i et
                        arbeidsmarkedstiltak, har du som regel ikke rett til tiltakspenger. En institusjon kan for
                        eksempel være et sykehus eller et fengsel.
                    </p>
                </React.Fragment>
            }
        >
            <>
                <JaNeiSpørsmål
                    name="svar.introduksjonsprogram.deltar"
                    validate={deltarIIntroprogrammetValidator}
                    hjelpetekst={{
                        tittel: 'Hva er introduksjonsprogrammet?',
                        tekst: (
                            <>
                                <p>Hva er introduksjonsprogrammet?</p>
                                <p>
                                    Introduksjonsprogrammet avtales med kommunen du bor i. Det er en ordning for
                                    nyankomne flyktninger. Hvis du er med i Introduksjonsprogrammet har du fått et brev
                                    fra kommunen du bor i om dette. Du kan også få utbetalt introduksjonsstønad. Ta
                                    kontakt med kommunen din hvis du er usikker på om du er med i
                                    Introduksjonsprogrammet.
                                </p>
                                <p>Du kan lese mer om introduksjonsprogrammet på (LENKE til IMDI)</p>
                            </>
                        ),
                    }}
                >
                    Deltar du i introduksjonsprogrammet i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchDeltarIIntroprogrammet && (
                    <Periodespørsmål
                        name="svar.introduksjonsprogram.periode"
                        validate={[gyldigPeriodeValidator, påkrevdIntroprogramPeriodeValidator]}
                    >
                        Når deltar du i introduksjonsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål
                    name="svar.kvalifiseringsprogram.deltar"
                    validate={deltarIKvpValidator}
                    hjelpetekst={{
                        tittel: 'Hva er kvalifiseringsprogrammet?',
                        tekst: (
                            <>
                                <p>
                                    Kvalifiseringsprogrammet arrangeres av NAV. Det kan være aktuelt for personer som
                                    har levd på sosialhjelp over lang tid, eller står i fare for å komme i en slik
                                    situasjon. Programmet er et tilbud om opplæring og arbeidstrening, og oppfølging for
                                    å komme i arbeid eller meningsfull aktivitet.
                                </p>

                                <p>
                                    Hvis du er med i kvalifiseringsprogrammet har du fått et brev fra NAV-kontoret om
                                    dette. Du kan også få utbetalt kvalifiseringsstønad. Ta kontakt med ditt NAV-kontor
                                    hvis du er usikker på om du er med i kvalifiseringsprogrammet.
                                </p>

                                <p>Les mer om kvalifiseringsprogrammet på (LENKE)</p>
                            </>
                        ),
                    }}
                >
                    Deltar du i kvalifiseringsprogrammet i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchDeltarIKvp && (
                    <Periodespørsmål
                        name="svar.kvalifiseringsprogram.periode"
                        validate={[gyldigPeriodeValidator, påkrevdKvpPeriodeValidator]}
                    >
                        Når deltar du i kvalifiseringsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål
                    name="svar.mottarAndreUtbetalinger"
                    validate={mottarAndreUtbetalinger}
                    description={(
                        <ul>
                            <li>Sykepenger</li>
                            <li>Gjenlevendepensjon</li>
                            <li>Alderspensjon</li>
                            <li>Supplerende stønad</li>
                            <li>Pengestøtte fra andre trygde- eller pensjonsordninger</li>
                            <li>Etterlønn</li>
                            <li>Stønad via Jobbsjansen</li>
                        </ul>
                    )}
                >
                    Mottar du noen av disse utbetalingene i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
            </>
        </Step>
    );
}
