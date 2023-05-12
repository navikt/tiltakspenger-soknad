import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';

interface Søknad {
    svar: Spørsmålsbesvarelser;
    vedlegg: {
        file: File;
        uuid: string;
    }[];
}

export default Søknad;
