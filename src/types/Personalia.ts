import { Barn } from '@/types/Barn';

export interface Personalia {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    fødselsnummer: string;
    harFylt18År: boolean;
    barn: Barn[];
}
