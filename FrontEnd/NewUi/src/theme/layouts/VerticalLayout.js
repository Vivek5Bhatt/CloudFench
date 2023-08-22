// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// ** Icons Imports
import ArrowUp from "mdi-material-ui/ArrowUp";

// ** Theme Config Import
import themeConfig from "theme.config";

// ** Components
import AppBar from "./components/vertical/appBar";
import Navigation from "./components/vertical/navigation";
import Footer from "./components/shared-components/footer";
import ScrollToTop from "src/theme/components/scroll-to-top";

// ** Styled Component
import DatePickerWrapper from "src/theme/styles/libs/react-datepicker";
import SocketProvider from "src/components/Socket/SocketProvider";
import Socket from "src/components/Socket/Socket";

const VerticalLayoutWrapper = styled("div")({
  height: "100%",
  display: "flex",
});

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
});

const ContentWrapper = styled("main")(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  padding: theme.spacing(6),
  transition: "padding .25s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const VerticalLayout = (props) => {
  // ** Props
  const { settings, children, scrollToTop } = props;

  // ** Vars
  const { contentWidth } = settings;
  const navWidth = themeConfig.navigationSize;

  // ** States
  const [navVisible, setNavVisible] = useState(false);

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible);

  const handleConnect = () => {
    console.log("~ connected");
  };
  const handleDisconnect = () => {
    console.log("~ disconnected");
  };
  return (
    <>
      <SocketProvider>
        <Socket on="connect" callback={handleConnect} />
        <Socket on="disconnect" callback={handleDisconnect} />
        <VerticalLayoutWrapper
          className={`${
            navVisible ? "small_layout_wrapper" : ""
          } layout-wrapper`}
        >
          <Navigation
            className="side_menu_layout"
            navWidth={navWidth}
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            toggleNavVisibility={toggleNavVisibility}
            {...props}
          />
          <MainContentWrapper className="layout-content-wrapper">
            <AppBar toggleNavVisibility={toggleNavVisibility} {...props} />

            <ContentWrapper
              className="layout-page-content"
              sx={{
                paddingBottom: "10px",
                ...(contentWidth === "boxed" && {
                  mx: "auto",
                  "@media (min-width:1440px)": { maxWidth: "100%" },
                  "@media (min-width:1200px)": { maxWidth: "100%" },
                }),
              }}
            >
              {children}
            </ContentWrapper>

            <Footer {...props} />

            <DatePickerWrapper sx={{ zIndex: 11 }}>
              <Box id="react-datepicker-portal"></Box>
            </DatePickerWrapper>
          </MainContentWrapper>
        </VerticalLayoutWrapper>
      </SocketProvider>
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className="mui-fixed">
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  );
};

export default VerticalLayout;
