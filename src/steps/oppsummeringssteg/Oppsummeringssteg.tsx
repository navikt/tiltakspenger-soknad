import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, Alert, BodyLong, Button, Heading } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import { formatPeriode } from '@/utils/formatPeriode';
import { formatDate } from '@/utils/formatDate';
import Søknad from '@/types/Søknad';
import Bekreftelsesspørsmål from '@/components/bekreftelsesspørsmål/Bekreftelsesspørsmål';
import styles from './Oppsummeringssteg.module.css';
import stepStyles from './../../components/step/Step.module.css';
import { påkrevdBekreftelsesspørsmål } from '@/utils/formValidators';
import BarneInfo from '@/components/barnetillegg/BarneInfo';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { lagTiltakVisningTekst } from '@/steps/tiltakssteg/utils';
import toSøknadJson from '@/utils/toSøknadJson';
import BarnetilleggSvar from '@/components/barnetillegg/BarnetilleggSvar';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { endredeSvar, oppsummerSvar, Svarfelt, SVARFELT_NAVN } from '@/utils/svaroppsummering';
import { useForrigeSøknad } from '@/components/forrige-svar/useForrigeSøknad';
import EttersendOpplysninger from '@/components/ettersending/EttersendOpplysninger';
import { dateStrWithMonthNameAndHourMinute } from '@/utils/formatDate';

interface OppsummeringsstegProps {
    title: string;
    stepNumber: number;
    onGoToPreviousStep: () => void;
    onCompleted: () => void;
    søknadsinnsendingInProgress: boolean;
    /** Satt når backenden avviste søknaden fordi svarene er de samme som i en søknad vi allerede har mottatt. */
    avvistUtenEndringer?: { mottatt: string };
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
    avvistUtenEndringer,
}: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const { personalia, valgtTiltak } = useContext(UtfyllingContext);
    const søknad: Søknad = getValues() as Søknad;
    const svar = søknad.svar;
    const { mottarAndreUtbetalinger, tiltak, barnetillegg } = svar;
    const forrige = useForrigeSøknad();
    // Samme form som søknaden sendes inn i, slik at den sammenlignes med forrige søknad slik backenden gjør.
    const innsendteSvar = JSON.parse(toSøknadJson(svar, personalia!.barn, valgtTiltak!)) as InnsendteSvar;
    const oppsummering = oppsummerSvar(innsendteSvar);
    const endret = forrige ? endredeSvar(oppsummering, forrige.oppsummering) : [];
    const ingenEndringer = !!forrige && endret.length === 0;

    const felt = (navn: Svarfelt, feltNavn: string = SVARFELT_NAVN[navn]) => (
        <Oppsummeringsfelt
            feltNavn={feltNavn}
            feltVerdi={oppsummering[navn] ?? ''}
            forrigeVerdi={endret.includes(navn) ? (forrige!.oppsummering[navn] ?? 'Ikke besvart') : undefined}
        />
    );

    const vedlegg = søknad.vedlegg;

    const valgtTiltakManglerPeriode =
        !valgtTiltak?.arenaRegistrertPeriode ||
        !valgtTiltak?.arenaRegistrertPeriode.fra ||
        !valgtTiltak?.arenaRegistrertPeriode.til;

    const tiltaksperiode = tiltak.periode;
    const opprinneligTiltaksperiode = valgtTiltakManglerPeriode ? tiltaksperiode : valgtTiltak.arenaRegistrertPeriode;

    const alleBarnSøktBarnetilleggFor = barnetillegg.søkerOmBarnetillegg
        ? barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
              .filter(({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato)
              .concat(
                  (personalia!.barn ?? []).map((barn) => ({
                      ...barn,
                      ...barnetillegg.bostedForBarnFraFolkeregisteret[barn.uuid],
                  })),
              )
        : [];
    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onGoToPreviousStep={onGoToPreviousStep}
            onCompleted={onCompleted}
            submitSectionRenderer={() => (
                <>
                    {avvistUtenEndringer && (
                        <Alert variant="error" role="alert" style={{ marginTop: '4rem' }}>
                            <Heading size="small" level="2" spacing>
                                Søknaden ble ikke sendt inn
                            </Heading>
                            <BodyLong spacing>
                                Svarene dine er de samme som i søknaden vi mottok{' '}
                                {dateStrWithMonthNameAndHourMinute(avvistUtenEndringer.mottatt)}. Vil du sende en ny
                                søknad, må du endre svarene som ikke lenger stemmer.
                            </BodyLong>
                            <EttersendOpplysninger />
                        </Alert>
                    )}
                    <div
                        className={stepStyles.step__buttonsection}
                        style={avvistUtenEndringer ? { marginTop: '2rem' } : undefined}
                    >
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
                </>
            )}
            guide='Her kan du se over at alt er riktig før du sender inn søknaden din. Om du trenger å gjøre endringer, kan du kikke deg tilbake i søknaden. Trykk på knappen "Forrige steg" nederst på siden.'
        >
            {ingenEndringer && (
                <Alert variant="warning" style={{ marginTop: '2rem' }}>
                    <Heading size="small" level="2" spacing>
                        Du har ikke endret noen svar
                    </Heading>
                    <BodyLong spacing>
                        Svarene dine er de samme som i søknaden vi mottok{' '}
                        {dateStrWithMonthNameAndHourMinute(forrige.søknad.mottatt)}. Vi tar ikke imot en ny søknad med
                        de samme svarene. Gå tilbake og endre svarene som ikke lenger stemmer.
                    </BodyLong>
                    <EttersendOpplysninger />
                </Alert>
            )}
            {forrige && endret.length > 0 && (
                <Alert variant="info" style={{ marginTop: '2rem' }}>
                    Svar som er endret siden søknaden vi mottok{' '}
                    {dateStrWithMonthNameAndHourMinute(forrige.søknad.mottatt)} er merket med «Endret».
                </Alert>
            )}
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
                            <span>{valgtTiltak ? lagTiltakVisningTekst(valgtTiltak) : ''}</span>
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
                        {felt('introduksjonsprogram')}
                        <div style={{ marginTop: '2rem' }}>{felt('kvalifiseringsprogram')}</div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Utbetalinger</Accordion.Header>
                    <Accordion.Content>
                        {felt('etterlønn')}
                        <div style={{ marginTop: '2rem' }}>{felt('sykepenger')}</div>
                        <div style={{ marginTop: '2rem' }}>{felt('mottarAndreUtbetalinger')}</div>
                        {mottarAndreUtbetalinger && (
                            <>
                                <div style={{ marginTop: '2rem' }}>{felt('gjenlevendepensjon')}</div>
                                <div style={{ marginTop: '2rem' }}>{felt('alderspensjon')}</div>
                                <div style={{ marginTop: '2rem' }}>{felt('supplerendestønadover67')}</div>
                                <div style={{ marginTop: '2rem' }}>{felt('supplerendestønadflyktninger')}</div>
                                <div style={{ marginTop: '2rem' }}>{felt('pensjonsordning')}</div>
                                <div style={{ marginTop: '2rem' }}>{felt('jobbsjansen')}</div>
                            </>
                        )}
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Institusjonsopphold</Accordion.Header>
                    <Accordion.Content>{felt('institusjonsopphold', '')}</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Barnetillegg</Accordion.Header>
                    <Accordion.Content>
                        {alleBarnSøktBarnetilleggFor.length > 0
                            ? alleBarnSøktBarnetilleggFor.map((barn, index) => {
                                  const barnetsVedlegg = vedlegg.filter((v) => v.uuid === barn.uuid);
                                  return (
                                      <div style={{ marginTop: index == 0 ? '0rem' : '2rem' }} key={barn.uuid}>
                                          <BarneInfo vedlegg={barnetsVedlegg} barn={barn} />
                                          {index != alleBarnSøktBarnetilleggFor.length - 1 && <hr />}
                                      </div>
                                  );
                              })
                            : 'Jeg søker ikke om barnetillegg'}
                        {endret.includes('barnetillegg') && (
                            <div style={{ marginTop: '2rem' }}>
                                <Oppsummeringsfelt
                                    feltNavn="Barnetillegg"
                                    feltVerdi={<BarnetilleggSvar svar={innsendteSvar} />}
                                    forrigeVerdi={<BarnetilleggSvar svar={forrige!.søknad.svar} />}
                                />
                            </div>
                        )}
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
