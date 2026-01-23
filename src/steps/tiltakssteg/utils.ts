import { Tiltak } from '@/types/Tiltak';
import { formatDate } from '@/utils/formatDate';
import { formatPeriode } from '@/utils/formatPeriode';

export const lagTiltaksalternativTekst = (tiltak: Tiltak) => {
    const { arenaRegistrertPeriode } = tiltak;
    const tiltaksbeskrivelse = lagTiltakVisningTekst(tiltak);
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

export const lagTiltakVisningTekst = ({ visningsnavn, typeNavn, arrangør }: Tiltak) => {
    const alternativtNavn = arrangør ? `${typeNavn} - ${arrangør}` : typeNavn;
    return visningsnavn ? visningsnavn : alternativtNavn;
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
