import React, { ReactNode } from 'react';
import { Tag } from '@navikt/ds-react';
import styles from './Oppsumeringsfelt.module.css';

interface OppsummeringsfeltProps {
    feltNavn: string;
    feltVerdi: ReactNode;
    /** Svaret i forrige søknad, når det er endret. */
    forrigeVerdi?: ReactNode;
}

const Oppsummeringsfelt = ({ feltNavn, feltVerdi, forrigeVerdi }: OppsummeringsfeltProps) => {
    return (
        <div className={styles.oppsummeringsfelt}>
            <b className={styles.oppsummeringsfelt__feltNavn}>
                {feltNavn}
                {forrigeVerdi !== undefined && (
                    <Tag variant="info" size="xsmall" className={styles.oppsummeringsfelt__endret}>
                        Endret
                    </Tag>
                )}
            </b>
            <div>{feltVerdi}</div>
            {forrigeVerdi !== undefined && (
                <div className={styles.oppsummeringsfelt__forrigeVerdi}>Forrige svar: {forrigeVerdi}</div>
            )}
        </div>
    );
};

export default Oppsummeringsfelt;
