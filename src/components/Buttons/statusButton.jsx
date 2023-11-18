import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// custom components
import CircularProgress from "@mui/material/CircularProgress";

export default function StatusButton({
  id,
  handleStatusDbClick,
  children,
  status,
  isLoading,
}) {
  return (
    <IconButton
      size="small"
      variant="outlined"
      onDoubleClick={() => handleStatusDbClick({ id, status: 0 })}
      sx={{
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${
          status === "تایید" ? "green" : status === "رد" ? "red" : "#EEE"
        }`,
        borderRadius: "10px",
        padding: "2px 2px 3px 2px",
        width: 50,
      }}
    >
      <Tooltip title="رد">
        {isLoading ? (
          <CircularProgress size={20} aria-busy={isLoading} />
        ) : (
          children
        )}
      </Tooltip>
    </IconButton>
  );
}
