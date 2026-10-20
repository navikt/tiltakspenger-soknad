import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Svarfelt } from '@/utils/svaroppsummering';
import { useForrigeSøknad } from '@/components/forrige-svar/useForrigeSøknad';
import styles from './ForrigeSvar.module.css';

/** Viser hva bruker svarte på spørsmålet i forrige søknad for tiltaket, slik at det er lett å se hva som er endret. */
export default function ForrigeSvar({ felt }: { felt: Svarfelt }) {
    const forrige = useForrigeSøknad();
    const tekst = forrige?.kortSvar[felt];
    if (tekst === undefined) {
        return null;
    }
    return (
        <BodyShort size="small" className={styles.forrigeSvar}>
            <b>Svaret ditt i forrige søknad:</b> {tekst}
        </BodyShort>
    );
}
