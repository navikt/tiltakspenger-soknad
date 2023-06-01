import React, { useContext } from 'react';
import dayjs from 'dayjs';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { useFormContext } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import Veiledningstekst from '@/steps/tiltakssteg/Veiledningstekst';
import TiltakMedUfullstendigPeriodeUtfylling from '@/steps/tiltakssteg/TiltakMedUfullstendigPeriodeUtfylling';
import TiltakMedPeriodeUtfylling from '@/steps/tiltakssteg/TiltakMedPeriodeUtfylling';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { valgtTiltakValidator } from '@/steps/tiltakssteg/validation';
import { lagSvaralternativForTiltak } from '@/steps/tiltakssteg/utils';

interface TiltaksstegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function Tiltakssteg({ onCompleted, onGoToPreviousStep }: TiltaksstegProps) {
    const { watch, resetField } = useFormContext();
    const valgtAktivitetId = watch('svar.tiltak.aktivitetId');
    const periode = watch('svar.tiltak.periode');
    const søkerHeleTiltaksperioden = watch('svar.tiltak.søkerHeleTiltaksperioden');
    const { tiltak, valgtTiltak } = useContext(UtfyllingContext);
    const brukerHarRegistrerteTiltak = !!tiltak && tiltak.length > 0;
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

    const lagDefaultTiltaksperiode = () => {
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

    const defaultTiltaksperiode = React.useMemo(() => {
        return lagDefaultTiltaksperiode();
    }, [valgtTiltak, søkerHeleTiltaksperioden]);

    React.useEffect(() => {
        const valgtTiltakHarEndretSeg = valgtAktivitetId !== valgtTiltak?.aktivitetId;
        if (valgtTiltakHarEndretSeg) {
            resetFormValues();
        }
    }, [valgtAktivitetId]);

    React.useEffect(() => {
        resetField('svar.tiltak.periode', { defaultValue: null });
    }, [søkerHeleTiltaksperioden]);

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
            guide={<Veiledningstekst brukerHarRegistrerteTiltak={brukerHarRegistrerteTiltak} />}
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
                <TiltakMedPeriodeUtfylling
                    valgtTiltak={valgtTiltak}
                    defaultPeriode={defaultTiltaksperiode || undefined}
                />
            )}
            {brukerHarValgtEtTiltak && (valgtTiltakManglerHelePerioden || valgtTiltakManglerKunTilDato) && (
                <TiltakMedUfullstendigPeriodeUtfylling
                    valgtTiltakManglerKunTilDato={valgtTiltakManglerKunTilDato}
                    defaultPeriode={defaultTiltaksperiode || undefined}
                />
            )}
        </Step>
    );
}
