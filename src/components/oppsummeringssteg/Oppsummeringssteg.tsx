import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, Button, ConfirmationPanel } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import styles from '../step/Step.module.css';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import { Personalia } from '@/types/Personalia';
import { Periode } from '@/types/Periode';
import { formatPeriode } from '@/utils/formatPeriode';
import { Tiltak } from '@/types/Tiltak';
import { formatDate } from '@/utils/formatDate';
import { AnnenUtbetaling } from '@/types/AnnenUtbetaling';
import { BarnFraAPI, SelvregistrertBarn } from '@/types/Barn';
import Søknad from '@/types/Søknad';

interface OppsummeringsstegProps {
    onCompleted: (data: any) => void;
    onGoToPreviousStep: () => void;
    personalia: Personalia;
    valgtTiltak: Tiltak;
}

function oppsummeringDeltarIKvp(deltarIKvp: boolean, periodeMedKvp: Periode | undefined) {
    if (deltarIKvp) {
        return `Ja, jeg deltar i kvalifiseringsprogrammet i perioden ${formatPeriode(periodeMedKvp!)}`;
    } else {
        return 'Nei, jeg deltar ikke i kvalifiseringsprogrammet i perioden jeg deltar på tiltaket';
    }
}

function oppsummeringDeltarIIntroprogram(deltarIIntroprogrammet: boolean, periodeMedIntro?: Periode) {
    if (deltarIIntroprogrammet) {
        return `Ja, jeg deltar i introduksjonsprogrammet i perioden ${formatPeriode(periodeMedIntro!)}`;
    } else {
        return 'Nei, jeg deltar ikke i introduksjonsprogrammet i perioden jeg deltar på tiltaket';
    }
}

function oppsummeringInstitusjon(borPåInstitusjon: boolean, periodePåInstitusjon?: Periode) {
    if (borPåInstitusjon) {
        return `Ja, jeg bor på institusjon med fri kost og losji i perioden ${formatPeriode(periodePåInstitusjon!)}`;
    } else {
        return 'Nei, jeg bor ikke på institusjon med fri kost og losji i perioden jeg går på tiltak';
    }
}

function oppsummeringPensjonsordninger(mottarEllerSøktPensjonsordning: boolean, pensjon: AnnenUtbetaling) {
    if (mottarEllerSøktPensjonsordning) {
        return `Ja, jeg mottar etterlønn fra ${pensjon.utbetaler} i perioden ${formatPeriode(pensjon.periode)}`;
    } else {
        return 'Nei, jeg har verken søkt om eller mottar utbetalinger fra en pensjonsordning';
    }
}

function oppsummeringEtterlønn(mottarEllerSøktEtterlønn: boolean, etterlønn: AnnenUtbetaling) {
    if (mottarEllerSøktEtterlønn) {
        return `Ja, jeg mottar etterlønn fra ${etterlønn.utbetaler} i perioden ${formatPeriode(etterlønn.periode)}`;
    } else {
        return 'Nei, jeg har verken søkt eller mottar etterlønn fra en arbeidsgiver';
    }
}

function oppsummeringBarnetillegg(harSøktBarnetillegg: boolean) {
    if (harSøktBarnetillegg) {
        return `Ja, jeg søker om barnetillegg for følgende barn`;
    } else {
        return 'Nei, jeg søker ikke om barnetillegg';
    }
}

function oppsummeringBarn(barn: BarnFraAPI | SelvregistrertBarn) {
    if (barn.fornavn && barn.etternavn) {
        return `${barn.fornavn} ${barn.mellomnavn ? `${barn.mellomnavn} ` : ''}${barn.etternavn}, født ${formatDate(
            barn.fødselsdato
        )}`;
    } else {
        return `Barn født ${formatDate(barn.fødselsdato)}`;
    }
}

export default function Oppsummeringssteg({
    onCompleted,
    onGoToPreviousStep,
    personalia,
    valgtTiltak,
}: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const søknad: Søknad = getValues() as Søknad;
    const svar = søknad.svar;
    const {
        kvalifiseringsprogram,
        introduksjonsprogram,
        pensjonsordning,
        etterlønn,
        institusjonsopphold,
        tiltak,
        barnetillegg,
    } = svar;

    const tiltaksperiode = tiltak.søkerHeleTiltaksperioden ? valgtTiltak.deltakelsePeriode : tiltak.periode;

    const registrerteBarnSøktBarnetilleggFor = personalia.barn.filter(
        ({ uuid }) => barnetillegg.registrerteBarnSøktBarnetilleggFor.indexOf(uuid) >= 0
    );

    const alleBarnSøktBarnetilleggFor = [
        ...barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor.filter(
            ({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato
        ),
        ...registrerteBarnSøktBarnetilleggFor,
    ];

    return (
        <Step
            title="Oppsummering"
            onCompleted={() => onCompleted(søknad)}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={5}
            submitSectionRenderer={() => (
                <div className={styles.step__buttonsection}>
                    <Button type="button" onClick={onGoToPreviousStep} size="small" variant="secondary">
                        Forrige steg
                    </Button>
                    <Button
                        type="button"
                        onClick={() => onCompleted(søknad)}
                        size="small"
                        style={{ marginLeft: '1rem' }}
                    >
                        Send inn søknad
                    </Button>
                </div>
            )}
            guide="Her kan du se over at alt er riktig, og ved behov endre opplysninger, før du sender inn søknaden din."
        >
            <Accordion style={{ marginTop: '2rem' }}>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Om deg</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Navn"
                            feltVerdi={`${personalia.fornavn} ${personalia.etternavn}`}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt feltNavn="Fødselsnummer" feltVerdi={`${personalia.fødselsnummer}`} />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tiltak</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt feltNavn="Tiltak" feltVerdi={valgtTiltak?.arrangør || ''} />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt feltNavn="Fra dato" feltVerdi={formatDate(tiltaksperiode!.fra)} />
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt feltNavn="Til dato" feltVerdi={formatDate(tiltaksperiode!.til)} />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>
                        Kvalifiseringsprogram, introduksjonsprogram og institusjonsopphold
                    </Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Kvalifiseringsprogrammet"
                            feltVerdi={oppsummeringDeltarIKvp(
                                kvalifiseringsprogram.deltar,
                                kvalifiseringsprogram.periode
                            )}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Introduksjonsprogrammet"
                                feltVerdi={oppsummeringDeltarIIntroprogram(
                                    introduksjonsprogram.deltar,
                                    introduksjonsprogram.periode
                                )}
                            />
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Opphold på institusjon"
                                feltVerdi={oppsummeringInstitusjon(
                                    institusjonsopphold.borPåInstitusjon,
                                    institusjonsopphold.periode
                                )}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Andre utbetalinger</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Pensjonsordninger"
                            feltVerdi={oppsummeringPensjonsordninger(
                                pensjonsordning.mottarEllerSøktPensjonsordning,
                                pensjonsordning
                            )}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Etterlønn"
                                feltVerdi={oppsummeringEtterlønn(etterlønn.mottarEllerSøktEtterlønn, etterlønn)}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Barnetillegg</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Barnetillegg"
                            feltVerdi={oppsummeringBarnetillegg(barnetillegg.søkerOmBarnetillegg)}
                        />
                        {alleBarnSøktBarnetilleggFor.map((barn, index) => (
                            <div style={{ marginTop: '2rem' }}>
                                <Oppsummeringsfelt feltNavn={`Barn ${index + 1}`} feltVerdi={oppsummeringBarn(barn)} />
                            </div>
                        ))}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            <ConfirmationPanel
                label="Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte"
                style={{ marginTop: '2rem' }}
            >
                <b>Vi stoler på deg</b>
            </ConfirmationPanel>
        </Step>
    );
}
