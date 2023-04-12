import logger from '@/utils/serverLogger';
import { NextApiRequest } from 'next';

export async function makeGetRequest(url: string, token: string): Promise<Response> {
    logger.info(`Making request to ${url}`);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    return await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
}

export async function makePostRequest(url: string, token: string, request: NextApiRequest): Promise<Response> {
    logger.info(`Making request to ${url}`);
    return await fetch(url, {
        method: 'POST',
        body: request.body,
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': request.headers['content-type'],
        } as HeadersInit,
    });
}
