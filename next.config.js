const { buildCspHeader } = require('@navikt/nav-dekoratoren-moduler/ssr');

let isDevelopment = process.env.NODE_ENV === 'development';

const appDirectives = {
    'script-src-elem': ["'self'"],
    'style-src-elem': ["'self'"],
    'img-src': isDevelopment ? ["'self'"] : [],
    'connect-src': isDevelopment
        ? ["'self'", process.env.NEXT_PUBLIC_TELEMETRY_URL]
        : [process.env.NEXT_PUBLIC_TELEMETRY_URL],
};

/** @type {import('next').NextConfig} */
module.exports = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    output: 'standalone',
    assetPrefix: process.env.ASSET_PREFIX,
    async headers() {
        const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
        const csp = await buildCspHeader(appDirectives, { env: environment });
        const securityHeaders = [
            {
                key: 'Content-Security-Policy',
                value: csp,
            },
            {
                key: 'X-Frame-Options',
                value: 'DENY',
            },
            {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
            },
            {
                key: 'Referrer-Policy',
                value: 'no-referrer',
            },
        ];

        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};
