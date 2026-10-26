import React, { use } from 'react';
import { Alert, BodyLong, Button, Heading, Link, VStack } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import BarnetilleggSvar from '@/components/barnetillegg/BarnetilleggSvar';
import EttersendOpplysninger from '@/components/ettersending/EttersendOpplysninger';
import { useForrigeSøknad } from '@/components/forrige-svar/useForrigeSøknad';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { lagTiltakVisningTekst } from '@/steps/tiltakssteg/utils';
import { dateStrWithMonthName, dateStrWithMonthNameAndHourMinute } from '@/utils/formatDate';
import { formatPeriode } from '@/utils/formatPeriode';
import { MIN_SIDE_URL, SAKSBEHANDLINGSTID_URL } from '@/utils/lenker';
import { SVARFELT, SVARFELT_NAVN } from '@/utils/svaroppsummering';
import { Behandlingsutfall } from '@/types/Tiltak';
import stepStyles from './../../components/step/Step.module.css';

const resultatTekst: Record<Behandlingsutfall['resultat'], string> = {
    INNVILGELSE: 'innvilget',
    AVSLAG: 'avslått',
    AVBRUTT: 'avbrutt',
};

function VedtaksbrevPåMinSide() {
    return (
        <BodyLong spacing>
            Du kan se vedtaksbrevet på{' '}
            <Link href={MIN_SIDE_URL} target="_blank">
                Min side (åpnes i ny fane)
            </Link>
            .
        </BodyLong>
    );
}

interface TidligereSøknadStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

/**
 * Vises når bruker har valgt et tiltak vi allerede har mottatt en søknad for.
 * Bruker ser svarene fra forrige søknad, og kan velge å ettersende opplysninger eller starte en ny søknad som er fylt ut med de samme svarene.
 * Er forrige søknad ferdig behandlet eller avbrutt, ser bruker utfallet, og kan sende den nye søknaden uten å endre svarene.
 * Har en søknad for tiltaket fått vedtak, ser bruker alltid det siste vedtaket, også når en nyere søknad er avbrutt eller under behandling.
 */
export default function TidligereSøknadSteg({
    title,
    stepNumber,
    onCompleted,
    onGoToPreviousStep,
}: TidligereSøknadStegProps) {
    const { valgtTiltak } = use(UtfyllingContext);
    const forrige = useForrigeSøknad();
    if (!valgtTiltak || !forrige) {
        return null;
    }
    const { søknad, oppsummering } = forrige;
    const { sisteVedtak } = valgtTiltak;

    return (
        <Step
            title={title}
            stepNumber={stepNumber}
            onCompleted={onCompleted}
            onGoToPreviousStep={onGoToPreviousStep}
            hideStepIndicator
            submitSectionRenderer={() => (
                <div className={stepStyles.step__buttonsection}>
                    <Button type="button" variant="secondary" onClick={onGoToPreviousStep}>
                        Forrige steg
                    </Button>
                    <Button type="submit">Start ny søknad</Button>
                </div>
            )}
        >
            {sisteVedtak && (
                <Alert variant="info" style={{ marginTop: '1rem' }}>
                    <Heading size="small" level="2" spacing>
                        Du har fått vedtak på en søknad for dette tiltaket
                    </Heading>
                    <BodyLong spacing>
                        Vi mottok søknaden din {dateStrWithMonthNameAndHourMinute(sisteVedtak.søknadMottatt)}. Den ble{' '}
                        {resultatTekst[sisteVedtak.behandlingsutfall.resultat]}{' '}
                        {dateStrWithMonthName(sisteVedtak.behandlingsutfall.tidspunkt)}.
                    </BodyLong>
                    <VedtaksbrevPåMinSide />
                </Alert>
            )}
            {søknad.behandlingsutfall ? (
                <Alert variant="info" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <Heading size="small" level="2" spacing>
                        {søknad.behandlingsutfall.resultat === 'AVBRUTT'
                            ? 'Søknaden din for dette tiltaket er avbrutt'
                            : 'Søknaden din for dette tiltaket er ferdig behandlet'}
                    </Heading>
                    <BodyLong spacing>
                        Vi mottok søknaden din {dateStrWithMonthNameAndHourMinute(søknad.mottatt)}, for tiltaket{' '}
                        {lagTiltakVisningTekst(valgtTiltak)}. Søknaden ble{' '}
                        {resultatTekst[søknad.behandlingsutfall.resultat]}{' '}
                        {dateStrWithMonthName(søknad.behandlingsutfall.tidspunkt)}.
                    </BodyLong>
                    {søknad.behandlingsutfall.resultat !== 'AVBRUTT' && <VedtaksbrevPåMinSide />}
                    <BodyLong>
                        Du kan sende en ny søknad for tiltaket. Den nye søknaden blir fylt ut med svarene dine fra
                        forrige søknad, så du kan endre svarene som ikke lenger stemmer.
                    </BodyLong>
                </Alert>
            ) : (
                <Alert variant="info" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <Heading size="small" level="2" spacing>
                        Vi har mottatt søknaden din for dette tiltaket
                    </Heading>
                    <BodyLong spacing>
                        Vi mottok søknaden din {dateStrWithMonthNameAndHourMinute(søknad.mottatt)}, for tiltaket{' '}
                        {lagTiltakVisningTekst(valgtTiltak)}. Du vil få beskjed når søknaden din er ferdig behandlet.
                    </BodyLong>
                    <BodyLong spacing>
                        Se{' '}
                        <Link href={SAKSBEHANDLINGSTID_URL} target="_blank">
                            forventet saksbehandlingstid (åpnes i ny fane)
                        </Link>
                        .
                    </BodyLong>
                    <BodyLong spacing>
                        Har du nye eller endrede opplysninger, kan du sende en ny søknad. Den nye søknaden blir fylt ut
                        med svarene dine fra forrige søknad, og du må endre minst ett svar for å kunne sende den inn.
                    </BodyLong>
                    <EttersendOpplysninger />
                </Alert>
            )}
            <Heading size="medium" level="2" spacing>
                Svarene dine i forrige søknad
            </Heading>
            <VStack gap="space-24" style={{ marginBottom: '2rem' }}>
                <Oppsummeringsfelt
                    feltNavn="Jeg søkte om tiltakspenger i perioden:"
                    feltVerdi={formatPeriode(søknad.svar.tiltak.periode)}
                />
                {SVARFELT.map((felt) => {
                    const tekst = oppsummering[felt];
                    return tekst === undefined ? null : (
                        <Oppsummeringsfelt
                            key={felt}
                            feltNavn={SVARFELT_NAVN[felt]}
                            feltVerdi={felt === 'barnetillegg' ? <BarnetilleggSvar svar={søknad.svar} /> : tekst}
                        />
                    );
                })}
            </VStack>
        </Step>
    );
}
