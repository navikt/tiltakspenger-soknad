import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, Button } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import { Periode } from '@/types/Periode';
import { formatPeriode } from '@/utils/formatPeriode';
import { formatDate } from '@/utils/formatDate';
import Søknad from '@/types/Søknad';
import Bekreftelsesspørsmål from '@/components/bekreftelsesspørsmål/Bekreftelsesspørsmål';
import styles from './Oppsummeringssteg.module.css';
import stepStyles from './../../components/step/Step.module.css';
import { påkrevdBekreftelsesspørsmål } from '@/utils/formValidators';
import BarneInfo from '@/components/barnetillegg/BarneInfo';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';

interface OppsummeringsstegProps {
    title: string;
    stepNumber: number;
    onGoToPreviousStep: () => void;
    onCompleted: () => void;
    søknadsinnsendingInProgress: boolean;
}

function hentSvarTilProgramDeltagelse(program: string, deltar: boolean, periode?: Periode) {
    if (deltar) {
        return `Ja, jeg mottar ${program} ${periode ? `i perioden ${formatPeriode(periode!)}` : ''} `;
    } else {
        return `Nei, jeg mottar ikke ${program}`;
    }
}

function oppsummeringInstitusjon(borPåInstitusjon: boolean, periodePåInstitusjon?: Periode) {
    if (borPåInstitusjon) {
        return `Ja, jeg bor på institusjon med fri kost og losji i perioden ${formatPeriode(periodePåInstitusjon!)}`;
    } else {
        return 'Nei, jeg bor ikke på institusjon med fri kost og losji i perioden jeg går på tiltak';
    }
}

function oppsummeringAlderspensjon(mottar: boolean, fraDato: string) {
    if (mottar) {
        return `Ja, jeg mottar alderspensjon fra ${formatDate(fraDato!)}`;
    } else {
        return 'Nei, jeg mottar ikke alderspensjon';
    }
}

function hentSvarTilSpørsmålene(spørsmålTittel: String, mottar: boolean, periode?: Periode) {
    if (mottar) {
        return `Ja, jeg mottar ${spørsmålTittel} ${periode ? `i perioden ${formatPeriode(periode!)}` : ''} `;
    } else {
        return `Nei, jeg mottar ikke ${spørsmålTittel} i perioden jeg går på tiltak`;
    }
}

function harBekreftetAlleOpplysningerValidator(verdi: boolean) {
    return påkrevdBekreftelsesspørsmål(verdi, 'Du må bekrefte at alle opplysninger du har oppgitt er korrekte');
}

export default function Oppsummeringssteg({
    title,
    stepNumber,
    onGoToPreviousStep,
    onCompleted,
    søknadsinnsendingInProgress,
}: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const { personalia, valgtTiltak } = useContext(UtfyllingContext);
    const søknad: Søknad = getValues() as Søknad;
    const svar = søknad.svar;
    const {
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

    const vedlegg = søknad.vedlegg;

    const valgtTiltakManglerPeriode =
        !valgtTiltak?.arenaRegistrertPeriode ||
        !valgtTiltak?.arenaRegistrertPeriode.fra ||
        !valgtTiltak?.arenaRegistrertPeriode.til;

    const tiltaksperiode = tiltak.periode;
    const opprinneligTiltaksperiode = valgtTiltakManglerPeriode ? tiltaksperiode : valgtTiltak.arenaRegistrertPeriode;

    const alleBarnSøktBarnetilleggFor = barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
        .filter(({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato)
        .concat(personalia!.barn);
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
                        variant="secondary"
                        disabled={søknadsinnsendingInProgress}
                        loading={søknadsinnsendingInProgress}
                    >
                        Forrige steg
                    </Button>
                    <Button
                        type="submit"
                        style={{ marginLeft: '1rem' }}
                        disabled={søknadsinnsendingInProgress}
                        loading={søknadsinnsendingInProgress}
                    >
                        Send inn søknad
                    </Button>
                </div>
            )}
            guide='Her kan du se over at alt er riktig før du sender inn søknaden din. Om du trenger å gjøre endringer, kan du kikke deg tilbake i søknaden. Trykk på knappen "Forrige steg" nederst på siden.'
        >
            <Accordion style={{ marginTop: '2rem' }}>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Om deg</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Navn"
                            feltVerdi={`${personalia!.fornavn} ${
                                personalia!.mellomnavn ? `${personalia!.mellomnavn} ` : ''
                            }${personalia!.etternavn}`}
                        />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tiltak</Accordion.Header>
                    <Accordion.Content>
                        <div>
                            <span>
                                {valgtTiltak?.arrangør || ''}
                                {valgtTiltak?.arrangør && valgtTiltak?.typeNavn && ' - '}
                                {valgtTiltak?.typeNavn || ''}
                            </span>
                            <br />
                            <span>
                                {formatDate(opprinneligTiltaksperiode!.fra)}
                                {opprinneligTiltaksperiode!.fra && opprinneligTiltaksperiode!.til && ' - '}
                                {formatDate(opprinneligTiltaksperiode!.til || '')}
                            </span>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Jeg søker om tiltakspenger i perioden:"
                                feltVerdi={formatPeriode(tiltaksperiode!)}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Introduksjonsstønad og kvalifiseringsstønad</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Introduksjonsstønad"
                            feltVerdi={hentSvarTilProgramDeltagelse(
                                'introduksjonsstønad',
                                introduksjonsprogram.deltar,
                                introduksjonsprogram.periode,
                            )}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Kvalifiseringsstønad"
                                feltVerdi={hentSvarTilProgramDeltagelse(
                                    'kvalifiseringsstønad',
                                    kvalifiseringsprogram.deltar,
                                    kvalifiseringsprogram.periode,
                                )}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Utbetalinger</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn="Etterlønn"
                            feltVerdi={hentSvarTilSpørsmålene(
                                'etterlønn fra en tidligere arbeidsgiver i perioden jeg går på tiltak',
                                etterlønn.mottar,
                            )}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Sykepenger"
                                feltVerdi={hentSvarTilSpørsmålene('sykepenger', sykepenger.mottar, sykepenger.periode)}
                            />
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Oppsummeringsfelt
                                feltNavn="Annen pengestøtte"
                                feltVerdi={hentSvarTilSpørsmålene(
                                    'annen pengestøtte i perioden jeg går på tiltak',
                                    mottarAndreUtbetalinger,
                                )}
                            />
                        </div>
                        {mottarAndreUtbetalinger && (
                            <>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Gjenlevendepensjon og omstillingsstønad"
                                        feltVerdi={hentSvarTilSpørsmålene(
                                            'gjenlevendepensjon eller omstillingsstønad',
                                            gjenlevendepensjon.mottar,
                                            gjenlevendepensjon.periode,
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Alderspensjon"
                                        feltVerdi={oppsummeringAlderspensjon(
                                            alderspensjon.mottar,
                                            alderspensjon.fraDato!,
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Supplerende stønad for personer over 67 år med kort botid i Norge"
                                        feltVerdi={hentSvarTilSpørsmålene(
                                            'supplerende stønad for personer over 67 år med kort botid i Norge',
                                            supplerendestønadover67.mottar,
                                            supplerendestønadover67.periode,
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Supplerende stønad for uføre flyktninger"
                                        feltVerdi={hentSvarTilSpørsmålene(
                                            'supplerende stønad for uføre flyktninger',
                                            supplerendestønadflyktninger.mottar,
                                            supplerendestønadflyktninger.periode,
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Pengestøtte fra andre trygde- eller pensjonsordninger"
                                        feltVerdi={hentSvarTilSpørsmålene(
                                            'pengestøtte fra andre trygde- eller pensjonsordninger',
                                            pensjonsordning.mottar,
                                            pensjonsordning.periode,
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Oppsummeringsfelt
                                        feltNavn="Stønad gjennom Jobbsjansen"
                                        feltVerdi={hentSvarTilSpørsmålene(
                                            'stønad gjennom Jobbsjansen',
                                            jobbsjansen.mottar,
                                            jobbsjansen.periode,
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Institusjonsopphold</Accordion.Header>
                    <Accordion.Content>
                        <Oppsummeringsfelt
                            feltNavn=""
                            feltVerdi={oppsummeringInstitusjon(
                                institusjonsopphold.borPåInstitusjon,
                                institusjonsopphold.periode,
                            )}
                        />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Barnetillegg</Accordion.Header>
                    <Accordion.Content>
                        {alleBarnSøktBarnetilleggFor.length > 0
                            ? alleBarnSøktBarnetilleggFor.map((barn, index) => {
                                  const barnetsVedlegg = vedlegg.filter((v) => v.uuid === barn.uuid);
                                  return (
                                      <div style={{ marginTop: index == 0 ? '0rem' : '2rem' }} key={barn.uuid}>
                                          <BarneInfo
                                              vedlegg={barnetsVedlegg}
                                              barn={{
                                                  ...barn,
                                                  oppholdInnenforEøs:
                                                      barn.oppholdInnenforEøs ??
                                                      barnetillegg.eøsOppholdForBarnFraAPI[barn.uuid],
                                              }}
                                          />
                                          {index != alleBarnSøktBarnetilleggFor.length - 1 && <hr />}
                                      </div>
                                  );
                              })
                            : 'Jeg søker ikke om barnetillegg'}
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
