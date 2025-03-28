import { Tiltak } from '@/types/Tiltak';
import { formatDate } from '@/utils/formatDate';
import { formatPeriode } from '@/utils/formatPeriode';

export const lagTiltaksalternativTekst = ({ typeNavn, arrangør, arenaRegistrertPeriode }: Tiltak) => {
    const tiltaksbeskrivelse = arrangør ? `${typeNavn} - ${arrangør}` : typeNavn;
    if (arenaRegistrertPeriode?.fra && !arenaRegistrertPeriode?.til) {
        return `${tiltaksbeskrivelse}. Startdato: ${formatDate(arenaRegistrertPeriode!.fra)}`;
    }
    if (!arenaRegistrertPeriode?.fra && arenaRegistrertPeriode?.til) {
        return `${tiltaksbeskrivelse}. Sluttdato: ${formatDate(arenaRegistrertPeriode!.fra)}`;
    }
    if (arenaRegistrertPeriode?.fra && arenaRegistrertPeriode?.til) {
        return `${tiltaksbeskrivelse}. Periode: ${formatPeriode(arenaRegistrertPeriode!)}`;
    }
    return tiltaksbeskrivelse;
};

export const lagSvaralternativForTiltak = (tiltak: Tiltak) => {
    return {
        tekst: lagTiltaksalternativTekst(tiltak),
        value: tiltak.aktivitetId,
    };
};

export const harFullstendigPeriode = (tiltak: Tiltak) => {
    return !!tiltak.arenaRegistrertPeriode?.fra && !!tiltak.arenaRegistrertPeriode?.til;
};
