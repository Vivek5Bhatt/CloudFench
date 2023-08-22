import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/system";
import SelectSize from "./SelectSize";

const SubnetTreeGraph = (props) => {
  const { onChange, value, daysData, setDaysData, refreshClick, networkList } =
    props;

  const allSeries = useMemo(() => {
    let allSeries = [];

    networkList.map((_item) => {
      allSeries.push([undefined, _item.name]);
      _item.subnets.map((subnet) => {
        allSeries.push([_item.name, subnet.name || subnet.id]);
        subnet.networkInterfaces.map((netInt) => {
          allSeries.push([subnet.name || subnet.id, netInt.name || netInt.id]);
          netInt.objects.map((obj) => {
            allSeries.push([
              netInt.name || netInt.id,
              obj.name || obj.publicIp,
            ]);
          });
        });
      });
    });
    return allSeries;
  }, [networkList]);

  useEffect(() => {
    var Highcharts = window.highcharts;
    Highcharts.chart("containerTree", {
      chart: {
        // spacingBottom: 30,
        marginRight: 100,
        marginTop: 50,
        height: "100%",
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "treegraph",
          keys: ["parent", "id", "level"],
          clip: false,
          data: allSeries,
          marker: {
            symbol: "circle",
            radius: 10,
            // fillColor: "#ffffff",
            lineWidth: 3,
          },
          dataLabels: {
            align: "left",
            pointFormat: "{point.id}",
            style: {
              color: "#000000",
              textOutline: "3px #ffffff",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "100px",
            },
            x: 24,
            crop: false,
            overflow: "none",
          },
          //   tooltip: {
          //     enabled: true,
          //     formatter: function (el) {
          //       return "<div> <span>My tooltip information </span> </div>";
          //     },
          //   },
          levels: [
            {
              level: 1,
              levelIsConstant: false,
            },
            {
              level: 2,
              colorByPoint: true,
            },
            {
              level: 3,
              colorVariation: {
                key: "brightness",
                to: -0.5,
              },
              //   collapsed: true,
            },
            {
              level: 4,
              colorVariation: {
                key: "brightness",
                to: 0.5,
              },
            },
          ],
        },
      ],
    });
  }, [allSeries]);

  return (
    <Box>
      <SelectSize
        onChange={onChange}
        value={value}
        label="Security Graph"
        daysData={daysData.subnet}
        setDaysData={setDaysData}
        refreshClick={() => refreshClick()}
        isTimer={true}
      />
      <figure className="highcharts-figure">
        <div id="containerTree"></div>
      </figure>
      {/* <HighchartsReact highcharts={Highcharts} options={newOptions} /> */}
    </Box>
  );
};

export default SubnetTreeGraph;
