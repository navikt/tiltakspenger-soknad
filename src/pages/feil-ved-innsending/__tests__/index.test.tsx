import { pageWithAuthentication } from '@/utils/pageWithAuthentication';
import { getServerSideProps } from '@/pages/feil-ved-innsending';
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
    it('feil-ved-innsending-page skal kreve at man har gyldig token ved hjelp av pageWithAuthentication', async () => {
        getServerSideProps(contextMock('Bearer test'));
        expect(pageWithAuthentication).toHaveBeenCalled();
    });
});
