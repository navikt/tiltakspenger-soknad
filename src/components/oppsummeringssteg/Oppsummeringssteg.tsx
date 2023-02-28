import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, Button, ConfirmationPanel, GuidePanel } from '@navikt/ds-react';
import Steg from '@/components/steg/Steg';
import styles from './../steg/Steg.module.css';

interface OppsummeringsstegProps {
    onCompleted: (data: any) => void;
    onGoToPreviousStep: () => void;
}

export default function Oppsummeringssteg({ onCompleted, onGoToPreviousStep }: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const data = getValues();
    return (
        <Steg
            tittel="Oppsummering"
            onCompleted={() => onCompleted(data)}
            onGoToPreviousStep={onGoToPreviousStep}
            stepNumber={5}
            submitSectionRenderer={() => (
                <div className={styles.steg__knappeseksjon}>
                    <Button type="button" onClick={onGoToPreviousStep} size="small" variant="secondary">
                        Forrige steg
                    </Button>
                    <Button type="button" onClick={onCompleted} size="small" style={{ marginLeft: '1rem' }}>
                        Send inn søknad
                    </Button>
                </div>
            )}
        >
            <GuidePanel poster>
                Her kan du se over at alt er riktig, og ved behov endre opplysninger, før du sender inn søknaden
            </GuidePanel>
            <Accordion style={{ marginTop: '2rem' }}>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Innledningsspørsmål</Accordion.Header>
                    <Accordion.Content>
                        {data.deltarIKvp === false && (
                            <p>Nei, jeg deltar ikke i kvalifiseringsprogrammet i perioden jeg deltar på tiltaket</p>
                        )}
                        {data.deltarIKvp === true && (
                            <p>Ja, jeg deltar i kvalifiseringsprogrammet i perioden jeg deltar på tiltaket</p>
                        )}
                        {data.deltarIIntroprogrammet === false && (
                            <p>Nei, jeg deltar ikke i introduksjonsprogrammet i perioden jeg deltar på tiltaket</p>
                        )}
                        {data.deltarIIntroprogrammet === true && (
                            <p>Ja, jeg deltar i introduksjonsprogrammet i perioden jeg deltar på tiltaket</p>
                        )}
                        {data.borPåInstitusjon === false && (
                            <p>
                                Nei, jeg bor ikke på institusjon med fri kost og losji i perioden jeg deltar på tiltaket
                            </p>
                        )}
                        {data.borPåInstitusjon === true && (
                            <p>Ja, jeg bor på institusjon med fri kost og losji i perioden jeg deltar på tiltaket</p>
                        )}
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tiltak</Accordion.Header>
                    <Accordion.Content>Test</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Andre utbetalinger</Accordion.Header>
                    <Accordion.Content>Test</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Barnetillegg</Accordion.Header>
                    <Accordion.Content>Test</Accordion.Content>
                </Accordion.Item>
            </Accordion>
            <ConfirmationPanel
                label="Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte"
                style={{ marginTop: '2rem' }}
            >
                <b>Vi stoler på deg</b>
            </ConfirmationPanel>
        </Steg>
    );
}
