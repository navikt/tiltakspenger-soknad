import { validateIdportenToken } from '@navikt/next-auth-wonderwall';
import { validateAuthorizationHeader } from '@/utils/authentication';

jest.mock('@navikt/next-auth-wonderwall', () => {
    return {
        validateIdportenToken: jest.fn(),
    };
});

describe('test av validateAuthorizationHeader', () => {
    it('promise skal rejectes hvis authorizationHeader mangler', async () => {
        const result = validateAuthorizationHeader(undefined);
        await expect(result).rejects.toThrow('Mangler authorization header');
    });

    it('promise skal rejectes hvis man ikke har et gyldig token', async () => {
        (validateIdportenToken as jest.Mock).mockRejectedValue({ message: 'ugyldig token' });
        const result = validateAuthorizationHeader('Bearer ugyldig token');
        await expect(result).rejects.toThrow('ugyldig token');
    });

    it('promise skal rejectes hvis man ikke får validert tokenet', async () => {
        (validateIdportenToken as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Kunne ikke validere token');
        });
        const result = validateAuthorizationHeader('Bearer et hvilket som helst token');
        await expect(result).rejects.toThrow('Kunne ikke validere token');
    });

    it('promise skal resolves hvis token valideres ok', async () => {
        (validateIdportenToken as jest.Mock).mockResolvedValue('valid');
        const result = validateAuthorizationHeader('Bearer token');
        await expect(result).resolves.toEqual('valid');
    });
});
