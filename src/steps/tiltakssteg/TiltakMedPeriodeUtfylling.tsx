import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tiltak } from '@/types/Tiltak';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { formatPeriode } from '@/utils/formatPeriode';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import { gyldigPeriodeValidator } from '@/utils/formValidators';
import {
    påkrevdSøkerHeleTiltaksperiodenValidator,
    påkrevdTiltaksperiodeSpørsmål,
} from '@/steps/tiltakssteg/validation';
import { PeriodevelgerPeriode } from '@/components/datovelger/Periodevelger';

interface TiltakMedPeriodeUtfyllingProps {
    valgtTiltak: Tiltak;
    defaultPeriode?: PeriodevelgerPeriode;
}

const TiltakMedPeriodeUtfylling = ({ valgtTiltak, defaultPeriode }: TiltakMedPeriodeUtfyllingProps) => {
    const { watch } = useFormContext();
    const søkerHeleTiltaksperioden = watch('svar.tiltak.søkerHeleTiltaksperioden');
    return (
        <>
            <JaNeiSpørsmål
                name="svar.tiltak.søkerHeleTiltaksperioden"
                reverse
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
                    defaultValue={defaultPeriode}
                >
                    Hvilken periode søker du tiltakspenger for?
                </Periodespørsmål>
            )}
        </>
    );
};

export default TiltakMedPeriodeUtfylling;
