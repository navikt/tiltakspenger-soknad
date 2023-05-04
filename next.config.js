const { buildCspHeader } = require('@navikt/nav-dekoratoren-moduler/ssr');
const { i18n } = require('./next-i18next.config')

let isDevelopment = process.env.NODE_ENV === 'development';

const appDirectives = {
    'script-src-elem': ["'self'"],
    'style-src-elem': ["'self'"],
    'connect-src': isDevelopment ? ["'self'"] : [],
};

/** @type {import('next').NextConfig} */
module.exports = {
    i18n,
    output: 'standalone',
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
