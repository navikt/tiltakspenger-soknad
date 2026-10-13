import { describe, expect, test } from '@jest/globals';
import { brukerHarFyltUtBarnetilleggsteg, brukerHarFyltUtNødvendigeOpplysninger } from './stepValidators';
import { Søknadssteg } from '@/types/Søknadssteg';
import Spørsmålsbesvarelser, { Barnetillegg } from '@/types/Spørsmålsbesvarelser';
import { Barn } from '@/types/Barn';

const barnFraFolkeregisteret: Barn[] = [{ uuid: 'a', fnr: '12345678910', fødselsdato: '2018-03-04' }];

const svar = (barnetillegg: Partial<Barnetillegg>) =>
    ({
        barnetillegg: {
            manueltRegistrerteBarnSøktBarnetilleggFor: [],
            bostedForBarnFraFolkeregisteret: {},
            ...barnetillegg,
        },
    }) as unknown as Spørsmålsbesvarelser;

describe('brukerHarFyltUtBarnetilleggsteg', () => {
    test('er ikke fylt ut før søkeren har svart på om hen vil søke barnetillegg', () => {
        expect(brukerHarFyltUtBarnetilleggsteg(svar({}), undefined)).toBe(false);
    });

    test('er fylt ut når søkeren svarer nei, uten at barna er hentet', () => {
        expect(brukerHarFyltUtBarnetilleggsteg(svar({ søkerOmBarnetillegg: false }), undefined)).toBe(true);
    });

    test('krever at barna er hentet og at søkeren har svart på bosted for alle', () => {
        expect(brukerHarFyltUtBarnetilleggsteg(svar({ søkerOmBarnetillegg: true }), undefined)).toBe(false);
        expect(brukerHarFyltUtBarnetilleggsteg(svar({ søkerOmBarnetillegg: true }), barnFraFolkeregisteret)).toBe(
            false,
        );
        expect(
            brukerHarFyltUtBarnetilleggsteg(
                svar({ søkerOmBarnetillegg: true, bostedForBarnFraFolkeregisteret: { a: { borINorge: false } } }),
                barnFraFolkeregisteret,
            ),
        ).toBe(false);
        expect(
            brukerHarFyltUtBarnetilleggsteg(
                svar({
                    søkerOmBarnetillegg: true,
                    bostedForBarnFraFolkeregisteret: { a: { borINorge: false, borIEøs: true } },
                }),
                barnFraFolkeregisteret,
            ),
        ).toBe(true);
    });

    test('krever svar på bosted for manuelt registrerte barn', () => {
        const manueltBarn = { uuid: 'b', fnr: null, fødselsdato: '2020-01-01', borINorge: false };
        expect(
            brukerHarFyltUtBarnetilleggsteg(
                svar({ søkerOmBarnetillegg: true, manueltRegistrerteBarnSøktBarnetilleggFor: [manueltBarn] }),
                [],
            ),
        ).toBe(false);
    });

    test('er ikke fylt ut når søkeren svarer ja uten å ha noen barn', () => {
        expect(brukerHarFyltUtBarnetilleggsteg(svar({ søkerOmBarnetillegg: true }), [])).toBe(false);
        expect(
            brukerHarFyltUtBarnetilleggsteg(
                svar({
                    søkerOmBarnetillegg: true,
                    manueltRegistrerteBarnSøktBarnetilleggFor: [
                        { uuid: 'b', fnr: null, fødselsdato: '2020-01-01', borINorge: true },
                    ],
                }),
                [],
            ),
        ).toBe(true);
    });
});

describe('brukerHarFyltUtNødvendigeOpplysninger for barnetilleggsstegene', () => {
    const tidligereStegUtfylt = (barnetillegg: Partial<Barnetillegg>) =>
        ({
            tiltak: { aktivitetId: '1', periode: { fra: '2026-01-01', til: '2026-02-01' } },
            kvalifiseringsprogram: { deltar: false },
            introduksjonsprogram: { deltar: false },
            mottarAndreUtbetalinger: false,
            etterlønn: { mottar: false },
            sykepenger: { mottar: false },
            institusjonsopphold: { borPåInstitusjon: false },
            barnetillegg: {
                manueltRegistrerteBarnSøktBarnetilleggFor: [],
                bostedForBarnFraFolkeregisteret: {},
                ...barnetillegg,
            },
        }) as unknown as Spørsmålsbesvarelser;

    test('barnesteget er bare tilgjengelig når søkeren har svart ja', () => {
        const steg = Søknadssteg.BARNETILLEGG_BARN;
        expect(brukerHarFyltUtNødvendigeOpplysninger(tidligereStegUtfylt({}), steg)).toBe(false);
        expect(brukerHarFyltUtNødvendigeOpplysninger(tidligereStegUtfylt({ søkerOmBarnetillegg: false }), steg)).toBe(
            false,
        );
        expect(brukerHarFyltUtNødvendigeOpplysninger(tidligereStegUtfylt({ søkerOmBarnetillegg: true }), steg)).toBe(
            true,
        );
    });

    test('barnesteget krever at stegene før er fylt ut', () => {
        const svar = tidligereStegUtfylt({ søkerOmBarnetillegg: true });
        svar.institusjonsopphold = {} as Spørsmålsbesvarelser['institusjonsopphold'];

        expect(brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.BARNETILLEGG_BARN)).toBe(false);
    });

    test('oppsummeringen krever at barnetillegget er besvart', () => {
        const steg = Søknadssteg.OPPSUMMERING;
        expect(brukerHarFyltUtNødvendigeOpplysninger(tidligereStegUtfylt({}), steg, [])).toBe(false);
        expect(
            brukerHarFyltUtNødvendigeOpplysninger(tidligereStegUtfylt({ søkerOmBarnetillegg: false }), steg, undefined),
        ).toBe(true);
        expect(
            brukerHarFyltUtNødvendigeOpplysninger(
                tidligereStegUtfylt({ søkerOmBarnetillegg: true }),
                steg,
                barnFraFolkeregisteret,
            ),
        ).toBe(false);
        expect(
            brukerHarFyltUtNødvendigeOpplysninger(
                tidligereStegUtfylt({
                    søkerOmBarnetillegg: true,
                    bostedForBarnFraFolkeregisteret: { a: { borINorge: true } },
                }),
                steg,
                barnFraFolkeregisteret,
            ),
        ).toBe(true);
    });
});
