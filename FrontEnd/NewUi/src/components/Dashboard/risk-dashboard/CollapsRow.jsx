import { IconButton, TableRow, TableCell, Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import CustomTable from "src/components/Tables/CustomTable";
import { useTheme } from "@emotion/react";
import Image from "next/image";
import { useState } from "react";
import Serverless from "src/components/Dashboard/risk-dashboard/Serverless";
import ExposeContainer from "src/components/Dashboard/risk-dashboard/ExposeContainer";
import ExposedDatabase from "src/components/Dashboard/risk-dashboard/ExposedDatabase";
import AWSIMG from "public/images/awsimg/aws.svg";

const BytesStyle = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
});
const columndD = (theme) => {
  const columns = [
    {
      id: "instance_id",
      label: "Virtual Machine ",
      textAlign: "left",
    },
    {
      id: "region",
      label: "Location",
      textAlign: "left",
    },
    {
      id: "public_ip_address",
      label: "Public endpoint ",
      textAlign: "left",
    },
    {
      id: "security_groups",
      label: "Internet exposed ports  ",
      textAlign: "left",
    },
    {
      id: "instance_profile_name",
      label: "Attached Identity",
      textAlign: "left",
    },
  ];
  return columns;
};

const CollapsRow = (props) => {
  const { lst, index, posturesList } = props || {};
  const theme = useTheme();
  const [clickedItem, setClickedItem] = useState(0);
  const [open, setOpen] = useState(false);

  const rows = () => {
    if (Array.isArray(posturesList)) {
      if (posturesList) {
        return posturesList?.map((row) => ({
          instance_id: (
            <BytesStyle>
              <Image src={AWSIMG} alt="aws" width={20} height={20} />
              <Box
                sx={{
                  py: "5px",
                  display: "flex",
                  justifyContent: "start",
                  flexDirection: "column",
                  ml: "10px",
                }}
              >
                <Typography
                  title={row?.tags.Name}
                  className="truncate"
                  sx={{
                    fontSize: "13px",
                    textAlign: "start",
                    maxWidth: "150px",
                  }}
                >
                  {row?.tags.Name}
                </Typography>
                <BytesStyle>
                  <Typography
                    sx={{
                      color: "#a19595",
                      fontSize: "10px",
                      fontWeight: "400",
                    }}
                  >
                    Account ID:{" "}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#a19595",
                      fontWeight: "400",
                      ml: "10px",
                    }}
                  >
                    {row.account_id}
                  </Typography>
                </BytesStyle>
                <BytesStyle>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#a19595",
                      fontWeight: "400",
                    }}
                  >
                    Resource ID:{" "}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#a19595",
                      fontSize: "10px",
                      fontWeight: "400",
                      ml: "10px",
                    }}
                  >
                    {row.instance_id}
                  </Typography>
                </BytesStyle>
              </Box>
            </BytesStyle>
          ),
          region: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px" }}>{row.region}</Typography>
            </BytesStyle>
          ),
          public_ip_address: (
            <BytesStyle>
              <Typography className="truncate" sx={{ fontSize: "12px" }}>
                {row.public_ip_address}
              </Typography>
            </BytesStyle>
          ),
          security_groups: (
            <BytesStyle>
              <Box>
                {row?.security_groups.map((el) => {
                  return (
                    <>
                      {el.security_group_ip_permissions.map((grpIp, key) => {
                        return (
                          <Typography
                            key={key}
                            className="truncate"
                            sx={{ fontSize: "12px", textAlign: "left" }}
                          >
                            {grpIp.FromPort}
                          </Typography>
                        );
                      })}
                      <Typography
                        className="truncate"
                        sx={{ fontSize: "12px", color: "#a19595" }}
                      >
                        {" "}
                        {el.security_group_id}
                      </Typography>
                    </>
                  );
                })}
              </Box>
            </BytesStyle>
          ),
          instance_profile_name: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px" }}>
                {row?.instance_profile_name}
              </Typography>
            </BytesStyle>
          ),
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const showTable = () => {
    let clickI = {
      0: (
        <CustomTable
          rows={rows()}
          headCells={columndD(theme)}
          isPagination={false}
        />
      ),
      1: <Serverless />,
      2: <ExposeContainer />,
      3: <ExposedDatabase />,
    };

    return clickI[clickedItem];
  };

  return (
    <>
      <TableRow colspan="2" key={props.index}>
        <TableCell
          onClick={() => {
            setOpen(!open);
            setClickedItem(props.index);
          }}
          sx={{
            border: "0px !important",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              background: "#E0ECF9",
              borderRadius: "10px",
              mr: "15px",
            }}
          >
            <Image src={lst.icon} alt={lst.icon} width={15} height={15} />
          </IconButton>
          <Box>
            <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
              {lst.count}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "" }}>
              {lst.label}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow className="table_collapse_row">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="cstm_tabbox"> {showTable()}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsRow;
