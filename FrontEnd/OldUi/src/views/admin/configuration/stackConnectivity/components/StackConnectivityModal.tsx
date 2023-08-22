import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
} from "@chakra-ui/react";
import axios from "util/axios";
import { FormEvent, Key, useEffect, useState } from "react";
import MultiSelectField from "./MultiSelectField";

export default function StackConnectivityModal({
  isOpen,
  onClose,
  stackConnectors,
  setStackConnectors,
}: {
  isOpen: boolean;
  onClose: any;
  stackConnectors: any;
  setStackConnectors: any;
}) {
  const [networkSection, setNetworkSection] = useState(false);
  const [stacks, setStacks] = useState([]);
  const [connectors, setConnectors] = useState([]);

  const [form, setForm] = useState({
    stack: "",
    cloudConnector: "",
    vpc: "",
    subnet: [],
  });

  const [error, setError] = useState({
    stack: "",
    cloudConnector: "",
    vpc: "",
    subnet: "",
  });

  const [vpcs, setVpcs] = useState([]);
  const [subnets, setSubnets] = useState([]);

  useEffect(() => {
    if (isOpen)
      (async () => {
        const response = await axios.get("deployments/stackConnector");
        setStacks(response.data);
        const result = await axios.get("cloud-connector/");
        setConnectors(result.data);
      })();
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      try {
        if (form.vpc.length !== 0) {
          const stackInfo = stacks.filter((stack) => stack.id === form.stack);
          const response = await axios.post("stack-connector/subnet", {
            region: stackInfo[0].region,
            vpcs: form.vpc,
            connectorId: form.cloudConnector,
          });
          setSubnets(response.data.Subnets);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [form.vpc]);

  const handleClose = () => {
    emptyStates();
    onClose();
  };

  const CloudInformationContent = () => {
    return (
      <ModalContent>
        <ModalHeader>Connect your VPC</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={"12px"} isInvalid={error.stack !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Security Stack
            </FormLabel>
            <Select
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              mb="4px"
              fontWeight="500"
              size="lg"
              name="stack"
              placeholder="Select a security stack"
              value={form.stack}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
            >
              {stacks.length !== 0 &&
                stacks.map((stack: any, index: Key) => (
                  <option key={index} value={stack.id}>
                    {stack.name}
                  </option>
                ))}
            </Select>
            {error.stack && (
              <FormErrorMessage mb={"16px"}>{error.stack}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={"12px"} isInvalid={error.cloudConnector !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Cloud Connector
            </FormLabel>
            <Select
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              mb="4px"
              fontWeight="500"
              size="lg"
              name="cloudConnector"
              placeholder="Select a cloud connector"
              value={form.cloudConnector}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
            >
              {connectors.length !== 0 &&
                connectors.map((connector: any, index: Key) => (
                  <option key={index} value={connector.id}>
                    {connector.name}
                  </option>
                ))}
            </Select>
            {error.cloudConnector && (
              <FormErrorMessage mb={"16px"}>
                {error.cloudConnector}
              </FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button onClick={onSubmitCloudInformation} colorScheme="blue">
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  };

  const ApiKeysContent = () => {
    return (
      <ModalContent>
        <ModalHeader>Connect your VPC</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box
              display="flex"
              justifyContent={"center"}
              padding={"50px 0"}
              width={"100%"}
              alignItems={"center"}
            >
              <Spinner color="#3311DB" />
            </Box>
          ) : (
            <>
              <FormControl mb={"12px"} isInvalid={error.vpc !== ""}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  VPCs
                </FormLabel>
                <Select
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  mb="4px"
                  fontWeight="500"
                  size="lg"
                  name="vpc"
                  placeholder="Select a VPC"
                  value={form.vpc}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [event.target.name]: event.target.value,
                    })
                  }
                >
                  {vpcs.length !== 0 &&
                    vpcs.map((vpc: any, index: Key) => (
                      <option key={index} value={vpc.VpcId}>
                        {vpc.VpcId}
                      </option>
                    ))}
                </Select>
                {error.vpc && (
                  <FormErrorMessage mb={"16px"}>{error.vpc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={"12px"} isInvalid={error.subnet !== ""}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Subnets
                </FormLabel>
                <MultiSelectField
                  options={subnets.map((subnet) => {
                    subnet.id = subnet.SubnetId;
                    return subnet;
                  })}
                  label={"Subnets"}
                  onChange={(selectedValues) => {
                    setForm({ ...form, subnet: selectedValues });
                  }}
                />
                {error.subnet && (
                  <FormErrorMessage mb={"16px"}>
                    {error.subnet}
                  </FormErrorMessage>
                )}
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={() => {
              setNetworkSection(false);
            }}
          >
            Back
          </Button>
          <Button colorScheme="blue" onClick={connectStack}>
            Connect
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  };

  const connectStack = async (event: FormEvent) => {
    event.preventDefault();
    const errorObject = {
      stack: "",
      cloudConnector: "",
      vpc: "",
      subnet: "",
    };
    let valid = true;

    if (form.vpc === "") {
      errorObject.vpc = "Please select a VPC.";
      valid = false;
    }
    if (form.subnet.length === 0 || form.subnet.length < 2) {
      errorObject.subnet = "Please select at least two Subnet.";
      valid = false;
    }

    if (!valid) {
      setError({ ...errorObject });
      return;
    }

    const stackInfo = stacks.filter((stack) => stack.id === form.stack);
    try {
      const response = await axios.post("stack-connector/add", {
        vpc: form.vpc,
        subnets: form.subnet,
        region: stackInfo[0].region,
        connectorId: form.cloudConnector,
        deploymentId: stackInfo[0].id,
      });

      setStackConnectors([...stackConnectors, response.data]);
      emptyStates();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitCloudInformation = async (event: FormEvent) => {
    event.preventDefault();
    const errorObject = {
      stack: "",
      cloudConnector: "",
      vpc: "",
      subnet: "",
    };
    let valid = true;

    if (form.stack === "") {
      errorObject.stack = "Please select a security stack.";
      valid = false;
    }
    if (form.cloudConnector === "") {
      errorObject.cloudConnector = "Please select a cloud connector.";
      valid = false;
    }

    if (!valid) {
      setError({ ...errorObject });
      return;
    }

    try {
      setLoading(true);
      setNetworkSection(true);
      const stackInfo = stacks.filter((stack) => stack.id === form.stack);
      const response = await axios.post("stack-connector/vpc", {
        region: stackInfo[0].region,
        connectorId: form.cloudConnector,
      });

      setVpcs(response.data.Vpcs);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const emptyStates = () => {
    setNetworkSection(false);
    setForm({
      stack: "",
      cloudConnector: "",
      vpc: "",
      subnet: [],
    });
    setError({
      stack: "",
      cloudConnector: "",
      vpc: "",
      subnet: "",
    });
    setVpcs([]);
    setSubnets([]);
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        {networkSection ? ApiKeysContent() : CloudInformationContent()}
      </Modal>
    </>
  );
}
