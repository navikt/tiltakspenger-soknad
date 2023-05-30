import React, { MouseEvent } from 'react';
import {Accordion, Button, ConfirmationPanel, GuidePanel, Link} from '@navikt/ds-react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import {ExternalLinkIcon} from "@navikt/aksel-icons";

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
        fetch('/api/soknad', {
            method: 'POST',
            body:
                '{\n' +
                '  "deltarIKvp": true,\n' +
                '  "periodeMedKvp": {\n' +
                '    "fra": "2023-01-01",\n' +
                '    "til": "2023-01-02"\n' +
                '  },\n' +
                '  "deltarIIntroprogrammet": true,\n' +
                '  "periodeMedIntroprogrammet": {\n' +
                '    "fra": "2024-01-01",\n' +
                '    "til": "2024-01-02"\n' +
                '  },\n' +
                '  "borPåInstitusjon": true,\n' +
                '  "institusjonstype": "fengsel",\n' +
                '  "tiltak": {\n' +
                '    "type": "foo",\n' +
                '    "periode": {\n' +
                '      "fra": "2025-01-01",\n' +
                '      "til": "2025-01-02"\n' +
                '    },\n' +
                '    "antallDagerIUken": 5\n' +
                '  },\n' +
                '  "mottarEllerSøktPensjonsordning": true,\n' +
                '  "pensjon": {\n' +
                '    "utbetaler": "Noen som betaler ut pensjon",\n' +
                '    "periode": {\n' +
                '      "fra": "2026-01-01",\n' +
                '      "til": "2026-01-02"\n' +
                '    }\n' +
                '  },\n' +
                '  "mottarEllerSøktEtterlønn": true,\n' +
                '  "etterlønn": {\n' +
                '    "utbetaler": "Noen som betaler ut pensjon",\n' +
                '    "periode": {\n' +
                '      "fra": "2027-01-01",\n' +
                '      "til": "2027-01-02"\n' +
                '    }\n' +
                '  },\n' +
                '  "søkerOmBarnetillegg": true,\n' +
                '  "barnSøktBarnetilleggFor": [\n' +
                '    {\n' +
                '      "fornavn": "Anna",\n' +
                '      "etternavn": "Filledokke",\n' +
                '      "fdato": "2020-05-05",\n' +
                '      "bostedsland": "NO"\n' +
                '    },\n' +
                '    {\n' +
                '      "fornavn": "Titten",\n' +
                '      "etternavn": "Tei",\n' +
                '      "fdato": "2018-04-09",\n' +
                '      "bostedsland": "NO"\n' +
                '    }\n' +
                '  ]\n' +
                '}',
        })
            .then((value) => value.blob())
            .then((value) => {
                setTest(value as any);
            });
    };

    return (
        <div>
            <h2 className={styles.søknadstittel}>Søknad om tiltakspenger</h2>
            <GuidePanel poster>
                <p>Hei! Jeg er her for å veilede deg gjennom søknaden.</p>
                <p>Du kan ha rett til tiltakspenger hvis du deltar i et arbeidsmarkedstiltak som NAV har godkjent.</p>
                <Link href="" target="_blank">Du kan kontakte oss om du ikke forstår spørsmålene <ExternalLinkIcon title="Åpne link i ny fane" /></Link>
            </GuidePanel>
            <div className={styles.accordions}>
                <Accordion>
                    <Accordion.Item>
                        <Accordion.Header>Tiltakspenger og annen inntekt</Accordion.Header>
                        <Accordion.Content>
                            <span>Du kan ikke få tiltakspenger hvis:</span>
                            <ul>
                                <li>du får annen pengestøtte som helt eller delvis skal dekke dine daglige utgifter </li>
                                <li>du har en jobb som hindrer deg i å delta på tiltaket</li>
                                <li>jobben du får lønn for er en del av tiltaket</li>
                            </ul>
                            <span>Det har ikke betydning hvor mye du får i annen pengestøtte eller lønn.</span>
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>Hvis du får tiltakspenger, gjelder dette</Accordion.Header>
                        <Accordion.Content>
                            <span>Hvir du får tiltakspenger må du:</span>
                            <ul>
                                <li>Møte som avtalt i tiltaket</li>
                                <li>Sende inn meldekortet ditt hver 14. dag</li>
                                <li>Gi beskjed hvis situasjonen din endrer seg</li>
                                <li>Betale tilbake hvis du får tiltakspenger du ikke har rett på</li>
                            </ul>


                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>Vi henter og bruker informasjon om deg</Accordion.Header>
                        <Accordion.Content>
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
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
            </div>
            <ConfirmationPanel
                className={styles.bekreftelsespanel}
                label="Jeg vil svare så godt jeg kan på spørsmålene i søknaden"
                value={brukerHarBekreftet}
                checked={brukerHarBekreftet}
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
                    size="medium"
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
                    size="medium"
                >
                    Start søknaden
                </Button>
                <Button onClick={sendSøknad}>Test Søknad</Button>
            </div>
        </div>
    );
}
