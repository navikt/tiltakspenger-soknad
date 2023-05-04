module.exports = {
    debug: process.env.NODE_ENV === 'development',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    i18n: {
        defaultLocale: 'nb',
        locales: ['nb', 'nn'],
    }
}