import Spørsmålsbesvarelser, {
    Alderspensjon,
    Barnetillegg,
    FormTiltak,
    Gjenlevendepensjon,
    Institusjonsopphold,
    Introduksjonsprogram,
    Jobbsjansen,
    Kvalifiseringsprogram,
    Supplerendestønadover67,
    Sykepenger,
} from '@/types/Spørsmålsbesvarelser';
import dayjs from 'dayjs';
import { Tiltak } from '@/types/Tiltak';
import { Barn } from '@/types/Barn';
import {Nullable} from "@/utils/eller-null";

interface Periode {
    fra: string;
    til: string;
}

function formatDate(dateString: Nullable<string>) {
    if (!dateString) return '';
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

function sykepenger({mottar, periode}: Sykepenger) {
    if (mottar) {
        return { mottar: mottar, periode: formatPeriod( periode as Periode)}
    }
    return { mottar: mottar };
}

function gjenlevendepensjon({ mottar, periode }: Gjenlevendepensjon) {
    if (mottar) {
        return { mottar, periode: formatPeriod(periode as Periode)}
    }
    return { mottar };
}

function alderspensjon(alderspensjon: Alderspensjon) {
    const { mottar, fraDato} = alderspensjon;
    if (mottar) {
        return { mottar, fraDato: formatDate(fraDato)}
    }
    return alderspensjon;
}

function supplerendestønadover67({ mottar, periode }: Supplerendestønadover67) {
    if (mottar) {
        return { mottar, periode: formatPeriod(periode as Periode)}
    }
    return { mottar };
}

function jobbsjansen({ mottar, periode }: Jobbsjansen) {
    if (mottar) {
        return { mottar, periode: formatPeriod(periode as Periode)}
    }
    return { mottar };
}

function supplerendestønadflyktninger({ mottar, periode }: Supplerendestønadover67) {
    if (mottar) {
        return { mottar, periode: formatPeriod(periode as Periode)}
    }
    return { mottar };
}

function institusjon(institusjonsopphold: Institusjonsopphold) {
    const { periode, borPåInstitusjon } = institusjonsopphold;
    if (borPåInstitusjon) {
        return { borPåInstitusjon, periode: formatPeriod(periode!) };
    }
    return institusjonsopphold;
}

function brukerregistrertTiltaksperiodeSkalMedVedInnsending({ søkerHeleTiltaksperioden }: FormTiltak, tiltak: Tiltak) {
    if (søkerHeleTiltaksperioden === false) {
        return true;
    }
    if (!tiltak.arenaRegistrertPeriode?.fra || !tiltak.arenaRegistrertPeriode?.til) {
        return true;
    }
    return false;
}

function tiltak(formTiltak: FormTiltak, tiltak: Tiltak) {
    return {
        ...formTiltak,
        arrangør: tiltak.arrangør,
        type: tiltak.type,
        typeNavn: tiltak.typeNavn,
        arenaRegistrertPeriode: tiltak.arenaRegistrertPeriode,
        periode: brukerregistrertTiltaksperiodeSkalMedVedInnsending(formTiltak, tiltak)
            ? formatPeriod(formTiltak.periode!)
            : tiltak.arenaRegistrertPeriode,
    };
}

function barnetillegg(barnetillegg: Barnetillegg, barnFraAPI: Barn[]) {
    const oppholdUtenforEØSDict = barnetillegg.eøsOppholdForBarnFraAPI;
    const registrerteBarn = barnFraAPI
            .map(({ fornavn, fødselsdato, mellomnavn, etternavn, uuid }) => ({
                fornavn,
                fødselsdato,
                mellomnavn,
                etternavn,
                oppholdUtenforEØS: oppholdUtenforEØSDict[uuid],
            }));
    const manueltRegistrerteBarnSøktBarnetilleggFor = barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor
            .filter(({ fornavn, etternavn, fødselsdato }) => fornavn && etternavn && fødselsdato)
            .map((barn) => ({
                ...barn,
                fødselsdato: formatDate(barn.fødselsdato),
            }));
    const ønskerÅSøkeBarnetilleggForAndreBarn = manueltRegistrerteBarnSøktBarnetilleggFor.length > 0;
    const søkerOmBarnetillegg = registrerteBarn.length > 0 || ønskerÅSøkeBarnetilleggForAndreBarn;
    return {
        ...barnetillegg,
        registrerteBarnSøktBarnetilleggFor: registrerteBarn,
        manueltRegistrerteBarnSøktBarnetilleggFor: manueltRegistrerteBarnSøktBarnetilleggFor,
        søkerOmBarnetillegg: søkerOmBarnetillegg,
        ønskerÅSøkeBarnetilleggForAndreBarn: ønskerÅSøkeBarnetilleggForAndreBarn
    };
}

export default function toSøknadJson(
    spørsmålsbesvarelser: Spørsmålsbesvarelser,
    barnFraApi: Barn[],
    valgtTiltak: Tiltak
): String {
    return JSON.stringify({
        ...spørsmålsbesvarelser,
        kvalifiseringsprogram: kvalifiseringsprogram(spørsmålsbesvarelser.kvalifiseringsprogram),
        introduksjonsprogram: introduksjonsprogram(spørsmålsbesvarelser.introduksjonsprogram),
        barnetillegg: barnetillegg(spørsmålsbesvarelser.barnetillegg, barnFraApi),
        sykepenger: sykepenger(spørsmålsbesvarelser.sykepenger),
        gjenlevendepensjon: gjenlevendepensjon(spørsmålsbesvarelser.gjenlevendepensjon),
        alderspensjon: alderspensjon(spørsmålsbesvarelser.alderspensjon),
        supplerendestønadover67: supplerendestønadover67(spørsmålsbesvarelser.supplerendestønadover67),
        supplerendestønadflyktninger: supplerendestønadflyktninger(spørsmålsbesvarelser.supplerendestønadflyktninger),
        jobbsjansen: jobbsjansen(spørsmålsbesvarelser.jobbsjansen),
        institusjonsopphold: institusjon(spørsmålsbesvarelser.institusjonsopphold),
        tiltak: tiltak(spørsmålsbesvarelser.tiltak, valgtTiltak),
    });
}
