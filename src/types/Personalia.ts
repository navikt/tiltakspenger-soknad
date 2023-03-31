import { BarnFraAPI } from '@/types/Barn';

export interface Personalia {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    fødselsnummer: string;
    barn: BarnFraAPI[];
}
