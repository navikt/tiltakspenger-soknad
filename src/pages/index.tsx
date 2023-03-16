import React, { MouseEvent } from 'react';
import { Button, ConfirmationPanel, GuidePanel, Link } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import Accordion from '@/components/accordion/Accordion';

export default function App() {
    const router = useRouter();

    const [markerBekreftelsesboksSomRød, setMarkerBekreftelsesboksSomRød] = React.useState(false);
    const [brukerHarBekreftet, setBrukerHarBekreftet] = React.useState(false);
    const [test, setTest] = React.useState();

    React.useEffect(() => {
        if (brukerHarBekreftet && markerBekreftelsesboksSomRød) {
            setMarkerBekreftelsesboksSomRød(false);
        }
    }, [brukerHarBekreftet]);

    const startSøknad = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/utfylling/tiltak');
    };

    const sendSøknad = () => {
        fetch("/api/soknad", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                    "deltarIKvp": true,
                    "periodeMedKvp": {
                        "fra": "2023-01-01",
                        "til": "2023-01-02"
                    },
                    "deltarIIntroprogrammet": true,
                    "periodeMedIntroprogrammet": {
                        "fra": "2024-01-01",
                        "til": "2024-01-02"
                    },
                    "borPåInstitusjon": true,
                    "institusjonstype" : "fengsel",
                    "tiltak": {
                        "type": "foo",
                        "periode": {
                            "fra": "2025-01-01",
                            "til": "2025-01-02"
                        },
                        "antallDagerIUken": 5
                    },
                    "mottarEllerSøktPensjonsordning": true,
                    "pensjon": {
                        "utbetaler": "Noen som betaler ut pensjon",
                        "periode": {
                            "fra": "2026-01-01",
                            "til": "2026-01-02"
                        }
                    },
                    "mottarEllerSøktEtterlønn": true,
                    "etterlønn": {
                        "utbetaler": "Noen som betaler ut pensjon",
                        "periode": {
                            "fra": "2027-01-01",
                            "til": "2027-01-02"
                        }
                    },
                    "søkerOmBarnetillegg": true,
                    "barnSøktBarnetilleggFor": [
                        {
                            "fornavn": "Anna",
                            "etternavn": "Filledokke",
                            "fdato": "2020-05-05",
                            "bostedsland": "NO"
                        },
                        {
                            "fornavn": "Titten",
                            "etternavn": "Tei",
                            "fdato": "2018-04-09",
                            "bostedsland": "NO"
                        }
                    ]
                }
            ),
        }).then( value =>
            value.blob()
        ).then( value => {
            setTest(value as any)
                console.log(test)
        }

        )
    }

    return (
        <div>
            <h2 className={styles.søknadstittel}>Søknad om tiltakspenger</h2>
            <GuidePanel poster>
                <p>Hei! Jeg er her for å veilede deg gjennom søknaden.</p>
                <p>Du kan ha rett til tiltakspenger hvis du deltar i et arbeidsmarkedstiltak som NAV har godkjent.</p>
                <p>
                    OBS: Hvis du tar pause på mer enn X minutter, slettes skjemaet på grunn av sikkerhetsinnstillinger.
                </p>
            </GuidePanel>
            <div className={styles.accordions}>
                <Accordion header="Tiltakspenger og annen inntekt">
                    <span>Du kan ikke få tiltakspenger hvis du</span>
                    <ul>
                        <li>får annen pengestøtte som helt eller delvis skal dekke dine daglige utgifter</li>
                        <li>får lønn samtidig som du deltar i tiltaket</li>
                    </ul>
                    <span>Det har ikke betydning hvor mye du får i annen pengestøtte eller lønn.</span>
                </Accordion>
                <Accordion header="Hvis du får tiltakspenger, gjelder dette">
                    <ul>
                        <li>Du må møte som avtalt i tiltaket</li>
                        <li>Du må sende inn meldekortet ditt hver 14. dag</li>
                        <li>Du må gi beskjed hvis situasjonen din endrer seg</li>
                        <li>Du må betale tilbake hvis du får tiltakspenger du ikke har rett på</li>
                    </ul>
                </Accordion>
                <Accordion header="Vi henter og bruker informasjon om deg">
                    <p>I tillegg til den informasjonen du oppgir i søknaden, henter vi:</p>
                    <ul>
                        <li>Personinformasjon om deg fra Folkeregisteret.</li>
                        <li>Personinformasjon om barna dine hvis du søker om barnetillegg</li>
                        <li>Inntektsinformasjon fra Skatteetaten</li>
                        <li>Opplysninger om hvilket arbeidsmarkedstiltak du deltar på</li>
                        <li>Opplysninger om du får andre utbetalinger fra NAV</li>
                        <li>Hvis du har barn, sjekker vi om barnets andre forelder har barnetillegg</li>
                    </ul>
                    <p>Dette gjør vi for å vurdere om du har rett til tiltakspenger.</p>
                    <p>
                        Vi deler opplysninger om hva du får utbetalt i tiltakspenger med Skatteetaten og Statistisk
                        sentralbyrå. Vi kan bruke opplysninger om deg til å forbedre våre tjenester.
                    </p>
                    <Link
                        href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten"
                        target="_blank"
                    >
                        Du kan lese mer om hvordan NAV behandler personopplysninger på nav.no (åpnes i ny fane).
                    </Link>
                </Accordion>
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
                <Button
                    onClick={sendSøknad}
                >
                    Test Søknad
                </Button>
            </div>
        </div>
    );
}
