import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { BarnListeDTO } from '@/types/Barn';

// uuid er ren ESM og lar seg ikke laste av jest uten transformering.
// Mockene heises ikke over importene når jest importeres fra @jest/globals, så modulen lastes dynamisk etterpå.
jest.mock('uuid', () => {
    let teller = 0;
    return { v4: () => `uuid-${++teller}` };
});
jest.mock('../mocks/mockedPersonalia', () => ({
    mockedBarn: [{ uuid: 'mock', fnr: null, fødselsdato: '2020-12-31' }],
}));

let hentBarnFraFolkeregisteret: typeof import('./hentBarn').hentBarnFraFolkeregisteret;
const env = process.env as Record<string, string | undefined>;
const opprinneligNodeEnv = env.NODE_ENV;
const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

function svar(status: number, body?: BarnListeDTO) {
    fetchMock.mockResolvedValue(new Response(body ? JSON.stringify(body) : null, { status }));
}

beforeAll(async () => {
    ({ hentBarnFraFolkeregisteret } = await import('./hentBarn'));
});

beforeEach(() => {
    global.fetch = fetchMock;
    env.NODE_ENV = 'production';
    delete env.NEXT_PUBLIC_BASE_PATH;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
    env.NODE_ENV = opprinneligNodeEnv;
});

describe('hentBarnFraFolkeregisteret', () => {
    test('henter barna fra eget endepunkt under basePath', async () => {
        env.NEXT_PUBLIC_BASE_PATH = '/tiltakspenger/soknad';
        svar(200, { barn: [] });

        await hentBarnFraFolkeregisteret();

        expect(fetchMock).toHaveBeenCalledWith('/tiltakspenger/soknad/api/personalia/barn');
    });

    test('gjør null-navn om til udefinert og gir hvert barn en egen uuid', async () => {
        svar(200, {
            barn: [
                {
                    fnr: '12345678910',
                    fødselsdato: '2018-03-04',
                    fornavn: 'Kim',
                    mellomnavn: null,
                    etternavn: 'Gullaber',
                },
                { fnr: '10987654321', fødselsdato: '2021-02-02', fornavn: null, mellomnavn: null, etternavn: null },
            ],
        });

        const barn = await hentBarnFraFolkeregisteret();

        expect(barn).toEqual([
            {
                fnr: '12345678910',
                fødselsdato: '2018-03-04',
                fornavn: 'Kim',
                mellomnavn: undefined,
                etternavn: 'Gullaber',
                uuid: expect.stringMatching(/^uuid-/),
            },
            {
                fnr: '10987654321',
                fødselsdato: '2021-02-02',
                fornavn: undefined,
                mellomnavn: undefined,
                etternavn: undefined,
                uuid: expect.stringMatching(/^uuid-/),
            },
        ]);
        expect(barn[0].uuid).not.toBe(barn[1].uuid);
    });

    test('feiler når søknad-api svarer med feilstatus, så steget kan tilby å prøve igjen', async () => {
        svar(500);

        await expect(hentBarnFraFolkeregisteret()).rejects.toThrow('Henting av barn feilet med status 500');
    });

    test('feiler når nettverkskallet feiler', async () => {
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

        await expect(hentBarnFraFolkeregisteret()).rejects.toThrow('Failed to fetch');
    });

    test('faller tilbake til mockede barn lokalt, der søknad-api ofte ikke kjører', async () => {
        env.NODE_ENV = 'development';
        svar(500);

        await expect(hentBarnFraFolkeregisteret()).resolves.toEqual([
            { uuid: 'mock', fnr: null, fødselsdato: '2020-12-31' },
        ]);
    });
});
