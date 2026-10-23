import React, { useState } from 'react';
import { Alert, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import {
    DEMO_SESJON_COOKIE,
    DEMO_TIDLIGERE_SØKNAD_COOKIE,
    DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE,
    DemoResultat,
} from '@/mocks/demo';
import styles from './Demovalg.module.css';

interface DemovalgProps {
    medTidligereSøknad: boolean;
    resultat: DemoResultat;
}

const RESULTATVALG: { verdi: DemoResultat; tekst: string }[] = [
    { verdi: 'UNDER_BEHANDLING', tekst: 'Under behandling' },
    { verdi: 'INNVILGELSE', tekst: 'Innvilget' },
    { verdi: 'AVSLAG', tekst: 'Avslått' },
    { verdi: 'AVBRUTT', tekst: 'Avbrutt' },
];

function settCookie(navn: string, verdi: string) {
    document.cookie = `${navn}=${verdi}; path=/; SameSite=Lax`;
    // Starter demoen på nytt, uten søknadene som er sendt inn så langt.
    document.cookie = `${DEMO_SESJON_COOKIE}=; path=/; Max-Age=0`;
}

/** Lar den som prøver demoen velge om brukeren har sendt inn en søknad tidligere, og hvordan den er behandlet. */
export default function Demovalg({ medTidligereSøknad, resultat }: DemovalgProps) {
    const [valgt, setValgt] = useState(medTidligereSøknad);
    const [valgtResultat, setValgtResultat] = useState(resultat);

    const velg = (verdi: boolean) => {
        settCookie(DEMO_TIDLIGERE_SØKNAD_COOKIE, String(verdi));
        setValgt(verdi);
    };

    const velgResultat = (verdi: DemoResultat) => {
        settCookie(DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE, verdi);
        setValgtResultat(verdi);
    };

    return (
        <Alert variant="info" className={styles.demovalg}>
            <VStack gap="space-16">
                <RadioGroup
                    legend="Demo: Har brukeren sendt inn en søknad tidligere?"
                    description="Gjelder tiltaket «Avklaring hos Testarrangør D». Søknader du sender inn i demoen, blir husket, så du kan prøve å sende dem på nytt. Et nytt valg glemmer dem."
                    value={String(valgt)}
                    onChange={(verdi: string) => velg(verdi === 'true')}
                    size="small"
                    className={styles.radioGroup}
                >
                    <Radio value="false">Nei</Radio>
                    <Radio value="true">Ja</Radio>
                </RadioGroup>
                {valgt && (
                    <RadioGroup
                        legend="Demo: Hva er resultatet av behandlingen?"
                        description="En søknad som er ferdig behandlet eller avbrutt, kan sendes inn på nytt med de samme svarene."
                        value={valgtResultat}
                        onChange={velgResultat}
                        size="small"
                    >
                        {RESULTATVALG.map(({ verdi, tekst }) => (
                            <Radio key={verdi} value={verdi}>
                                {tekst}
                            </Radio>
                        ))}
                    </RadioGroup>
                )}
            </VStack>
        </Alert>
    );
}
