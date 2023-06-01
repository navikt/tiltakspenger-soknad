import React from 'react';
import { PeriodevelgerPeriode } from '@/components/datovelger/Periodevelger';
import { Alert } from '@navikt/ds-react';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import { gyldigPeriodeValidator } from '@/utils/formValidators';
import { påkrevdTiltaksperiodeSpørsmål } from '@/steps/tiltakssteg/validation';

interface TiltakMedUfullstendigPeriodeUtfyllingProps {
    valgtTiltakManglerKunTilDato: boolean;
    defaultPeriode?: PeriodevelgerPeriode;
}

const TiltakMedUfullstendigPeriodeUtfylling = ({
    valgtTiltakManglerKunTilDato,
    defaultPeriode,
}: TiltakMedUfullstendigPeriodeUtfyllingProps) => {
    return (
        <>
            <Alert variant="info" style={{ marginTop: '2rem' }}>
                {valgtTiltakManglerKunTilDato
                    ? 'Vi har ikke registrert en sluttdato på dette tiltaket. Du kan legge inn sluttdato på tiltaket under.'
                    : 'Vi har ikke registrert i hvilken periode du deltar på dette tiltaket. Du kan legge inn perioden du ønsker å søke tiltakspenger for under.'}
            </Alert>
            <Periodespørsmål
                name="svar.tiltak.periode"
                validate={[gyldigPeriodeValidator, påkrevdTiltaksperiodeSpørsmål]}
                defaultValue={defaultPeriode}
            >
                Hvilken periode søker du tiltakspenger for?
            </Periodespørsmål>
        </>
    );
};

export default TiltakMedUfullstendigPeriodeUtfylling;
