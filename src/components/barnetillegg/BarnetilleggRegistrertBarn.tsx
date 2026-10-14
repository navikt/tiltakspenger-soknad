import { Barn } from '@/types/Barn';
import React from 'react';
import styles from './Barnetillegg.module.css';
import { formatDate } from '@/utils/formatDate';
import { visningsnavnForBarn } from '@/utils/barnetsNavn';
import BostedSpørsmål, { navnPåBarnet } from '@/components/barnetillegg/BostedSpørsmål';

interface BarnetilleggRegistrertBarnProps {
    barn: Barn;
}

export default function BarnetilleggRegistrertBarn({ barn }: BarnetilleggRegistrertBarnProps) {
    const { fødselsdato, uuid } = barn;
    return (
        <div className={styles.barnetillegg}>
            <p>
                <strong>Navn:</strong> {visningsnavnForBarn(barn)}
            </p>
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
