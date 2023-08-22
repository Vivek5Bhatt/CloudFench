import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Progress,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  Icon,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";

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
import axios from "util/axios";
import DeploymentModal from "views/admin/default/components/DeploymentModal";
import { io } from "socket.io-client";
import { MdOutlineMoreHoriz } from "react-icons/md";

type RowObj = {
  id: string;
  createdAt: Date;
  progress: string;
  services: {
    webWorkLoad: boolean;
    secureConnectivity: boolean;
    workloadProtection: boolean;
  };
  name: string;
  cloud: string;
  az: string;
  instance: string;
  region: string;
};

interface DataReducerAction {
  type: string;
  payload: any;
}

const columnHelper = createColumnHelper<RowObj>();
const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });

// const columns = columnsDataCheck;
export default function CheckTable(props: { tableData: any }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [deployActive, setDeployActive] = React.useState(true);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();
  const fetchDeployments = async () => {
    try {
      const response = await axios.get("/deployments/default");

      if (response.data.length !== 0) {
        dispatchData({ type: "initializeList", payload: response.data });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    (async () => fetchDeployments())();
    socket.connect();

    socket.on("error", (error) => {
      console.log(error, "socketerror");
    });

    socket.on("progress", (progress) => {
      dispatchData({
        type: "updateProgress",
        payload: { id: progress.id, progress: progress.progress },
      });
    });

    return () => {
      socket.off("error");
      socket.off("progress");
      socket.disconnect();
    };
  }, []);

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
    columnHelper.accessor("cloud", {
      id: "cloud",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          Cloud
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
      id: "region",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          Region
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
    columnHelper.accessor("progress", {
      id: "progress",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          PROGRESS
        </Text>
      ),
      cell: (info) => {
        let value,
          progress = info.getValue();

        switch (progress) {
          case "initializing":
            value = 30;
            break;
          case "provisioning":
            value = 70;
            break;
          case "success":
            value = 100;
            break;
          case "error":
            value = 100;
            break;
          case "destroyed":
            value = 100;
            break;
          case "destroying":
            value = 50;
            break;
        }
        return (
          <Box
            position={"relative"}
            display="flex"
            flexFlow={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Progress
              value={value}
              width="100%"
              colorScheme={progress === "error" ? "red" : "blue"}
            />
            <Text
              position={"absolute"}
              top="2.5"
              fontSize={"12px"}
              textAlign="center"
            >
              {progress}
            </Text>
          </Box>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
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
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toDateString()}
        </Text>
      ),
    }),
  ];

  const dataReducer = (state: RowObj[], action: DataReducerAction) => {
    switch (action.type) {
      case "initializeList":
        return [...action.payload];
      case "addStack":
        return [...state, action.payload];
      case "updateProgress":
        let tempObj = [...state];
        tempObj = tempObj.map((obj) => {
          if (obj.id === action.payload.id) {
            obj.progress = action.payload.progress;
          }
          return obj;
        });
        return tempObj;
      default:
        break;
    }
  };

  const [data, dispatchData] = React.useReducer(dataReducer, []);

  // const [data, setData] = React.useState(() => [...defaultData]);
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

  const [modalOpen, setModalOpen] = React.useState(false);

  const deployStack = async (stack: {
    createdAt: Date;
    progress: string;
    services: {
      webWorkLoad: boolean;
      secureConnectivity: boolean;
      workloadProtection: boolean;
    };
    name: string;
    cloud: string;
    az: string;
    instance: string;
    region: string;
  }) => {
    setModalOpen(false);
    setDeployActive(false);

    dispatchData({ type: "addStack", payload: stack });
    try {
      await axios.post("/infra/deploy", stack);

      await fetchDeployments();

      setDeployActive(true);
    } catch (error) {
      setDeployActive(true);
    }
  };

  const destroyStack = async (stack: {
    id: string;
    createdAt: Date;
    progress: string;
    services: {
      webWorkLoad: boolean;
      secureConnectivity: boolean;
      workloadProtection: boolean;
    };
    name: string;
    cloud: string;
    az: string;
    instance: string;
    region: string;
  }) => {
    try {
      const response = await axios.delete(`/infra/destroy/${stack.id}`);
      if (response.data.status === 400) {
        toast({
          title: "Error",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      dispatchData({
        type: "updateProgress",
        payload: { id: stack.id, progress: "destroying" },
      });
    } catch (error) {
      setDeployActive(true);
    }
  };

  return (
    <Card flexDirection="column" w="100%" px="0px">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Deployments
        </Text>
        {/* <Menu /> */}
      </Flex>
      <Box>
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
                <Th pe="10px" borderColor={borderColor} cursor="pointer">
                  <Flex
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    Action
                  </Flex>
                </Th>
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {data.length === 0 ? (
              <Tr padding={"4"} width={"full"} justifyContent="center">
                <Td colSpan={6} textAlign={"center"}>
                  <Text fontSize="sm">No stack deployed yet...</Text>
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                    <Td
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {["success", "error", "destroyed"].includes(
                        row.original.progress
                      ) && (
                        <Menu>
                          {({ isOpen }: { isOpen: boolean }) => (
                            <>
                              <MenuButton isActive={isOpen} as={Button}>
                                <Icon
                                  as={MdOutlineMoreHoriz}
                                  // color={useColorModeValue("brand.500", "white")}
                                  w="24px"
                                  h="24px"
                                />
                              </MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() => destroyStack(row.original)}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </>
                          )}
                        </Menu>
                      )}
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent={"flex-end"} width="full" px="16px">
        <Button
          variant={"action"}
          disabled={!deployActive}
          onClick={() => setModalOpen(true)}
        >
          Deploy Stack
        </Button>
      </Flex>
      <DeploymentModal
        isOpen={modalOpen}
        deployStack={deployStack}
        setModalOpen={setModalOpen}
      />
    </Card>
  );
}
