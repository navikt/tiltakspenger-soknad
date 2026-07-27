import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Readable } from 'node:stream';
import type { NextApiRequest } from 'next';
import { makeGetRequest, makePostRequest, TIMEOUT_DEFAULT, TIMEOUT_INNSENDING } from './http';

/** Minimal stand-in for requesten Next gir oss: en lesbar strøm med headere. */
function fakeRequest(body: string): NextApiRequest {
    return Object.assign(Readable.from([Buffer.from(body)]), {
        headers: { 'content-type': 'multipart/form-data; boundary=xyz' },
    }) as unknown as NextApiRequest;
}

describe('http', () => {
    beforeEach(() => {
        jest.spyOn(AbortSignal, 'timeout');
        global.fetch = jest.fn(async () => new Response('{}', { status: 201 })) as typeof fetch;
    });

    test('innsending av søknad tåler at backend virusskanner vedleggene synkront', async () => {
        // Virusskanningen skjer inne i innsendingskallet: 5 vedlegg på 17,5 MB brukte 9 sekunder i ClamAV,
        // og grensene tillater 10 vedlegg på 50 MB. Med den korte timeouten gir BFF-en opp mens backend
        // fullfører, og brukeren får feilmelding på en søknad som faktisk ble registrert.
        await makePostRequest('http://api/soknad', 'token', fakeRequest('søknad'));

        expect(AbortSignal.timeout).toHaveBeenCalledWith(TIMEOUT_INNSENDING);
        expect(TIMEOUT_INNSENDING).toBeGreaterThanOrEqual(60_000);
    });

    test('vanlige oppslag beholder den korte timeouten', async () => {
        await makeGetRequest('http://api/personalia', 'token');

        expect(AbortSignal.timeout).toHaveBeenCalledWith(TIMEOUT_DEFAULT);
        expect(TIMEOUT_DEFAULT).toBe(10_000);
    });

    test('sender requestbodyen videre uendret', async () => {
        await makePostRequest('http://api/soknad', 'token', fakeRequest('vedleggsbytes'));

        const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
        expect(Buffer.from(init.body as Uint8Array).toString()).toBe('vedleggsbytes');
        expect(init.headers).toMatchObject({ 'content-type': 'multipart/form-data; boundary=xyz' });
    });
});
