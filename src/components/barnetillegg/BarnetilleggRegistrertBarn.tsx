import { Barn } from '@/types/Barn';
import React from 'react';
import styles from './Barnetillegg.module.css';
import { formatDate } from '@/utils/formatDate';
import BostedSpørsmål, { navnPåBarnet } from '@/components/barnetillegg/BostedSpørsmål';

interface BarnetilleggRegistrertBarnProps {
    barn: Barn;
}

export default function BarnetilleggRegistrertBarn({ barn }: BarnetilleggRegistrertBarnProps) {
    const { fødselsdato, fornavn, etternavn, mellomnavn, uuid } = barn;
    return (
        <div className={styles.barnetillegg}>
            {fornavn && (
                <p>
                    <strong>Navn:</strong> {fornavn} {mellomnavn} {etternavn}
                </p>
            )}
            <p>
                <strong>Fødselsdato:</strong> {formatDate(fødselsdato)}
            </p>
            <BostedSpørsmål
                barnetsNavn={navnPåBarnet(barn)}
                borINorgeName={`svar.barnetillegg.bostedForBarnFraFolkeregisteret.${uuid}.borINorge`}
                borIEøsName={`svar.barnetillegg.bostedForBarnFraFolkeregisteret.${uuid}.borIEøs`}
            />
        </div>
    );
}
