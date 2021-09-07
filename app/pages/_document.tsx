import {
  Document,
  Html,
  DocumentHead,
  Main,
  BlitzScript /*DocumentContext*/,
  DocumentContext,
} from "blitz";

import { Provider as StyletronProvider } from "styletron-react";
import { Sheet } from "styletron-engine-atomic";
import { styletron } from "utils/styletron";
type MyDocumentProps = { stylesheets: Sheet[] };

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: App => props => <StyletronProvider value={styletron}>
        <App {...props} />
      </StyletronProvider>
    });

    const initialProps = await Document.getInitialProps(ctx);
    const stylesheets = styletron.getStylesheets() || [];

    return {
      ...initialProps,
      stylesheets
    };
  }

  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <DocumentHead>
          {this.props.stylesheets.map((sheet, i) => <style
            className="_styletron_hydrate_"
            dangerouslySetInnerHTML={{
              __html: sheet.css
            }}
            media={sheet.attrs.media}
            data-hydrate={sheet.attrs["data-hydrate"]}
            key={i} />)}
        </DocumentHead>
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument
