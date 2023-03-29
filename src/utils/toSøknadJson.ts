import Søknad from '@/types/Søknad';
import dayjs from 'dayjs';

interface Periode {
    fra: string;
    til: string;
}

function formatDate(dateString: string) {
    return dayjs(dateString).format('YYYY-MM-DD');
}

function formatPeriod(period: Periode): Periode {
    return {
        fra: formatDate(period.fra),
        til: formatDate(period.til),
    };
}

function periodeMedKvp({ deltarIKvp, periodeMedKvp }: Søknad) {
    if (deltarIKvp) {
        return formatPeriod(periodeMedKvp as Periode);
    }
    return null;
}

function periodeMedIntro({ deltarIIntroprogrammet, periodeMedIntroprogrammet }: Søknad) {
    if (deltarIIntroprogrammet) {
        return formatPeriod(periodeMedIntroprogrammet as Periode);
    }
    return null;
}

function tiltak({ tiltak: { periode, ...rest } }: Søknad) {
    return {
        ...rest,
        periode: formatPeriod(periode),
    };
}

function pensjon({ mottarEllerSøktPensjonsordning, pensjon }: Søknad) {
    if (mottarEllerSøktPensjonsordning) {
        return { ...pensjon, periode: formatPeriod(pensjon.periode) };
    }
    return pensjon;
}

function etterlønn({ mottarEllerSøktEtterlønn, etterlønn }: Søknad) {
    if (mottarEllerSøktEtterlønn) {
        return { ...etterlønn, periode: formatPeriod(etterlønn.periode) };
    }
    return etterlønn;
}

function barnSøktBarnetilleggFor({ barnSøktBarnetilleggFor }: Søknad) {
    return barnSøktBarnetilleggFor
        .filter(({ fornavn, etternavn, fdato, bostedsland }) => fornavn && etternavn && fdato && bostedsland)
        .map((barn) => ({
            ...barn,
            fdato: formatDate(barn.fdato),
        }));
}

export default function toSøknadJson(søknad: Søknad): String {
    return JSON.stringify({
        ...søknad,
        periodeMedKvp: periodeMedKvp(søknad),
        periodeMedIntroprogrammet: periodeMedIntro(søknad),
        tiltak: tiltak(søknad),
        barnSøktBarnetilleggFor: barnSøktBarnetilleggFor(søknad),
        pensjon: pensjon(søknad),
        etterlønn: etterlønn(søknad),
    });
}
