import React from 'react';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { Tiltak } from '@/types/Tiltak';
import { formatPeriode } from '@/utils/formatPeriode';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { useFormContext } from 'react-hook-form';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import { Button, Link } from '@navikt/ds-react';

interface TiltaksstegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    tiltak: Tiltak[];
}

export default function Tiltakssteg({ onCompleted, onGoToPreviousStep, tiltak }: TiltaksstegProps) {
    const { watch, resetField } = useFormContext();
    const valgtAktivitetId = watch('svar.valgtAktivitetId');
    const søkerHeleTiltaksperioden = watch('svar.søkerHeleTiltaksperioden');
    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak>();
    const brukerHarRegistrerteTiltak = tiltak && tiltak.length > 0;

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

    const veiledningstekstForBrukerUtenTiltak = () => {
        return (
            <>
                <p>For å ha rett til tiltakspenger må du delta i et arbeidsmarkedstiltak som er godkjent av NAV. </p>
                <p>
                    Det er ikke registrert at du er påmeldt, deltar på eller nylig har deltatt på et
                    arbeidsmarkedstiltak som gir rett til tiltakspenger.
                </p>
                <span>Hvis du mener dette ikke er riktig kan du </span>
                <ul>
                    <li>
                        Kontakte veilederen din gjennom{' '}
                        <Link href="https://pto.dev.nav.no/arbeid/dialog" target="_blank">
                            dialogen (åpnes i ny fane)
                        </Link>
                    </li>
                    <li>Vente noen dager og prøve igjen</li>
                    <li>
                        <Link href="https://www.nav.no/fyllut/nav761345?sub=paper" target="_blank">
                            Sende søknad på papir (åpnes i ny fane)
                        </Link>
                    </li>
                </ul>
            </>
        );
    };

    const veiledningstekstForBrukerMedTiltak = () => {
        return (
            <>
                <p>
                    For å ha rett til tiltakspenger må du delta i et arbeidsmarkedstiltak som er godkjent av NAV. Listen
                    under viser arbeidsmarkedstiltak som du enten er påmeldt, deltar på eller nylig har deltatt på. Vi
                    viser bare dine arbeidsmarkedstiltak som gir rett til tiltakspenger.
                </p>

                <p>
                    Hvis ikke listen under inneholder det arbeidsmarkedstiltaket som du vil søke tiltakspenger for, kan
                    du
                </p>
                <ul>
                    <li>
                        Kontakte veilederen din gjennom{' '}
                        <Link href="https://pto.dev.nav.no/arbeid/dialog" target="_blank">
                            dialogen (åpnes i ny fane)
                        </Link>
                    </li>
                    <li>Vente noen dager og prøve igjen</li>
                    <li>
                        <Link href="https://www.nav.no/fyllut/nav761345?sub=paper" target="_blank">
                            Sende søknad på papir (åpnes i ny fane)
                        </Link>
                    </li>
                </ul>
            </>
        );
    };

    const veiledningstekst = () => {
        if (!brukerHarRegistrerteTiltak) {
            return veiledningstekstForBrukerUtenTiltak();
        }
        return veiledningstekstForBrukerMedTiltak();
    };

    React.useEffect(() => {
        velgTiltak();
        resetFormValues();
    }, [valgtAktivitetId]);

    const submitSectionRenderer = !brukerHarRegistrerteTiltak
        ? () => (
              <Button style={{ margin: '1rem auto', display: 'block' }} type="button">
                  Avbryt søknaden og gå til Min side
              </Button>
          )
        : undefined;

    return (
        <Step
            title="Tiltak"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={1}
            guide={veiledningstekst()}
            submitSectionRenderer={submitSectionRenderer}
            hideStepIndicator={!brukerHarRegistrerteTiltak}
            hideTitle={!brukerHarRegistrerteTiltak}
        >
            {brukerHarRegistrerteTiltak && (
                <Flervalgsspørsmål
                    alternativer={tiltak.map(({ arrangør, deltakelsePeriode, aktivitetId }) => {
                        return {
                            tekst: `${arrangør}. Periode: ${formatPeriode(deltakelsePeriode)}`,
                            value: aktivitetId,
                        };
                    })}
                    name="svar.valgtAktivitetId"
                >
                    Hvilket tiltak ønsker du å søke tiltakspenger for?
                </Flervalgsspørsmål>
            )}
            {valgtTiltak && (
                <JaNeiSpørsmål name="svar.søkerHeleTiltaksperioden" reverse>
                    Vi har registrert at du deltar på dette tiltaket i perioden{' '}
                    {formatPeriode(valgtTiltak!.deltakelsePeriode)}. Ønsker du å søke tiltakspenger i hele denne
                    perioden?
                </JaNeiSpørsmål>
            )}
            {!søkerHeleTiltaksperioden && søkerHeleTiltaksperioden !== undefined && (
                <Periodespørsmål
                    name="svar.overskrevetTiltaksperiode"
                    minDate={new Date(valgtTiltak!.deltakelsePeriode.fra)}
                    maxDate={new Date(valgtTiltak!.deltakelsePeriode.til)}
                >
                    Hvilken periode søker du tiltakspenger for?
                </Periodespørsmål>
            )}
        </Step>
    );
}
