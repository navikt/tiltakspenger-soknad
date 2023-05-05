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
import { Barn } from '@/types/Barn';

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

function barnetillegg(barnetillegg: Barnetillegg, barnFraAPI: Barn[]) {
    const oppholdUtenforEØSDict = barnetillegg.registrerteBarn.oppholdUtenforEØS
    return {
        ...barnetillegg,
        registrerteBarn: barnFraAPI
            .map(({ fornavn, fødselsdato, mellomnavn, etternavn, uuid }) => ({
                fornavn,
                fødselsdato,
                mellomnavn,
                etternavn,
                oppholdUtenforEØS: oppholdUtenforEØSDict[uuid],
            })),
        manueltRegistrerteBarnSøktBarnetilleggFor: barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
            .filter(({ fornavn, etternavn, fødselsdato, bostedsland }) => fornavn && etternavn && fødselsdato && bostedsland)
            .map((barn) => ({
                ...barn,
                fødselsdato: formatDate(barn.fødselsdato),
            })),
    };
}

export default function toSøknadJson(spørsmålsbesvarelser: Spørsmålsbesvarelser, barnFraApi: Barn[]): String {
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
