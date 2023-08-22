import React from "react";
import { Box } from "@mui/system";
import SelectSize from "./SelectSize";
import Typography from "@mui/material/Typography";
import CommonNetwork from "./CommonNetwork";

const SubnetGraph = (props) => {
  const { onChange, value, daysData, setDaysData, refreshClick, networkList } =
    props;

  return (
    <Box>
      <SelectSize
        id="subnet-graph-size-select"
        onChange={onChange}
        value={value}
        label="Stack Connectivity Graph"
        daysData={daysData.subnet}
        setDaysData={setDaysData}
        refreshClick={() => refreshClick()}
        isTimer={true}
      />
      {networkList.map((netList, key) => {
        return <CommonNetwork key={key} netList={netList} />;
      })}
      {!networkList.length && <Typography>No Data Found</Typography>}
    </Box>
  );
};

export default SubnetGraph;
