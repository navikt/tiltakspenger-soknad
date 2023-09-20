import React, { useContext } from 'react';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Step from '@/components/step/Step';
import {Alert, Button, Link, List} from '@navikt/ds-react';
import Veiledningstekst from '@/steps/tiltakssteg/Veiledningstekst';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { valgtTiltakValidator } from '@/steps/tiltakssteg/validation';
import {harFullstendigPeriode, lagSvaralternativForTiltak, lagTiltaksalternativTekst} from '@/steps/tiltakssteg/utils';

interface TiltaksstegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function Tiltakssteg({ title, stepNumber, onCompleted, onGoToPreviousStep }: TiltaksstegProps) {
    const { tiltak } = useContext(UtfyllingContext);
    const brukerHarRegistrerteTiltak = !!tiltak && tiltak.length > 0;
    const tiltakMedGyldigPeriode = tiltak?.filter(harFullstendigPeriode);
    const tiltakMedUgyldigPeriode = tiltak?.filter(tiltak => !harFullstendigPeriode(tiltak));
    const brukerHarRegistrerteTiltakMedGyldigPeriode = !!tiltakMedGyldigPeriode && tiltakMedGyldigPeriode.length > 0;
    const brukerHarRegistrerteTiltakMedUgyldigPeriode = !!tiltakMedUgyldigPeriode && tiltakMedUgyldigPeriode.length > 0;

    const submitSectionRenderer = !brukerHarRegistrerteTiltakMedGyldigPeriode
        ? () => (
            <Link href="https://www.nav.no/minside" style={{ margin: '1rem auto', display: 'block', width: "fit-content"}}>
              <Button type="button" as="a">
                  Avbryt søknaden og gå til Min side
              </Button>
            </Link>
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
            hideStepIndicator={!brukerHarRegistrerteTiltakMedGyldigPeriode}
            hideTitle={!brukerHarRegistrerteTiltak}
        >
            {brukerHarRegistrerteTiltakMedUgyldigPeriode && (
                <Alert variant="warning" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <List as="ul" title="Vi har funnet tiltak som mangler start- eller sluttdato">
                        {tiltakMedUgyldigPeriode.map((t) => (
                            <List.Item key={tiltak.aktivitetId}>{lagTiltaksalternativTekst(t)}</List.Item>
                        ))}
                    </List>
                    Dersom du ønsker å søke tiltakspenger for et av disse tiltakene, må du sende søknad på
                    papir eller kontakte oss slik at vi kan registrere fullstendig periode på tiltaket.
                </Alert>
            )}
            {brukerHarRegistrerteTiltakMedGyldigPeriode && (
                <Flervalgsspørsmål
                    alternativer={tiltakMedGyldigPeriode.map(lagSvaralternativForTiltak)}
                    name="svar.tiltak.aktivitetId"
                    validate={valgtTiltakValidator}
                >
                    Hvilket tiltak ønsker du å søke tiltakspenger for?
                </Flervalgsspørsmål>
            )}
        </Step>
    );
}
