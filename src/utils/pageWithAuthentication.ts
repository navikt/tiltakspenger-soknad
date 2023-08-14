import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import logger from '@/utils/serverLogger';
import { redirectToLogin, validateAuthorizationHeader } from '@/utils/authentication';

const defaultGetServerSideProps = async () => ({
    props: {},
});

export function pageWithAuthentication(getServerSideProps: GetServerSideProps = defaultGetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        try {
            const authorizationHeader = context.req.headers.authorization;
            if (!authorizationHeader) {
                throw new Error('Fant ingen token i authorization header');
            }
            await validateAuthorizationHeader(authorizationHeader);
        } catch (error) {
            logger.error(`Bruker har ikke tilgang: ${(error as Error).message}`);
            return redirectToLogin(context);
        }
        return getServerSideProps(context);
    };
}
