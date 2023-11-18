import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { TableBorder } from "../../variables";
import TableRow from "@mui/material/TableRow";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F5F5F5",
    fontWeight: "bold",
    borderLeft: TableBorder,
    borderBottom: TableBorder,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderLeft: TableBorder,
    borderBottom: TableBorder,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));
