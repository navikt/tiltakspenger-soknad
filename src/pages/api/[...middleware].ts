import { NextApiRequest, NextApiResponse } from 'next';
import logger from './../../utils/serverLogger';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { makeGetRequest, makePostRequest } from '@/utils/http';
import { validateIdportenToken } from '@navikt/next-auth-wonderwall';

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
    return Promise.reject(`Unsupported method ${request.method}`);
}

const middlewareLive = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    let oboToken = null;
    try {
        logger.info('Henter token');
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw Error('Mangler token');
        }
        const validationResult = await validateIdportenToken(authorizationHeader);
        if (validationResult !== 'valid') {
            throw validationResult;
        }
        oboToken = await getOnBehalfOfToken(request.headers.authorization!!);
    } catch (error) {
        logger.error('Bruker har ikke tilgang', error);
        response.status(401).json({ message: 'Bruker har ikke tilgang' });
    }
    if (oboToken) {
        logger.info('Starter http kall');
        try {
            const res = await makeApiRequest(request, oboToken as string);
            if (res.ok) {
                try {
                    const body = await res.json();
                    logger.info('Returnerer respons');
                    response.status(res.status).json(body);
                } catch (error) {
                    logger.error(`Respons er ikke gyldig JSON, returnerer 502. Message: ${(error as Error).message}`);
                    response.status(502).json({ message: 'Bad Gateway' });
                }
            } else {
                logger.info(`Respons var ikke OK. Status: ${res.status}`);
                const error = await res.text();
                response.status(res.status).json({ error: !error ? res.statusText : error });
            }
        } catch (error) {
            logger.error(`Fikk ikke kontakt med APIet, returnerer 502. Message: ${(error as Error).message}`);
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
