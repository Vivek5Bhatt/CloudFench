import React, { useState, memo } from "react";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { Typography, useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Select from "@mui/material/Select";
import { FormControl } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const SelectSize = (props) => {
  const {
    onChange,
    value,
    label,
    daysData,
    setDaysData,
    refreshClick,
    isTimer,
    id,
  } = props || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [opennew, setOpennew] = useState(false);

  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event);
    setOpennew(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickbx = () => {
    setOpennew(!opennew);
  };

  const handleChangeHours = (event) => {
    setDaysData && setDaysData(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingBottom: "15px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "20px !important",
            fontWeight: "500",
            paddingRight: "15px",
            [theme.breakpoints.down("sm")]: {
              fontSize: "18px !important",
            },
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <IconButton
            onClick={() => refreshClick && refreshClick()}
            sx={{ mr: "20px" }}
          >
            <RefreshIcon />
          </IconButton>
          <Box sx={{ paddingRight: "10px" }}>
            {/*select box  */}

            {!isTimer && (
              <FormControl
                size="small"
                sx={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "flex-end",

                  "& .MuiInputBase-formControl": {
                    backgroundColor: theme.palette.background.paper,
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    padding: "6.5px 14px",
                    minWidth: "3.5rem!important",
                  },
                }}
              >
                <Select
                  id={id && id}
                  onChange={handleChangeHours}
                  value={daysData}
                >
                  <MenuItem value={"hour"}>1 Hour</MenuItem>
                  <MenuItem value={"day"}>24 hour</MenuItem>
                  <MenuItem value={"week"}>7 days</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* select box end */}
          </Box>

          <Box>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <List sx={{ padding: "0px" }}>
              <ListItemButton
                onClick={handleClickbx}
                sx={{ padding: "4px 10px" }}
              >
                <ListItemIcon>
                  <ZoomOutMapOutlinedIcon sx={{ fontSize: "16px" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Resize"
                  sx={{
                    " & .MuiTypography-body1": {
                      fontSize: "14px",
                    },
                  }}
                />
                {opennew ? (
                  <ExpandLess sx={{ fontSize: "18px", marginLeft: "5px" }} />
                ) : (
                  <ExpandMore sx={{ fontSize: "18px", marginLeft: "5px" }} />
                )}
              </ListItemButton>
              <Collapse in={opennew} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ padding: "5px 10px" }}>
                    {/* select grid */}
                    <Grid
                      container
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Grid item>
                        <ButtonGroup
                          variant="outlined"
                          aria-label="outlined button group"
                          sx={{
                            border: "1px solid",
                            borderColor: "#89868d",
                            borderRadius: "0px",
                            marginBottom: "0px",
                            " & .cstm_boxgrid": {
                              width: "20px",
                              height: "20px",

                              borderRight: "1px solid",
                              borderColor: "#89868d",
                            },
                          }}
                        >
                          {[3, 4, 6, 12].map((value, index) => (
                            <Box
                              className="cstm_boxgrid"
                              onClick={() => handleChange(value)}
                              key={index}
                            >
                              <label className="cstm_checkbox_grid">
                                <input
                                  type="checkbox"
                                  checked={props.value === value ? true : false}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </Box>
                          ))}
                        </ButtonGroup>
                        <Typography
                          sx={{
                            mt: "0px",
                            fontSize: "10px",
                            textAlign: "right",
                          }}
                        >
                          {" "}
                          {props.value === value && value}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* select grid end */}
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default memo(SelectSize);
