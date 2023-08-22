/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useReducer, useState } from "react";
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import axios from "util/axios";
import Countries from "util/countries.json";
import Industries from "util/industry.json";
import Reaptcha from "reaptcha";

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [verifyCode, setVerifyCode] = useState(false);
  const [form, setForm] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    country: "",
    industry: "",
    postalCode: null,
    businessName: "",
  });

  const errorReducer = (state: any, action: { payload: any; type: string }) => {
    switch (action.type) {
      case "error":
        return { ...action.payload };
      default:
        break;
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useReducer(errorReducer, {
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    country: "",
    industry: "",
    postalCode: null,
    signupError: "",
    businessName: "",
  });

  const [recaptcha, setRecaptcha] = useState(false);

  const validate = () => {
    const errorObj = {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      country: "",
      postalCode: "",
      industry: "",
      signupError: "",
      businessName: "",
    };

    let valid = true;

    if (!recaptcha) {
      errorObj.signupError = "Please fill the recaptcha.";

      valid = false;
    }
    if (
      form.email === "" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      errorObj.email = "Please enter a valid email";

      valid = false;
    }
    if (
      form.email.includes("gmail") ||
      form.email.includes("outlook") ||
      form.email.includes("yahoo") ||
      form.email.includes("hotmail") ||
      form.email.includes("icloud")
    ) {
      errorObj.email = "Please enter your work email.";

      valid = false;
    }

    if (form.address === "") {
      errorObj.address = "Address should not be empty";

      valid = false;
    }

    if (form.firstName === "") {
      errorObj.firstName = "First Name should not be empty";

      valid = false;
    }

    if (form.lastName === "") {
      errorObj.lastName = "Last name should not be empty";

      valid = false;
    }

    if (form.state === "") {
      errorObj.state = "State should not be empty";

      valid = false;
    }
    if (form.postalCode === 0) {
      errorObj.postalCode = "Postal Code should not be empty";

      valid = false;
    }
    if (form.country === "") {
      errorObj.country = "Country should not be empty";

      valid = false;
    }
    if (form.industry === "") {
      errorObj.industry = "Industry should not be empty";

      valid = false;
    }
    if (form.businessName === "") {
      errorObj.businessName = "Business name should not be empty";

      valid = false;
    }
    setError({
      type: "error",
      payload: {
        ...errorObj,
      },
    });
    return valid;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post("auth/signup", {
        ...form,
        postalCode: parseInt(form.postalCode),
      });
      if (!result) {
        setLoading(false);
        throw new Error("Something went wrong. Please try again");
      }
      setVerifyCode(true);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      const temp = error;
      temp.signupError = err.response.data.message;
      setError({
        type: "error",
        payload: { ...temp },
      });
      setLoading(false);
    }
  };
  const handleInput = (event: { target: { name: any; value: any } }) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // const resendEmail = async () => {
  //   try {
  //     await axios.post("auth/resend-code", { email: form.email });
  //   } catch (error) {}
  // };

  const verifyRecaptcha = (res: any) => {
    setRecaptcha(true);
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign Up
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        {verifyCode ? (
          <Box me={"auto"}>
            <Text
              mb="36px"
              ms="4px"
              color={"InfoText"}
              fontWeight="400"
              fontSize="xl"
            >
              Sign up successful.<br></br>A temporary password has been sent to
              your email. Please{" "}
              <NavLink to="/auth/sign-in">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Sign in
                </Text>
              </NavLink>{" "}
              to continue.
            </Text>
          </Box>
        ) : loading ? (
          <Spinner color="#3311DB" />
        ) : (
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: "100%", md: "420px" }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: "auto", lg: "unset" }}
            me="auto"
            mb={{ base: "20px", md: "auto" }}
          >
            <Grid templateColumns="repeat(2, 1fr)" rowGap={2} columnGap={2}>
              <GridItem w="100%">
                <FormControl mb={"12px"} isInvalid={error.firstName !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    First Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="John"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInput}
                    required={true}
                  />
                  {error.firstName && (
                    <FormErrorMessage mb={"16px"}>
                      {error.firstName}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%">
                <FormControl mb={"12px"} isInvalid={error.lastName !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Last Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="Doe"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInput}
                  />
                  {error.lastName && (
                    <FormErrorMessage mb={"16px"}>
                      {error.lastName}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%" colSpan={2} mt="1rem">
                <FormControl mb={"12px"} isInvalid={error.address !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Business Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="Business Name"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleInput}
                  />
                  {error.businessName && (
                    <FormErrorMessage mb={"16px"}>
                      {error.businessName}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%" colSpan={2}>
                <FormControl mb={"12px"} isInvalid={error.address !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Business Address<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="Business Address"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="address"
                    value={form.address}
                    onChange={handleInput}
                  />
                  {error.address && (
                    <FormErrorMessage mb={"16px"}>
                      {error.address}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem width={"100%"} colSpan={2} mt="1rem">
                <FormControl mb={"12px"} isInvalid={error.email !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Work Email<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="email"
                    placeholder="mail@simmmple.com"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                  />
                  {error.email && (
                    <FormErrorMessage mb={"16px"}>
                      {error.email}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%" mt="1rem">
                <FormControl mb={"12px"} isInvalid={error.state !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    State<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="US, NY"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="state"
                    value={form.state}
                    onChange={handleInput}
                  />
                  {error.state && (
                    <FormErrorMessage mb={"16px"}>
                      {error.state}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%" mt={"1rem"}>
                <FormControl mb={"12px"} isInvalid={error.postalCode !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Postal Code<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="number"
                    placeholder="54500"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleInput}
                  />
                  {error.postalCode && (
                    <FormErrorMessage mb={"16px"}>
                      {error.postalCode}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%">
                <FormControl mb={"12px"} isInvalid={error.country !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Country<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="Select your country"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="country"
                    value={form.country}
                    onChange={handleInput}
                  >
                    {Countries.map((country) => (
                      <option value={country.name}>{country.name}</option>
                    ))}
                  </Select>
                  {error.country && (
                    <FormErrorMessage mb={"16px"}>
                      {error.country}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem w="100%">
                <FormControl mb={"12px"} isInvalid={error.country !== ""}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Industry<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="Select your business industry"
                    mb="4px"
                    fontWeight="500"
                    size="lg"
                    name="industry"
                    value={form.industry}
                    onChange={handleInput}
                  >
                    {Industries.map((industry) => (
                      <option value={industry}>{industry}</option>
                    ))}
                  </Select>
                  {error.industry && (
                    <FormErrorMessage mb={"16px"}>
                      {error.industry}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <FormControl mb={"12px"} mt="2rem">
              <Reaptcha
                sitekey="6Le6JcAkAAAAAP8njYklgu-0Z2pYm8dVT5uROJGH
"
                onVerify={verifyRecaptcha}
              />
            </FormControl>

            <FormControl
              isInvalid={error.signupError !== ""}
              mb={"12px"}
              mt="1rem"
            >
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                onClick={onSubmit}
              >
                Sign Up
              </Button>
              {error.signupError && (
                <FormErrorMessage whiteSpace={"pre"} mb={"16px"}>
                  {error.signupError}
                </FormErrorMessage>
              )}
            </FormControl>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColorDetails} fontWeight="400" fontSize="14px">
                Already Registered?
                <NavLink to="/auth/sign-in">
                  <Text
                    color={textColorBrand}
                    as="span"
                    ms="5px"
                    fontWeight="500"
                  >
                    Sign in
                  </Text>
                </NavLink>
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
