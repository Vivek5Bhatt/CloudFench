import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { CopyBlock, nord } from "react-code-blocks";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import axios from "util/axios";
import { FormEvent, useEffect, useState } from "react";
import { encryptPayload } from "util/encryption";

export default function ConnectorModal({
  form,
  setForm,
  isOpen,
  onClose,
  connectors,
  setConnectors,
}: {
  form: {
    id: string;
    name: string;
    cloud: string;
    apiKey: string;
    secretKey: string;
    accountId: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      cloud: string;
      apiKey: string;
      secretKey: string;
      accountId: string;
    }>
  >;
  isOpen: boolean;
  setConnectors: any;
  connectors: any[];
  onClose: any;
}) {
  const [apiSection, setApiSection] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    name: "",
    cloud: "",
    apiKey: "",
    secretKey: "",
    accountId: "",
  });

  useEffect(() => {
    (async () => {
      if (form.cloud !== "") {
        const response = await axios.get(
          `cloud-connector/policy/${form.cloud}`
        );
        setPolicy(JSON.stringify(response.data));
      }
    })();
  }, [form.cloud]);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [policy, setPolicy] = useState("");

  const handleClose = () => {
    emptyStates();
    setLoading(false);
    onClose();
  };

  const CloudInformationContent = () => {
    return (
      <ModalContent>
        <ModalHeader>
          {form.id !== "" ? "Edit" : "Create"} a Cloud Connector
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={"16px"} isInvalid={error.name !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Connector Name
            </FormLabel>
            <Input
              // isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              type="text"
              placeholder="Enter a name for connector."
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
          <FormControl mb={"16px"} isInvalid={error.cloud !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Select a Cloud Provider
            </FormLabel>
            <RadioGroup
              onChange={(value) => setForm({ ...form, cloud: value })}
              value={form.cloud}
            >
              <Stack direction="row" justifyContent={"space-around"}>
                <Radio value="AWS">AWS</Radio>
                <Radio value="GCP">GCP</Radio>
                <Radio value="Azure">Azure</Radio>
              </Stack>
            </RadioGroup>
            {error.cloud && <FormErrorMessage>{error.cloud}</FormErrorMessage>}
          </FormControl>
          <FormControl mb={"16px"} isInvalid={error.cloud !== ""}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Policy
            </FormLabel>
            <CopyBlock
              text={
                policy !== "" && !policy.includes('""')
                  ? JSON.stringify(JSON.parse(policy))
                  : "Please select a cloud provider to get the policy."
              }
              theme={nord}
              language="json"
              customStyle={{
                height: "250px",
                overflowY: "scroll",
                margin: "0px 0.75rem",
                borderRadius: "5px",
                boxShadow: "1px 2px 3px rgba(0,0,0,0.35)",
                fontSize: "0.75rem",
              }}
            />
            {/* 
              {error.cloud && (
                <FormErrorMessage>{error.cloud}</FormErrorMessage>
              )} */}
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
        <ModalHeader>
          {form.id !== "" ? "Edit" : "Create"} a Cloud Connector
        </ModalHeader>
        <ModalCloseButton />
        {loading ? (
          <ModalBody>
            <Box
              height={"250px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Spinner color="#3311DB" />
            </Box>
          </ModalBody>
        ) : (
          <>
            <ModalBody>
              <FormControl mb={"16px"} isInvalid={error.accountId !== ""}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Account Id
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  placeholder="Enter your AWS Account's API Key"
                  mb="4px"
                  fontWeight="500"
                  size="lg"
                  name="accountId"
                  value={form.accountId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [event.target.name]: event.target.value,
                    })
                  }
                />
                {error.accountId && (
                  <FormErrorMessage mb={"16px"}>
                    {error.accountId}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={"16px"} isInvalid={error.apiKey !== ""}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Access Key
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  placeholder="Enter your AWS Account's API Key"
                  mb="4px"
                  fontWeight="500"
                  size="lg"
                  name="apiKey"
                  value={form.apiKey}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [event.target.name]: event.target.value,
                    })
                  }
                />
                {error.apiKey && (
                  <FormErrorMessage mb={"16px"}>
                    {error.apiKey}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={"16px"} isInvalid={error.secretKey !== ""}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Secret Key
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Enter your AWS Account's Secret Key"
                    mb="4px"
                    size="lg"
                    type={show ? "text" : "password"}
                    variant="auth"
                    name="secretKey"
                    value={form.secretKey}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [event.target.name]: event.target.value,
                      })
                    }
                  />
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={"gray.400"}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={handleClick}
                    />
                  </InputRightElement>
                </InputGroup>
                {error.secretKey && (
                  <FormErrorMessage mb={"16px"}>
                    {error.secretKey}
                  </FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setApiSection(false)}>
                Back
              </Button>
              <Button colorScheme="blue" onClick={onSubmitApiInfo}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    );
  };
  const onSubmitApiInfo = async (event: FormEvent) => {
    event.preventDefault();
    const errorObject = {
      name: "",
      cloud: "",
      apiKey: "",
      secretKey: "",
      accountId: "",
    };
    let valid = true;

    if (form.accountId === "") {
      errorObject.accountId = "Please provide an Account ID for the connector.";
      valid = false;
    }
    if (form.apiKey === "") {
      errorObject.apiKey = "Please provide an API Key for the connector.";
      valid = false;
    }
    if (form.secretKey === "") {
      errorObject.secretKey = "Please provide a Secret Key for the connector.";
      valid = false;
    }

    if (!valid) {
      setError({ ...errorObject });
      return;
    }
    setLoading(true);

    try {
      const cipherText = encryptPayload({ ...form });
      if (form.id !== "") {
        const response = await axios.put("/cloud-connector/", {
          payload: cipherText,
        });

        const updatedConnectors = connectors.map((connector) => {
          if (connector.id === response.data.id) {
            return response.data;
          }
          return connector;
        });
        setConnectors([...updatedConnectors]);
        emptyStates();
        setLoading(false);
        onClose();
      } else {
        const response = await axios.post("/cloud-connector/", {
          payload: cipherText,
        });
        if (response.data) {
          setConnectors([...connectors, response.data]);
          emptyStates();
          setLoading(false);
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitCloudInformation = (event: FormEvent) => {
    event.preventDefault();
    const errorObject = {
      name: "",
      cloud: "",
      apiKey: "",
      secretKey: "",
      accountId: "",
    };
    let valid = true;

    if (form.name === "") {
      errorObject.name = "Please enter a name for the connector.";
      valid = false;
    }
    if (form.cloud === "") {
      errorObject.cloud = "Please select a cloud provider.";
      valid = false;
    }

    if (!valid) {
      setError({ ...errorObject });
      return;
    }

    setApiSection(true);
  };

  const emptyStates = () => {
    setApiSection(false);
    setForm({
      id: "",
      name: "",
      cloud: "",
      apiKey: "",
      secretKey: "",
      accountId: "",
    });
    setError({
      name: "",
      cloud: "",
      apiKey: "",
      secretKey: "",
      accountId: "",
    });
    setPolicy("");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        {apiSection ? ApiKeysContent() : CloudInformationContent()}
      </Modal>
    </>
  );
}
