import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import Flervalgsspørsmål from '@/components/flervalgsspørsmål/Flervalgsspørsmål';
import { Button, GuidePanel } from '@navikt/ds-react';
import Periodespørsmål from '@/components/periodespørsmål/Periodespørsmål';
import Fritekstspørsmål from '@/components/fritekstspørsmål/Fritekstspørsmål';
import VariabelPersonliste from '@/components/personliste/VariabelPersonliste';

export default function Utfylling() {
    const formMethods = useForm({
        defaultValues: {
            barnUnderSeksten: [{ fornavn: '', etternavn: '', fdato: '', bostedsland: '' }],
            borPåInstitusjon: undefined,
            mottarEllerSøktPensjonsordningEllerEtterlønn: undefined,
            søkerOmBarnetillegg: undefined,
        },
    });
    const { handleSubmit, watch } = formMethods;
    const watchBorPåInstitusjon = watch('borPåInstitusjon');
    const watchPensjonsordningEllerEtterlønn = watch('mottarEllerSøktPensjonsordningEllerEtterlønn');
    const watchSøkerOmBarnetillegg = watch('søkerOmBarnetillegg');
    const onSubmit = console.log;

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <JaNeiSpørsmål name="deltarIKvp">Deltar du i kvalifiseringsprogrammet?</JaNeiSpørsmål>
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
                    Fyll ut informasjon om tiltaket du vil delta på i feltene under. Hvis du ikke har avtalt tiltaket
                    med NAV, vil vi kontakte deg for å avklare om vi kan godkjenne tiltaket.
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
                <Fritekstspørsmål name="tiltaksarrangør.adresse" textFieldProps={{ htmlSize: 45 }}>
                    Oppgi tiltaksarrangørens adresse
                </Fritekstspørsmål>
                <Fritekstspørsmål name="tiltaksarrangør.postnummer" textFieldProps={{ htmlSize: 10 }}>
                    Oppgi tiltaksarrangørens postnummer
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
                <Button type={'submit'}>Send inn</Button>
            </form>
        </FormProvider>
    );
}
