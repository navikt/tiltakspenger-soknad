import { v4 as uuidv4 } from 'uuid';
import Spørsmålsbesvarelser, { Barnetillegg, Bosted } from '@/types/Spørsmålsbesvarelser';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { Barn } from '@/types/Barn';
import { Periode } from '@/types/Periode';
import { Oppholdssted } from '@/utils/bosted';

/** Svarene på bosted-spørsmålene som ga oppholdsstedet, se `tilOppholdssted`. */
export function fraOppholdssted(oppholdssted: Oppholdssted | null | undefined): Bosted {
    switch (oppholdssted) {
        case 'NORGE':
            return { borINorge: true };
        case 'ANNET_EØS_LAND':
            return { borINorge: false, borIEøs: true };
        case 'IKKE_EØS_LAND':
            return { borINorge: false, borIEøs: false };
        default:
            return {};
    }
}

/**
 * Bostedet bruker oppga for barna fra Folkeregisteret i forrige søknad.
 * Barna får ny uuid hver gang de hentes, så de kjennes igjen på fødselsnummeret.
 */
export function bostedForBarnFraFolkeregisteret(forrige: InnsendteSvar, barn: Barn[]): Record<string, Bosted> {
    return Object.fromEntries(
        barn.flatMap(({ uuid, fnr }) => {
            const tidligere = forrige.barnetillegg.registrerteBarnSøktBarnetilleggFor.find((b) => b.fnr === fnr);
            const bosted = fraOppholdssted(tidligere?.oppholdssted);
            return tidligere && bosted.borINorge !== undefined ? [[uuid, bosted]] : [];
        }),
    );
}

const periode = (ja: boolean, periode: Periode | null | undefined) => (ja && periode ? periode : undefined);

export type ForhåndsutfylteSvar = Omit<
    Spørsmålsbesvarelser,
    'tiltak' | 'barnetillegg' | 'harBekreftetAlleOpplysninger' | 'harBekreftetÅSvareSåGodtManKan'
> & { barnetillegg: Omit<Barnetillegg, 'kladd'> };

/**
 * Skjemasvarene til en ny søknad, fylt ut med svarene fra forrige søknad for samme tiltak.
 * Tiltaket og bekreftelsene er ikke med: bruker har allerede valgt tiltaket, og må bekrefte på nytt.
 * Vedleggene er heller ikke med, og må lastes opp på nytt eller ettersendes.
 */
export function forhåndsutfyllFraForrigeSøknad(
    forrige: InnsendteSvar,
    barnFraFolkeregisteret?: Barn[],
): ForhåndsutfylteSvar {
    const utbetaling = ({ mottar, periode: p }: { mottar: boolean; periode?: Periode | null }) => ({
        mottar,
        periode: periode(mottar, p) as Periode,
    });
    return {
        kvalifiseringsprogram: {
            deltar: forrige.kvalifiseringsprogram.deltar,
            periode: periode(forrige.kvalifiseringsprogram.deltar, forrige.kvalifiseringsprogram.periode),
        },
        introduksjonsprogram: {
            deltar: forrige.introduksjonsprogram.deltar,
            periode: periode(forrige.introduksjonsprogram.deltar, forrige.introduksjonsprogram.periode),
        },
        institusjonsopphold: {
            borPåInstitusjon: forrige.institusjonsopphold.borPåInstitusjon,
            periode: periode(forrige.institusjonsopphold.borPåInstitusjon, forrige.institusjonsopphold.periode),
        },
        etterlønn: { mottar: forrige.etterlønn.mottar },
        sykepenger: utbetaling(forrige.sykepenger),
        mottarAndreUtbetalinger: forrige.mottarAndreUtbetalinger,
        gjenlevendepensjon: utbetaling(forrige.gjenlevendepensjon),
        alderspensjon: {
            mottar: forrige.alderspensjon.mottar,
            fraDato:
                (forrige.alderspensjon.mottar && forrige.alderspensjon.fraDato) || (undefined as unknown as string),
        },
        supplerendestønadover67: utbetaling(forrige.supplerendestønadover67),
        supplerendestønadflyktninger: utbetaling(forrige.supplerendestønadflyktninger),
        pensjonsordning: utbetaling(forrige.pensjonsordning),
        jobbsjansen: utbetaling(forrige.jobbsjansen),
        barnetillegg: {
            søkerOmBarnetillegg: forrige.barnetillegg.søkerOmBarnetillegg ?? undefined,
            manueltRegistrerteBarnSøktBarnetilleggFor:
                forrige.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor.map(
                    ({ fornavn, mellomnavn, etternavn, fødselsdato, oppholdssted }) => ({
                        fornavn: fornavn ?? undefined,
                        mellomnavn: mellomnavn ?? undefined,
                        etternavn: etternavn ?? undefined,
                        fødselsdato,
                        fnr: null,
                        uuid: uuidv4(),
                        ...fraOppholdssted(oppholdssted),
                    }),
                ),
            bostedForBarnFraFolkeregisteret: barnFraFolkeregisteret
                ? bostedForBarnFraFolkeregisteret(forrige, barnFraFolkeregisteret)
                : {},
        },
    };
}
