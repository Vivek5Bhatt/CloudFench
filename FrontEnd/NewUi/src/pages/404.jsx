// ** Next Import
import { useRouter } from "next/router";
// ** MUI Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// ** Layout Import
import BlankLayout from "src/theme/layouts/BlankLayout";
import { getCookie } from "cookies-next";

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down("lg")]: {
    height: 400,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(13),
  },
}));

const Error404 = () => {
  const route = useRouter();
  const token = getCookie("token");

  const handleClick = () => {
    if (token) {
      route.push("/admin/dashboard");
    } else {
      route.push("/");
    }
  };

  return (
    <Box className="content-center">
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h1">404</Typography>
          <Typography
            variant="h5"
            sx={{ mb: 1, fontSize: "1.5rem !important" }}
          >
            Page Not Found ⚠️
          </Typography>
          <Typography variant="body2">
            We couldn&prime;t find the page you are looking for.
          </Typography>
        </BoxWrapper>
        <Img
          height="400"
          alt="error-illustration"
          src="/images/pages/404.png"
        />
        <Button
          component="a"
          variant="contained"
          sx={{ px: 5.5 }}
          onClick={handleClick}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

Error404.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Error404;
