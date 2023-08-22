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
import { FaChevronLeft } from "react-icons/fa";

function ForgotPassword() {
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

  const [error, setError] = useReducer(errorReducer, {
    email: "",
    code: "",
    password: "",
  });
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
  });

  const router = useHistory();

  const validate = () => {
    const errorObj = { email: "", password: "", code: "" };

    let valid = true;
    if (
      form.email === "" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      errorObj.email = "Please enter a valid email";
      setError({
        type: "error",
        payload: { ...errorObj },
      });
      valid = false;
    }

    if (codeSent) {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          form.password
        ) ||
        form.password === ""
      ) {
        errorObj.password =
          "Password should be more than 8 characters.\nShould contain uppercase and lowercase characters.\nShould contain at least one number.";
        setError({
          type: "error",
          payload: {
            ...errorObj,
          },
        });
        valid = false;
      }
      if (form.code === "") {
        errorObj.code = "Please enter a valid code";
        setError({
          type: "error",
          payload: { ...errorObj },
        });
        valid = false;
      }
    }

    return valid;
  };

  const [codeSent, setCodeSent] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("auth/forgot-password", {
        email: form.email,
      });

      setCodeSent(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const createNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("auth/confirm-password", {
        email: form.email,
        newPassword: form.password,
        confirmationCode: form.code,
      });

      setLoading(false);
      router.push("auth/sign-in");
    } catch (error: any) {
      setLoading(false);
      setError({
        type: "error",
        payload: { email: "", password: "", code: error.response.data.message },
      });
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
            Enter your email and password to sign in!
          </Text>
        </Box>

        {loading ? (
          <Spinner color="#3311DB" mb={"24px"} />
        ) : codeSent ? (
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
            <Flex
              align="center"
              ps={{ base: "25px", lg: "0px" }}
              pt={{ lg: "0px", xl: "0px" }}
              w="fit-content"
              mb={"24px"}
              onClick={() => setCodeSent(false)}
            >
              <Icon
                as={FaChevronLeft}
                me="12px"
                h="13px"
                w="8px"
                color="secondaryGray.600"
              />
              <Text ms="0px" fontSize="sm" color="secondaryGray.600">
                Add a different email?
              </Text>
            </Flex>
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
            <FormControl mb={"12px"} isInvalid={error.code !== ""}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Code<Text color={brandStars}>*</Text>
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
                name="code"
                value={form.code}
                onChange={(event) =>
                  setForm({ ...form, [event.target.name]: event.target.value })
                }
              />
              {error.code && (
                <FormErrorMessage mb={"16px"}>{error.code}</FormErrorMessage>
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
                <FormErrorMessage whiteSpace={"pre"} mb={"16px"}>
                  {error.password}
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
                onClick={createNewPassword}
              >
                Create New Password
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
                <NavLink to="/auth/sign-in">
                  <Text
                    color={textColorBrand}
                    as="span"
                    ms="5px"
                    fontWeight="500"
                  >
                    Back to Sign in?
                  </Text>
                </NavLink>
              </Text>
            </Flex>
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
            <FormControl>
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
                Send Code
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
                <NavLink to="/auth/sign-in">
                  <Text
                    color={textColorBrand}
                    as="span"
                    ms="5px"
                    fontWeight="500"
                  >
                    Back to Sign in?
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

export default ForgotPassword;
