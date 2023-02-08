import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, GuidePanel } from '@navikt/ds-react';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';

interface UtfyllingsstegProps {
    onCompleted: () => void;
}

export default function Utfyllingssteg({ onCompleted }: UtfyllingsstegProps) {
    const { handleSubmit, watch } = useFormContext();

    const watchDeltarIKvp = watch('deltarIKvp');
    const watchDeltarIIntroprogrammet = watch('deltarIIntroprogrammet');
    const watchBorPåInstitusjon = watch('borPåInstitusjon');
    const watchPensjonsordningEllerEtterlønn = watch('mottarEllerSøktPensjonsordningEllerEtterlønn');
    const watchSøkerOmBarnetillegg = watch('søkerOmBarnetillegg');

    return (
        <form onSubmit={handleSubmit(onCompleted)}>
            <JaNeiSpørsmål name="deltarIKvp">
                Deltar du i kvalifiseringsprogrammet i perioden du søker tiltakspenger for?
            </JaNeiSpørsmål>
            {watchDeltarIKvp && (
                <Periodespørsmål name="periodeMedKvp">
                    I hvilken periode deltar du i kvalifiseringsprogrammet?
                </Periodespørsmål>
            )}
            <JaNeiSpørsmål name="deltarIIntroprogrammet">
                Deltar du i introduksjonsprogrammet i perioden du søker tiltakspenger for?
            </JaNeiSpørsmål>
            {watchDeltarIIntroprogrammet && (
                <Periodespørsmål name="periodeMedIntroprogrammet">
                    I hvilken periode deltar du i introduksjonsprogrammet?
                </Periodespørsmål>
            )}
            <JaNeiSpørsmål name="borPåInstitusjon">
                Bor du på institusjon i tiltaksperioden med fri kost og losji?
            </JaNeiSpørsmål>
            {watchBorPåInstitusjon && (
                <Flervalgsspørsmål
                    name="institusjonstype"
                    alternativer={[
                        {
                            tekst: 'Barnevernsinstitusjon',
                            value: 'barnevernsinstitusjon',
                        },
                        { tekst: 'Overgangsbolig', value: 'overgangsbolig' },
                        { tekst: 'Annen type institusjon', value: 'annen' },
                    ]}
                >
                    Hvilken type institusjon bor du på?
                </Flervalgsspørsmål>
            )}
            <GuidePanel poster>
                Fyll ut informasjon om tiltaket du vil delta på i feltene under. Hvis du ikke har avtalt tiltaket med
                NAV, vil vi kontakte deg for å avklare om vi kan godkjenne tiltaket.
            </GuidePanel>
            <Flervalgsspørsmål
                alternativer={[
                    { tekst: 'AMO', value: 'AMO' },
                    { tekst: 'Arbeidstrening', value: 'arbeidstrening' },
                    { tekst: 'Jobbsøkerkurs', value: 'jobbsøkerkurs' },
                    { tekst: 'Annet type tiltak', value: 'annet' },
                ]}
                name="tiltakstype"
            >
                Hvilken type tiltak søker du tiltakspenger for?
            </Flervalgsspørsmål>
            <Periodespørsmål name="tiltaksperiode">I hvilken periode skal du delta på tiltaket?</Periodespørsmål>
            <Fritekstspørsmål name="tiltaksarrangør.navn" textFieldProps={{ htmlSize: 45 }}>
                Oppgi tiltaksarrangørens navn
            </Fritekstspørsmål>
            <Flervalgsspørsmål
                name="antallDagerMedTiltakPerUke"
                alternativer={[
                    { tekst: '1 dag i uken', value: '1' },
                    { tekst: '2 dager i uken', value: '2' },
                    { tekst: '3 dager i uken', value: '3' },
                    { tekst: '4 dager i uken', value: '4' },
                    { tekst: '5 dager i uken', value: '5' },
                ]}
            >
                Hvor mange dager i uken deltar du på tiltaket?
            </Flervalgsspørsmål>
            <JaNeiSpørsmål name="mottarEllerSøktPensjonsordningEllerEtterlønn">
                Har du søkt om eller mottar pensjonsordning eller etterlønn fra en arbeidsgiver?
            </JaNeiSpørsmål>
            {watchPensjonsordningEllerEtterlønn && (
                <>
                    <Fritekstspørsmål name="pensjonEllerEtterlønn.utbetaler" textFieldProps={{ htmlSize: 45 }}>
                        Hvem utbetaler pensjon eller etterlønn?
                    </Fritekstspørsmål>
                    <Fritekstspørsmål name="pensjonEllerEtterlønn.prosentandel" textFieldProps={{ htmlSize: 5 }}>
                        Oppgi prosentandel (valgfritt)
                    </Fritekstspørsmål>
                    <Periodespørsmål name="pensjonEllerEtterlønn.periode">Oppgi periode</Periodespørsmål>
                </>
            )}
            <JaNeiSpørsmål name="søkerOmBarnetillegg">
                Ønsker du å søke om barnetillegg for ett eller flere barn under 16 år som du forsørger?
            </JaNeiSpørsmål>
            {watchSøkerOmBarnetillegg && <VariabelPersonliste name="barnUnderSeksten" />}
            <Fritekstspørsmål name="andreOpplysninger" textFieldProps={{ htmlSize: 100 }}>
                Andre opplysninger
            </Fritekstspørsmål>
            <Button type="submit">Gå til oppsummering</Button>
        </form>
    );
}
