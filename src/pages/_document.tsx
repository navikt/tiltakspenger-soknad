import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { DecoratorComponentsReact, fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import serverLogger from '@/utils/serverLogger';

interface PageDocumentProps {
    decoratorFragments: DecoratorComponentsReact;
}

class PageDocument extends Document<PageDocumentProps> {
    static async getDecoratorFragments(): Promise<DecoratorComponentsReact> {
        serverLogger.info(`Setter opp dekoratør med env satt til: ${(process.env.DEKORATOR_ENV as any) || 'dev'}`);
        try {
            const fragments = await fetchDecoratorReact({
                env: (process.env.DEKORATOR_ENV as any) || 'dev',
                params: {
                    context: 'privatperson',
                    simple: true,
                    chatbot: false,
                    level: 'Level4',
                },
            });
            return fragments;
        } catch (error) {
            console.error('Henting av dekoratøren feilet', error);
            const emptyElement = () => <></>;
            return {
                HeadAssets: emptyElement,
                Scripts: emptyElement,
                Header: emptyElement,
                Footer: emptyElement,
            };
        }
    }

    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const decoratorFragments = await PageDocument.getDecoratorFragments();
        return { ...initialProps, decoratorFragments };
    }

    render() {
        const {
            decoratorFragments: { Header, Footer, HeadAssets, Scripts },
        } = this.props;
        return (
            <Html lang="no">
                <Head>
                    <HeadAssets />
                </Head>
                <body>
                    <Scripts />
                    <Header />
                    <Main />
                    <Footer />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default PageDocument;
