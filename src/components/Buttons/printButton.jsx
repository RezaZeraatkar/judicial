import React from "react";
// import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";

export default function printButton({ onPrintHandler }) {
  return (
    <Tooltip title="چاپ">
      <IconButton size="small" aria-label="delete" onClick={onPrintHandler}>
        <PrintIcon
          fontSize="small"
          // sx={{ color: `${theme.palette.warning.dark}` }}
        />
      </IconButton>
    </Tooltip>
  );
}
