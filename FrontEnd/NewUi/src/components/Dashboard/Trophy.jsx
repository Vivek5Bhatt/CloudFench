import React from "react";
import { Box } from "@mui/system";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SelectSize from "./SelectSize";
import exporting from "highcharts/modules/exporting";
import { Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

if (typeof Highcharts === "object") {
  exporting(Highcharts);
}

const Trophy = (props) => {
  const {
    onChange,
    value,
    applicationList,
    daysData,
    setDaysData,
    refreshClick,
    tableLoader,
  } = props;

  const theme = useTheme();
  const mainArr = [];
  const nameArr = [];

  const times = applicationList.map((item) => [item.time, 0]);

  applicationList?.map((val) => {
    val.data.map((Int) => {
      if (!nameArr.includes(Int.app_group)) {
        nameArr.push(Int.app_group);
        mainArr.push({ name: Int.app_group, data: times });
      }
    });
  });

  const mapped = mainArr?.map((val) => {
    let application = null;
    let band = null;

    const newData = val.data.map((item) => {
      application = applicationList.find((app) => app.time == item[0]);
      if (application) {
        band = application?.data?.find((inter) => inter.app_group == val.name);
      }
      const newArr = [0, 0];
      if (application) {
        newArr[0] = item[0] * 1000;
        newArr[1] = band ? band?.bandwidth : 0;
      }
      return newArr;
    });

    return {
      ...val,
      data: newData,
    };
  });

  const options = {
    chart: {
      type: "area",
      height: "300px",
      backgroundColor: theme.palette.background.chartnew,
    },
    title: {
      text: "",
    },
    tooltip: {
      valueDecimals: 2,
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: theme.palette.text.primary,
        },
      },
    },
    yAxis: {
      labels: {
        style: {
          color: theme.palette.text.primary,
        },
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
        style: {
          color: "red",
        },
      },
      area: {
        fillOpacity: 0.0,
      },
    },
    credits: {
      enabled: false,
    },
    series: mapped || [],
    legend: {
      itemStyle: {
        color: theme.palette.text.primary,
      },
      itemHoverStyle: {
        color: theme.palette.text.secondary,
      },
    },
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <SelectSize
        id="application-size-select"
        onChange={onChange}
        value={value}
        label="Top Applications and their Bandwidth"
        daysData={daysData.app}
        setDaysData={setDaysData}
        refreshClick={() => refreshClick()}
      />
      <Box sx={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
        {applicationList.length ? (
          <Box sx={{ width: "100%", minWidth: "600px" }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </Box>
        ) : (
          <Typography>No Data Found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Trophy;
