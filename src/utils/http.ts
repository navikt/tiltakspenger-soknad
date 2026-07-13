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
    // Query-params logges ikke — de kan inneholde personopplysninger.
    const loggbarUrl = url.split('?')[0];
    try {
        const response = await fetch(url, {
            ...init,
            signal: AbortSignal.timeout(timeout),
        });
        const durationMs = Date.now() - start;
        logger.info(
            { url: loggbarUrl, method: init.method, status: response.status, durationMs },
            `${init.method} ${loggbarUrl} -> ${response.status} (${durationMs}ms)`,
        );
        return response;
    } catch (err) {
        const durationMs = Date.now() - start;
        // Logges ikke her — call site logger én feillinje med konsekvensen, og får konteksten via meldingen/cause.
        throw new Error(
            `${init.method} ${loggbarUrl} failed after ${durationMs}ms (timeout ${timeout}ms): ${(err as Error).message}`,
            { cause: err },
        );
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
                // Logges ikke her — feilen propagerer til call site som logger én feillinje.
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
