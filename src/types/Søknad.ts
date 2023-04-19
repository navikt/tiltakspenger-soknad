import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';

interface Søknad {
    svar: Spørsmålsbesvarelser;
    vedlegg: File[];
}

export default Søknad;
