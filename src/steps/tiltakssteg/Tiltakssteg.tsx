import React from 'react';
import dayjs from 'dayjs';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { Tiltak } from '@/types/Tiltak';
import { formatPeriode } from '@/utils/formatPeriode';
import { useFormContext } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import { påkrevdSvarValidator } from '@/utils/formValidators';
import { formatDate } from '@/utils/formatDate';
import Veiledningstekst from '@/steps/tiltakssteg/Veiledningstekst';
import TiltakMedUfullstendigPeriodeUtfylling from '@/steps/tiltakssteg/TiltakMedUfullstendigPeriodeUtfylling';
import TiltakMedPeriodeUtfylling from '@/steps/tiltakssteg/TiltakMedPeriodeUtfylling';

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

<<<<<<< HEAD
export default function Tiltakssteg({ title, stepNumber, onCompleted, onGoToPreviousStep, tiltak, valgtTiltak }: TiltaksstegProps) {
    const { watch, resetField, setValue } = useFormContext();
=======
export default function Tiltakssteg({ onCompleted, onGoToPreviousStep, tiltak, valgtTiltak }: TiltaksstegProps) {
    const { watch, resetField } = useFormContext();
>>>>>>> ff30d14971d3ca07206ccf054dfdef9b75158943
    const valgtAktivitetId = watch('svar.tiltak.aktivitetId');
    const periode = watch('svar.tiltak.periode');
    const brukerHarRegistrerteTiltak = tiltak && tiltak.length > 0;
    const brukerHarValgtEtTiltak = !!valgtTiltak;
    const valgtTiltakManglerHelePerioden =
        !valgtTiltak?.arenaRegistrertPeriode &&
        !valgtTiltak?.arenaRegistrertPeriode?.fra &&
        !valgtTiltak?.arenaRegistrertPeriode?.til;
    const valgtTiltakManglerKunTilDato =
        !!valgtTiltak?.arenaRegistrertPeriode &&
        !!valgtTiltak?.arenaRegistrertPeriode.fra &&
        !valgtTiltak?.arenaRegistrertPeriode.til;

    const resetFormValues = () => {
        resetField('svar.tiltak.søkerHeleTiltaksperioden');
        resetField('svar.tiltak.periode', { defaultValue: null });
    };

    const lagDefaultPeriode = () => {
        let defaultVerdi = null;
        const brukerHarFyltUtPeriodeAllerede = periode?.fra && periode?.til;
        if (brukerHarFyltUtPeriodeAllerede) {
            defaultVerdi = {
                fra: dayjs(periode.fra).toDate(),
                til: dayjs(periode.til).toDate(),
            };
        } else if (valgtTiltakManglerKunTilDato) {
            defaultVerdi = { fra: dayjs(valgtTiltak?.arenaRegistrertPeriode?.fra).toDate() };
        }
        return defaultVerdi;
    };

    const defaultPeriode = React.useMemo(() => {
        return lagDefaultPeriode();
    }, [valgtTiltak]);

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

    const lagTiltaksalternativTekst = ({ typeNavn, arrangør, arenaRegistrertPeriode }: Tiltak) => {
        const tiltakstypeOgArrangør = `${typeNavn} - ${arrangør}`;
        if (arenaRegistrertPeriode?.fra && !arenaRegistrertPeriode?.til) {
            return `${tiltakstypeOgArrangør}. Startdato: ${formatDate(arenaRegistrertPeriode!.fra)}`;
        }
        if (arenaRegistrertPeriode?.fra && arenaRegistrertPeriode?.til) {
            return `${tiltakstypeOgArrangør}. Periode: ${formatPeriode(arenaRegistrertPeriode!)}`;
        }
        return tiltakstypeOgArrangør;
    };

    const lagSvaralternativForTiltak = (tiltak: Tiltak) => {
        return {
            tekst: lagTiltaksalternativTekst(tiltak),
            value: tiltak.aktivitetId,
        };
    };

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
<<<<<<< HEAD
            guide={veiledningstekst()}
=======
            stepNumber={1}
            guide={<Veiledningstekst brukerHarRegistrerteTiltak={brukerHarRegistrerteTiltak} />}
>>>>>>> ff30d14971d3ca07206ccf054dfdef9b75158943
            submitSectionRenderer={submitSectionRenderer}
            hideStepIndicator={!brukerHarRegistrerteTiltak}
            hideTitle={!brukerHarRegistrerteTiltak}
        >
            {brukerHarRegistrerteTiltak && (
                <Flervalgsspørsmål
                    alternativer={tiltak.map(lagSvaralternativForTiltak)}
                    name="svar.tiltak.aktivitetId"
                    validate={valgtTiltakValidator}
                >
                    Hvilket tiltak ønsker du å søke tiltakspenger for?
                </Flervalgsspørsmål>
            )}
            {brukerHarValgtEtTiltak && !valgtTiltakManglerHelePerioden && !valgtTiltakManglerKunTilDato && (
                <TiltakMedPeriodeUtfylling valgtTiltak={valgtTiltak} />
            )}
            {brukerHarValgtEtTiltak && (valgtTiltakManglerHelePerioden || valgtTiltakManglerKunTilDato) && (
                <TiltakMedUfullstendigPeriodeUtfylling
                    valgtTiltakManglerKunTilDato={valgtTiltakManglerKunTilDato}
                    defaultPeriode={defaultPeriode || undefined}
                />
            )}
        </Step>
    );
}
