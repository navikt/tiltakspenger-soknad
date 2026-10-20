import { NextApiRequest, NextApiResponse } from 'next';
import logger from './../../utils/serverLogger';
import { getOnBehalfOfToken, validateAuthorizationHeader } from '@/utils/authentication';
import { makeGetRequest, makePostRequest } from '@/utils/http';
import { mockedBarn } from '@/mocks/mockedPersonalia';
import { DEMO_SESJON_COOKIE } from '@/mocks/demo';
import { mottaDemosøknad } from '@/mocks/demoInnsendinger';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { SøknadUtenEndringerResponse } from '@/types/SøknadResponse';

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
        await validateAuthorizationHeader(request.headers.authorization);
        oboToken = await getOnBehalfOfToken(request.headers.authorization);
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
            } else if (res.status === 409) {
                // Søknaden har de samme svarene som en vi allerede har mottatt: nettleseren trenger svaret som det er for å vise når vi mottok den.
                response.setHeader('Content-Type', res.headers.get('content-type') ?? 'application/json');
                response.status(409).send(await res.text());
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

async function lesInnsendteSvar(request: NextApiRequest): Promise<InnsendteSvar> {
    const deler: Buffer[] = [];
    for await (const del of request) {
        deler.push(del as Buffer);
    }
    const formData = await new Response(Buffer.concat(deler), {
        headers: { 'content-type': request.headers['content-type'] ?? '' },
    }).formData();
    return JSON.parse(formData.get('søknad') as string);
}

const middlewareDemo = async (request: NextApiRequest, response: NextApiResponse) => {
    const path = request.url?.split('?')[0];
    const method = request.method?.toUpperCase();
    if (method === 'GET' && path?.endsWith('/personalia/barn')) {
        return response.status(200).json({ barn: mockedBarn });
    }
    if (method === 'POST' && path?.endsWith('/soknad')) {
        const resultat = mottaDemosøknad(request.cookies, await lesInnsendteSvar(request));
        if (resultat.type === 'utenEndringer') {
            const body: SøknadUtenEndringerResponse = {
                kode: 'SØKNAD_UTEN_ENDRINGER',
                mottatt: resultat.mottatt,
                melding: 'Søknaden har de samme svarene som en søknad vi allerede har mottatt.',
            };
            return response.status(409).json(body);
        }
        if (resultat.nySesjon) {
            response.setHeader('Set-Cookie', `${DEMO_SESJON_COOKIE}=${resultat.nySesjon}; Path=/; SameSite=Lax`);
        }
        return response.status(201).json({ innsendingTidspunkt: resultat.mottatt });
    }
    return response.status(404).json({ message: 'Finnes ikke i demoen' });
};

// sørger for at NextJS sin default bodyParser ikke ødelegger for vedleggsopplastning
export const config = {
    api: {
        bodyParser: false,
    },
};

const middleware = process.env.IS_DEMO_MODE === 'true' ? middlewareDemo : middlewareLive;

export default middleware;
