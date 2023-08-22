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
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  useToast,
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
import { MdOutlineMoreHoriz } from "react-icons/md";

// Custom components
import Card from "components/card/Card";

type RowObj = {
  id: string;
  name: string;
  cloud: string;
  status: string;
  accountId: string;
  accessKey: string;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ConnectorTable(props: {
  tableData: any;
  onEdit: any;
  setConnector: any;
}) {
  const toast = useToast();
  const { tableData, setConnector, onEdit } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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
          CLOUD
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("accessKey", {
      id: "accessKey",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          ACCESS KEY
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("accountId", {
      id: "accountId",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          ACCOUNT ID
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
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
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
  ];
  const [data, setData] = React.useState(tableData);
  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

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

  const destroyConnector = async (connector: RowObj) => {
    try {
      const index = tableData.findIndex(
        (item: any) => item.id === connector.id
      );
      const response = await axios.delete(`/cloud-connector/${connector.id}`);

      if (response.data.status === 200) {
        const temp = tableData;
        temp.splice(index, 1);
        setConnector([...temp]);
        toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 9000,
          isClosable: true,
          containerStyle: { whiteSpace: "pre" },
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          containerStyle: { whiteSpace: "pre" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Connectors
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
              {table.getRowModel().rows.map((row) => {
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
                                onClick={() => destroyConnector(row.original)}
                              >
                                Delete
                              </MenuItem>
                              <MenuItem onClick={() => onEdit(row.original)}>
                                Edit
                              </MenuItem>
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </>
  );
}
