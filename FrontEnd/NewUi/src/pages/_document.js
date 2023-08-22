/* eslint-disable @next/next/no-sync-scripts */
// ** React Import
import { Children } from "react";
// ** Next Import
import Document, { Html, Head, Main, NextScript } from "next/document";
// ** Emotion Imports
import createEmotionServer from "@emotion/server/create-instance";
// ** Utils Imports
import { createEmotionCache } from "src/theme/utils/create-emotion-cache";

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
          <script src="https://code.highcharts.com/highcharts.js"></script>

          <script src="https://code.highcharts.com/highcharts-more.src.js"></script>
          <script src="https://code.highcharts.com/modules/networkgraph.js"></script>

          <script src="https://code.highcharts.com/css/highcharts.css"></script>

          <script src="https://code.highcharts.com/modules/treemap.js"></script>

          <script src="https://code.highcharts.com/modules/treegraph.js"></script>

          <script src="https://code.highcharts.com/modules/exporting.js"></script>
          <script src="https://code.highcharts.com/modules/accessibility.js"></script>

          <script src="https://cdn.anychart.com/releases/8.11.1/js/anychart-core.min.js?hcode=a0c21fc77e1449cc86299c5faa067dc4"></script>
          <script src="https://cdn.anychart.com/releases/8.11.1/js/anychart-graph.min.js?hcode=a0c21fc77e1449cc86299c5faa067dc4"></script>
          <script src="https://cdn.anychart.com/releases/8.11.1/js/anychart-exports.min.js?hcode=a0c21fc77e1449cc86299c5faa067dc4"></script>
          <script src="https://cdn.anychart.com/releases/8.11.1/js/anychart-ui.min.js?hcode=a0c21fc77e1449cc86299c5faa067dc4"></script>

          <script>window.highcharts = Highcharts;</script>

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/images/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        ),
    });
  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = emotionStyles.styles.map((style) => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
      />
    );
  });

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};

export default CustomDocument;
