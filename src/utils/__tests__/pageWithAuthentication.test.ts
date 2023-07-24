import {validateAuthorizationHeader} from '@/utils/authentication';
import {pageWithAuthentication} from '@/utils/pageWithAuthentication';
import {GetServerSidePropsContext} from 'next';

jest.mock('@/utils/authentication', () => {
    return {
        validateAuthorizationHeader: jest.fn(),
    };
});

const getServersidePropsMock = jest.fn();

function contextMock(authorizationHeader: string | undefined) {
    return {req: {headers: {authorization: authorizationHeader}}} as GetServerSidePropsContext;
}

const redirectToLogin = {
    redirect: {
        destination: '/oauth2/login',
        permanent: false,
    },
};

describe('test av pageWithAuthentication', () => {
    it('om authorizationHeader er undefined skal man redirectes til login', async () => {
        const authenticatedPageHandler = pageWithAuthentication(getServersidePropsMock);
        const contextWithoutAuthorization = contextMock(undefined);
        await expect(authenticatedPageHandler(contextWithoutAuthorization)).resolves.toEqual(redirectToLogin);

        expect(getServersidePropsMock).not.toHaveBeenCalled();
    });

    it('om validateAuthorizationHeader feiler på noe skal man redirectes til login', async () => {
        (validateAuthorizationHeader as jest.Mock).mockImplementationOnce(() => {
            throw new Error('client_id does not match app client_id');
        });
        const authenticatedPageHandler = pageWithAuthentication(getServersidePropsMock);
        const contextWithAuthorization = contextMock('Bearer token');
        await expect(authenticatedPageHandler(contextWithAuthorization)).resolves.toEqual(redirectToLogin);

        expect(getServersidePropsMock).not.toHaveBeenCalled();
    });

    it('om token er korrekt blir getServersideProps kalt', async () => {
        (validateAuthorizationHeader as jest.Mock).mockReturnValueOnce(Promise.resolve('valid'));
        const authenticatedPageHandler = pageWithAuthentication(getServersidePropsMock);
        const contextWithAuthorization = contextMock('Bearer token');
        await authenticatedPageHandler(contextWithAuthorization);

        expect(getServersidePropsMock).toHaveBeenCalledWith(contextWithAuthorization);
    });
});
