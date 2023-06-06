import React, { useContext } from 'react';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import { Button } from '@navikt/ds-react';
import Veiledningstekst from '@/steps/tiltakssteg/Veiledningstekst';
import TiltakMedUfullstendigPeriodeUtfylling from '@/steps/tiltakssteg/TiltakMedUfullstendigPeriodeUtfylling';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { valgtTiltakValidator } from '@/steps/tiltakssteg/validation';
import { lagSvaralternativForTiltak } from '@/steps/tiltakssteg/utils';

interface TiltaksstegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function Tiltakssteg({ title, stepNumber, onCompleted, onGoToPreviousStep }: TiltaksstegProps) {
    const { tiltak, valgtTiltak } = useContext(UtfyllingContext);
    const brukerHarRegistrerteTiltak = !!tiltak && tiltak.length > 0;
    const brukerHarValgtEtTiltak = !!valgtTiltak;
    const valgtTiltakManglerHelePerioden =
        !valgtTiltak?.arenaRegistrertPeriode || (
        !valgtTiltak?.arenaRegistrertPeriode?.fra &&
        !valgtTiltak?.arenaRegistrertPeriode?.til);
    const valgtTiltakManglerKunTilDato =
        !!valgtTiltak?.arenaRegistrertPeriode &&
        !!valgtTiltak?.arenaRegistrertPeriode.fra &&
        !valgtTiltak?.arenaRegistrertPeriode.til;

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
            {(brukerHarValgtEtTiltak && valgtTiltakManglerHelePerioden ) && (
                <TiltakMedUfullstendigPeriodeUtfylling
                    valgtTiltakManglerKunTilDato={valgtTiltakManglerKunTilDato}
                    valgtTiltak={valgtTiltak}
                />
            )}
            {(brukerHarValgtEtTiltak && valgtTiltakManglerKunTilDato ) && (
                <TiltakMedUfullstendigPeriodeUtfylling
                    valgtTiltakManglerKunTilDato={valgtTiltakManglerKunTilDato}
                    valgtTiltak={valgtTiltak}
                />
            )}
        </Step>
    );
}
