import { NextApiRequest, NextApiResponse } from 'next';
import logger from './../../utils/serverLogger';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { makeGetRequest, makePostRequest } from '@/utils/http';
import { validateIdportenToken } from '@navikt/oasis';

const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;

function getUrl(req: NextApiRequest): string {
    const path = req?.url?.replace('/api', '');
    return `${backendUrl}${path}`;
}

async function makeApiRequest(request: NextApiRequest, oboToken: string): Promise<Response> {
    const url = getUrl(request);
    if (request.method!.toUpperCase() === 'GET') {
        return makeGetRequest(url, oboToken);
    }
    if (request.method!.toUpperCase() === 'POST') {
        return makePostRequest(url, oboToken, request);
    }
    return Promise.reject(new Error(`Unsupported method ${request.method}`));
}

const middlewareLive = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    // Query-params logges ikke — de kan inneholde personopplysninger.
    const requestContext = { path: request.url?.split('?')[0], method: request.method };
    let oboToken = null;
    try {
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw Error('Mangler token');
        }
        const validationResult = await validateIdportenToken(authorizationHeader);
        if (!validationResult.ok) {
            throw validationResult.error;
        }
        oboToken = await getOnBehalfOfToken(request.headers.authorization!);
    } catch (error) {
        logger.error({ err: error, ...requestContext }, 'Bruker har ikke tilgang');
        response.status(401).json({ message: 'Bruker har ikke tilgang' });
    }

    if (oboToken) {
        try {
            // Selve kallet (metode, url, status, varighet) logges i makeRequest — her logges kun avvik.
            const res = await makeApiRequest(request, oboToken as string);
            if (res.ok) {
                try {
                    const body = await res.json();
                    response.status(res.status).json(body);
                } catch (error) {
                    logger.error({ err: error, ...requestContext }, 'Respons er ikke gyldig JSON, returnerer 502');
                    response.status(502).json({ message: 'Bad Gateway' });
                }
            } else {
                const error = await res.text();
                response.status(res.status).json({ error: !error ? res.statusText : error });
            }
        } catch (error) {
            logger.error(
                { err: error, ...requestContext },
                `Fikk ikke kontakt med APIet, returnerer 502. Message: ${(error as Error).message}`,
            );
            response.status(502).json({ message: 'Bad Gateway' });
        }
    }
};

const middlewareDemo = async (request: NextApiRequest, response: NextApiResponse) => {
    return response.status(201).json({
        innsendingTidspunkt: new Date().toISOString(),
    });
};

// sørger for at NextJS sin default bodyParser ikke ødelegger for vedleggsopplastning
export const config = {
    api: {
        bodyParser: false,
    },
};

const middleware = process.env.IS_DEMO_MODE === 'true' ? middlewareDemo : middlewareLive;

export default middleware;
