// ** MUI Imports
import Grid from "@mui/material/Grid";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
// ** Demo Components Imports
import MaterialBasicTable from "src/components/Tables/MaterialTable/Basic";

const Security = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BreadcrumbHeading title="Security" />
        </Grid>
        <Grid item xs={12}>
          <MaterialBasicTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Security;
