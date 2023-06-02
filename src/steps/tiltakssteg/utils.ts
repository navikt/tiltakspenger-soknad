import { Tiltak } from '@/types/Tiltak';
import { formatDate } from '@/utils/formatDate';
import { formatPeriode } from '@/utils/formatPeriode';

export const lagTiltaksalternativTekst = ({ typeNavn, arrangør, arenaRegistrertPeriode }: Tiltak) => {
    const tiltakstypeOgArrangør = `${typeNavn} - ${arrangør}`;
    if (arenaRegistrertPeriode?.fra && !arenaRegistrertPeriode?.til) {
        return `${tiltakstypeOgArrangør}. Startdato: ${formatDate(arenaRegistrertPeriode!.fra)}`;
    }
    if (arenaRegistrertPeriode?.fra && arenaRegistrertPeriode?.til) {
        return `${tiltakstypeOgArrangør}. Periode: ${formatPeriode(arenaRegistrertPeriode!)}`;
    }
    return tiltakstypeOgArrangør;
};

export const lagSvaralternativForTiltak = (tiltak: Tiltak) => {
    return {
        tekst: lagTiltaksalternativTekst(tiltak),
        value: tiltak.aktivitetId,
    };
};
