import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Collapse, TablePagination } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

export default function CustomTable(props) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = React.useState(0);
  const [clickedRow, setClickedRow] = useState();
  const {
    isTableBorder,
    rows,
    headCells,
    isPagination,
    iSexpandToggle,
    children,
    isClickedIndex,
  } = props || {};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          boxShadow: "0px 2px 10px 0px rgba(58, 53, 65, 0.1)",
        }}
      >
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 750,
              border: isTableBorder ? `1px solid gray` : "",
            }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {headCells.map((col, index) => {
                  return (
                    <TableCell
                      key={index}
                      align={col.textAlign ? col.textAlign : "center"}
                      sx={{
                        borderRight: "1px solid",
                        borderColor: theme.palette.action.focus,
                        padding: "2px 10px !important",
                        color: theme.palette.primary.contrastText,
                        textTransform: "capitalize",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.length ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <>
                        <TableRow
                          key={index}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {headCells.map((column, columnIndex) => (
                            <TableCell
                              align={
                                column.isBodyAign ? column.isBodyAign : "center"
                              }
                              sx={{
                                border: column.isBorder ? column.isBorder : "",
                                borderBottom: `1px solid ${theme.palette.action.focus}`,
                                padding: "5px 10px !important",
                              }}
                              key={columnIndex}
                              component="td"
                              onClick={() => {
                                setClickedRow(index);
                                isClickedIndex && isClickedIndex(index);
                              }}
                            >
                              {row[column.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                        {iSexpandToggle && clickedRow === index && (
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={6}
                            >
                              <Collapse
                                in={iSexpandToggle && iSexpandToggle}
                                timeout="auto"
                                unmountOnExit
                              >
                                {children}
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
              ) : (
                <Box sx={{ alignItems: "center", display: "flex", p: "20px" }}>
                  No Data Found
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {isPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}
