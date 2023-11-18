import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ApprovalIcon from "@mui/icons-material/Approval";

// custom components
import CircularProgress from "@mui/material/CircularProgress";

// API Requests

export default function ApprovealButton({
  id,
  handleStatusUpdate,
  currentStatus,
  isLoading,
  isAdmin,
}) {
  if (!isAdmin) {
    return <></>;
  }
  return (
    <IconButton
      size="small"
      variant="outlined"
      disabled={currentStatus !== "نامشخص" ? true : false}
      onClick={() => handleStatusUpdate({ id, status: 1 })}
    >
      <Tooltip title="تایید">
        {isLoading ? (
          <CircularProgress size={20} aria-busy={isLoading} />
        ) : (
          <ApprovalIcon
            fontSize="small"
            color={currentStatus !== "نامشخص" ? "disabled" : "primary"}
          />
        )}
      </Tooltip>
    </IconButton>
  );
}
