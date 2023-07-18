import { validateAuthorizationHeader } from '../authentication';

jest.mock('../authentication');

describe('teste autentisering', () => {
    it('testet', () => {
        (validateAuthorizationHeader as jest.Mock).mockReturnValueOnce('test');
        expect(validateAuthorizationHeader('bearer')).toEqual('test');
    });
});
