import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';

interface Søknad {
    svar: Spørsmålsbesvarelser;
    vedlegg: {
        file: File;
    }[];
}

export default Søknad;
