import { useRouter } from "next/router";
// ** MUI Imports
import Grid from "@mui/material/Grid";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
// ** Demo Components Imports
import MaterialBasicTable from "src/components/Tables/MaterialTable/Basic";

const Security = () => {
  const router = useRouter();
  const currentPageUrl = router.pathname;
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BreadcrumbHeading url={currentPageUrl} />
        </Grid>
        <Grid item xs={12}>
          <MaterialBasicTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Security;
