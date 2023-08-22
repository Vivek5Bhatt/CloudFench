import * as Yup from "yup";

export const SignInValidation = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter a email")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ),
  password: Yup.string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/,
      "Must Contain 8 Characters or less than 16 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const NewPasswordValidations = Yup.object({
  newPassword: Yup.string()
    .required("Please enter your new password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/,
      "Must Contain 8 Characters or less than 16 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const SignUpValidation = Yup.object({
  firstName: Yup.string().min(3).max(25).required("Please enter first name"),
  lastName: Yup.string().min(3).max(25).required("Please enter last name"),
  businessName: Yup.string()
    .min(3)
    .max(25)
    .required("Please enter bussiness name"),
  address: Yup.string().min(3).max(40).required("Please enter address"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter a email")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ),
  state: Yup.string().min(3).max(25).required("Please enter state"),
  postalCode: Yup.number().min(5).required("Please enter state"),
  country: Yup.string().required("Please select country"),
  industry: Yup.string().required("Please select industry"),
});

export const ForgetPasswordValidation = Yup.object({
  email: Yup.string()
    .email()
    .required("Please enter a email")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ),
});

export const ConfirmPasswordValidation = Yup.object({
  confirmationCode: Yup.number().required("Please enter state"),
  newPassword: Yup.string()
    .required("Please enter your new password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/,
      "Must Contain 8 Characters or less than 16 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const CreateConnectorValidation = Yup.object({
  name: Yup.string().required("Please enter connector name"),
  accountId: Yup.string().required("Please enter account id"),
  secretKey: Yup.string().required("Please enter secret key"),
  apiKey: Yup.string().required("Please enter access key"),
});

export const DeployeStackSchema = Yup.object().shape({
  cloud: Yup.string().required("Please select Cloud"),
  region: Yup.object().required("Please select Region"),
  // az: Yup.array().required("Please select Zones"),
  instance: Yup.string().required("Please select Stack size"),
});
