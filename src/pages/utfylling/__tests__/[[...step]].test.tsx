import { pageWithAuthentication } from '@/utils/pageWithAuthentication';
import { getServerSideProps } from '@/pages/utfylling/[[...step]]';
import { GetServerSidePropsContext } from 'next';

jest.mock('@/utils/pageWithAuthentication', () => {
    return {
        pageWithAuthentication: jest.fn().mockImplementation(() => {
            return function () {};
        }),
    };
});

function contextMock(authorizationHeader: string | undefined) {
    return { req: { headers: { authorization: authorizationHeader } } } as GetServerSidePropsContext;
}

describe('test av utfylling-page', () => {
    it('utfylling-page skal kreve at man har gyldig token ved hjelp av pageWithAuthentication', async () => {
        getServerSideProps(contextMock('Bearer test'));
        expect(pageWithAuthentication).toHaveBeenCalled();
    });
});
