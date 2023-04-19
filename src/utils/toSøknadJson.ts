import Spørsmålsbesvarelser, {
    Barnetillegg,
    Etterlønn,
    Institusjonsopphold,
    Introduksjonsprogram,
    Kvalifiseringsprogram,
    Pensjonsordning,
} from '@/types/Spørsmålsbesvarelser';
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

function kvalifiseringsprogram({ deltar, periode }: Kvalifiseringsprogram) {
    if (deltar) {
        return { deltar, periode: formatPeriod(periode as Periode) };
    }
    return { deltar };
}

function introduksjonsprogram({ deltar, periode }: Introduksjonsprogram) {
    if (deltar) {
        return { deltar, periode: formatPeriod(periode as Periode) };
    }
    return { deltar };
}

function pensjon(pensjonsornding: Pensjonsordning) {
    const { mottarEllerSøktPensjonsordning, periode, utbetaler } = pensjonsornding;
    if (mottarEllerSøktPensjonsordning) {
        return { utbetaler, mottarEllerSøktPensjonsordning, periode: formatPeriod(periode) };
    }
    return pensjonsornding;
}

function etterlønn(etterlønn: Etterlønn) {
    const { periode, mottarEllerSøktEtterlønn, utbetaler } = etterlønn;
    if (mottarEllerSøktEtterlønn) {
        return { mottarEllerSøktEtterlønn, utbetaler, periode: formatPeriod(periode) };
    }
    return etterlønn;
}

function institusjon(institusjonsopphold: Institusjonsopphold) {
    const { periode, borPåInstitusjon } = institusjonsopphold;
    if (borPåInstitusjon) {
        return { borPåInstitusjon, periode: formatPeriod(periode!) };
    }
    return institusjonsopphold;
}

function barnSøktBarnetilleggFor({ manueltRegistrerteBarnSøktBarnetilleggFor }: Barnetillegg) {
    return manueltRegistrerteBarnSøktBarnetilleggFor
        .filter(
            ({ fornavn, etternavn, fødselsdato, bostedsland }) => fornavn && etternavn && fødselsdato && bostedsland
        )
        .map((barn) => ({
            ...barn,
            fdato: formatDate(barn.fødselsdato),
        }));
}

export default function toSøknadJson(spørsmålsbesvarelser: Spørsmålsbesvarelser): String {
    return JSON.stringify({
        ...spørsmålsbesvarelser,
        kvalifiseringsprogram: kvalifiseringsprogram(spørsmålsbesvarelser.kvalifiseringsprogram),
        introduksjonsprogram: introduksjonsprogram(spørsmålsbesvarelser.introduksjonsprogram),
        barnetillegg: barnSøktBarnetilleggFor(spørsmålsbesvarelser.barnetillegg),
        pensjonsordning: pensjon(spørsmålsbesvarelser.pensjonsordning),
        etterlønn: etterlønn(spørsmålsbesvarelser.etterlønn),
        institusjonsopphold: institusjon(spørsmålsbesvarelser.institusjonsopphold),
    });
}
