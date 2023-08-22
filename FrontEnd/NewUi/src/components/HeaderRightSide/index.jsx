import { useRouter } from "next/router";
// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// ** Icons Imports
import Menu from "mdi-material-ui/Menu";
// ** Components
import ModeToggler from "src/theme/layouts/components/shared-components/ModeToggler";
import UserDropdown from "src/theme/layouts/components/shared-components/UserDropdown";
import NotificationDropdown from "src/theme/layouts/components/shared-components/NotificationDropdown";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import Image from "next/image";
import ArrowRight from "../../../public/images/humberger_toggle_righticon1.svg";
import ArrowLeft from "../../../public/images/humberger_toggle_icon.svg";
import ArrowRightDark from "../../../public/images/humberger_toggle_righticon_white.svg";
import ArrowLeftDark from "../../../public/images/humberger_toggle_icon.white.svg";

import { useDispatch } from "react-redux";
import { setSideNavToggle } from "utils/redux/features/navbar/Navbarslice";

const AppBarContent = (props) => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

  // ** Props
  const { settings, saveSettings, toggleNavVisibility } = props;

  // ** Hook
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleRoute = (url) => {
    router.push(url);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        className="actions-left"
        sx={{ mr: 2, display: "flex", alignItems: "center" }}
      >
        <IconButton
          className="humberger_btn"
          color="inherit"
          onClick={() => {
            setToggle(!toggle);
            dispatch(setSideNavToggle(!toggle));
            toggleNavVisibility();
          }}
          sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
        >
          {!toggle ? (
            // <ArrowBackIcon
            //   sx={{
            //     transition: "all 400ms ease-in-out",
            //   }}
            // />
            <Image
              width={15}
              height={15}
              src={theme.palette.mode === "dark" ? ArrowLeftDark : ArrowLeft}
              alt={"ArrowLeftDark"}
            />
          ) : (
            // <ArrowBackIcon
            //   sx={{
            //     transition: "all 400ms ease-in-out",
            //     transform: "rotate(180deg)",
            //   }}
            // />
            <Image
              width={15}
              height={15}
              src={theme.palette.mode === "dark" ? ArrowRightDark : ArrowRight}
              alt={"ArrowRightDark"}
            />
          )}
        </IconButton>
        <Box
          sx={{
            lineHeight: "1",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <IconButton
            color="inherit"
            aria-haspopup="true"
            aria-controls="customized-menu"
            sx={{
              padding: "6px",
            }}
            onClick={() => handleRoute("/admin/dashboard")}
          >
            <HomeOutlinedIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
      </Box>
      <Box
        className="actions-right"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown />
        <UserDropdown />
      </Box>
    </Box>
  );
};

export default AppBarContent;
