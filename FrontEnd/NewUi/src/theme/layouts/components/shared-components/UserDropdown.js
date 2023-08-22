// ** React Imports
import { useState, Fragment, useEffect } from "react";
// ** Next Import
import { useRouter } from "next/router";
// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
// ** Icons Imports
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import AccountOutline from "mdi-material-ui/AccountOutline";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { deleteCookie, getCookie } from "cookies-next";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const theme = useTheme();

  // ** Hooks
  const router = useRouter();

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      fontSize: "1.375rem",
      color: "text.secondary",
    },
  };

  const handleLogOut = () => {
    deleteCookie("idToken");
    deleteCookie("token");
    deleteCookie("userId");
    deleteCookie("userName");
    router.push("/");
  };

  useEffect(() => {
    setUserName(getCookie("userName"));
  }, []);

  return (
    <Fragment>
      <Badge
        overlap="circular"
        sx={{ ml: 0, cursor: "pointer" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {/* <Avatar
          alt={userName}
          onClick={handleDropdownOpen}
        >
          <PermIdentityIcon fontSize='16px'></PermIdentityIcon>
        </Avatar> */}
        <Stack direction="row" spacing={1}>
          <Box
            className="profile_btnbx"
            onClick={handleDropdownOpen}
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Avatar alt={userName} onClick={handleDropdownOpen}>
              <PermIdentityIcon fontSize="16px"></PermIdentityIcon>
            </Avatar>
            <Typography className="profile_name" variant="body1">
              {userName}
            </Typography>
            <Typography className="iconbx" variant="body2">
              {!Boolean(anchorEl) ? (
                <KeyboardArrowDownIcon fontSize="16px"></KeyboardArrowDownIcon>
              ) : (
                <KeyboardArrowUpIcon fontSize="16px"></KeyboardArrowUpIcon>
              )}
            </Typography>
          </Box>
        </Stack>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar alt={userName} sx={{ width: "2.2rem", height: "2.2rem" }}>
                <PermIdentityIcon fontSize="16px"></PermIdentityIcon>
              </Avatar>
            </Badge>
            <Box
              sx={{
                display: "flex",
                marginLeft: 3,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{userName}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem> */}
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogOut}>
          <LogoutVariant
            sx={{
              marginRight: 2,
              fontSize: "1.375rem",
              color: "text.secondary",
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
