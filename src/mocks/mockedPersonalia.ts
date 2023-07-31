import { v4 as uuidv4 } from 'uuid';

export const mockedPersonalia = {
    fornavn: 'Foo',
    mellomnavn: 'Bar',
    etternavn: 'Baz',
    fødselsnummer: '123',
    harFylt18År: true,
    barn: [
        { fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() },
        { fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4() },
    ],
};
