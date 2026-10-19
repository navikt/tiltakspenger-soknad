import React, { use } from 'react';
import { Alert, BodyLong, Button, Heading, VStack } from '@navikt/ds-react';
import Step from '@/components/step/Step';
import Oppsummeringsfelt from '@/components/oppsummeringsfelt/Oppsummeringsfelt';
import EttersendOpplysninger from '@/components/ettersending/EttersendOpplysninger';
import { useForrigeSøknad } from '@/components/forrige-svar/useForrigeSøknad';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { lagTiltakVisningTekst } from '@/steps/tiltakssteg/utils';
import { dateStrWithMonthNameAndHourMinute } from '@/utils/formatDate';
import { formatPeriode } from '@/utils/formatPeriode';
import { SVARFELT, SVARFELT_NAVN } from '@/utils/svaroppsummering';
import stepStyles from './../../components/step/Step.module.css';

interface TidligereSøknadStegProps {
    title: string;
    stepNumber: number;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
}

/**
 * Vises når bruker har valgt et tiltak vi allerede har mottatt en søknad for.
 * Bruker ser svarene fra forrige søknad, og kan velge å ettersende opplysninger eller starte en ny søknad som er fylt ut med de samme svarene.
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
            <Alert variant="info" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <Heading size="small" level="2" spacing>
                    Vi har mottatt søknaden din for dette tiltaket
                </Heading>
                <BodyLong spacing>
                    Vi mottok søknaden din om tiltakspenger for {lagTiltakVisningTekst(valgtTiltak)}{' '}
                    {dateStrWithMonthNameAndHourMinute(søknad.mottatt)}.
                </BodyLong>
                <BodyLong spacing>
                    Har du nye eller endrede opplysninger, kan du sende en ny søknad. Den nye søknaden blir fylt ut med
                    svarene dine fra forrige søknad, og du må endre minst ett svar for å kunne sende den inn.
                </BodyLong>
                <EttersendOpplysninger />
            </Alert>
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
                        <Oppsummeringsfelt key={felt} feltNavn={SVARFELT_NAVN[felt]} feltVerdi={tekst} />
                    );
                })}
            </VStack>
        </Step>
    );
}
