// ** MUI Imports
import Box from "@mui/material/Box";
import { InfinitySpin } from "react-loader-spinner";
import { useTheme } from "@mui/material/styles";

const Loader = () => {
  const theme = useTheme();
  return (
    <Box
      className="cstm_loaderbx"
      sx={{
        position: "absolute",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        zIndex: " 9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <InfinitySpin width="200" color={theme.palette.primary.main} />
    </Box>
  );
};

export default Loader;
