import { Barn } from '@/types/Barn';

export interface Personalia {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    fødselsnummer: string;
    harFylt18År: boolean;
    /** Barna fra Folkeregisteret hentes først når søkeren har svart at hen vil søke barnetillegg. */
    barn?: Barn[];
}
