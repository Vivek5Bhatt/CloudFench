import { Modal, ModalOverlay } from "@chakra-ui/react";
import { useReducer, useState } from "react";

import SecurityServicesSection from "./SecurityServicesSection";
import SecurityStackInfo from "./SecurityStackInfo";

export default function DeploymentModal({
  isOpen,
  deployStack,
  setModalOpen,
}: {
  isOpen: boolean;
  deployStack: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const errorReducer = (
    state: {
      securityServices: string;
      name: string;
      cloud: string;
      az: string;
      instance: string;
      region: string;
    },
    action: {
      payload: {
        securityServices: string;
        name: string;
        cloud: string;
        az: string;
        instance: string;
        region: string;
      };
      type: string;
    }
  ) => {
    switch (action.type) {
      case "error":
        return { ...action.payload };
      default:
        break;
    }
  };

  const [error, setError] = useReducer(errorReducer, {
    securityServices: "",
    name: "",
    cloud: "",
    az: "",
    instance: "",
    region: "",
  });

  const [form, setForm] = useState({
    webWorkLoad: false,
    secureConnectivity: false,
    workloadProtection: false,
    name: "",
    cloud: "",
    az: [],
    instance: "",
    region: "",
  });

  const [serviceSectionComplete, setServiceSectionComplete] = useState(false);

  const validate = () => {
    let valid = true;
    let errorObj = {
      securityServices: "",
      name: "",
      cloud: "",
      az: "",
      instance: "",
      region: "",
    };

    if (form.name === "") {
      errorObj.name = "Please select a name.";
      setError({ type: "error", payload: errorObj });
      valid = false;
    }

    if (form.cloud === "") {
      errorObj.cloud = "Please select cloud provider.";
      setError({ type: "error", payload: errorObj });
      valid = false;
    }

    if (form.az.length === 0) {
      errorObj.az = "Please select an availability zone.";
      setError({ type: "error", payload: errorObj });
      valid = false;
    }
    if (form.region === "") {
      errorObj.region = "Please select a region.";
      setError({ type: "error", payload: errorObj });
      valid = false;
    }
    if (form.instance === "") {
      errorObj.instance = "Please select an instance type.";
      setError({ type: "error", payload: errorObj });
      valid = false;
    }
    return valid;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }


    const stack = {
      createdAt: new Date(),
      progress: `initializing`,
      services: {
        webWorkLoad: form.webWorkLoad,
        secureConnectivity: form.secureConnectivity,
        workloadProtection: form.workloadProtection,
      },
      name: form.name,
      cloud: form.cloud,
      az: form.az,
      instance: form.instance,
      region: form.region,
    };
    resetStates();
    deployStack(stack);
  };
  const onServiceSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      form.webWorkLoad === false &&
      form.secureConnectivity === false &&
      form.workloadProtection === false
    ) {
      setError({
        type: "error",
        payload: {
          ...error,
          securityServices: "Please select at-least one service.",
        },
      });
      return;
    }

    setServiceSectionComplete(true);
  };

  const closeModal = () => {
    resetStates();
    setModalOpen(false);
  };

  const resetStates = () => {
    setForm({
      webWorkLoad: false,
      secureConnectivity: false,
      workloadProtection: false,
      name: "",
      cloud: "",
      az: [],
      instance: "",
      region: "",
    });
    setError({
      type: "error",
      payload: {
        securityServices: "",
        name: "",
        cloud: "",
        az: "",
        instance: "",
        region: "",
      },
    });
    setServiceSectionComplete(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      {serviceSectionComplete ? (
        <SecurityStackInfo
          form={form}
          validate={validate}
          error={error}
          setForm={setForm}
          closeModal={closeModal}
          onSubmit={onSubmit}
        />
      ) : (
        <SecurityServicesSection
          form={form}
          error={error}
          setForm={setForm}
          closeModal={closeModal}
          onSubmit={onServiceSubmit}
        />
      )}
    </Modal>
  );
}
