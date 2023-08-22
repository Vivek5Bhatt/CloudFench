// ** MUI Imports
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import ListCheckbox from "src/components/ListCheckbox";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const TabsDestination = ({
  policy,
  datas,
  setAddress,
  policies,
  setPolicies,
  selectedIndex,
  address,
  isEditMode,
  setNewEditData,
  newEditData,
  editAbleData,
  updateClickableRow,
  validateRow,
  checkDisabled,
}) => {
  const [value, setValue] = useState("1");
  const [searchDestinations, setSearchDestinations] = useState("");
  const [addressChecked, setAddressChecked] = useState(true);

  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (policy["internet-service"] === "enable") {
      setAddressChecked(false);
    }
  }, []);

  return (
    <>
      <Box
        className="tab_content_box"
        sx={{ width: "100%", typography: "body1" }}
      >
        <TabContext
          value={policy["internet-service"] === "enable" ? "2" : value}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                disabled={policy["internet-service"] === "enable"}
                label="Address"
                value="1"
              />
              <Tab
                label="Internet Service"
                value="2"
                disabled={
                  !policy["internet-service"] === "enable" || addressChecked
                }
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box className="cstm_destination_list">
              <Box sx={{ paddingTop: "10px" }}>
                <TextField
                  sx={{
                    "& .MuiInputBase-input": {
                      paddingTop: "6.5px",
                      paddingBottom: "6.5px",
                    },
                  }}
                  id="input-with-icon-textfield"
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchDestinations}
                  onChange={(event) => {
                    setSearchDestinations(event.target.value);
                  }}
                />
              </Box>
              <ListCheckbox
                datas={address}
                type="address"
                addressChecked={addressChecked}
                setAddressChecked={setAddressChecked}
                setAddress={setAddress}
                policies={policies}
                setPolicies={setPolicies}
                selectedIndex={selectedIndex}
                searchDatas={searchDestinations}
                isEditMode={isEditMode}
                policy={policy}
                setNewEditData={setNewEditData}
                newEditData={newEditData}
                editAbleData={editAbleData}
                updateClickableRow={(val) => {
                  let clone = policies.map((item) => {
                    return {
                      ...item,
                    };
                  });
                  updateClickableRow(
                    clone,
                    val.service,
                    val.editData,
                    selectedIndex,
                    policy
                  );
                }}
                validateRow={validateRow}
                checkDisabled={checkDisabled}
              />
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box className="cstm_destination_list">
              <Box sx={{ paddingTop: "10px" }}>
                <TextField
                  sx={{
                    "& .MuiInputBase-input": {
                      paddingTop: "6.5px",
                      paddingBottom: "6.5px",
                    },
                  }}
                  id="input-with-icon-textfield"
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchDestinations}
                  onChange={(event) => {
                    setSearchDestinations(event.target.value);
                  }}
                />
              </Box>
              <ListCheckbox
                datas={datas}
                type="internet-service-name"
                policies={policies}
                setPolicies={setPolicies}
                selectedIndex={selectedIndex}
                searchDatas={searchDestinations}
                isEditMode={isEditMode}
                policy={policy}
                setNewEditData={setNewEditData}
                newEditData={newEditData}
                editAbleData={editAbleData}
                updateClickableRow={(val) => {
                  let clone = policies.map((item) => {
                    return {
                      ...item,
                    };
                  });
                  updateClickableRow(
                    clone,
                    val.service,
                    val.editData,
                    selectedIndex,
                    policy
                  );
                }}
                validateRow={validateRow}
                checkDisabled={checkDisabled}
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default TabsDestination;
