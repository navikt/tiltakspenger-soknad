import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import {
  fetchDecoratorReact,
  Components as DecoratorComponents,
  Components,
} from "@navikt/nav-dekoratoren-moduler/ssr";

interface PageDocumentProps {
  decoratorFragments: DecoratorComponents;
}

class PageDocument extends Document<PageDocumentProps> {
  static async getDecoratorFragments(): Promise<Components> {
    try {
      const fragments = await fetchDecoratorReact({
        env: "dev",
        context: "privatperson",
        simple: true,
        chatbot: false,
      });
      return fragments;
    } catch (error) {
      console.error("Henting av dekoratøren feilet", error);
      const emptyElement = () => <></>;
      return {
        Styles: emptyElement,
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
      decoratorFragments: { Header, Footer, Styles, Scripts },
    } = this.props;
    return (
      <Html lang="en">
        <Head>
          <Styles />
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
