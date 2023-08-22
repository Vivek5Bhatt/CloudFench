import { Box, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PolicyTable from "./policyTable";

export default function PolicyComponent() {
  const location = useLocation();
  const [policyType, setPolicyType] = useState("secure-nat");

  useEffect(() => {
    if (location.pathname.includes("internal-segmentation")) {
      setPolicyType("internal-segmentation");
    } else {
      setPolicyType("secure-nat");
    }
  }, [location.pathname]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Box width={"100%"} display={"flex"} color="blue" justifyContent="end">
          <PolicyTable policyType={policyType} tableData={[]} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
