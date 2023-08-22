import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "util/axios";
import ConnectorModal from "./components/ConnectorModal";
import ConnectorTable from "./components/ConnectorTable";

export default function CloudConnector() {
  const [modalOpen, setModalOpen] = useState(false);
  const [connectors, setConnectors] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    cloud: "",
    apiKey: "",
    secretKey: "",
    accountId: "",
  });

  useEffect(() => {
    (async () => {
      const response = await axios.get("/cloud-connector/");
      setConnectors(response.data);
    })();
  }, []);

  const handleUpdate = (newState: any) => {
    setConnectors(newState);
  };

  const handleEdit = (connector: any) => {
    setForm({
      id: connector.id,
      name: connector.name,
      cloud: connector.cloud,
      apiKey: connector.accessKey,
      secretKey: "",
      accountId: connector.accountId,
    });
    setModalOpen(true);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Box width={"100%"} display={"flex"} color="blue" justifyContent="end">
          <Button onClick={() => setModalOpen(true)}>New Connector</Button>
        </Box>
        <ConnectorTable
          onEdit={handleEdit}
          tableData={connectors}
          setConnector={handleUpdate}
        />
      </SimpleGrid>
      <ConnectorModal
        form={form}
        setForm={setForm}
        isOpen={modalOpen}
        connectors={connectors}
        setConnectors={setConnectors}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
