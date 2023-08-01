import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator, periodenErInnenforTiltaksperiodeValidator } from '@/utils/formValidators';
import { formatPeriode } from '@/utils/formatPeriode';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { Periode } from '@/types/Periode';
import {
    deltarIIntroprogrammetValidator,
    deltarIKvpValidator,
    påkrevdIntroprogramPeriodeValidator,
    påkrevdKvpPeriodeValidator,
} from '@/steps/programdeltagelsesteg/validation';
import { Link } from '@navikt/ds-react';

interface ProgramDeltagelseStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function ProgramDeltagelseSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: ProgramDeltagelseStegProps) {
    const { watch, resetField } = useFormContext();
    const { valgtTiltak } = useContext(UtfyllingContext);

    const brukerregistrertPeriode = watch('svar.tiltak.periode') as Periode;
    const tiltaksperiode = brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode;
    const tiltaksperiodeTekst = formatPeriode(tiltaksperiode);

    const watchDeltarIKvp = watch('svar.kvalifiseringsprogram.deltar');
    const watchDeltarIIntroprogrammet = watch('svar.introduksjonsprogram.deltar');

    const resetKvpPeriode = () => {
        resetField('svar.kvalifiseringsprogram.periode', { defaultValue: null });
    };

    const resetIntroPeriode = () => {
        resetField('svar.introduksjonsprogram.periode', { defaultValue: null });
    };

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
                </React.Fragment>
            }
        >
            <>
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

                                <Link href="https://www.nav.no/kvalifiseringsprogrammet" target="_blank">
                                    Les mer om kvalifiseringsprogrammet (åpnes i ny fane)
                                </Link>
                            </>
                        ),
                    }}
                    afterOnChange={resetKvpPeriode}
                >
                    Deltar du i kvalifiseringsprogrammet i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchDeltarIKvp && (
                    <Periodespørsmål
                        name="svar.kvalifiseringsprogram.periode"
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdKvpPeriodeValidator,
                            (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                        ]}
                        minDate={new Date(tiltaksperiode?.fra)}
                        maxDate={new Date(tiltaksperiode?.til)}
                    >
                        I hvilken del av perioden deltar du i kvalifiseringsprogrammet?
                    </Periodespørsmål>
                )}
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
                                <Link
                                    href="https://www.imdi.no/om-imdi/brosjyrer-handboker-og-veiledere/velkommen-til-introduksjonsprogram/"
                                    target="_blank"
                                >
                                    Les mer om introduksjonsprogrammet (åpnes i ny fane)
                                </Link>
                            </>
                        ),
                    }}
                    afterOnChange={resetIntroPeriode}
                >
                    Deltar du i introduksjonsprogrammet i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchDeltarIIntroprogrammet && (
                    <Periodespørsmål
                        name="svar.introduksjonsprogram.periode"
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdIntroprogramPeriodeValidator,
                            (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                        ]}
                        minDate={new Date(tiltaksperiode?.fra)}
                        maxDate={new Date(tiltaksperiode?.til)}
                    >
                        I hvilken del av perioden deltar du i introduksjonsprogrammet?
                    </Periodespørsmål>
                )}
            </>
        </Step>
    );
}
