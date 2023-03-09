import React, { MouseEvent } from 'react';
import { Button, ConfirmationPanel, GuidePanel } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import Accordion from '@/components/accordion/Accordion';

export default function App() {
    const router = useRouter();

    const [markerBekreftelsesboksSomRød, setMarkerBekreftelsesboksSomRød] = React.useState(false);
    const [brukerHarBekreftet, setBrukerHarBekreftet] = React.useState(false);

    React.useEffect(() => {
        if (brukerHarBekreftet && markerBekreftelsesboksSomRød) {
            setMarkerBekreftelsesboksSomRød(false);
        }
    }, [brukerHarBekreftet]);

    const startSøknad = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/utfylling/innledning');
    };

    return (
        <div>
            <h2 className={styles.søknadstittel}>Søknad om tiltakspenger</h2>
            <GuidePanel poster>Hei! Jeg er her for å veilede deg gjennom søknaden om tiltakspenger.</GuidePanel>
            <div className={styles.accordions}>
                <Accordion header="Placeholder Accordion 1">Placeholder innhold 1</Accordion>
                <Accordion header="Placeholder Accordion 2">Placeholder innhold 2</Accordion>
            </div>
            <ConfirmationPanel
                className={styles.bekreftelsespanel}
                label="Jeg vil svare så godt jeg kan på spørsmålene i søknaden"
                value={brukerHarBekreftet}
                onChange={() => setBrukerHarBekreftet(!brukerHarBekreftet)}
                error={
                    markerBekreftelsesboksSomRød
                        ? 'Du må bekrefte at du vil svare så godt du kan på spørsmålene i søknaden'
                        : null
                }
            >
                <b>Vi stoler på deg</b>
            </ConfirmationPanel>
            <div className={styles.knappeseksjon}>
                <Button
                    onClick={() => console.log('Hva skal vi gjøre når bruker avbryter søknaden?')}
                    type="button"
                    size="small"
                    variant="secondary"
                >
                    Avbryt søknaden
                </Button>
                <Button
                    onClick={(event) => {
                        if (brukerHarBekreftet) startSøknad(event);
                        else setMarkerBekreftelsesboksSomRød(true);
                    }}
                    type="button"
                    size="small"
                >
                    Start søknaden
                </Button>
            </div>
        </div>
    );
}
