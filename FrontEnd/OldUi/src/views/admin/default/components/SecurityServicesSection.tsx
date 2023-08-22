import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";

export default function SecurityServicesSection({
  error,
  form,
  setForm,
  closeModal,
  onSubmit,
}: {
  closeModal: any;
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
  return (
    <ModalContent>
      <ModalHeader>Deploy a new security stack</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {/* Body */}
        <Text mb={"24px"}>Select your security service.</Text>
        <FormControl mb={"12px"} isInvalid={error.securityServices !== ""}>
          <Flex direction={"column"} rowGap={"24px"}>
            <Checkbox
              isRequired={true}
              ms={{ base: "0px", md: "0px" }}
              mb="4px"
              fontWeight="500"
              size="md"
              name="webWorkLoad"
              checked={form.webWorkLoad}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.checked })
              }
            >
              Web Workload and API Protection
            </Checkbox>
            <Checkbox
              isRequired={true}
              ms={{ base: "0px", md: "0px" }}
              mb="4px"
              fontWeight="500"
              size="md"
              name="secureConnectivity"
              checked={form.secureConnectivity}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.checked })
              }
            >
              Secure Connectivity and Remote Access
            </Checkbox>
            <Checkbox
              isRequired={true}
              ms={{ base: "0px", md: "0px" }}
              mb="4px"
              fontWeight="500"
              size="md"
              name="workloadProtection"
              checked={form.workloadProtection}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.checked })
              }
            >
              Workload protection and Internal Segmentation
            </Checkbox>
            {error.securityServices && (
              <FormErrorMessage mb={"16px"}>
                {error.securityServices}
              </FormErrorMessage>
            )}
          </Flex>
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} onClick={closeModal}>
          Close
        </Button>
        <Button
          colorScheme="blue"
          onClick={onSubmit}
          type="submit"
        >
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
