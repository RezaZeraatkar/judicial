import React from "react";
import PropTypes from "prop-types";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

// Table Utilities
import { estimateHeaderCellWidth } from "./TableUtils";
// Table Styled Components
import { StyledTableCell, StyledTableRow } from "./TableStyledComponents";

export default function EnhancedTableHead(props) {
  const {
    header,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StyledTableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all data",
            }}
          />
        </StyledTableCell>
        {header.map((headCell) => (
          <StyledTableCell
            key={headCell.field}
            align="center"
            padding="normal"
            sortDirection={orderBy === headCell.field ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.field}
              direction={orderBy === headCell.field ? order : "asc"}
              onClick={createSortHandler(headCell.field)}
            >
              <Box
                sx={{
                  width: () => estimateHeaderCellWidth(headCell.headerName),
                }}
              >
                {headCell.headerName}
              </Box>
              {orderBy === headCell.field ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

// propTypes
EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
