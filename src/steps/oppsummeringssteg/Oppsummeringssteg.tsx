import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, Button } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import { Personalia } from '@/types/Personalia';
import { Periode } from '@/types/Periode';
import { formatPeriode } from '@/utils/formatPeriode';
import { Tiltak } from '@/types/Tiltak';
import { formatDate } from '@/utils/formatDate';
import Søknad from '@/types/Søknad';
import Bekreftelsesspørsmål from '@/components/bekreftelsesspørsmål/Bekreftelsesspørsmål';
import styles from './Oppsummeringssteg.module.css';
import stepStyles from './../../components/step/Step.module.css';
import { påkrevdBekreftelsesspørsmål } from '@/utils/formValidators';
import BarneInfo from '@/components/barnetillegg/BarneInfo';
import Show from "@/components/show/show";

interface OppsummeringsstegProps {
    title: string;
    stepNumber: number;
    onGoToPreviousStep: () => void;
    personalia: Personalia;
    valgtTiltak: Tiltak;
    onCompleted: () => void;
    søknadsinnsendingInProgress: boolean;
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

function visSvarTilAndreUtbetalinger(mottarAndreUtbetalinger: boolean){
    if (mottarAndreUtbetalinger) {
        return 'Ja, jeg mottar andre offentlige, private eller utenlandske trygde- eller pensjonsordninger.';
    } else {
        return 'Nei, jeg mottar ikke andre offentlige, private eller utenlandske trygde- eller pensjonsordninger.'
    }
}

function oppsummeringPensjonsordninger(mottarEllerSøktPensjonsordning: boolean) {
    if (mottarEllerSøktPensjonsordning) {
        return `Ja, jeg mottar utbetalinger fra en pensjonsordning`;
    } else {
        return 'Nei, jeg har verken søkt om eller mottar utbetalinger fra en pensjonsordning';
    }
}

function oppsummeringEtterlønn(mottarEllerSøktEtterlønn: boolean) {
    if (mottarEllerSøktEtterlønn) {
        return `Ja, jeg mottar etterlønn fra en arbeidsgiver`;
    } else {
        return 'Nei, jeg har verken søkt eller mottar etterlønn fra en arbeidsgiver';
    }
}

function harBekreftetAlleOpplysningerValidator(verdi: boolean) {
    return påkrevdBekreftelsesspørsmål(verdi, 'Du må bekrefte at alle opplysninger du har oppgitt er korrekte');
}

export default function Oppsummeringssteg({
                                              title,
                                              stepNumber,
                                              onGoToPreviousStep,
                                              personalia,
                                              valgtTiltak,
                                              onCompleted,
                                              søknadsinnsendingInProgress,
                                          }: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const søknad: Søknad = getValues() as Søknad;
    const svar = søknad.svar;
    const {
        harBekreftetÅSvareSåGodtManKan,
        kvalifiseringsprogram,
        introduksjonsprogram,
        pensjonsordning,
        etterlønn,
        mottarAndreUtbetalinger,
        sykepenger,
        gjenlevendepensjon,
        alderspensjon,
        supplerendestønadover67,
        supplerendestønadflyktninger,
        jobbsjansen,
        institusjonsopphold,
        tiltak,
        barnetillegg,
    } = svar;
    const valgtTiltakManglerPeriode =
        !valgtTiltak?.arenaRegistrertPeriode ||
        !valgtTiltak?.arenaRegistrertPeriode.fra ||
        !valgtTiltak?.arenaRegistrertPeriode.til;

    const tiltaksperiode = tiltak.søkerHeleTiltaksperioden ? valgtTiltak.arenaRegistrertPeriode : tiltak.periode;
    const opprinneligTiltaksperiode = valgtTiltakManglerPeriode ? tiltaksperiode : valgtTiltak.arenaRegistrertPeriode;

    const alleBarnSøktBarnetilleggFor = barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
        .filter(({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato)
        .concat(personalia.barn);

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onGoToPreviousStep={onGoToPreviousStep}
            onCompleted={onCompleted}
            submitSectionRenderer={() => (
                <div className={stepStyles.step__buttonsection}>
                    <Button
                        type="button"
                        onClick={onGoToPreviousStep}
                        size="small"
                        variant="secondary"
                        disabled={søknadsinnsendingInProgress}
                        loading={søknadsinnsendingInProgress}
                    >
                        Forrige steg
                    </Button>
                    <Button
                        type="submit"
                        size="small"
                        style={{ marginLeft: '1rem' }}
                        disabled={søknadsinnsendingInProgress}
                        loading={søknadsinnsendingInProgress}
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
                            <Oppsummeringsfelt
                                feltNavn="Fra dato"
                                feltVerdi={formatDate(opprinneligTiltaksperiode!.fra)}
                            />
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Til dato"
                                feltVerdi={formatDate(opprinneligTiltaksperiode!.til)}
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Jeg søker om tiltakspenger i perioden:"
                                feltVerdi={formatPeriode(tiltaksperiode!)}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Programdeltagelse</Accordion.Header>
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
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Andre utbetalinger</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Andreutbetalinger"
                            feltVerdi={visSvarTilAndreUtbetalinger(mottarAndreUtbetalinger)}
                        />
                            {
                                sykepenger.periode ? (
                                    <div style={{ marginTop: '2rem' }}>
                                        <Oppsummeringsfelt
                                            feltNavn="Sykepenger"
                                            feltVerdi={formatPeriode(sykepenger.periode!)}
                                        />
                                    </div>
                                ) : <></>
                            }
                        {
                            gjenlevendepensjon.periode ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Gjenlevendepensjon"
                                        feltVerdi={formatPeriode(gjenlevendepensjon.periode!)}
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            alderspensjon.fraDato ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Alderspensjon"
                                        feltVerdi={formatDate(alderspensjon.fraDato!)}
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            pensjonsordning && pensjonsordning.mottar ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Pensjonsordning"
                                        feltVerdi=""
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            etterlønn && etterlønn.mottar ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Etterlønn"
                                        feltVerdi=""
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            supplerendestønadover67 && supplerendestønadover67.mottar ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Supplerende stønad for person over 67 år"
                                        feltVerdi={formatPeriode(supplerendestønadover67.periode!)}
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            supplerendestønadflyktninger && supplerendestønadflyktninger.mottar ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Supplerende stønad for uføre flyktninger"
                                        feltVerdi={formatPeriode(supplerendestønadflyktninger.periode!)}
                                    />
                                </div>
                            ) : <></>
                        }
                        {
                            jobbsjansen && jobbsjansen.mottar ? (
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Jobbsjansen"
                                        feltVerdi={formatPeriode(jobbsjansen.periode!)}
                                    />
                                </div>
                            ) : <></>
                        }
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Institusjonsopphold</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Opphold på institusjon"
                            feltVerdi={oppsummeringInstitusjon(
                                institusjonsopphold.borPåInstitusjon,
                                institusjonsopphold.periode
                            )}
                            />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Barnetillegg</Accordion.Header>
                    <Accordion.Content>
                        {alleBarnSøktBarnetilleggFor.map((barn, index) => (
                            <div style={{ marginTop: index == 0 ? '0rem' : '2rem' }}>
                                <BarneInfo
                                    barn={{
                                        ...barn,
                                        oppholdUtenforEØS:
                                            barn.oppholdUtenforEØS ?? barnetillegg.eøsOppholdForBarnFraAPI[barn.uuid],
                                    }}
                                />
                                {index != alleBarnSøktBarnetilleggFor.length - 1 && <hr />}
                            </div>
                        ))}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            <Bekreftelsesspørsmål
                label="Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte."
                className={styles.bekreftelsesboks}
                name="svar.harBekreftetAlleOpplysninger"
                validate={harBekreftetAlleOpplysningerValidator}
            >
                <b>Vi stoler på deg</b>
            </Bekreftelsesspørsmål>
        </Step>
    );
}
