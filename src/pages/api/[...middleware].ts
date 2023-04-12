import { NextApiRequest, NextApiResponse } from 'next';
import logger from './../../utils/serverLogger';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { makeGetRequest, makePostRequest } from '@/utils/http';

const backendUrl = process.env.TILTAKSPENGESOKNAD_API_URL;

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

export default async function middleware(request: NextApiRequest, response: NextApiResponse): Promise<void> {
    let oboToken = null;
    try {
        logger.info('Henter token');
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw Error('Mangler token');
        }
        oboToken = await getOnBehalfOfToken(authorizationHeader);
    } catch (error) {
        logger.info('Bruker har ikke tilgang', error);
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
                    response.status(502).json({ message: 'Bad Gateway' });
                }
            } else {
                logger.info('Respons var ikke OK');
                const error = await res.text();
                response.status(res.status).json({ error: !error ? res.statusText : error });
            }
        } catch (error) {
            logger.error(`Fikk ikke kontakt med APIet, returnerer 502. Message: ${(error as Error).message}`);
            response.status(502).json({ message: 'Bad Gateway' });
        }
    }
}
