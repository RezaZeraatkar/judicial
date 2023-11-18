import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import TableFooter from "@mui/material/TableFooter";
// mui icons
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

const CutomTable = (props) => {
  const { register, watch } = useForm();
  const [rows, setRows] = useState(props.rows);
  const columns = props.columns;
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const areAllRowsSelected = rows.every((row) => row.isSelected);
    setIsHeaderCheckboxChecked(areAllRowsSelected);
  }, [rows]);

  useEffect(() => {
    const newColumns = columns.filter((col) => {
      if (!col.hideable) {
        return col;
      }
    });
    setVisibleColumns(newColumns);
  }, [columns]);

  const toggleColumnVisibility = (colObj) => {
    const index = visibleColumns.findIndex((col) => col.field === colObj.field);
    if (index !== -1) {
      setVisibleColumns((prev) =>
        prev.filter((col) => col.field !== colObj.field),
      );
    } else {
      setVisibleColumns((prev) => {
        const newColumns = [...prev];
        newColumns.splice(columns.indexOf(colObj), 0, colObj);
        return newColumns;
      });
    }
  };

  const handleHeaderCheckboxChange = (event) => {
    const updatedRows = rows.map((row) => ({
      ...row,
      isSelected: event.target.checked,
    }));

    setRows(updatedRows);
    setIsHeaderCheckboxChecked(event.target.checked);
    if (event.target.checked) {
      setCheckedRows([...rows]);
    } else {
      setCheckedRows([]);
    }
  };

  const handleCheckRow = (event, row) => {
    if (event.target.checked) {
      row.isSelected = true;
      setCheckedRows([...checkedRows, row]);
    } else {
      row.isSelected = false;
      setCheckedRows(
        checkedRows.filter(
          (checkedRow) => checkedRow.isSelected !== row.isSelected,
        ),
      );
    }
    const areAllRowsSelected = rows.every((row) => row.isSelected);
    setIsHeaderCheckboxChecked(areAllRowsSelected);
  };

  const handleDeleteCheckedRows = () => {
    const updatedRows = rows.filter((row) => !checkedRows.includes(row));
    setRows(updatedRows);
    setCheckedRows([]);
    setIsHeaderCheckboxChecked(false);
  };

  const handleSort = useCallback(
    (column) => {
      if (column === sortColumn) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
      setPage(0);
    },
    [sortColumn, sortDirection],
  );

  const sortedRows = useMemo(
    () =>
      sortColumn
        ? [...rows].sort((a, b) => {
            if (sortDirection === "asc") {
              return a[sortColumn] < b[sortColumn] ? -1 : 1;
            } else {
              return a[sortColumn] > b[sortColumn] ? -1 : 1;
            }
          })
        : rows,
    [rows, sortColumn, sortDirection],
  );

  const paginatedRows = useMemo(
    () =>
      sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRows, page, rowsPerPage],
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = (rowId) => {
    const colFields = columns.map((col) => {
      return `${col["field"]}-${rowId}`;
    });
    const fields = {};
    colFields.forEach((col) => {
      const column = col.split("-");
      const colName = column[0];
      fields[colName] = watch(col);
    });
    // console.log(fields);
  };

  const message =
    checkedRows.length > 0 ? (
      <div style={{ position: "absolute" }}>
        {`${checkedRows.length} سطر انتخاب شده است`}
        <IconButton onClick={handleDeleteCheckedRows}>
          <Delete />
        </IconButton>
      </div>
    ) : null;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {message}
      <ColumnSelector
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={toggleColumnVisibility}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={isHeaderCheckboxChecked}
                  indeterminate={
                    checkedRows.length > 0 &&
                    checkedRows.length < rows.length &&
                    !isHeaderCheckboxChecked
                  }
                  onChange={handleHeaderCheckboxChange}
                />
              </TableCell>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                >
                  {column.field}
                  {sortColumn === column.field &&
                    (sortDirection === "asc" ? (
                      <ArrowUpward color="primary" />
                    ) : (
                      <ArrowDownward color="primary" />
                    ))}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => {
              const rowID = row.id;
              return (
                <TableRow key={index} hover>
                  <TableCell>
                    <Checkbox
                      checked={row.isSelected}
                      onChange={(event) => handleCheckRow(event, row)}
                    />
                  </TableCell>
                  {visibleColumns.map((column) => {
                    return (
                      <TableCell key={column.field}>
                        <TextField
                          variant="outlined"
                          {...register(`${column.field}-${row.id}`)}
                          size="small"
                          required={false}
                          value={row[column.field]}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <IconButton
                      color="success"
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditRow(rowID)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              {columns.map((column) => (
                <TableCell>
                  <TextField
                    variant="outlined"
                    name={`${column.field}`}
                    size="small"
                    required={true}
                    placeholder={column.field}
                  />
                </TableCell>
              ))}
              <TableCell>
                <IconButton size="small" onClick={() => {}}>
                  <Add fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} از ${count !== -1 ? count : `بیش از ${to}`}`
        }
      />
    </Paper>
  );
};

const ColumnSelector = ({
  columns,
  visibleColumns,
  onToggleColumnVisibility,
}) => {
  const toggleCheckbox = (column) => {
    onToggleColumnVisibility(column);
  };

  return (
    <FormControl component="fieldset">
      <FormGroup>
        {columns.map((column) => (
          <FormControlLabel
            key={column.field}
            control={
              column.hideable ? (
                <></>
              ) : (
                <Checkbox
                  checked={visibleColumns.some(
                    (col) => col.field === column.field,
                  )}
                  onChange={() => toggleCheckbox(column)}
                />
              )
            }
            label={column.field}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default CutomTable;
