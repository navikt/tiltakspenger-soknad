import logger from '@/utils/serverLogger';
import { NextApiRequest } from 'next';

const TIMEOUT_DEFAULT = 10000;

export async function makeGetRequest(url: string, token: string, timeout: number = TIMEOUT_DEFAULT): Promise<Response> {
    logger.info(`Making request to ${url}`);
    return await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(timeout),
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
}

async function readRequestAsStream(request: NextApiRequest): Promise<Buffer> {
    const requestAsStream: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        request
            .on('readable', () => {
                const chunk = request.read();
                if (chunk !== null) {
                    requestAsStream.push(chunk);
                }
            })
            .on('end', () => {
                const buffer = Buffer.concat(requestAsStream);
                return resolve(buffer);
            })
            .on('error', (error) => {
                logger.error(`Error occured reading buffer ${JSON.stringify(error)}`);
                return reject(error);
            });
    });
}

export async function makePostRequest(
    url: string,
    token: string,
    request: NextApiRequest,
    timeout: number = TIMEOUT_DEFAULT,
): Promise<Response> {
    logger.info(`Making request to ${url}`);
    const requestBuffer = await readRequestAsStream(request);
    const body = new Uint8Array(requestBuffer);
    return await fetch(url, {
        method: 'POST',
        body: body,
        signal: AbortSignal.timeout(timeout),
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': request.headers['content-type'],
        } as HeadersInit,
    });
}
