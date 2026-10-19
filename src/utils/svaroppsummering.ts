import { Periode } from '@/types/Periode';
import { InnsendtBarn, InnsendteSvar } from '@/types/InnsendteSvar';
import { formatPeriode } from '@/utils/formatPeriode';
import { formatDate } from '@/utils/formatDate';
import { Oppholdssted } from '@/utils/bosted';

/** Spørsmålene i søknaden som vi viser svaret på, og sammenligner med forrige søknad. */
export const SVARFELT = [
    'kvalifiseringsprogram',
    'introduksjonsprogram',
    'etterlønn',
    'sykepenger',
    'mottarAndreUtbetalinger',
    'gjenlevendepensjon',
    'alderspensjon',
    'supplerendestønadover67',
    'supplerendestønadflyktninger',
    'pensjonsordning',
    'jobbsjansen',
    'institusjonsopphold',
    'barnetillegg',
] as const;

export type Svarfelt = (typeof SVARFELT)[number];

/** Svaret på hvert spørsmål som tekst, eller `undefined` når spørsmålet ikke ble stilt. */
export type Svaroppsummering = Record<Svarfelt, string | undefined>;

export const SVARFELT_NAVN: Record<Svarfelt, string> = {
    kvalifiseringsprogram: 'Kvalifiseringsstønad',
    introduksjonsprogram: 'Introduksjonsstønad',
    etterlønn: 'Etterlønn',
    sykepenger: 'Sykepenger',
    mottarAndreUtbetalinger: 'Annen pengestøtte',
    gjenlevendepensjon: 'Gjenlevendepensjon og omstillingsstønad',
    alderspensjon: 'Alderspensjon',
    supplerendestønadover67: 'Supplerende stønad for personer over 67 år med kort botid i Norge',
    supplerendestønadflyktninger: 'Supplerende stønad for uføre flyktninger',
    pensjonsordning: 'Pengestøtte fra andre trygde- eller pensjonsordninger',
    jobbsjansen: 'Stønad gjennom Jobbsjansen',
    institusjonsopphold: 'Institusjonsopphold',
    barnetillegg: 'Barnetillegg',
};

export function hentSvarTilProgramDeltagelse(program: string, deltar: boolean, periode?: Periode | null) {
    if (deltar) {
        return `Ja, jeg mottar ${program} ${periode ? `i perioden ${formatPeriode(periode)}` : ''} `;
    } else {
        return `Nei, jeg mottar ikke ${program}`;
    }
}

export function oppsummeringInstitusjon(borPåInstitusjon: boolean, periodePåInstitusjon?: Periode | null) {
    if (borPåInstitusjon) {
        return `Ja, jeg bor på institusjon med fri kost og losji i perioden ${formatPeriode(periodePåInstitusjon!)}`;
    } else {
        return 'Nei, jeg bor ikke på institusjon med fri kost og losji i perioden jeg går på tiltak';
    }
}

export function oppsummeringAlderspensjon(mottar: boolean, fraDato?: string | null) {
    if (mottar) {
        return `Ja, jeg mottar alderspensjon fra ${formatDate(fraDato!)}`;
    } else {
        return 'Nei, jeg mottar ikke alderspensjon';
    }
}

export function hentSvarTilSpørsmålene(spørsmålTittel: string, mottar: boolean, periode?: Periode | null) {
    if (mottar) {
        return `Ja, jeg mottar ${spørsmålTittel} ${periode ? `i perioden ${formatPeriode(periode)}` : ''} `;
    } else {
        return `Nei, jeg mottar ikke ${spørsmålTittel} i perioden jeg går på tiltak`;
    }
}

const OPPHOLDSSTED_TEKST: Record<Oppholdssted, string> = {
    NORGE: 'bor i Norge',
    ANNET_EØS_LAND: 'bor i et annet EØS-land',
    IKKE_EØS_LAND: 'bor utenfor EØS',
};

function barnTekst({ fornavn, mellomnavn, etternavn, fødselsdato, oppholdssted }: InnsendtBarn) {
    const navn = [fornavn, mellomnavn, etternavn].filter((del) => !!del).join(' ');
    const bosted = oppholdssted ? `, ${OPPHOLDSSTED_TEKST[oppholdssted]}` : '';
    return `${navn}, født ${formatDate(fødselsdato)}${bosted}`;
}

function oppsummeringBarnetillegg({ barnetillegg }: InnsendteSvar) {
    if (!barnetillegg.søkerOmBarnetillegg) {
        return 'Jeg søker ikke om barnetillegg';
    }
    // Sortert, slik at rekkefølgen barna ble lagt til i ikke teller som en endring.
    const barn = [
        ...barnetillegg.registrerteBarnSøktBarnetilleggFor,
        ...barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor,
    ]
        .map(barnTekst)
        .sort((a, b) => a.localeCompare(b, 'nb'));
    return `Jeg søker om barnetillegg for: ${barn.join('; ')}`;
}

/**
 * Lager svartekstene for en søknad i innsendt form.
 * Bruk `JSON.parse(toSøknadJson(...))` for skjemasvarene, slik at de sammenlignes med forrige søknad på samme form som backenden gjør.
 */
export function oppsummerSvar(svar: InnsendteSvar): Svaroppsummering {
    const andre = <T>(tekst: () => T) => (svar.mottarAndreUtbetalinger ? tekst() : undefined);
    return {
        kvalifiseringsprogram: hentSvarTilProgramDeltagelse(
            'kvalifiseringsstønad',
            svar.kvalifiseringsprogram.deltar,
            svar.kvalifiseringsprogram.periode,
        ),
        introduksjonsprogram: hentSvarTilProgramDeltagelse(
            'introduksjonsstønad',
            svar.introduksjonsprogram.deltar,
            svar.introduksjonsprogram.periode,
        ),
        etterlønn: hentSvarTilSpørsmålene(
            'etterlønn fra en tidligere arbeidsgiver i perioden jeg går på tiltak',
            svar.etterlønn.mottar,
        ),
        sykepenger: hentSvarTilSpørsmålene('sykepenger', svar.sykepenger.mottar, svar.sykepenger.periode),
        mottarAndreUtbetalinger: hentSvarTilSpørsmålene(
            'annen pengestøtte i perioden jeg går på tiltak',
            svar.mottarAndreUtbetalinger,
        ),
        gjenlevendepensjon: andre(() =>
            hentSvarTilSpørsmålene(
                'gjenlevendepensjon eller omstillingsstønad',
                svar.gjenlevendepensjon.mottar,
                svar.gjenlevendepensjon.periode,
            ),
        ),
        alderspensjon: andre(() => oppsummeringAlderspensjon(svar.alderspensjon.mottar, svar.alderspensjon.fraDato)),
        supplerendestønadover67: andre(() =>
            hentSvarTilSpørsmålene(
                'supplerende stønad for personer over 67 år med kort botid i Norge',
                svar.supplerendestønadover67.mottar,
                svar.supplerendestønadover67.periode,
            ),
        ),
        supplerendestønadflyktninger: andre(() =>
            hentSvarTilSpørsmålene(
                'supplerende stønad for uføre flyktninger',
                svar.supplerendestønadflyktninger.mottar,
                svar.supplerendestønadflyktninger.periode,
            ),
        ),
        pensjonsordning: andre(() =>
            hentSvarTilSpørsmålene(
                'pengestøtte fra andre trygde- eller pensjonsordninger',
                svar.pensjonsordning.mottar,
                svar.pensjonsordning.periode,
            ),
        ),
        jobbsjansen: andre(() =>
            hentSvarTilSpørsmålene('stønad gjennom Jobbsjansen', svar.jobbsjansen.mottar, svar.jobbsjansen.periode),
        ),
        institusjonsopphold: oppsummeringInstitusjon(
            svar.institusjonsopphold.borPåInstitusjon,
            svar.institusjonsopphold.periode,
        ),
        barnetillegg: oppsummeringBarnetillegg(svar),
    };
}

/** Spørsmålene der svaret er endret fra forrige søknad, i samme rekkefølge som i søknaden. */
export function endredeSvar(nå: Svaroppsummering, forrige: Svaroppsummering): Svarfelt[] {
    return SVARFELT.filter((felt) => nå[felt] !== forrige[felt]);
}
