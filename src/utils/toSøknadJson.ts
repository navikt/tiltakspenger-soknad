import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
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

function periodeMedKvp({ deltarIKvp, periodeMedKvp }: Spørsmålsbesvarelser) {
    if (deltarIKvp) {
        return formatPeriod(periodeMedKvp as Periode);
    }
    return null;
}

function periodeMedIntro({ deltarIIntroprogrammet, periodeMedIntroprogrammet }: Spørsmålsbesvarelser) {
    if (deltarIIntroprogrammet) {
        return formatPeriod(periodeMedIntroprogrammet as Periode);
    }
    return null;
}

function pensjon({ mottarEllerSøktPensjonsordning, pensjon }: Spørsmålsbesvarelser) {
    if (mottarEllerSøktPensjonsordning) {
        return { ...pensjon, periode: formatPeriod(pensjon.periode) };
    }
    return pensjon;
}

function etterlønn({ mottarEllerSøktEtterlønn, etterlønn }: Spørsmålsbesvarelser) {
    if (mottarEllerSøktEtterlønn) {
        return { ...etterlønn, periode: formatPeriod(etterlønn.periode) };
    }
    return etterlønn;
}

function barnSøktBarnetilleggFor({ manueltRegistrerteBarnSøktBarnetilleggFor }: Spørsmålsbesvarelser) {
    return manueltRegistrerteBarnSøktBarnetilleggFor
        .filter(
            ({ fornavn, etternavn, fødselsdato, bostedsland }) => fornavn && etternavn && fødselsdato && bostedsland
        )
        .map((barn) => ({
            ...barn,
            fdato: formatDate(barn.fødselsdato),
        }));
}

export default function toSøknadJson(søknad: Spørsmålsbesvarelser): String {
    return JSON.stringify({
        ...søknad,
        periodeMedKvp: periodeMedKvp(søknad),
        periodeMedIntroprogrammet: periodeMedIntro(søknad),
        barnSøktBarnetilleggFor: barnSøktBarnetilleggFor(søknad),
        pensjon: pensjon(søknad),
        etterlønn: etterlønn(søknad),
    });
}
