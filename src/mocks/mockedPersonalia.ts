import { Personalia } from '@/types/Personalia';
import { Barn } from '@/types/Barn';
import { v4 as uuidv4 } from 'uuid';

export const mockedPersonalia: Personalia = {
    fornavn: 'Foo',
    mellomnavn: 'Bar',
    etternavn: 'Baz',
    fødselsnummer: '123',
    harFylt18År: true,
};

// Fødselsnumrene er oppdiktede, men må finnes: forrige søknads bosted for barna kjennes igjen på dem.
export const mockedBarn: Barn[] = [
    {
        fnr: '01012550001',
        fornavn: 'Test',
        etternavn: 'Testesen',
        fødselsdato: '2025-01-01',
        uuid: uuidv4(),
    },
    {
        fnr: '31122050002',
        fornavn: 'Fest',
        etternavn: 'Festesen',
        fødselsdato: '2020-12-31',
        uuid: uuidv4(),
    },
    {
        fnr: '31122050003',
        fødselsdato: '2020-12-31',
        uuid: uuidv4(),
    },
];
