import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Step from '@/components/step/Step';
import { gyldigPeriodeValidator } from '@/utils/formValidators';
import { formatPeriode } from '@/utils/formatPeriode';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { Periode } from '@/types/Periode';
import {
    borPåInstitusjonValidator,
    deltarIIntroprogrammetValidator,
    deltarIKvpValidator,
    periodenErInnenforTiltaksperiodeValidator,
    påkrevdInstitusjonsoppholdPeriodeValidator,
    påkrevdIntroprogramPeriodeValidator,
    påkrevdKvpPeriodeValidator,
} from '@/steps/innledningssteg/validation';

interface KvpStegProps {
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

export default function KvpSteg({ onCompleted, onGoToPreviousStep }: KvpStegProps) {
    const { watch } = useFormContext();
    const { valgtTiltak } = useContext(UtfyllingContext);

    const brukerregistrertPeriode = watch('svar.tiltak.periode') as Periode;
    const tiltaksperiode = brukerregistrertPeriode || valgtTiltak?.arenaRegistrertPeriode;
    const tiltaksperiodeTekst = formatPeriode(tiltaksperiode);

    const watchDeltarIKvp = watch('svar.kvalifiseringsprogram.deltar');
    const watchDeltarIIntroprogrammet = watch('svar.introduksjonsprogram.deltar');
    const watchBorPåInstitusjon = watch('svar.institusjonsopphold.borPåInstitusjon');
    return (
        <Step
            title="Kvalifiseringsprogrammet, introduksjonsprogrammet og institusjonsopphold"
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={2}
            guide={
                <React.Fragment>
                    <p>
                        Hvis du deltar i kvalifiseringsprogrammet eller introduksjonsprogrammet har du <b>ikke</b> rett
                        på tiltakspenger. Du må derfor svare på spørsmål om dette.
                    </p>
                    <p>
                        Bor du på en institusjon med gratis opphold, mat og drikke når du deltar i et
                        arbeidsmarkedstiltak, har du som regel ikke rett til tiltakspenger. En institusjon kan for
                        eksempel være et sykehus eller et fengsel.
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

                                <p>Les mer om kvalifiseringsprogrammet på (LENKE)</p>
                            </>
                        ),
                    }}
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
                        Når deltar du i kvalifiseringsprogrammet?
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
                                <p>Du kan lese mer om introduksjonsprogrammet på (LENKE til IMDI)</p>
                            </>
                        ),
                    }}
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
                        Når deltar du i introduksjonsprogrammet?
                    </Periodespørsmål>
                )}
                <JaNeiSpørsmål
                    name="svar.institusjonsopphold.borPåInstitusjon"
                    validate={borPåInstitusjonValidator}
                    hjelpetekst={{
                        tittel: 'Unntak for barnevernsinstitusjoner og overgangsbolig',
                        tekst: 'Bor du på barnevernsinstitusjon eller i en overgangsbolig har du likevel rett til å få tiltakspenger. Da kan du krysse «nei» på spørsmålet.',
                    }}
                >
                    Bor du i en institusjon med gratis opphold, mat og drikke i perioden {tiltaksperiodeTekst}?
                </JaNeiSpørsmål>
                {watchBorPåInstitusjon && (
                    <Periodespørsmål
                        name="svar.institusjonsopphold.periode"
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdInstitusjonsoppholdPeriodeValidator,
                            (periode) => periodenErInnenforTiltaksperiodeValidator(periode, tiltaksperiode),
                        ]}
                        minDate={new Date(tiltaksperiode?.fra)}
                        maxDate={new Date(tiltaksperiode?.til)}
                    >
                        I hvilken periode bor du på institusjon med gratis opphold, mat og drikke?
                    </Periodespørsmål>
                )}
            </>
        </Step>
    );
}
