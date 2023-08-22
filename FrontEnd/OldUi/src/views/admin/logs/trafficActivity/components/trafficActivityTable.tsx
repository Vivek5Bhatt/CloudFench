import {
  Flex,
  Box,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Select,
  Spinner,
} from "@chakra-ui/react";
import * as React from "react";

import axios from "util/axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

// Custom components
import Card from "components/card/Card";
import TrafficActivityDrawer from "./trafficActivityDrawer";
import TablePagination from "components/pagination/TablePagination";

const columnHelper = createColumnHelper<{ [key: string]: string }>();

export default function TrafficActivityTable(props: { tableData: any }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [pagination, setPagination] = React.useState({
    currentPage: 0,
    totalPages: 0,
    perPage: 100,
  });

  const [Deployments, setDeployments] = React.useState([]);
  const [selectedOptions, setSelecetedOptions] = React.useState(null);
  const [logData, setLogData] = React.useState([]);

  React.useEffect(() => {
    (async () => await fetchDeployments())();
  }, []);

  const fetchDeployments = async () => {
    try {
      const response = await axios.get("/deployments/default");

      if (response.data.length !== 0) {
        setDeployments(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchLogs = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const result = await axios.post("/logs/", {
        deploymentId: selectedOptions.id,
        offset: page * limit,
        limit,
      });

      if (result.data.status === 200) {
        setPagination({
          ...pagination,
          currentPage: page,
          totalPages: Math.ceil(result.data.payload.total / 100),
        });
        const updateLogs = result.data.payload.data.map((log: any) => {
          return {
            ...log,
            Deployment: selectedOptions.name,
            cloud: selectedOptions.cloud,
            region: selectedOptions.region,
          };
        });
        setLogData(updateLogs);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (selectedOptions) {
      (async () => {
        await fetchLogs(pagination.currentPage, pagination.perPage);
      })();
    }
  }, [selectedOptions]);
  React.useEffect(() => {
    setData(logData);
  }, [logData]);

  const columns = [
    columnHelper.accessor("Deployment", {
      id: "stackName",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          DEPLOYMENT
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("cloud", {
      id: "stackCloud",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          CLOUD
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("region", {
      id: "stackRegion",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          REGION
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          DATE
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("time", {
      id: "time",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          TIME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("action", {
      id: "action",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          ACTION
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("srcip", {
      id: "srcname",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          SOURCE NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("dstip", {
      id: "dstname",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          DESTINATION NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("srccountry", {
      id: "srccountry",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          SOURCE COUNTRY
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() === "Reserved"
            ? ""
            : info.getValue().replace("%20", " ")}
        </Text>
      ),
    }),
    columnHelper.accessor("dstcountry", {
      id: "dstcountry",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          DESTINATION COUNTRY
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() === "Reserved"
            ? ""
            : info.getValue().replace("%20", " ")}
        </Text>
      ),
    }),
    columnHelper.accessor("service", {
      id: "service",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          SERVICE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("app", {
      id: "app",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          APPLICATION
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("policyname", {
      id: "policyname",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          POLICY NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
  ];
  const [data, setData] = React.useState(logData);
  const [loading, setLoading] = React.useState(false);
  const [DetailedObj, setDetailedObj] = React.useState(undefined);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={"hidden"}
        // overflowX={{ sm: "scroll", lg: "scroll" }}
      >
        <Flex
          px="25px"
          mb="8px"
          width={"full"}
          justifyContent="space-between"
          align="center"
        >
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
            minWidth={"fit-content"}
          >
            Traffic Activity
          </Text>
          <Box
            width={"100%"}
            display={"flex"}
            color="blue"
            justifyContent="end"
          >
            <Select
              onChange={(event) =>
                setSelecetedOptions(
                  Deployments.filter((d) => d.id === event.target.value)[0]
                )
              }
              variant="outline"
              width={250}
              placeholder="Select a deployment"
            >
              {Deployments.map((deployment, index) => (
                <option key={index} value={deployment.id}>
                  {deployment.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <Box width={"100%"} overflowX="scroll">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: "10px", lg: "12px" }}
                          color="gray.400"
                          whiteSpace={"pre"}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "",
                            desc: "",
                          }[header.column.getIsSorted() as string] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            {loading ? (
              <Tbody>
                <Tr width={"full"} justifyContent="center">
                  <Td colSpan={11} textAlign={"center"}>
                    <Box paddingY={"40px"}>
                      <Spinner color="#3311DB" />
                    </Box>
                  </Td>
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {data.length === 0 ? (
                  <Tr padding={"4"} width={"full"} justifyContent="center">
                    <Td colSpan={11} textAlign={"center"}>
                      <Text fontSize="sm">No data to show yet...</Text>
                    </Td>
                  </Tr>
                ) : (
                  table
                    .getRowModel()
                    .rows.slice(0, pagination.perPage)
                    .map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          onDoubleClick={() => {
                            setDetailedObj(row.original);
                            onOpen();
                          }}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                fontSize={"10px"}
                                minWidth={"max-content"}
                                borderColor="transparent"
                                whiteSpace={"pre"}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })
                )}
              </Tbody>
            )}
          </Table>
        </Box>
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={async (newPage) => {
            setPagination({ ...pagination, currentPage: newPage });
            await fetchLogs(newPage, pagination.perPage);
          }}
        />
      </Card>
      <TrafficActivityDrawer
        DetailedObj={DetailedObj}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
