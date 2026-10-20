import React from 'react';
import { List } from '@navikt/ds-react';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { barnSøktBarnetilleggFor } from '@/utils/svaroppsummering';
import styles from './BarnetilleggSvar.module.css';

/** Svaret på barnetillegg i en innsendt søknad, med barna det er søkt for som en liste. */
export default function BarnetilleggSvar({ svar }: { svar: InnsendteSvar }) {
    const barn = barnSøktBarnetilleggFor(svar);
    if (!barn) {
        return <>Jeg søker ikke om barnetillegg</>;
    }
    return (
        <>
            Jeg søker om barnetillegg for:
            <List as="ul" className={styles.liste}>
                {barn.map((tekst) => (
                    <List.Item key={tekst}>{tekst}</List.Item>
                ))}
            </List>
        </>
    );
}
