import logger from '@/utils/serverLogger';
import { NextApiRequest } from 'next';

const TIMEOUT_DEFAULT = 10000;

// trace_id/span_id injiseres automatisk i loggene av OTel-autoinstrumenteringen,
// og propageres til backend via traceparent-headeren på fetch-kallet.
async function makeRequest(
    url: string,
    timeout: number,
    init: RequestInit & { method: string },
): Promise<Response> {
    const start = Date.now();
    logger.info({ url, method: init.method }, `Making request to ${url}`);
    try {
        const response = await fetch(url, {
            ...init,
            signal: AbortSignal.timeout(timeout),
        });
        logger.info(
            { url, method: init.method, status: response.status, durationMs: Date.now() - start },
            `Request to ${url} completed with status ${response.status}`,
        );
        return response;
    } catch (err) {
        const durationMs = Date.now() - start;
        logger.error(
            { err, url, method: init.method, durationMs, timeout },
            `Request to ${url} failed after ${durationMs}ms (timeout ${timeout}ms)`,
        );
        throw err;
    }
}

export async function makeGetRequest(url: string, token: string, timeout: number = TIMEOUT_DEFAULT): Promise<Response> {
    return makeRequest(url, timeout, {
        method: 'GET',
        headers: {
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
    const requestBuffer = await readRequestAsStream(request);
    const body = new Uint8Array(requestBuffer);
    return makeRequest(url, timeout, {
        method: 'POST',
        body: body,
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': request.headers['content-type'],
        } as HeadersInit,
    });
}
