import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import BlockIcon from "@mui/icons-material/Block";

const CustomChip = (props) => {
  const { label, iconType, changeIconColor, isOnlyTickIcon } = props || {};
  return (
    <Chip
      size="small"
      variant="text"
      icon={
        isOnlyTickIcon ? (
          <CheckCircleIcon color={changeIconColor ? "success" : "disabled"} />
        ) : iconType ? (
          <CheckCircleIcon color={"success"} />
        ) : (
          <BlockIcon color="error" />
        )
      }
      label={label && label}
      sx={{
        backgroundColor: "transparent",
        borderRadius: "0px",
        "&:hover": {
          backgroundColor: "transparent",
        },
        "& .MuiChip-label": {
          paddingLeft: "0px !important",
        },
        "& .MuiSvgIcon-root": {
          marginRight: "2px !important",
          //   fill: changeIconColor && iconType ? "gray !important" : "",
        },
      }}
    />
  );
};
export default CustomChip;
