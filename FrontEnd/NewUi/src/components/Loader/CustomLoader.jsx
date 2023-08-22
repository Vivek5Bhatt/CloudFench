import { Box } from "@mui/system";

import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { InfinitySpin } from "react-loader-spinner";

const CustomLoader = (props) => {
  const theme = useTheme();
  return (
    <Box
      className="cstm_loaderbx"
      sx={{
        // position: "absolute",
        // top: "0px",
        // right: "0px",
        // bottom: "0px",
        // left: "0px",
        width: "100%",
        minHeight: props?.minHeight ? props?.minHeight : "75vh",
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
export default CustomLoader;
