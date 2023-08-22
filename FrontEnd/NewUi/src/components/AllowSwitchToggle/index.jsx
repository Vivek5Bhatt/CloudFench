// ** MUI Imports
import { styled, useTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    disabled={
      (props.policy.policyid !== props.editAbleData && !props.isEditMode) ||
      (props.isEditMode && !props.validateRow.includes(props.policy.policyid))
    }
    checked={
      props.clone[props.selectedIndex]["action"] === "accept" ? true : false
    }
    onChange={(event) => {
      props.clone[props.selectedIndex]["action"] = event.target.checked
        ? "accept"
        : "deny";
      props.setPolicies(props.clone);
      props.isEditMode && props.updateClickableRow(event.target.checked);
    }}
  />
))(({ theme }) => ({
  width: 35,
  height: 18,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.green.light,
        opacity: 1,
        border: 0,
      },

      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },

    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-track::before, & .MuiSwitch-track::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track::before": {
    backgroundImage: `url('/images/tick-green.svg')`,
    backgroundSize: "12px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    left: "2px",
  },
  "& .MuiSwitch-track::after": {
    backgroundImage: `url('/images/blocked.svg')`,
    backgroundSize: "10px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    right: "2px",
  },

  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 14,
    height: 14,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.red.light,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const AllowSwitchToggle = ({
  policy,
  setPolicies,
  selectedIndex,
  policies,
  isEditMode,
  setNewEditData,
  newEditData,
  editAbleData,
  updateClickableRow,
  validateRow,
}) => {
  const theme = useTheme();
  let clone = policies.map((item) => {
    return {
      ...item,
    };
  });
  return (
    <>
      <FormControlLabel
        sx={{
          margin: "0px",
        }}
        control={
          <CustomSwitch
            policy={policy}
            policies={policies}
            setPolicies={setPolicies}
            selectedIndex={selectedIndex}
            clone={clone}
            isEditMode={isEditMode}
            setNewEditData={setNewEditData}
            newEditData={newEditData}
            editAbleData={editAbleData}
            updateClickableRow={updateClickableRow}
            validateRow={validateRow}
          />
        }
      />
    </>
  );
};

export default AllowSwitchToggle;
