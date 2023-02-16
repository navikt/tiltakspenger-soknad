import { NextApiRequest, NextApiResponse } from 'next';
import logger from './../../utils/serverLogger';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import nodeJose from 'node-jose';
import nodeFetch from 'node-fetch';

const backendUrl = process.env.TILTAKSPENGESOKNAD_API_URL;

async function getKey(jwk: any) {
    if (!jwk) {
        logger.error('JWK Mangler');
        throw Error('JWK Mangler');
    }

    return nodeJose.JWK.asKey(jwk).then((key: any) => {
        return Promise.resolve(key);
    });
}

function createClientAssertion(key: any) {
    const assertionHeaders = {
        kid: key.kid,
        typ: 'JWT',
        alg: 'RS256',
    };

    const assertionClaims = {
        sub: process.env.TOKEN_X_CLIENT_ID,
        iss: process.env.TOKEN_X_CLIENT_ID,
        aud: process.env.TOKEN_X_TOKEN_ENDPOINT,
        jti: uuidv4(),
        nbf: 1597783152,
        iat: 1597783152,
        exp: 1597783272,
    };

    return jwt.sign(assertionClaims, key.toPEM(true), { header: assertionHeaders, algorithm: 'RS256' });
}

async function exchangeToken(subjectToken: string) {
    const key = await getKey(process.env.TOKEN_X_PRIVATE_JWK);
    const clientAssertion = createClientAssertion(key);
    const tokenEndpoint = process.env.TOKEN_X_TOKEN_ENDPOINT;

    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
    params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    params.append('token_endpoint_auth_method', 'private_key_jwt');
    params.append('client_assertion', clientAssertion);
    params.append('subject_token_type', 'urn:ietf:params:oauth:token-type:jwt');
    params.append('subject_token', subjectToken);
    params.append('audience', `local:tpts:tiltakspengesoknad-api`);

    const response = await nodeFetch(tokenEndpoint || '', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    const data = await response.json();
    return (data as any).access_token;
}

function removeBearer(authorizationHeader: string) {
    return authorizationHeader.replace('Bearer ', '');
}

const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

function validateAuthorizationHeader(authorizationHeader: string | undefined) {
    if (!authorizationHeader) {
        throw new Error('Ingen tilgang');
    }
    const authToken = authorizationHeader.match(tokenRegex)?.groups?.token;
    if (!authToken) {
        throw new Error('Ingen tilgang');
    }
}

async function getToken(request: NextApiRequest) {
    const authorizationHeader = request.headers['authorization'];
    validateAuthorizationHeader(authorizationHeader);
    const subjectToken = removeBearer(authorizationHeader || '');
    const accessToken = await exchangeToken(subjectToken);
    return accessToken;
}

function getUrl(req: NextApiRequest): string {
    const path = req?.url?.replace('/api', '');
    return `${backendUrl}${path}`;
}

async function makeApiRequest(request: NextApiRequest, oboToken: string): Promise<Response> {
    const url = getUrl(request);
    logger.info(`Making request to ${url}`);
    return await fetch(url, {
        method: request.method,
        body: request.method === 'GET' ? undefined : request.body,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${oboToken}`,
        },
    });
}

export default async function middleware(request: NextApiRequest, response: NextApiResponse): Promise<void> {
    let oboToken = null;
    try {
        oboToken = await getToken(request);
    } catch (error) {
        logger.error('Bruker har ikke tilgang', error);
        response.status(401).json({ message: 'Bruker har ikke tilgang' });
    }
    if (oboToken) {
        try {
            const res = await makeApiRequest(request, oboToken as string);
            if (res.ok) {
                const body = await res.json();
                response.status(res.status).json(body);
            } else {
                const error = await res.text();
                response.status(res.status).json({ error: !error ? res.statusText : error });
            }
        } catch (error) {
            logger.error('Fikk ikke kontakt med APIet, returnerer 502', error);
            response.status(502).json({ message: 'Bad Gateway' });
        }
    }
}
