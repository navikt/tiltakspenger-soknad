import React from 'react';
import styles from './Oppsumeringsfelt.module.css';

interface OppsummeringsfeltProps {
    feltNavn: string;
    feltVerdi: string;
}

const Oppsummeringsfelt = ({ feltNavn, feltVerdi }: OppsummeringsfeltProps) => {
    return (
        <p className={styles.oppsummeringsfelt}>
            <b className={styles.oppsummeringsfelt__feltNavn}>{feltNavn}</b>
            <span>{feltVerdi}</span>
        </p>
    );
};

export default Oppsummeringsfelt;
