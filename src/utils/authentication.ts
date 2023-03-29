import logger from '@/utils/serverLogger';
import nodeJose from 'node-jose';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import { NextApiRequest } from 'next';

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

    const now = Math.floor(Date.now() / 1000);

    const assertionClaims = {
        sub: process.env.TOKEN_X_CLIENT_ID,
        iss: process.env.TOKEN_X_CLIENT_ID,
        aud: process.env.TOKEN_X_TOKEN_ENDPOINT,
        jti: uuidv4(),
        nbf: now,
        iat: now,
        exp: now + 10,
    };

    return jwt.sign(assertionClaims, key.toPEM(true), { header: assertionHeaders, algorithm: 'RS256' });
}

async function exchangeToken(subjectToken: string) {
    const key = await getKey(process.env.TOKEN_X_PRIVATE_JWK);
    const clientAssertion = createClientAssertion(key);
    const tokenEndpoint = process.env.TOKEN_X_TOKEN_ENDPOINT;
    const cluster = process.env.NAIS_CLUSTER_NAME;

    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
    params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    params.append('token_endpoint_auth_method', 'private_key_jwt');
    params.append('client_assertion', clientAssertion);
    params.append('subject_token_type', 'urn:ietf:params:oauth:token-type:jwt');
    params.append('subject_token', subjectToken);
    params.append('audience', `${cluster}:tpts:tiltakspenger-soknad-api`);

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

export async function getOnBehalfOfToken(authorizationHeader: string) {
    validateAuthorizationHeader(authorizationHeader);
    const subjectToken = removeBearer(authorizationHeader || '');
    const accessToken = await exchangeToken(subjectToken);
    return accessToken;
}
