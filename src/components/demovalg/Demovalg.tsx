import React, { useState } from 'react';
import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import { DEMO_SESJON_COOKIE, DEMO_TIDLIGERE_SØKNAD_COOKIE } from '@/mocks/demo';
import styles from './Demovalg.module.css';

interface DemovalgProps {
    medTidligereSøknad: boolean;
}

/** Lar den som prøver demoen velge om brukeren har sendt inn en søknad tidligere. */
export default function Demovalg({ medTidligereSøknad }: DemovalgProps) {
    const [valgt, setValgt] = useState(medTidligereSøknad);

    const velg = (verdi: boolean) => {
        document.cookie = `${DEMO_TIDLIGERE_SØKNAD_COOKIE}=${verdi}; path=/; SameSite=Lax`;
        // Starter demoen på nytt, uten søknadene som er sendt inn så langt.
        document.cookie = `${DEMO_SESJON_COOKIE}=; path=/; Max-Age=0`;
        setValgt(verdi);
    };

    return (
        <Alert variant="info" className={styles.demovalg}>
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
        </Alert>
    );
}
