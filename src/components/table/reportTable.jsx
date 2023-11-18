import React from "react";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";

const TableContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const Table = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
});

const TableHead = styled("thead")({
  // backgroundColor: "#f5f5f5",
  border: "1px solid black",
});

const TableBody = styled("tbody")({
  border: "1px solid black",
});

const TableRow = styled("tr")({});

const TableCell = styled("td")({
  padding: "12px",
  border: "1px solid black",
  textAlign: "center",
});

const TableHeaderCell = styled("th")({
  padding: "12px",
  border: "1px solid black",
  textAlign: "center",
});

const TablePaginationContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "16px",
});

const ReportTable = ({ columns, rows, rowsPerPage, onPageChange }) => {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeaderCell
                key={column.field}
                style={{ borderLeft: index === 0 ? "1px solid black" : "none" }}
              >
                {column.headerName}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`${column.field}-${rowIndex}`}
                    style={{
                      borderLeft: colIndex === 0 ? "1px solid black" : "none",
                    }}
                  >
                    {row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePaginationContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </TablePaginationContainer>
    </TableContainer>
  );
};

export default ReportTable;
