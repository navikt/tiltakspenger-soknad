import React, { MouseEvent } from 'react';
import { Button, ConfirmationPanel, GuidePanel, Link } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import Accordion from '@/components/accordion/Accordion';
import { useTranslation } from 'next-i18next';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSidePropsContext} from "next";
import {onLanguageSelect} from "@navikt/nav-dekoratoren-moduler";

export default function App() {
    const router = useRouter();
    const { pathname, asPath, query } = router;
    const { t } = useTranslation('common', {keyPrefix: 'index'});

    const [markerBekreftelsesboksSomRød, setMarkerBekreftelsesboksSomRød] = React.useState(false);
    const [brukerHarBekreftet, setBrukerHarBekreftet] = React.useState(false);
    const [test, setTest] = React.useState();

    React.useEffect(() => {
        if (brukerHarBekreftet && markerBekreftelsesboksSomRød) {
            setMarkerBekreftelsesboksSomRød(false);
        }
    }, [brukerHarBekreftet]);

    const settSpråkvariant = (locale: string) => {
        router.push({ pathname, query }, asPath, { locale: locale });
    }

    onLanguageSelect((language) => {
        settSpråkvariant(language.locale)
    });

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
            <h2 className={styles.søknadstittel}>{t('søknadstittel')}</h2>
            <GuidePanel poster>
                <p>{t('veiledning.p1')}</p>
                <p>{t('veiledning.p2')}</p>
                <p>{t('veiledning.p3')}</p>
            </GuidePanel>
            <div className={styles.accordions}>
                <Accordion header={t('nedtrekk1.header')}>
                    <span>{t('nedtrekk1.span1')}</span>
                    <ul>
                        <li>{t('nedtrekk1.li1')}</li>
                        <li>{t('nedtrekk1.li2')}</li>
                    </ul>
                    <span>{t('nedtrekk1.span2')}</span>
                </Accordion>
                <Accordion header={t('nedtrekk2.header')}>
                    <ul>
                        <li>{t('nedtrekk2.li1')}</li>
                        <li>{t('nedtrekk2.li2')}</li>
                        <li>{t('nedtrekk2.li3')}</li>
                        <li>{t('nedtrekk2.li3')}</li>
                    </ul>
                </Accordion>
                <Accordion header={t('nedtrekk3.header')}>
                    <p>{t('nedtrekk3.p1')}</p>
                    <ul>
                        <li>{t('nedtrekk3.li1')}</li>
                        <li>{t('nedtrekk3.li2')}</li>
                        <li>{t('nedtrekk3.li3')}</li>
                        <li>{t('nedtrekk3.li4')}</li>
                        <li>{t('nedtrekk3.li5')}</li>
                        <li>{t('nedtrekk3.li6')}</li>
                    </ul>
                    <p>{t('nedtrekk3.p2')}</p>
                    <p>{t('nedtrekk3.p3')}</p>
                    <Link
                        href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten"
                        target="_blank"
                    >{t('nedtrekk3.link')}</Link>
                </Accordion>
            </div>
            <ConfirmationPanel
                className={styles.bekreftelsespanel}
                label={t('bekreftelse.label')}
                value={brukerHarBekreftet}
                onChange={() => setBrukerHarBekreftet(!brukerHarBekreftet)}
                error={
                    markerBekreftelsesboksSomRød
                        ? t('bekreftelse.error')
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
                <Button onClick={sendSøknad}>Test Søknad</Button>
            </div>
        </div>
    );
}

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => ({
    props: {
        ...await serverSideTranslations(locale ?? 'nb', ['common'])
    },
})

