import { describe, expect, test } from '@jest/globals';
import { barnetillegg } from './toSøknadJson';
import { Barn } from '@/types/Barn';
import { Barnetillegg } from '@/types/Spørsmålsbesvarelser';

const barnFraFolkeregisteret: Barn[] = [
    { uuid: 'a', fnr: '12345678910', fornavn: 'Kim', etternavn: 'Gullaber', fødselsdato: '2018-03-04' },
    { uuid: 'b', fnr: '10987654321', fornavn: 'Trulte', etternavn: 'Syltestrikk', fødselsdato: '2021-02-02' },
];

const manueltBarn: Barn = {
    uuid: 'c',
    fnr: null,
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    fødselsdato: '2020-01-01',
    borINorge: false,
    borIEøs: false,
};

const svar = (overstyr: Partial<Barnetillegg>): Barnetillegg => ({
    manueltRegistrerteBarnSøktBarnetilleggFor: [manueltBarn],
    bostedForBarnFraFolkeregisteret: {
        a: { borINorge: true },
        b: { borINorge: false, borIEøs: true },
    },
    kladd: { uuid: '', fnr: null, fødselsdato: '' },
    ...overstyr,
});

describe('barnetillegg i søknaden', () => {
    test('sender oppholdssted og avledet oppholdInnenforEøs for alle barna når søkeren svarer ja', () => {
        const resultat = barnetillegg(svar({ søkerOmBarnetillegg: true }), barnFraFolkeregisteret);

        expect(resultat.søkerOmBarnetillegg).toBe(true);
        expect(resultat.registrerteBarnSøktBarnetilleggFor).toEqual([
            {
                fnr: '12345678910',
                fornavn: 'Kim',
                mellomnavn: undefined,
                etternavn: 'Gullaber',
                fødselsdato: '2018-03-04',
                oppholdssted: 'NORGE',
                oppholdInnenforEøs: true,
            },
            {
                fnr: '10987654321',
                fornavn: 'Trulte',
                mellomnavn: undefined,
                etternavn: 'Syltestrikk',
                fødselsdato: '2021-02-02',
                oppholdssted: 'ANNET_EØS_LAND',
                oppholdInnenforEøs: true,
            },
        ]);
        expect(resultat.manueltRegistrerteBarnSøktBarnetilleggFor).toEqual([
            {
                fornavn: 'Ola',
                mellomnavn: undefined,
                etternavn: 'Nordmann',
                fødselsdato: '2020-01-01',
                oppholdssted: 'IKKE_EØS_LAND',
                oppholdInnenforEøs: false,
            },
        ]);
    });

    test('sender ingen barn når søkeren svarer nei, selv om barn ble lagt til før søkeren ombestemte seg', () => {
        const resultat = barnetillegg(svar({ søkerOmBarnetillegg: false }), barnFraFolkeregisteret);

        expect(resultat).toEqual({
            søkerOmBarnetillegg: false,
            registrerteBarnSøktBarnetilleggFor: [],
            manueltRegistrerteBarnSøktBarnetilleggFor: [],
        });
    });

    test('sender ikke svar på spørsmålet når søkeren ikke har kommet så langt', () => {
        expect(barnetillegg(svar({}), barnFraFolkeregisteret)).toEqual({
            søkerOmBarnetillegg: undefined,
            registrerteBarnSøktBarnetilleggFor: [],
            manueltRegistrerteBarnSøktBarnetilleggFor: [],
        });
    });

    test('sender ingen barn fra Folkeregisteret når de ikke er hentet', () => {
        const resultat = barnetillegg(svar({ søkerOmBarnetillegg: true }), undefined);

        expect(resultat.registrerteBarnSøktBarnetilleggFor).toEqual([]);
        expect(resultat.manueltRegistrerteBarnSøktBarnetilleggFor).toHaveLength(1);
    });

    test('sender barn uten bostedssvar uten oppholdssted, så søknad-api avviser søknaden', () => {
        const resultat = barnetillegg(
            svar({ søkerOmBarnetillegg: true, bostedForBarnFraFolkeregisteret: {} }),
            barnFraFolkeregisteret,
        );

        for (const barn of resultat.registrerteBarnSøktBarnetilleggFor) {
            expect(barn.oppholdssted).toBeUndefined();
        }
    });

    test('hopper over manuelt registrerte barn som mangler navn eller fødselsdato', () => {
        const resultat = barnetillegg(
            svar({
                søkerOmBarnetillegg: true,
                manueltRegistrerteBarnSøktBarnetilleggFor: [manueltBarn, { ...manueltBarn, uuid: 'd', etternavn: '' }],
            }),
            [],
        );

        expect(resultat.manueltRegistrerteBarnSøktBarnetilleggFor).toHaveLength(1);
    });
});
