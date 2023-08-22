import { Box, Select, SimpleGrid } from "@chakra-ui/react";
import axios from "util/axios";
import { useEffect, useState } from "react";
// import TrafficActivityMenu from "./components/trafficActivityMenu";
import TrafficActivityTable from "./components/trafficActivityTable";

export default function TrafficActivity() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Box width={"100%"} display={"flex"} color="blue" justifyContent="end">
          <TrafficActivityTable tableData={[]} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
