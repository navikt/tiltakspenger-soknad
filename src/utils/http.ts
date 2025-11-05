import logger from '@/utils/serverLogger';
import { NextApiRequest } from 'next';

export async function makeGetRequest<T>(url: string, token: string): Promise<Response> {
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

export async function makePostRequest(url: string, token: string, request: NextApiRequest): Promise<Response> {
    logger.info(`Making request to ${url}`);
    const requestBuffer = await readRequestAsStream(request);
    return await fetch(url, {
        method: 'POST',
        body: requestBuffer,
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': request.headers['content-type'],
        } as HeadersInit,
    });
}
