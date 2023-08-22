import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React from "react";
import { Box, style } from "@mui/system";
import { Typography, useTheme } from "@mui/material";
import { firstLetterCapital } from "utils/commonFunctions";

const TablePopOver = (props) => {
  const { data } = props || {};
  const theme = useTheme();

  const { ip, Type, SubnetId, VPCName, Description, SubnetName, VPCId } =
    data || {};
  return (
    <Box className="outer_listbx">
      <Box
        className="outer_listbx_body"
        sx={{
          padding: "20px 30px 20px 20px",
          "& .listing_bx strong.MuiTypography-body2": {
            color: theme.palette.text.primary,
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            color: theme.palette.primary.dark,
          }}
        >
          {/* {cellData?.dstip} Info */}
          Destination Info
        </Typography>
        <List>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                IP :{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {ip}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                Type :{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {firstLetterCapital(Type)}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                Name :{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {SubnetName}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                Description :{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {Description}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                VPC Id:{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {VPCId}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                VPC Name:{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {VPCName}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                Subnet Id:{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {SubnetId}
              </Typography>
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <Box className="listing_bx">
              <Typography
                variant="body2"
                component="strong"
                fontWeight={600}
                fontSize={13}
              >
                Subnet Name:{" "}
              </Typography>
              <Typography variant="body2" component="span" fontSize={13}>
                {SubnetName}
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
export default TablePopOver;
