// ** React Imports
import { useState, useEffect } from "react";
// ** Next Imports
import { useRouter } from "next/router";
import Image from "next/image";
// ** MUI Components
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// ** Layout Import
import BlankLayout from "src/theme/layouts/BlankLayout";
// ** Countries & Industries json
import Countries from "utils/countries.json";
import Industries from "utils/industry.json";
// ** Login Api
import { signUpUser } from "utils/apis/routes/auth";
// ** Toast
import { toast } from "react-toastify";
// Cookie
import { useFormik } from "formik";
import { SignUpValidation } from "utils/validation";
import logopic from "../../../../public/images/logo.svg";
import logopicWhite from "public/images/fence-white.svg";
import Loader from "src/components/Loader";
import { getCookie } from "cookies-next";
import { isTokenExpired } from "utils/commonFunctions";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const RegisterPage = () => {
  const [buttonLoader, setButtonLoader] = useState(false);
  // ** Hook
  const theme = useTheme();
  const router = useRouter();
  const token = getCookie("token");

  const initialValues = {
    firstName: "",
    lastName: "",
    businessName: "",
    address: "",
    email: "",
    state: "",
    postalCode: null,
    country: "",
    industry: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: SignUpValidation,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: async (values) => {
        try {
          setButtonLoader(true);
          const isEmailValid =
            values.email.includes("gmail") ||
            values.email.includes("outlook") ||
            values.email.includes("yahoo") ||
            values.email.includes("hotmail") ||
            values.email.includes("icloud");
          if (isEmailValid) {
            errors.email = "Please enter your work email.";
            setButtonLoader(false);
            return;
          }
          const isValid = await signUpUser(values);
          if (isValid && isValid.status === 201) {
            router.push("/");
            setButtonLoader(false);
            toast.success("Sign Up Successfully!");
          }
        } catch (error) {
          setButtonLoader(false);
          toast.error(
            error?.response?.data?.error ||
              error?.message ||
              "something went wrong"
          );
          return;
        }
      },
    });

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      router.push("/admin/dashboard");
    }
  }, [token]);

  return (
    <Box
      className="content-center"
      sx={{
        flexWrap: "wrap",
        "& .Mui-error": {
          marginLeft: "0px",
        },
        "& .error_textMui": {
          marginTop: "3px",
          fontSize: "0.75rem",
          lineHeight: "1.66",
          letterSpacing: "0.4px",
          color: theme.palette.error.main,
        },
        [theme.breakpoints.down("sm")]: {
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
          },
          "& .MuiInputLabel-outlined": {
            fontSize: "14px",
            transform: "translate(14px, 12px) scale(1)",
          },
          "& .MuiInputLabel-shrink.MuiInputLabel-outlined": {
            fontSize: "16px",
            transform: "translate(14px, -9px) scale(0.75)",
          },
        },
      }}
    >
      <Card sx={{ zIndex: 1, maxWidth: "600px", width: "100% !important" }}>
        <CardContent
          sx={{
            padding: (theme) => `${theme.spacing(12, 9, 12)} !important`,
            [theme.breakpoints.down("md")]: {
              padding: (theme) => `${theme.spacing(8, 4, 8)} !important`,
            },
          }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                ml: 0,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.3rem !important",
              }}
            >
              <Image
                src={theme.palette.mode === "light" ? logopic : logopicWhite}
                alt="logo"
                width={180}
                priority
              />
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5, textAlign: "center" }}
            >
              Sign Up
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Enter your email and password to sign in!
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(errors.firstName) && Boolean(touched.firstName)
                  }
                  helperText={
                    Boolean(errors.firstName) && Boolean(touched.firstName)
                      ? errors.firstName
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.lastName) && Boolean(touched.lastName)}
                  helperText={
                    Boolean(errors.lastName) && Boolean(touched.lastName)
                      ? errors.lastName
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Work Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.email) && Boolean(touched.email)}
                  helperText={
                    Boolean(errors.email) && Boolean(touched.email)
                      ? errors.email
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="businessName"
                  label="Business Name"
                  name="businessName"
                  value={values.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(errors.businessName) &&
                    Boolean(touched.businessName)
                  }
                  helperText={
                    Boolean(errors.businessName) &&
                    Boolean(touched.businessName)
                      ? errors.businessName
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="address"
                  label="Business Address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.address) && Boolean(touched.address)}
                  helperText={
                    Boolean(errors.address) && Boolean(touched.address)
                      ? errors.address
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.state) && Boolean(touched.state)}
                  helperText={
                    Boolean(errors.state) && Boolean(touched.state)
                      ? errors.state
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={values.postalCode !== null ? values.postalCode : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(errors.postalCode) && Boolean(touched.postalCode)
                  }
                  helperText={
                    Boolean(errors.postalCode) && Boolean(touched.postalCode)
                      ? errors.postalCode
                      : null
                  }
                  required
                  sx={{ marginBottom: 4 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ marginBottom: 4 }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    label="Country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.country) && Boolean(touched.country)}
                    required
                  >
                    {Countries.map((country, index) => {
                      return (
                        <MenuItem key={index} value={country.name}>
                          {country.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {Boolean(errors.country) && Boolean(touched.country) ? (
                    <Typography
                      className="error_textMui"
                      variant="body2"
                      sx={{ marginRight: 2 }}
                    >
                      {errors.country}
                    </Typography>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ marginBottom: 4 }}>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    label="Industry"
                    name="industry"
                    value={values.industry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.industry) && Boolean(touched.industry)
                    }
                    required
                  >
                    {Industries.map((Industry, index) => {
                      return (
                        <MenuItem key={index} value={Industry}>
                          {Industry}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {Boolean(errors.industry) && Boolean(touched.industry) ? (
                    <Typography
                      className="error_textMui"
                      variant="body2"
                      sx={{ marginRight: 2 }}
                    >
                      {errors.industry}
                    </Typography>
                  ) : null}
                </FormControl>
              </Grid>
            </Grid>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{
                marginBottom: 7,
                overflow: "hidden",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
              disabled={buttonLoader}
            >
              {buttonLoader && <Loader />}
              Sign up
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ marginRight: 2 }}>
                Already Registered?
              </Typography>
              <Typography variant="body2">
                <Link passHref href="/">
                  <LinkStyled> Sign in </LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box sx={{ marginTop: "auto", pt: "15px", width: "100%" }}>
        <Typography variant="body2" textAlign="center">
          © 2023 CloudFence Solutions v0.1
        </Typography>
      </Box>
    </Box>
  );
};

RegisterPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default RegisterPage;
