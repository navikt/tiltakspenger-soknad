import React from 'react';
import { Tag } from '@navikt/ds-react';
import styles from './Oppsumeringsfelt.module.css';

interface OppsummeringsfeltProps {
    feltNavn: string;
    feltVerdi: string;
    /** Svaret i forrige søknad, når det er endret. */
    forrigeVerdi?: string;
}

const Oppsummeringsfelt = ({ feltNavn, feltVerdi, forrigeVerdi }: OppsummeringsfeltProps) => {
    return (
        <p className={styles.oppsummeringsfelt}>
            <b className={styles.oppsummeringsfelt__feltNavn}>
                {feltNavn}
                {forrigeVerdi !== undefined && (
                    <Tag variant="info" size="xsmall" className={styles.oppsummeringsfelt__endret}>
                        Endret
                    </Tag>
                )}
            </b>
            <span>{feltVerdi}</span>
            {forrigeVerdi !== undefined && (
                <span className={styles.oppsummeringsfelt__forrigeVerdi}>Forrige svar: {forrigeVerdi}</span>
            )}
        </p>
    );
};

export default Oppsummeringsfelt;
