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
import { NavLink, useHistory } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
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
import { validate } from "uuid";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(false);
  const errorReducer = (
    state: { email: string; password: string },
    action: { payload: any; type: string }
  ) => {
    switch (action.type) {
      case "error":
        return { ...action.payload };
      default:
        break;
    }
  };
  const [passwordChallenge, setPasswordChallenge] = useState(false);
  const [newPassword, setNewPassword] = useState({ value: "", error: "" });
  const [error, setError] = useReducer(errorReducer, {
    email: "",
    password: "",
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useHistory();

  const validate = () => {
    const errorObj = { email: "", password: "" };
    let valid = true;
    if (
      form.email === "" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      errorObj.email = "Please enter a valid email";
      valid = false;
    }
    if (form.password.length < 6 || form.password === "") {
      errorObj.password = "Password should be more than 6 characters";

      valid = false;
    }

    setError({
      type: "error",
      payload: { ...errorObj },
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
      const result = await axios.post("auth/signin", { ...form });

      if (result.data.newPasswordRequired) {
        setPasswordChallenge(true);
        setError({
          type: "error",
          payload: {
            email: "",
            password: "",
          },
        });
      } else {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.accessToken}`;
        router.push("/admin");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({
        type: "error",
        payload: {
          email: "Invalid Credential",
          password: "Invalid Credential",
        },
      });
    }
  };

  const passwordChallengeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*.\[\]{}\(\)?\-"!@#%&\/\\,><':;|_~`]).{8,}/.test(
        newPassword.value.trim()
      ) ||
      newPassword.value === ""
    ) {
      setNewPassword({
        value: newPassword.value,
        error:
          "Password should be more than 8 characters.\nShould contain uppercase and lowercase characters.\nShould contain at least one number.",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("auth/signin", {
        ...form,
        newPassword: newPassword.value,
      });

      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.accessToken}`;
      router.push("/admin");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {passwordChallenge
              ? "Please enter a new password to continue."
              : "Enter your email and password to sign in!"}
          </Text>
        </Box>

        {loading ? (
          <Spinner color="#3311DB" />
        ) : passwordChallenge ? (
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
            <FormControl mb={"12px"} isInvalid={newPassword.error !== ""}>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                New Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="4px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  name="password"
                  value={newPassword.value}
                  onChange={(event) =>
                    setNewPassword({ value: event.target.value, error: "" })
                  }
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {newPassword.error && (
                <FormErrorMessage mb={"16px"}>
                  {newPassword.error}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                onClick={passwordChallengeSubmit}
              >
                Sign In
              </Button>
            </FormControl>
          </Flex>
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
            {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}
            <FormControl mb={"12px"} isInvalid={error.email !== ""}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
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
                onChange={(event) =>
                  setForm({ ...form, [event.target.name]: event.target.value })
                }
              />
              {error.email && (
                <FormErrorMessage mb={"16px"}>{error.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mb={"12px"} isInvalid={error.password !== ""}>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="4px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  name="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [event.target.name]: event.target.value,
                    })
                  }
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {error.password && (
                <FormErrorMessage mb={"16px"}>
                  {error.password}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    id="remember-login"
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color={textColor}
                    fontSize="sm"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                <NavLink to="/auth/forgot-password">
                  <Text
                    color={textColorBrand}
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
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
                Sign In
              </Button>
            </FormControl>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColorDetails} fontWeight="400" fontSize="14px">
                Not registered yet?
                <NavLink to="/auth/sign-up">
                  <Text
                    color={textColorBrand}
                    as="span"
                    ms="5px"
                    fontWeight="500"
                  >
                    Create an Account
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

export default SignIn;
