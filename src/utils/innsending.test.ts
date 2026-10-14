import { describe, expect, test } from '@jest/globals';
import { lagFormDataForInnsending } from './innsending';
import Søknad from '@/types/Søknad';
import { Personalia } from '@/types/Personalia';
import { Tiltak } from '@/types/Tiltak';
import { Barn } from '@/types/Barn';
import defaultValues from '@/defaultValues';

const manueltBarn: Barn = {
    uuid: 'ola',
    fnr: null,
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    fødselsdato: '2020-01-01',
    borINorge: true,
};

const personalia: Personalia = {
    fornavn: 'Test',
    etternavn: 'Testesen',
    fødselsnummer: '01019012345',
    harFylt18År: true,
    barn: [],
};

const tiltak = { aktivitetId: '1', arenaRegistrertPeriode: {}, typeNavn: 'Tiltak' } as unknown as Tiltak;

function søknad(søkerOmBarnetillegg: boolean | undefined, vedleggFor: string[]): Søknad {
    return {
        svar: {
            ...defaultValues.svar,
            tiltak: { aktivitetId: '1', periode: { fra: '2026-01-01', til: '2026-02-01' } },
            barnetillegg: {
                ...defaultValues.svar.barnetillegg,
                søkerOmBarnetillegg,
                manueltRegistrerteBarnSøktBarnetilleggFor: [manueltBarn],
            },
        },
        vedlegg: vedleggFor.map((uuid) => ({ uuid, file: new File(['innhold'], `${uuid}.pdf`) })),
    } as unknown as Søknad;
}

function vedleggNavn(formData: FormData) {
    return [...formData.entries()]
        .filter(([nøkkel]) => nøkkel.startsWith('vedlegg-'))
        .map(([, fil]) => (fil as File).name);
}

describe('lagFormDataForInnsending', () => {
    test('sender vedlegg for manuelt registrerte barn når søkeren søker om barnetillegg', () => {
        const formData = lagFormDataForInnsending(søknad(true, ['ola', 'slettet-barn']), personalia, tiltak);

        expect(vedleggNavn(formData)).toEqual(['ola.pdf']);
    });

    test.each([false, undefined])(
        'sender verken barn eller vedlegg når søkeren har svart %s på om hen søker barnetillegg',
        (søkerOmBarnetillegg) => {
            const formData = lagFormDataForInnsending(søknad(søkerOmBarnetillegg, ['ola']), personalia, tiltak);

            expect(vedleggNavn(formData)).toEqual([]);
            const barnetillegg = JSON.parse(formData.get('søknad') as string).barnetillegg;
            expect(barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor).toEqual([]);
            expect(barnetillegg.registrerteBarnSøktBarnetilleggFor).toEqual([]);
        },
    );

    test('sender ikke med bostedssvarene og kladden som egne felt i søknaden', () => {
        const formData = lagFormDataForInnsending(søknad(true, []), personalia, tiltak);

        const barnetillegg = JSON.parse(formData.get('søknad') as string).barnetillegg;
        expect(Object.keys(barnetillegg).sort()).toEqual([
            'manueltRegistrerteBarnSøktBarnetilleggFor',
            'registrerteBarnSøktBarnetilleggFor',
            'søkerOmBarnetillegg',
        ]);
    });
});
