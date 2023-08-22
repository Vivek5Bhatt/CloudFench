const DefaultPalette = (mode, themeColor) => {
  // ** Vars
  const lightColor = "58, 53, 65";
  const darkColor = "231, 227, 252";
  const mainColor = mode === "light" ? lightColor : darkColor;

  const primaryGradient = () => {
    if (themeColor === "primary") {
      return "#C6A7FE";
    } else if (themeColor === "secondary") {
      return "#9C9FA4";
    } else if (themeColor === "success") {
      return "#93DD5C";
    } else if (themeColor === "error") {
      return "#FF8C90";
    } else if (themeColor === "warning") {
      return "#FFCF5C";
    } else {
      return "#6ACDFF";
    }
  };

  return {
    customColors: {
      main: mainColor,
      primaryGradient: primaryGradient(),
      tableHeaderBg: mode === "light" ? "#F9FAFC" : "#3D3759",
    },
    common: {
      black: "#000",
      white: "#FFF",
    },
    mode: mode,
    primary: {
      light: "#61c5ff",
      main: "#49beff",
      dark: "#42a8e1",
      contrastText: "#FFF",
      100: "#d1efff",

      primarylight: `rgba(58, 53, 65, 0.87)`,
    },
    secondary: {
      light: "#9C9FA4",
      main: "#8A8D93",
      dark: "#777B82",
      contrastText: "#FFF",
    },
    success: {
      light: "#6AD01F",
      main: "#56CA00",
      dark: "#4CB200",
      contrastText: "#FFF",
    },
    error: {
      light: "#FF6166",
      main: "#FF4C51",
      dark: "#E04347",
      contrastText: "#FFF",
      optRed: "#E6A6A6",
    },
    warning: {
      light: "#FFCA64",
      main: "#FFB400",
      dark: "#E09E00",
      contrastText: "#FFF",
    },
    info: {
      light: "#32BAFF",
      main: "#16B1FF",
      dark: "#139CE0",
      contrastText: "#FFF",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#616161",
      A700: "#303030",
      A800: "#5D9273",
      A900: "#d4e3db",
    },
    red: {
      light: "#ffcfca",
    },
    green: {
      light: "#d0f1c5",
      greenOpct: "#A3CDB6",
    },
    blue: {
      bluelight: "#428099",
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`,
    },

    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === "light" ? "#FFF" : "#312D4B",
      default: mode === "light" ? "#F4F5FA" : "#28243D",
      textbg: mode === "light" ? "#f7f7f7" : "#28243d",
      allowbg: mode === "light" ? "#dff3ff" : "#28243d",
      bdrline: mode === "light" ? "#D5E6F2" : "#312D4B",
      chartnew: mode === "light" ? "#fff" : "#383452",
      netwrokgraph:
        mode === "light"
          ? "rgba(255, 255, 255, 0.82)"
          : "rgba(55, 53, 80, 0.82)",
      policiesicon: mode === "light" ? "#f7f6f6" : "#44434d",
      skycard: mode === "light" ? "#dbecf6" : "#383452",
      subroot: mode === "light" ? "#808080" : "#fff",
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  };
};

export default DefaultPalette;
