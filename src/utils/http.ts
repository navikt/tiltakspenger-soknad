import logger from '@/utils/serverLogger';

export async function makeGetRequest(url: string, token: string): Promise<Response> {
    logger.info(`Making request to ${url}`);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    return await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
}

export async function makePostRequest(url: string, token: string, body?: any): Promise<Response> {
    logger.info(`Making request to ${url}`);
    return await fetch(url, {
        method: 'POST',
        body,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
}
