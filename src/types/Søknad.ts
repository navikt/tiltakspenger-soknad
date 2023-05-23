import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';

interface Søknad {
    svar: Spørsmålsbesvarelser;
    vedlegg: Vedlegg[];
}

export interface Vedlegg {
    file: File;
    uuid: string;
}

export default Søknad;
