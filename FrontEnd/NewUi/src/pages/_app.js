import Head from "next/head";
import { Router } from "next/router";
// ** Loader Import
import NProgress from "nprogress";
// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
// ** Config Imports
import themeConfig from "theme.config";
// ** Component Imports
import UserLayout from "src/components/Layout";
import ThemeComponent from "src/theme/theme/ThemeComponent";
// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/theme/context/settingsContext";
// ** Utils Imports
import { createEmotionCache } from "src/theme/utils/create-emotion-cache";
// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
// ** Global css styles
import "styles/globals.css";
// ** Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "utils/redux/store";

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // Variables
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${process.env.NEXT_PUBLIC_APP_TITLE}`}</title>
          <meta
            name="description"
            content={`${process.env.NEXT_PUBLIC_APP_TITLE}`}
          />
          <meta
            name="keywords"
            content="Material Design, MUI, Admin Template, React Admin Template"
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  {getLayout(<Component {...pageProps} />)}
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
          <ToastContainer theme="colored" autoClose={2000} />
        </SettingsProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
