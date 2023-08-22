// ** React Imports
import { useEffect, useState } from "react";
// ** Next Imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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
// ** Layout Import
import BlankLayout from "src/theme/layouts/BlankLayout";
// ** Login Api
import { loginUser, userMe } from "utils/apis/routes/auth";
import logopic from "../../public/images/logo.svg";
import logopicWhite from "../../public/images/fence-white.svg";
// ** Toast
import { toast } from "react-toastify";
// Cookie
import { setCookie, getCookie } from "cookies-next";
// import { Formik, useFormik } from "formik";
// import { SignInValidation, NewPasswordValidations } from "utils/validation";
import Loader from "src/components/Loader";
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
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;

  const passwordError =
    "Must Contain 8 Characters or less than 16 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";
  const [values, setValues] = useState({
    email: "",
    password: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    newPassword: false,
  });

  // ** Hook
  const theme = useTheme();
  const router = useRouter();
  const token = getCookie("token");
  const notAllowEmailDomains = [
    "gmail",
    "outlook",
    "yahoo",
    "hotmail",
    "icloud",
  ];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    if (name == "email") {
      validateForm({ [name]: value }, true, false, false);
    } else if (name == "password") {
      validateForm({ [name]: value }, false, true, false);
    } else {
      validateForm({ [name]: value }, false, false, true);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => {
      return {
        ...prev,
        [name]: true,
      };
    });
  };

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues,
  //   validationSchema: changePassword
  //     ? NewPasswordValidations
  //     : SignInValidation,
  //   validateOnChange: true,
  //   validateOnBlur: false,
  //   onSubmit: async (values) => {
  //     loginApi(values);
  //   },
  // });

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      router.push("/admin/dashboard");
    }
  }, []);

  const loginApi = async (values) => {
    try {
      if (!changePassword) {
        delete values.newPassword;
      }
      setButtonLoader(true);
      const emailDomainName = values.email.split("@")[1].split(".")[0];
      const isEmailValid = notAllowEmailDomains.includes(emailDomainName);
      if (isEmailValid) {
        setButtonLoader(false);
        setErrors((prev) => {
          return {
            ...prev,
            email: "Please enter your work email.",
          };
        });
        return;
      } else {
        const isValid = await loginUser(values);
        if (isValid && isValid.status === 201) {
          if (isValid?.data?.newPasswordRequired) {
            setButtonLoader(false);
            setChangePassword(true);
            // formik.setValues({
            //   email: values.email,
            //   password: values.password,
            //   newPassword: "",
            // });
            setValues((prev) => {
              return {
                ...prev,
                newPassword: "",
              };
            });
          } else {
            setButtonLoader(false);
            router.push("/admin/dashboard");
            setCookie("token", isValid.data.accessToken);
            setCookie("idToken", isValid.data.idToken);
            setCookie("userId", isValid.data.user.id);
            setCookie(
              "userName",
              `${isValid.data.user.firstName} ${isValid.data.user.lastName}`
            );
            let authRes = await userMe();
            if (authRes) {
              setCookie("cloudConnector", authRes?.data?.data?.cloudConnector);
            }
          }
        }
      }
    } catch (error) {
      setButtonLoader(false);
      toast.error(
        error?.response?.data?.error || error?.message || "something went wrong"
      );
      return;
    }
  };

  const validateForm = (data, email, password, newPassword) => {
    let errors = 0;

    if (!changePassword) {
      if (email) {
        if (data.email == "") {
          setErrors((prev) => {
            return {
              ...prev,
              email: "Please enter your email",
            };
          });
          errors += 1;
        } else if (!pattern.test(data.email)) {
          setErrors((prev) => {
            return {
              ...prev,
              email: "Please enter a valid email",
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              email: "",
            };
          });
        }
      }

      if (password) {
        if (data.password == "") {
          setErrors((prev) => {
            return {
              ...prev,
              password: "Please enter your password",
            };
          });
          errors += 1;
        } else if (!passwordPattern.test(data.password)) {
          setErrors((prev) => {
            return {
              ...prev,
              password: passwordError,
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              password: "",
            };
          });
        }
      }
    } else {
      if (newPassword) {
        if (data.newPassword == "") {
          setErrors((prev) => {
            return {
              ...prev,
              newPassword: "Please enter your new password",
            };
          });
          errors += 1;
        } else if (!passwordPattern.test(data.newPassword)) {
          setErrors((prev) => {
            return {
              ...prev,
              newPassword: passwordError,
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              newPassword: "",
            };
          });
        }
      }
    }

    if (errors > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setTouched({
        email: true,
        password: true,
        newPassword: true,
      });
      const errorsObj = Object.values(errors).filter((item) => item);
      const validated = validateForm(values, true, true, true);
      if (!validated) {
        return;
      }
      if (errorsObj.length == 0) {
        loginApi(values);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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
            padding: (theme) => `${theme.spacing(12, 9, 12)}!important`,
            [theme.breakpoints.down("md")]: {
              padding: (theme) => `${theme.spacing(8, 4, 8)}!important`,
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
              Sign In
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Enter your email and password to sign in!
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            {!changePassword && (
              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                defaultValue={values.email}
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
            )}

            {changePassword ? (
              <>
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    New Password
                  </InputLabel>
                  <OutlinedInput
                    label="New Password"
                    id="auth-login-password"
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                      Boolean(errors.newPassword) &&
                      Boolean(touched.newPassword)
                    }
                    required
                  />
                </FormControl>
                {Boolean(errors.newPassword) && Boolean(touched.newPassword) ? (
                  <Typography
                    className="error_textMui"
                    variant="body2"
                    sx={{ marginRight: 2 }}
                  >
                    {errors.newPassword}
                  </Typography>
                ) : null}
              </>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="auth-login-password"
                    error={
                      Boolean(errors.password) && Boolean(touched.password)
                    }
                    required
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    id="auth-login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    defaultValue={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.password) && Boolean(touched.password)
                    }
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
                  />
                </FormControl>
                {Boolean(errors.password) && Boolean(touched.password) ? (
                  <Typography
                    className="error_textMui"
                    variant="body2"
                    sx={{ marginRight: 2 }}
                  >
                    {errors.password}
                  </Typography>
                ) : null}
              </>
            )}

            {changePassword ? (
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label="Keep me logged in"
                />
                <Link passHref href="/auth/forgot-password">
                  <LinkStyled>Forgot Password?</LinkStyled>
                </Link>
              </Box>
            ) : (
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  paddingTop: "10px",
                }}
              >
                <Link passHref href="/auth/forgot-password">
                  <LinkStyled>Forgot Password?</LinkStyled>
                </Link>
              </Box>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              // onClick={handleSubmit}
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
              Sign In
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
                Not registered yet?
              </Typography>
              <Typography variant="body2">
                <Link passHref href="/auth/register">
                  <LinkStyled> Create an Account</LinkStyled>
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

LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
