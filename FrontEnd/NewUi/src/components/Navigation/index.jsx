import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { useTheme } from "@mui/material/styles";
import PowerOutlinedIcon from "@mui/icons-material/PowerOutlined";
import CableOutlinedIcon from "@mui/icons-material/CableOutlined";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import Divider from "@mui/material/Divider";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { useSelector } from "react-redux";
import { ClickAwayListener } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function NestedList({ setNavVisible }) {
  const [open, setOpen] = useState(null);
  const [openNested, setOpenNested] = useState(null);
  const { navToggle } = useSelector((e) => e.navbar);

  useEffect(() => {
    setOpen(null);
  }, [navToggle]);

  const handleClick = (id) => {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
      console.log(id);
    }
  };

  const handleNested = (id) => {
    if (openNested === id) {
      setOpenNested(null);
    } else {
      setOpenNested(id);
    }
  };

  const router = useRouter();
  const theme = useTheme();

  const handleRoute = (url) => {
    setNavVisible(false);
    router.push(url);
  };

  const currentRoute = router.pathname.includes("/admin/settings");

  const handleClickAway = () => {
    setOpen(null);
  };

  return (
    // <ClickAwayListener onClickAway={handleClickAway}>
    <List
      className="cstm-menubar"
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        "& .MuiButtonBase-root": {
          paddingLeft: "20px",
        },
        "& .subtitle .MuiTypography-root": {
          fontSize: "14px",
        },
        "& .MuiListSubheader-root": {
          fontWeight: "600",
          color: theme.palette.blue.bluelight,
          fontSize: "14px",
          paddingLeft: "28px",
          lineHeight: "38px",
        },
        "& .titlenav": {
          marginBottom: "10px",
        },
        "& .MuiCollapse-wrapper .MuiButtonBase-root .MuiSvgIcon-root": {
          width: "20px",
          hright: "auto",
        },
        "& .sub_menucollapse .MuiTypography-root": {
          fontSize: "14px",
        },
        "& .MuiCollapse-root .MuiButtonBase-root ": {
          paddingLeft: "28px",
        },
        "& .MuiCollapse-root .MuiCollapse-root .MuiButtonBase-root ": {
          paddingLeft: "36px",
        },
        "& .subtitle_menutop": {
          padding: "0px 0px 0px 18px",
          lineHeight: "26px",
        },
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {!currentRoute ? (
        <>
          <ListItemButton
            className={router.pathname === "/admin/dashboard" ? "active" : ""}
            onClick={() => {
              handleRoute("/admin/dashboard");
              // handleClick(5);
            }}
          >
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
            {/* {open === 5 ? (
              <ExpandLess className="arrow_icon" />
            ) : (
              <ExpandMore className="arrow_icon" />
            )} */}
          </ListItemButton>
          <ListItemButton
            onClick={() => handleRoute("/admin/external-exposure")}
            className={
              router.pathname === "/admin/external-exposure" ? "active" : ""
            }
          >
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText primary="External Exposure" />
          </ListItemButton>

          {/* <Collapse in={open === 5} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => handleRoute("/admin/external-exposure")}
                className={
                  router.pathname === "/admin/external-exposure" ? "active" : ""
                }
              >
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="External Exposure" />
              </ListItemButton>
            </List>
          </Collapse> */}

          <ListItemButton onClick={() => handleClick(2)} className="titlenav">
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            <ListItemText primary="Configuration" />
            {open === 2 ? (
              <ExpandLess className="arrow_icon" />
            ) : (
              <ExpandMore className="arrow_icon" />
            )}
          </ListItemButton>
          <Collapse
            in={open === 2}
            timeout="auto"
            unmountOnExit
            className="configuration_collapsebx"
          >
            <List component="div" disablePadding>
              <ListSubheader component="div" id="nested-list-subheader">
                Secure Nat Gw
              </ListSubheader>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/secure-nat-gw/policies"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/secure-nat-gw/policies")
                }
              >
                <ListItemIcon>
                  <GppGoodOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Policies" className="subtitle" />
              </ListItemButton>
              {/* web security collapase */}
              <ListItemButton
                onClick={() => handleNested(21)}
                className="titlenav sub_menucollapse"
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" />
                {openNested === 21 ? (
                  <ExpandLess className="arrow_icon" />
                ) : (
                  <ExpandMore className="arrow_icon" />
                )}
              </ListItemButton>
              <Collapse in={openNested === 21} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    className={
                      router.pathname ===
                      "/admin/configuration/secure-nat-gw/security/web-security"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleRoute(
                        "/admin/configuration/secure-nat-gw/security/web-security"
                      )
                    }
                  >
                    <ListItemIcon>
                      <VpnLockIcon />
                    </ListItemIcon>
                    <ListItemText primary="Web Security" className="subtitle" />
                  </ListItemButton>
                </List>
              </Collapse>
              {/* collapse end */}
              <ListSubheader component="div" id="nested-list-subheader">
                internal Segmentation
              </ListSubheader>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/internal-segmentation/policies"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute(
                    "/admin/configuration/internal-segmentation/policies"
                  )
                }
              >
                <ListItemIcon>
                  <GppGoodOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Policies" className="subtitle" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/internal-segmentation/security"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute(
                    "/admin/configuration/internal-segmentation/security"
                  )
                }
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" className="subtitle" />
              </ListItemButton>

              {/* objects menu */}
              {/* <ListSubheader component="div" id="nested-list-subheader">
                Objects
              </ListSubheader>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === "/admin/configuration/objects/address"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/objects/address")
                }
              >
                <ListItemIcon>
                  <LocationOnOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Address" className="subtitle" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === "/admin/configuration/objects/service"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/objects/service")
                }
              >
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Service" className="subtitle" />
              </ListItemButton> */}
              {/* <Divider
                className="inner_divider"
                sx={{
                  margin: "0px 0 4px 0",
                  marginLeft: "15px",
                }}
              /> */}
              {/* objects end */}

              <ListSubheader component="div" id="nested-list-subheader">
                Remote Access
              </ListSubheader>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/remote-access/policies"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/remote-access/policies")
                }
              >
                <ListItemIcon>
                  <GppGoodOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Policies" className="subtitle" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/remote-access/security"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/remote-access/security")
                }
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" className="subtitle" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/remote-access/settings"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/configuration/remote-access/settings")
                }
              >
                <ListItemIcon>
                  <SettingsSuggestOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" className="subtitle" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton onClick={() => handleClick(3)} className="titlenav">
            <ListItemIcon>
              <LeaderboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Monitor & Logs" />
            {open === 3 ? (
              <ExpandLess className="arrow_icon" />
            ) : (
              <ExpandMore className="arrow_icon" />
            )}
          </ListItemButton>
          <Collapse in={open === 3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === "/admin/monitor-logs/traffic-activity"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/monitor-logs/traffic-activity")
                }
              >
                <ListItemIcon>
                  <AdsClickIcon />
                </ListItemIcon>
                <ListItemText primary="Traffic Activity" className="subtitle" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === "/admin/monitor-logs/malware-protection"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute("/admin/monitor-logs/malware-protection")
                }
              >
                <ListItemIcon>
                  <AdminPanelSettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Malware Protection"
                  className="subtitle"
                />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === "/admin/monitor-logs/compliance"
                    ? "active"
                    : ""
                }
                onClick={() => handleRoute("/admin/monitor-logs/compliance")}
              >
                <ListItemIcon>
                  <AssignmentOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Compliance" className="subtitle" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* <ListItemButton className="titlenav" onClick={() => handleClick(4)}>
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {open === 1 ? (
              <ExpandLess className="arrow_icon" />
            ) : (
              <ExpandMore className="arrow_icon" />
            )}
          </ListItemButton> */}
          {/* <Collapse in={open === 4} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListSubheader component="div" id="nested-list-subheader">
                Stack Settings
              </ListSubheader>
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname ===
                  "/admin/configuration/stack-settings/stack-connectivity"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleRoute(
                    "/admin/configuration/stack-settings/stack-connectivity"
                  )
                }
              >
                <ListItemIcon>
                  <LayersOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Stack Connectivity"
                  className="subtitle"
                />
              </ListItemButton>
            </List>
          </Collapse> */}
        </>
      ) : (
        <>
          <ListItemButton
            className={
              router.pathname === "/admin/settings/connectors"
                ? "active titlenav"
                : "titlenav"
            }
            onClick={() => handleRoute("/admin/settings/connectors")}
          >
            <ListItemIcon>
              <CableOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Connectors" />
          </ListItemButton>
          <ListItemButton
            className={
              router.pathname === "/admin/settings/deployments"
                ? "active titlenav"
                : "titlenav"
            }
            onClick={() => handleRoute("/admin/settings/deployments")}
          >
            <ListItemIcon>
              <PowerOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Deployments" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            className={
              router.pathname ===
              "/admin/settings/stack-settings/stack-connectivity"
                ? "active"
                : ""
            }
            onClick={() =>
              handleRoute("/admin/settings/stack-settings/stack-connectivity")
            }
          >
            <ListItemIcon>
              <LayersOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Stack Connectivity" className="subtitle" />
          </ListItemButton>
        </>
      )}
    </List>
    // </ClickAwayListener>
  );
}
