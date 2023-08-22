// ** MUI Imports
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { firstLetterCapital } from "utils/commonFunctions";

const LinkStyled = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const BreadcrumbHeading = ({ url }) => {
  let breadCrumbUrl = url?.split("/").splice(2);
  const breadCrumbElement = breadCrumbUrl?.map((url) => {
    const addSpace = url.replace(/-/g, " ");
    const capitalBreadCrumb = firstLetterCapital(addSpace);
    return capitalBreadCrumb;
  });
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Box sx={{ display: "inline-flex" }}>
          <LinkStyled sx={{ display: "inline-flex", fontSize: "14px" }}>
            {breadCrumbElement && breadCrumbElement[0]}
          </LinkStyled>
        </Box>
        <Typography color="text.primary" sx={{ fontSize: "14px" }}>
          {breadCrumbUrl?.length >= 3
            ? breadCrumbElement && breadCrumbElement[2]
            : breadCrumbElement && breadCrumbElement[1]}
        </Typography>
        {breadCrumbUrl?.length >= 4 && (
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            {breadCrumbElement && breadCrumbElement[3]}
          </Typography>
        )}
      </Breadcrumbs>
    </>
  );
};

export default BreadcrumbHeading;
