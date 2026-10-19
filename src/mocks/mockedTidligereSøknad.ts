import { InnsendteSvar } from '@/types/InnsendteSvar';

/** Svarene i en tidligere søknad, slik søknad-api-et returnerer dem på `tidligereSøknad` for et tiltak. */
export const mocketTidligereSvar: InnsendteSvar = {
    tiltak: {
        aktivitetId: '45avk6',
        periode: { fra: '2025-03-01', til: '2025-06-30' },
        arenaRegistrertPeriode: { fra: '2025-03-01', til: '2025-06-30' },
        arrangør: 'Testarrangør D',
        type: 'AVKLARAG',
        typeNavn: 'Avklaring',
        gjennomforingId: '345678',
        visningsnavn: 'Avklaring hos Testarrangør D',
    },
    kvalifiseringsprogram: { deltar: false, periode: null },
    introduksjonsprogram: { deltar: false, periode: null },
    institusjonsopphold: { borPåInstitusjon: false, periode: null },
    mottarAndreUtbetalinger: false,
    sykepenger: { mottar: true, periode: { fra: '2025-03-01', til: '2025-03-31' } },
    gjenlevendepensjon: { mottar: false, periode: null },
    alderspensjon: { mottar: false, fraDato: null },
    supplerendestønadover67: { mottar: false, periode: null },
    supplerendestønadflyktninger: { mottar: false, periode: null },
    pensjonsordning: { mottar: false, periode: null },
    etterlønn: { mottar: false },
    jobbsjansen: { mottar: false, periode: null },
    barnetillegg: {
        søkerOmBarnetillegg: true,
        registrerteBarnSøktBarnetilleggFor: [],
        manueltRegistrerteBarnSøktBarnetilleggFor: [
            {
                fornavn: 'Kari',
                mellomnavn: null,
                etternavn: 'Nordmann',
                fødselsdato: '2020-05-17',
                oppholdssted: 'NORGE',
            },
        ],
    },
    harBekreftetAlleOpplysninger: true,
    harBekreftetÅSvareSåGodtManKan: true,
};
