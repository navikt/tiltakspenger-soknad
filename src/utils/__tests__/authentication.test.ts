import { validateAuthorizationHeader } from '@/utils/authentication';

jest.mock('../authentication', () => {
    return {
        validateAuthorizationHeader: jest.fn(),
    };
});

describe('teste autentisering', () => {
    it('testet', () => {
        (validateAuthorizationHeader as jest.Mock).mockReturnValueOnce('test');
        expect(validateAuthorizationHeader('bearer')).toEqual('test');
    });
});
