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
  Icon,
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
import { MdCheckCircle, MdDisabledByDefault } from "react-icons/md";

const columnHelper = createColumnHelper<{ [key: string]: string }>();

export default function PolicyTable(props: {
  tableData: any;
  policyType: string;
}) {
  const { tableData, policyType } = props;

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
  }, [policyType]);

  const fetchDeployments = async () => {
    try {
      const response = await axios.get(`/deployments/policy/${policyType}`);

      if (response.data.length !== 0) {
        setDeployments(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchLogs = async () => {
    let srcport: string, dstport: string;

    if (policyType === "secure-nat") {
      srcport = "port2";
      dstport = "port1";
    } else if (policyType === "internal-segmentation") {
      srcport = "port2";
      dstport = "port2";
    }

    try {
      setLoading(true);
      const result = await axios.post("/policy", {
        deploymentId: selectedOptions.id,
      });

      const policies = result.data.results;

      if (policies) {
        const filteredPolicies = policies.filter((policy: any) => {
          if (
            policy["srcintf"][0].name === srcport &&
            policy["dstintf"][0].name === dstport
          ) {
            return policy;
          }
          return false;
        });

        setLogData(filteredPolicies);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  React.useEffect(() => {
    setLogData([]);
    setDeployments([]);
  }, [policyType]);

  React.useEffect(() => {
    if (selectedOptions) {
      (async () => {
        await fetchLogs();
      })();
    }
  }, [selectedOptions]);

  React.useEffect(() => {
    setData(logData);
  }, [logData]);

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          NAME
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
    columnHelper.accessor("srcaddr", {
      id: "srcaddr",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          SOURCE
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Box>
            {info.getValue().map((obj: any, index: number) => (
              <Text
                key={index}
                color={textColor}
                fontSize="sm"
                fontWeight="700"
              >
                {obj.name}
              </Text>
            ))}
          </Box>
        </Flex>
      ),
    }),
    columnHelper.accessor("dstaddr", {
      id: "dstaddr",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          DESTINATION
        </Text>
      ),
      cell: (info: any) => {
        let property = "dstaddr";
        if (
          info.row.original["internet-service"] !== "disable" &&
          policyType === "secure-nat"
        ) {
          property = "internet-service-name";
        }

        return (
          <Flex align="center">
            <Box>
              {info.row.original[property].map((obj: any, index: number) => (
                <Text
                  key={index}
                  color={textColor}
                  fontSize="sm"
                  fontWeight="700"
                >
                  {obj.name}
                </Text>
              ))}
            </Box>
          </Flex>
        );
      },
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
      cell: (info: any) => {
        return (
          <Flex align="center">
            <Box>
              {info.row.original["internet-service"] !== "disable" &&
              policyType === "secure-nat" ? (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Internet Services
                </Text>
              ) : (
                info.getValue().map((obj: any, index: number) => (
                  <Text
                    key={index}
                    color={textColor}
                    fontSize="sm"
                    fontWeight="700"
                  >
                    {obj.name}
                  </Text>
                ))
              )}
            </Box>
          </Flex>
        );
      },
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
      cell: (info: any) => (
        <Flex align="center">
          <Text
            display={"flex"}
            alignItems="center"
            color={textColor}
            fontSize="sm"
            fontWeight="700"
            textTransform={"capitalize"}
          >
            {info.getValue() === "accept" ? (
              <>
                <Icon as={MdCheckCircle} color="green" /> {info.getValue()}
              </>
            ) : (
              <>
                <Icon as={MdDisabledByDefault} color="red" /> {info.getValue()}
              </>
            )}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("security-profiles", {
      id: "security-profiles",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          Security Profiles
        </Text>
      ),
      cell: (info: any) => {
        return (
          <Flex align="center">
            <Box>{listSecurityProfiles(info.row.original)}</Box>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          STATUS
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text
            display={"flex"}
            alignItems="center"
            color={textColor}
            fontSize="sm"
            fontWeight="700"
            textTransform={"capitalize"}
          >
            {info.getValue() === "enable" ? (
              <>
                <Icon as={MdCheckCircle} color="green" /> {info.getValue()}
              </>
            ) : (
              <>
                <Icon as={MdDisabledByDefault} color="red" /> {info.getValue()}
              </>
            )}
          </Text>
        </Flex>
      ),
    }),
  ];

  const listSecurityProfiles = (rowData: any) => {
    const profiles = [
      { key: "webfilter-profile", label: "Web", policyType: ["secure-nat"] },
      {
        key: "application-list",
        label: "App",
        policyType: ["secure-nat", "internal-segmentation"],
      },
      {
        key: "av-profile",
        label: "AntiVirus",
        policyType: ["secure-nat", "internal-segmentation"],
      },
      { key: "dnsfilter-profile", label: "DNS", policyType: ["secure-nat"] },
      {
        key: "ssl-ssh-profile",
        label: "SSL",
        policyType: ["secure-nat", "internal-segmentation"],
      },
      {
        key: "ips-sensor",
        label: "IPS",
        policyType: ["internal-segmentation"],
      },
    ];

    const elem: JSX.Element[] = [];

    profiles.forEach((profile, index) => {
      const val = rowData[profile.key];
      if (val !== "") {
        elem.push(
          <Text key={index} color={textColor} fontSize="sm" fontWeight="700">
            {profile.label} : {val}
          </Text>
        );
      }
    });
    return elem;
  };
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
            Policies
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
      </Card>
    </>
  );
}
