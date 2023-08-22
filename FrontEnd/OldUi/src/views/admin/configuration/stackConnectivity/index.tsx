import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StackConnectivityTable from "./components/StackConectivityTable";
import StackConnectivityModal from "./components/StackConnectivityModal";
import axios from "util/axios";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });

export default function StackConnectivity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stackConnectors, setStackConnectors] = useState([]);
  const fetchStackConnectors = async () => {
    const response = await axios.get("/stack-connector/");

    return response.data;
  };

  useEffect(() => {
    (async () => {
      const response = await fetchStackConnectors();
      setStackConnectors(response);
    })();

    socket.connect();

    socket.on(
      "stackConnectorProgress",
      async (payload: { id: string; status: string }) => {
        const response = await fetchStackConnectors();
        const temp = [];

        for (const connector of response) {
          if (connector.id === payload.id) {
            connector.status = payload.status;
          }
          temp.push(connector);
        }

        setStackConnectors(temp);
      }
    );

    return () => {
      socket.off("stackConnectorProgress");
      socket.disconnect();
    };
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Box width={"100%"} display={"flex"} color="blue" justifyContent="end">
          <Button onClick={() => setModalOpen(true)}>Connect Stack</Button>
        </Box>
        <StackConnectivityTable tableData={stackConnectors} />
      </SimpleGrid>
      <StackConnectivityModal
        isOpen={modalOpen}
        stackConnectors={stackConnectors}
        setStackConnectors={setStackConnectors}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
