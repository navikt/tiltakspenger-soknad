import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { DecoratorComponentsReact, fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import serverLogger from '@/utils/serverLogger';

interface PageDocumentProps {
    Decorator: DecoratorComponentsReact;
}

class PageDocument extends Document<PageDocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        serverLogger.info(`Setter opp dekoratør med env satt til: ${(process.env.DEKORATOR_ENV as any) || 'dev'}`);

        const Decorator = await fetchDecoratorReact({
            env: (process.env.DEKORATOR_ENV as any) || 'prod',
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
