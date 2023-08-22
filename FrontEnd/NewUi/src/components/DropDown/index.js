import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CustomDropDown = (props) => {
  const { options, onChange, label, value, sx, disabled } = props || {};
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label && label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          sx={sx && sx}
          label=""
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled && disabled}
        >
          {(options || []).map((option, key) => {
            return (
              <MenuItem key={key} value={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomDropDown;
