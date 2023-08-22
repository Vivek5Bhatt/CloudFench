import { Box } from "@mui/system";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormControl, MenuItem, Select, Tab } from "@mui/material";

const CommonNetwork = (props) => {
  const { netList } = props || {};
  const [anchorEl, setAnchorEl] = useState(false);
  const [showData, setShowData] = useState({});
  const theme = useTheme();
  const [selectVpc, setSelectVpc] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    if (netList) {
      setSelectVpc([netList?.data[0]]);
    }
  }, [netList]);

  const handleClick = () => {
    setAnchorEl(true);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  const mainData = useMemo(() => {
    let allSeries = [];
    let allVPC = [];
    let connectedSub = [];
    let popupData = [];

    selectVpc.map((_item) => {
      const protectedBy = _item.protectedBy;
      // allVPC.push(_item.name);
      // let itemName = _item.name + _item.protectedBy;

      let vpcName = _item?.name ? _item.name + " (" + _item.id + ")" : _item.id;

      allVPC.push(vpcName);
      // allSeries.push([_item.name, _item.name]);

      const popupObj = {
        name: vpcName,
        data: {
          id: _item.id,
          name: _item?.name,
          type: _item.type,
          protectedBy: protectedBy,
        },
      };
      popupData.push(popupObj);

      _item.subnets.map((subnet) => {
        const subnetName = subnet.name
          ? subnet.name + " (" + subnet.id + ")"
          : subnet.id;
        if (subnet.connected) {
          connectedSub.push(subnetName);
        }
        allSeries.push([vpcName, subnetName]);

        // allSeries.push([_item.name, subnetName]);

        const popupObj = {
          name: subnetName,
          data: {
            id: subnet.id,
            name: subnet.name,
            type: subnet.type,
            protectedBy: subnet.connected ? protectedBy : "NOT PROTECTED",
          },
        };
        popupData.push(popupObj);

        subnet.networkInterfaces.map((netInt) => {
          // const networkInterfaceName = netInt?.name || netInt?.id;

          const networkInterfaceName = netInt?.name
            ? netInt?.name + " (" + netInt?.id + ")"
            : netInt?.id;
          allSeries.push([subnetName, networkInterfaceName]);

          const popupObj = {
            name: networkInterfaceName,
            data: {
              id: netInt.id,
              name: netInt.name,
              type: "network interface",
              protectedBy: protectedBy,
            },
          };
          popupData.push(popupObj);

          netInt.objects.map((obj) => {
            // const obj1 = obj.type != "" ? obj.type : obj.name;
            const name =
              obj.publicIp ||
              obj.name +
                " (" +
                obj.az +
                ", " +
                (obj?.privateIpAddresses?.length &&
                  obj?.privateIpAddresses[0]) +
                ")";
            const newobj = obj.type ? obj.type + " (" + name + ")" : obj.name;
            allSeries.push([networkInterfaceName, newobj || obj.publicIp]);

            const popupObj = {
              name: newobj,
              data: {
                id: obj.id,
                name: obj.publicIp || obj.name,
                publicIp: obj?.publicIp,
                type:
                  obj.type == "applicationEndpoint"
                    ? "application endpoint"
                    : obj.type,
                protectedBy: protectedBy,
              },
            };
            popupData.push(popupObj);
          });
        });
      });
    });

    return { allSeries, allVPC, connectedSub, popupData };
  }, [selectVpc]);

  const { allSeries, allVPC, connectedSub, popupData } = mainData;

  const showIcon = (text) => {
    if (text.includes("subnet")) {
      const setgreen = connectedSub.includes(text);
      return setgreen
        ? `url(${window.location.origin}/images/awsimg/subnet_green1.svg)`
        : `url(${window.location.origin}/images/awsimg/subnet_red.svg)`;
    } else if (text.includes("eni")) {
      return `url(${window.location.origin}/images/awsimg/interface_orange.svg)`;
    } else if (text.includes("ec2")) {
      return `url(${window.location.origin}/images/awsimg/aws-ec2.svg)`;
    } else if (text.includes("rds")) {
      return `url(${window.location.origin}/images/awsimg/aws-rds.svg)`;
    } else if (allVPC.includes(text)) {
      return `url(${window.location.origin}/images/awsimg/vpc_blue1.svg)`;
    } else if (text.includes("lambda")) {
      // if (text.includes("lambda-vpc")) {
      //   return `url(${window.location.origin}/vpc_blue1.svg)`;
      // }
      return `url(${window.location.origin}/images/awsimg/aws-lambda-1.svg)`;
    } else if (text.includes("elasticache")) {
      return `url(${window.location.origin}/images/awsimg/aws-Elasti-cache.svg)`;
    } else if (text.includes("applicationEndpoint")) {
      return `url(${window.location.origin}/images/awsimg/yellow_light1.svg)`;
    } else if (text.includes("lb")) {
      return `url(${window.location.origin}/images/awsimg/load-balancer-icon-3.png)`;
    } else if (text.includes("transitGW")) {
      return `url(${window.location.origin}/images/awsimg/20_vpc-customer-gateway.500b29e8da.png)`;
    }

    // else if (allVPC.includes(text)) {
    //   return `url(${window.location.origin}/vpc_blue1.svg)`;
    // }
    else {
      return `url(${window.location.origin}/images/interface_orange.svg)`;
    }
  };

  const handleSelectedData = useCallback(
    (point) => {
      const find = popupData?.find((item) => item.name == point);
      setShowData(find?.data);
    },
    [popupData]
  );

  useEffect(() => {
    Highcharts.addEvent(Highcharts.Series, "afterSetOptions", function (e) {
      const colors = Highcharts.getOptions().colors,
        nodes = {};

      let i = 0;
      if (
        this instanceof Highcharts.Series.types.networkgraph &&
        e.options.id === "lang-tree"
      ) {
        e.options?.data?.forEach(function (link) {
          const checkSize = allVPC.includes(link[0]);
          if (link[0]) {
            nodes[link[0]] = {
              id: link[0],
              marker: {
                radius: 20,
                symbol: showIcon(link[0]),
                width: checkSize ? 40 : 35,
                height: checkSize ? 40 : 35,
                name: link[0],
                info: selectVpc,
              },
            };
            nodes[link[1]] = {
              id: link[1],
              marker: {
                radius: 10,
                width: 35,
                height: 35,
                symbol: showIcon(link[1]),
                name: link[1],
                info: selectVpc,
              },
              color: colors[i++],
            };
          } else if (nodes[link[0]] && nodes[link[0]].color) {
            nodes[link[1]] = {
              id: link[1],
              color: nodes[link[0]].color,
            };
          }
        });

        e.options.nodes = Object.keys(nodes).map(function (id) {
          return nodes[id];
        });
      }
    });

    Highcharts.chart(netList.accountId, {
      chart: {
        type: "networkgraph",
        // marginTop: 5.0,
        marginRight: 50,
        height: allSeries.length > 30 ? "100%" : "",
        // maxHeight: "500px",
        backgroundColor: theme.palette.background.chartnew,
      },
      title: {
        text: "",
        align: "",
      },
      subtitle: {
        text: "",
        align: "",
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        style: {
          // fontFamily: "monospace",
          fontSize: "14px",
          marginBottom: "10px",
          lineHeight: "24px",
        },
        useHTML: true,

        formatter: function (el) {
          let hoverD = popupData?.find((item) => item.name == this.point.name);

          return (
            "<span style='font-weight :600'>ID :</span>" +
            " " +
            (hoverD?.data.id || "") +
            "<br />" +
            "<span style='font-weight :600'>Name :</span>" +
            " " +
            hoverD?.data.name +
            "<br />" +
            "<span style='font-weight :600'>Type :</span>" +
            " " +
            hoverD?.data.type?.toUpperCase() +
            "<br />" +
            "<span style='font-weight :600'>Protected By :</span>" +
            " " +
            hoverD?.data.protectedBy
          );
        },
      },
      plotOptions: {
        networkgraph: {
          keys: ["from", "to"],
          // layoutAlgorithm: {
          //   enableSimulation: true,
          //   friction: -0.9,
          // },
          // layoutAlgorithm: {
          //   enableSimulation: true,
          //   // integration: "verlet",
          //   linkLength: 100,
          // },
        },
      },
      series: [
        {
          accessibility: {
            enabled: false,
          },
          layoutAlgorithm: {
            enableSimulation: false,
          },
          point: {
            events: {
              click: function () {
                var point = this;
                // handleClick();
                // setTooltipOpen(true);
                handleSelectedData(point.name);
              },
              // mouseOut: function () {
              //   setTooltipOpen(false);
              // },
            },
          },
          // enableMouseTracking: false,
          dataLabels: {
            enabled: true,
            linkFormat: "",
            style: {
              fontSize: "0.8em",
              fontWeight: "normal",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "70px",
              fontWeight: "700",
              // fontSize: "14px",
            },
          },
          id: "lang-tree",
          data: allSeries,
        },
      ],
    });
  }, [allSeries, theme, selectVpc]);

  const ShowInfo = () => {
    return (
      <Dialog
        open={anchorEl}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.netwrokgraph,
            backdropFilter: "blur(6px)",
            border: "1px solid",
            borderColor: theme.palette.action.focus,
          },
        }}
        onClose={handleClose}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            borderBottom: "1px solid",
            borderColor: theme.palette.action.focus,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setAnchorEl(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          className="outer_listbx_body"
          sx={{
            padding: "10px 10px",
            minWidth: "250px",
            minHeight: "150px",
            borderRadius: "6px",
          }}
        >
          <List>
            {showData?.publicIp ? (
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Public IP :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {showData?.publicIp}
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    ID :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {showData?.id}
                  </Typography>
                </Box>
              </ListItem>
            )}
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
                <Typography
                  variant="body2"
                  component="span"
                  fontSize={13}
                  textTransform="uppercase"
                >
                  {showData?.type}
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
                  Protected By :{" "}
                </Typography>
                <Typography variant="body2" component="span" fontSize={13}>
                  {showData?.protectedBy}
                </Typography>
              </Box>
            </ListItem>
          </List>
        </Box>
      </Dialog>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>Account Id: {netList.accountId}</Typography>
        {selectVpc.length && (
          <FormControl
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Typography>Select the VPC: </Typography>

            <Select
              sx={{
                ml: "10px",
                minWidth: "206px",
                "& .MuiSelect-select": {
                  padding: "6.5px 14px",
                },
              }}
              value={selectVpc && selectVpc[0]}
              onChange={(e) => {
                setSelectVpc([e.target.value]);
              }}
            >
              {netList.data.map((active, index) => {
                return (
                  <MenuItem key={index} value={active}>
                    {active.name || active.id}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Box>
      <figure className="highcharts-figure">
        <div id={netList.accountId} className="networkClass">
          <ShowInfo />
        </div>
      </figure>
    </Box>
  );
};

export default CommonNetwork;
