import React from 'react';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { Tiltak } from '@/types/Tiltak';
import { formatPeriode } from '@/utils/formatPeriode';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { useFormContext } from 'react-hook-form';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import { Alert, Button, Link } from '@navikt/ds-react';
import {
    gyldigPeriodeValidator,
    påkrevdJaNeiSpørsmålValidator,
    påkrevdPeriodeValidator,
    påkrevdSvarValidator,
} from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';

interface TiltaksstegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    tiltak: Tiltak[];
    valgtTiltak: Tiltak | null;
}

function valgtTiltakValidator(verdi: string) {
    return påkrevdSvarValidator(verdi, 'Du må oppgi hvilket tiltak du søker tiltakspenger for');
}

export default function Tiltakssteg({ title, stepNumber, onCompleted, onGoToPreviousStep, tiltak, valgtTiltak }: TiltaksstegProps) {
    const { watch, resetField } = useFormContext();
    const valgtAktivitetId = watch('svar.tiltak.aktivitetId');
    const brukerHarRegistrerteTiltak = tiltak && tiltak.length > 0;
    const brukerHarValgtEtTiltak = !!valgtTiltak;
    const valgtTiltakManglerPeriode =
        !valgtTiltak?.arenaRegistrertPeriode ||
        !valgtTiltak?.arenaRegistrertPeriode.fra ||
        !valgtTiltak?.arenaRegistrertPeriode.til;

    const resetFormValues = () => {
        resetField('svar.tiltak.søkerHeleTiltaksperioden');
        resetField('svar.tiltak.periode');
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
        const valgtTiltakHarEndretSeg = valgtAktivitetId !== valgtTiltak?.aktivitetId;
        if (valgtTiltakHarEndretSeg) {
            resetFormValues();
        }
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
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            guide={veiledningstekst()}
            submitSectionRenderer={submitSectionRenderer}
            hideStepIndicator={!brukerHarRegistrerteTiltak}
            hideTitle={!brukerHarRegistrerteTiltak}
        >
            {brukerHarRegistrerteTiltak && (
                <Flervalgsspørsmål
                    alternativer={tiltak.map(({ arrangør, arenaRegistrertPeriode, aktivitetId, typeNavn }) => {
                        let tiltakTekst = `${typeNavn} - ${arrangør}`;
                        if (arenaRegistrertPeriode && arenaRegistrertPeriode.fra && arenaRegistrertPeriode.til) {
                            tiltakTekst += `. Periode: ${formatPeriode(arenaRegistrertPeriode)}`;
                        }
                        return {
                            tekst: tiltakTekst,
                            value: aktivitetId,
                        };
                    })}
                    name="svar.tiltak.aktivitetId"
                    validate={valgtTiltakValidator}
                >
                    Hvilket tiltak ønsker du å søke tiltakspenger for?
                </Flervalgsspørsmål>
            )}
            {brukerHarValgtEtTiltak && !valgtTiltakManglerPeriode && (
                <TiltakMedPeriodeUtfylling valgtTiltak={valgtTiltak} />
            )}
            {brukerHarValgtEtTiltak && valgtTiltakManglerPeriode && <TiltakUtenPeriodeUtfylling />}
        </Step>
    );
}

interface TiltakMedPeriodeUtfyllingProps {
    valgtTiltak: Tiltak;
}

function påkrevdSøkerHeleTiltaksperiodenValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker tiltakspenger for hele tiltaksperioden');
}

function påkrevdTiltaksperiodeSpørsmål(verdi: FormPeriode) {
    return påkrevdPeriodeValidator(verdi, 'Du må oppgi hvilken periode du søker tiltakspenger for');
}

const TiltakMedPeriodeUtfylling = ({ valgtTiltak }: TiltakMedPeriodeUtfyllingProps) => {
    const { watch } = useFormContext();
    const søkerHeleTiltaksperioden = watch('svar.tiltak.søkerHeleTiltaksperioden');
    return (
        <>
            <JaNeiSpørsmål
                name="svar.tiltak.søkerHeleTiltaksperioden"
                validate={påkrevdSøkerHeleTiltaksperiodenValidator}
            >
                Vi har registrert at du deltar på dette tiltaket i perioden{' '}
                {formatPeriode(valgtTiltak.arenaRegistrertPeriode!)}. Ønsker du å søke tiltakspenger i hele denne
                perioden?
            </JaNeiSpørsmål>
            {søkerHeleTiltaksperioden === false && (
                <Periodespørsmål
                    name="svar.tiltak.periode"
                    minDate={new Date(valgtTiltak.arenaRegistrertPeriode!.fra)}
                    maxDate={new Date(valgtTiltak.arenaRegistrertPeriode!.til)}
                    validate={[gyldigPeriodeValidator, påkrevdTiltaksperiodeSpørsmål]}
                >
                    Hvilken periode søker du tiltakspenger for?
                </Periodespørsmål>
            )}
        </>
    );
};

const TiltakUtenPeriodeUtfylling = () => {
    return (
        <>
            <Alert variant="info" style={{ marginTop: '2rem' }}>
                Vi har ikke registrert i hvilken periode du deltar på dette tiltaket. Du kan legge inn perioden du
                ønsker å søke tiltakspenger for under.
            </Alert>
            <Periodespørsmål
                name="svar.tiltak.periode"
                validate={[gyldigPeriodeValidator, påkrevdTiltaksperiodeSpørsmål]}
            >
                Hvilken periode søker du tiltakspenger for?
            </Periodespørsmål>
        </>
    );
};
