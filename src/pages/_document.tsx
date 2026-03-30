import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { DecoratorComponentsReact, fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import serverLogger from '@/utils/serverLogger';

interface PageDocumentProps {
    Decorator: DecoratorComponentsReact;
}

class PageDocument extends Document<PageDocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        const dekoratorEnv = (process.env.DEKORATOR_ENV || 'prod') as 'prod'

        serverLogger.info(`Setter opp dekoratør med env satt til: ${dekoratorEnv}`);

        const Decorator = await fetchDecoratorReact({
            env: dekoratorEnv,
            params: {
                context: 'privatperson',
                simple: true,
                chatbot: false,
                level: 'Level4',
            },
        });

        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;

        return (
            <Html lang="no">
                <Head>
                    <Decorator.HeadAssets />
                </Head>
                <body>
                    <Decorator.Scripts />
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default PageDocument;
