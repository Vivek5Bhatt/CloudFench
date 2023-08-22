// ** React Imports
import { useState, useEffect } from "react";
// ** Next Imports
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { toast } from "react-toastify";
// ** Layout Import
import BlankLayout from "src/theme/layouts/BlankLayout";

// Cookie
import { useFormik } from "formik";
import {
  ForgetPasswordValidation,
  ConfirmPasswordValidation,
} from "utils/validation";
// ** Login Api
import { forgotPassword, confirmPassword } from "utils/apis/routes/auth";
import logopic from "public/images/logo.svg";
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

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const LoginPage = () => {
  // ** State
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  // ** Hook
  const theme = useTheme();
  const router = useRouter();
  const token = getCookie("token");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const initialValues = {
    email: "",
  };

  const cInitialValues = {
    confirmationCode: "",
    newPassword: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: ForgetPasswordValidation,
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
            setButtonLoader(false);
            errors.email = "Please enter your work email.";
            return;
          }
          const isValid = await forgotPassword(values);
          if (isValid && isValid.status === 201) {
            setChangePassword(true);
            setButtonLoader(false);
            toast.success("Email Sended!");
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

  const {
    values: cValues,
    errors: cErrors,
    touched: cTouched,
    handleBlur: cHandleBlur,
    handleChange: cHandleChange,
    handleSubmit: cHandleSubmit,
  } = useFormik({
    initialValues: cInitialValues,
    validationSchema: ConfirmPasswordValidation,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (cValues) => {
      try {
        setButtonLoader(true);
        const data = { ...cValues, ...values };
        const isValid = await confirmPassword(data);
        if (isValid && isValid.status === 201) {
          setButtonLoader(false);
          toast.success("Password changed successfully!");
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
      <Card sx={{ zIndex: 1 }}>
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
              Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Please enter valid email
            </Typography>
          </Box>
          {!changePassword && (
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="email"
                label="Email"
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
              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
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
                Send Code
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2">
                  <Link passHref href="/">
                    <LinkStyled> Back to Sign in?</LinkStyled>
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
          {changePassword && (
            <form noValidate autoComplete="off" onSubmit={cHandleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  paddingBottom: "15px",
                }}
              >
                <Typography variant="body2">
                  <Link passHref href="/" sx={{ display: "inline-flex" }}>
                    <LinkStyled sx={{ display: "inline-flex" }}>
                      <ArrowBackIosIcon
                        sx={{ width: "14px" }}
                      ></ArrowBackIosIcon>{" "}
                      Add a different email?
                    </LinkStyled>
                  </Link>
                </Typography>
              </Box>
              <TextField
                fullWidth
                id="confirmationCode"
                label="confirmationCode"
                name="confirmationCode"
                value={cValues.confirmationCode}
                onChange={cHandleChange}
                onBlur={cHandleBlur}
                error={
                  Boolean(cErrors.confirmationCode) &&
                  Boolean(cTouched.confirmationCode)
                }
                helperText={
                  Boolean(cErrors.confirmationCode) &&
                  Boolean(cTouched.confirmationCode)
                    ? cErrors.confirmationCode
                    : null
                }
                required
                sx={{ marginBottom: 4 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 4 }}>
                <InputLabel htmlFor="auth-login-password">Password</InputLabel>
                <OutlinedInput
                  label="New Password"
                  value={cValues.newPassword}
                  id="auth-login-password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={
                    Boolean(cErrors.newPassword) &&
                    Boolean(cTouched.newPassword)
                  }
                  required
                />
              </FormControl>
              {Boolean(cErrors.newPassword) && Boolean(cTouched.newPassword) ? (
                <Typography
                  className="error_textMui"
                  variant="body2"
                  sx={{ marginRight: 2 }}
                >
                  {cErrors.newPassword}
                </Typography>
              ) : null}
              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
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
                Create New Password
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2">
                  <Link passHref href="/">
                    <LinkStyled> Back to Sign in?</LinkStyled>
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
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

LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
