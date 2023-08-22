import { Box } from "@mui/system";
import SelectSize from "./SelectSize";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import exporting from "highcharts/modules/exporting";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

if (typeof Highcharts === "object") {
  more(Highcharts);
  exporting(Highcharts);
}

// more(Highcharts);
const CustomBubble = (props) => {
  const {
    value,
    onChange,
    topThreatList,
    daysData,
    setDaysData,
    refreshClick,
  } = props;

  const theme = useTheme();
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "packedbubble",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        "<tr><th>UI</th><th>API</th></tr>" +
        "<tr><td>Threat: </td>" +
        "<td>{point.name} </td></tr>" +
        "<tr><td>Threat Level:  </td>" +
        "<td>{point.level_s} </td></tr>" +
        "<tr><td>CVE ID: </td> " +
        "<td>{point.cve_list} </td></tr>" +
        "<tr><td>Incidents</td> " +
        "<td>{point.incidents} </td></tr>",
      footerFormat: "</table>",
      followPointer: true,
    },
    // plotOptions: {
    //   series: {
    //     enableMouseTracking: false,
    //   },
    //   packedbubble: {
    //     // minSize: "30%",
    //     // maxSize: "120%",
    //     zMin: 0,
    //     zMax: 1000,
    //     layoutAlgorithm: {
    //       splitSeries: false,
    //       gravitationalConstant: 0.02,
    //     },
    //     dataLabels: {
    //       enabled: true,
    //       format: "{point.name}",
    //       filter: {
    //         property: "y",
    //         operator: ">",
    //         value: 250,
    //       },
    //       style: {
    //         color: "black",
    //         textOutline: "none",
    //         fontWeight: "normal",
    //       },
    //     },
    //   },
    // },
    plotOptions: {
      series: {
        bubble: {
          color: "white",
          marker: {
            fillColor: "transparent",
          },
        },
        minSize: "20%",
        maxSize: "100%",
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
      },
    },
    series: [],
  });

  useEffect(() => {
    const newD = topThreatList.map((_el) => {
      return {
        name: _el.threat,
        data: [
          {
            name: _el.threat,
            level_s: _el.level_s,
            cve_list: _el.cve_list,
            incidents: _el.incidents,
            value: parseInt(_el.threat_block),
          },
        ],
      };
    });

    setChartOptions({
      ...chartOptions,
      series: newD,
      chart: { backgroundColor: theme.palette.background.chartnew },
      legend: {
        itemStyle: {
          color: theme.palette.text.primary,
        },
        itemHoverStyle: {
          color: theme.palette.text.secondary,
        },
      },
    });
  }, [topThreatList, theme]);

  return (
    <>
      <Box>
        <SelectSize
          id="threat-size-select"
          value={value}
          onChange={onChange}
          label="Top Threats"
          daysData={daysData.thre}
          setDaysData={setDaysData}
          refreshClick={() => refreshClick()}
        />
        <Box sx={{ width: "100%" }}>
          {topThreatList.length ? (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          ) : (
            <Typography>No Data Found</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CustomBubble;
