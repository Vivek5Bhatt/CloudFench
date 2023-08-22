// ** MUI Imports
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { firstLetterCapital } from "utils/commonFunctions";

const ListCheckbox = ({
  datas,
  setAddress,
  policies,
  setPolicies,
  selectedIndex,
  type,
  searchDatas,
  addressChecked,
  setAddressChecked,
  isEditMode,
  policy,
  editAbleData,
  updateClickableRow,
  checkDisabled,
}) => {
  const [checked, setChecked] = useState([]);
  const theme = useTheme();
  let clone = policies.map((item) => {
    return {
      ...item,
    };
  });
  let temp;
  if (type === "service") {
    temp = [...clone[selectedIndex].service];
  } else if (type === "internet-service-name") {
    temp = [...clone[selectedIndex]["internet-service-name"]];
  } else if (type === "address") {
    temp = [...clone[selectedIndex].dstaddr];
  }

  const handleToggle = (value, data, bool) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    if (type === "service") {
      if (!bool) {
        temp = temp.filter((item) => item.name !== "ALL");
        temp.push(data);
        clone[selectedIndex]["service"] = temp;
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "service",
            editData: editData[0].service,
          };
          updateClickableRow(adKeys);
        }
      } else {
        const findIndex = temp.findIndex((item) => item.name === data.name);
        temp.splice(findIndex, 1);
        if (temp.length === 0) {
          temp.push({ name: "all" });
        }
        clone[selectedIndex]["service"] = temp;
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "service",
            editData: editData[0].service,
          };
          updateClickableRow(adKeys);
        }
      }
    } else if (type === "internet-service-name") {
      if (!bool) {
        temp = temp.filter((item) => item.name !== "all");
        temp.push(data);
        clone[selectedIndex]["internet-service-name"] = temp;
        clone[selectedIndex]["internet-service"] = "enable";
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "internet-service-name",
            editData: editData[0]["internet-service-name"],
          };
          updateClickableRow(adKeys);
        }
      } else {
        const findIndex = temp.findIndex((item) => item.name === data.name);
        temp.splice(findIndex, 1);
        if (temp.length === 0) {
          clone[selectedIndex]["internet-service"] = "disable";
          temp.push({ name: "all" });
        }
        clone[selectedIndex]["internet-service-name"] = temp;
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "internet-service-name",
            editData: [],
          };
          updateClickableRow(adKeys);
        }
      }
    } else if (type === "address") {
      if (!bool) {
        setAddressChecked(!addressChecked);
        [...clone[selectedIndex]["internet-service-name"]] = [];
        setPolicies(clone);
        temp = temp.filter((item) => item.name !== "all");
        temp.push(data);
        clone[selectedIndex]["dstaddr"] = temp;
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "dstaddr",
            editData: editData[0].dstaddr,
          };
          updateClickableRow(adKeys);
        }
      } else {
        setAddressChecked(!addressChecked);
        const findIndex = temp.findIndex((item) => item.name === data.name);
        temp.splice(findIndex, 1);
        clone[selectedIndex]["dstaddr"] = temp;
        setPolicies(clone);
        if (isEditMode) {
          const editData = clone.filter(
            (item) => item.policyid === editAbleData
          );
          let adKeys = {
            service: "dstaddr",
            editData: editData[0].dstaddr,
          };
          updateClickableRow(adKeys);
        }
      }
    }
  };

  return (
    <List
      sx={{
        maxHeight: "240px",
        overflowY: "auto",

        "& .MuiCheckbox-root": {
          padding: "0px",
        },
        "& .MuiListItemText-root": {
          margin: "0px",
        },
        "& .MuiListItemButton-root": {
          paddingTop: "4px",
          paddingBottom: "4px",
        },
        "& .MuiListItemIcon-root .MuiSvgIcon-root": {
          height: "auto !important",
        },
      }}
    >
      {datas
        ?.filter((item) =>
          item?.name?.toLowerCase().includes(searchDatas?.toLowerCase())
        )
        ?.map((data, index) => {
          const labelId = `checkbox-list-label-${index}`;
          const checkedName = temp.find((item) => item.name === data.name);
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(
                  index,
                  data,
                  // checked.indexOf(index) !== -1 ||
                  checkedName?.name === data.name
                )}
                dense
                disabled={checkDisabled(policy?.policyid)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      // checked.indexOf(index) !== -1 ||
                      checkedName?.name === data.name
                    }
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={firstLetterCapital(data.name)}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
};

export default ListCheckbox;
