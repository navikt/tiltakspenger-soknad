import Spørsmålsbesvarelser, {
    Barnetillegg,
    Etterlønn,
    FormTiltak,
    Institusjonsopphold,
    Introduksjonsprogram,
    Kvalifiseringsprogram,
    Pensjonsordning,
} from '@/types/Spørsmålsbesvarelser';
import dayjs from 'dayjs';
import { BarnFraAPI } from '@/types/Barn';

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

function tiltak(formTiltak: FormTiltak) {
    if (formTiltak.periode) {
        return {
            ...formTiltak,
            periode: formatPeriod(formTiltak.periode),
        };
    }
    return formTiltak;
}

function barnetillegg(barnetillegg: Barnetillegg, registrerteBarn: BarnFraAPI[]) {
    return {
        ...barnetillegg,
        registrerteBarnSøktBarnetilleggFor: registrerteBarn
            .filter(({ uuid }) => barnetillegg.registrerteBarnSøktBarnetilleggFor.indexOf(uuid) >= 0)
            // sørger for å fjerne uuid i post
            .map(({ fornavn, fødselsdato, mellomnavn, etternavn }) => ({
                fornavn,
                fødselsdato,
                mellomnavn,
                etternavn,
            })),
        manueltRegistrerteBarnSøktBarnetilleggFor: barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
            .filter(({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato)
            .map((barn) => ({
                ...barn,
                fødselsdato: formatDate(barn.fødselsdato),
            })),
    };
}

export default function toSøknadJson(spørsmålsbesvarelser: Spørsmålsbesvarelser, barnFraApi: BarnFraAPI[]): String {
    return JSON.stringify({
        ...spørsmålsbesvarelser,
        kvalifiseringsprogram: kvalifiseringsprogram(spørsmålsbesvarelser.kvalifiseringsprogram),
        introduksjonsprogram: introduksjonsprogram(spørsmålsbesvarelser.introduksjonsprogram),
        barnetillegg: barnetillegg(spørsmålsbesvarelser.barnetillegg, barnFraApi),
        pensjonsordning: pensjon(spørsmålsbesvarelser.pensjonsordning),
        etterlønn: etterlønn(spørsmålsbesvarelser.etterlønn),
        institusjonsopphold: institusjon(spørsmålsbesvarelser.institusjonsopphold),
        tiltak: tiltak(spørsmålsbesvarelser.tiltak),
    });
}
