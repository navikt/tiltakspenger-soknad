import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import logger from '@/utils/serverLogger';
import { redirectToLogin, validateAuthorizationHeader } from '@/utils/authentication';

const defaultGetServerSideProps = async () => ({
    props: {},
});

export function pageWithAuthentication(getServerSideProps: GetServerSideProps = defaultGetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        try {
            await validateAuthorizationHeader(context.req.headers.authorization);
        } catch (error) {
            logger.error(`Bruker har ikke tilgang: ${(error as Error).message}`);
            return redirectToLogin(context);
        }
        return getServerSideProps(context);
    };
}
