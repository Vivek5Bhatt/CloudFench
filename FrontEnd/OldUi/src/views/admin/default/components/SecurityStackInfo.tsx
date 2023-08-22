import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  FormControl,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Spinner,
  Box,
  Text,
} from "@chakra-ui/react";
import awsRegions from "aws-regions";
import { useState } from "react";
import MultiSelectMenu from "./MultiSelectMenu";
import axios from "util/axios";
export default function SecurityStackInfo({
  error,
  form,
  validate,
  setForm,
  closeModal,
  onSubmit,
}: {
  closeModal: any;
  validate: any;
  error: {
    securityServices: string;
    name: string;
    cloud: string;
    az: string;
    instance: string;
    region: string;
  };
  form: {
    webWorkLoad: boolean;
    secureConnectivity: boolean;
    workloadProtection: boolean;
    name: string;
    cloud: string;
    az: any;
    instance: string;
    region: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      webWorkLoad: boolean;
      secureConnectivity: boolean;
      workloadProtection: boolean;
      name: string;
      cloud: string;
      az: any;
      instance: string;
      region: string;
    }>
  >;
  onSubmit: any;
}) {
  const [loading, setLoading] = useState(false);
  const [twoFASec, setTwoFASec] = useState(false);
  const [twoFAVal, setTwoFAVal] = useState("");
  const [twoFaError, setTwoFaError] = useState("");
  const [code, setCode] = useState("");
  return twoFASec ? (
    <ModalContent>
      <ModalHeader>Add Authorization Code</ModalHeader>
      <ModalCloseButton />

      {loading ? (
        <Box
          height={"200px"}
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          flexFlow="column"
          rowGap={"1rem"}
        >
          <Spinner color="#3311DB" />
          <Text fontSize="sm">Sending email...</Text>
        </Box>
      ) : (
        <ModalBody>
          <FormControl mb={"12px"} isInvalid={twoFaError !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              //   color={}
              mb="8px"
            >
              Authorization Code
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              type="number"
              placeholder="Enter the authorization code"
              mb="4px"
              fontWeight="500"
              size="lg"
              name="twoFAVal"
              value={twoFAVal}
              onChange={(event) => {
                setTwoFAVal(event.target.value);
              }}
            />
            {twoFaError !== "" && (
              <FormErrorMessage mb={"16px"}>{twoFaError}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
      )}
      <ModalFooter>
        <Button
          mr={3}
          onClick={() => {
            setTwoFASec(false);
            setTwoFAVal("");
            setTwoFaError("");
            setLoading(false);
            setCode("");
            closeModal();
          }}
        >
          Close
        </Button>
        <Button
          colorScheme="blue"
          onClick={(event) => {
            if (twoFAVal === window.atob(code)) {
              onSubmit(event);
            } else {
              setTwoFaError(
                "The code is invalid. Please enter the correct code."
              );
            }
          }}
          type="submit"
        >
          Deploy
        </Button>
      </ModalFooter>
    </ModalContent>
  ) : (
    <ModalContent>
      <ModalHeader>Deploy a new security stack</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        {/* Body */}
        <FormControl mb={"12px"} isInvalid={error.name !== ""}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            //   color={}
            mb="8px"
          >
            Name
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="text"
            placeholder="Enter a description."
            mb="4px"
            fontWeight="500"
            size="lg"
            name="name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, [event.target.name]: event.target.value })
            }
          />
          {error.name && (
            <FormErrorMessage mb={"16px"}>{error.name}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb={"12px"} isInvalid={error.cloud !== ""}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            //   color={}
            mb="8px"
          >
            Cloud
          </FormLabel>
          <Select
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            mb="4px"
            fontWeight="500"
            size="lg"
            name="cloud"
            placeholder="Select a cloud"
            value={form.cloud}
            onChange={(event) =>
              setForm({ ...form, [event.target.name]: event.target.value })
            }
          >
            <option value="AWS">AWS</option>
          </Select>
          {error.cloud && (
            <FormErrorMessage mb={"16px"}>{error.cloud}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb={"12px"} isInvalid={error.region !== ""}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            //   color={}
            mb="8px"
          >
            Regions
          </FormLabel>
          <Select
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            mb="4px"
            fontWeight="500"
            size="lg"
            name="region"
            placeholder="Select a region"
            value={form.region}
            onChange={(event) =>
              setForm({ ...form, [event.target.name]: event.target.value })
            }
          >
            {awsRegions.list().map((region, index) => (
              <option key={index} value={region.code}>
                {region.full_name} ({region.code})
              </option>
            ))}
          </Select>
          {error.region && (
            <FormErrorMessage mb={"16px"}>{error.region}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb={"12px"} isInvalid={error.az !== ""}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            //   color={}
            mb="8px"
          >
            Availability Zones
          </FormLabel>
          <MultiSelectMenu
            options={
              form.region !== ""
                ? [...awsRegions.lookup({ code: form.region }).zones]
                : []
            }
            label={"Availability Zones"}
            onChange={(selectedValues) => {
              setForm({ ...form, az: selectedValues });
            }}
          />
          {error.az && (
            <FormErrorMessage mb={"16px"}>{error.az}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb={"12px"} isInvalid={error.instance !== ""}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            //   color={}
            mb="8px"
          >
            Instance Types
          </FormLabel>
          <Select
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            mb="4px"
            fontWeight="500"
            size="lg"
            name="instance"
            placeholder="Select an instance type"
            value={form.instance}
            onChange={(event) =>
              setForm({ ...form, [event.target.name]: event.target.value })
            }
          >
            <option value={"Very Small"}>Very Small</option>
            <option value={"Small"}> Small</option>
          </Select>
          {error.instance && (
            <FormErrorMessage mb={"16px"}>{error.instance}</FormErrorMessage>
          )}
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} onClick={closeModal}>
          Close
        </Button>
        <Button
          colorScheme="blue"
          onClick={async () => {
            if (!validate()) {
              return;
            }
            setLoading(true);
            setTwoFASec(true);
            try {
              const res = await axios.get("infra/sendTwoFaEmail");

              if (res.data === "") {
                throw Error("No code received");
              }

              setCode(res.data);
              setLoading(false);
            } catch (error) {
              setLoading(false);
              setTwoFASec(false);
              console.log(error);
            }
          }}
          type="submit"
        >
          Deploy
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
