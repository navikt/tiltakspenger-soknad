import React from 'react';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { Tiltak } from '@/types/Tiltak';
import { formatPeriode } from '@/utils/formatPeriode';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { useFormContext } from 'react-hook-form';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';

interface TiltaksstegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    tiltak: Tiltak[];
}

export default function Tiltakssteg({ onCompleted, onGoToPreviousStep, tiltak }: TiltaksstegProps) {
    const { watch, resetField } = useFormContext();
    const valgtAktivitetId = watch('valgtAktivitetId');
    const søkerHeleTiltaksperioden = watch('søkerHeleTiltaksperioden');
    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak>();

    const velgTiltak = () => {
        const valgtTiltaksobjekt = tiltak.find(({ aktivitetId }) => aktivitetId === valgtAktivitetId);
        if (valgtTiltaksobjekt) {
            setValgtTiltak(valgtTiltaksobjekt);
        }
    };

    const resetFormValues = () => {
        resetField('søkerHeleTiltaksperioden');
        resetField('overskrevetTiltaksperiode');
    };

    React.useEffect(() => {
        velgTiltak();
        resetFormValues();
    }, [valgtAktivitetId]);

    return (
        <Step
            title="Tiltak"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={1}
            guide={
                <>
                    <p>For å ha rett til tiltakspenger må du delta i et arbeidsmarkedstiltak som er godkjent av NAV.</p>
                    {tiltak.length === 0 && (
                        <p>
                            Det er ikke registrert noen aktuelle tiltak for deg. Hvis du har avtalt tiltak med
                            veilederen din, kan du legge det inn i søknaden. Veilederen din vil da bli kontaktet.
                        </p>
                    )}
                    <p>Du kan vanligvis se hvilke arbeidsmarkedstiltak som har blitt avtalt i aktivitetsplanen din.</p>
                </>
            }
        >
            <Flervalgsspørsmål
                alternativer={tiltak.map(({ arrangør, deltakelsePeriode, aktivitetId }) => {
                    return {
                        tekst: `${arrangør}. Periode: ${formatPeriode(deltakelsePeriode)}`,
                        value: aktivitetId,
                    };
                })}
                name="valgtAktivitetId"
            >
                Hvilket tiltak ønsker du å søke tiltakspenger for?
            </Flervalgsspørsmål>
            {valgtTiltak && (
                <JaNeiSpørsmål name="søkerHeleTiltaksperioden" reverse>
                    Vi har registrert at du deltar på dette tiltaket i perioden{' '}
                    {formatPeriode(valgtTiltak!.deltakelsePeriode)}. Ønsker du å søke tiltakspenger i hele denne
                    perioden?
                </JaNeiSpørsmål>
            )}
            {!søkerHeleTiltaksperioden && søkerHeleTiltaksperioden !== undefined && (
                <Periodespørsmål
                    name="overskrevetTiltaksperiode"
                    minDate={new Date(valgtTiltak!.deltakelsePeriode.fom)}
                    maxDate={new Date(valgtTiltak!.deltakelsePeriode.tom)}
                >
                    Hvilken periode søker du tiltakspenger for?
                </Periodespørsmål>
            )}
        </Step>
    );
}
