import React from "react";
import IconButton from "@mui/material/IconButton";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Tooltip from "@mui/material/Tooltip";

// custom components
import CircularProgress from "@mui/material/CircularProgress";

// API Requests
// update status mutation hook

export default function NotApprovealButton({
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
      onClick={() => handleStatusUpdate({ id, status: 2 })}
      disabled={currentStatus !== "نامشخص" ? true : false}
    >
      <Tooltip title="رد">
        {isLoading ? (
          <CircularProgress size={20} aria-busy={isLoading} />
        ) : (
          <ThumbDownIcon
            fontSize="small"
            color={currentStatus !== "نامشخص" ? "disabled" : "error"}
          />
        )}
      </Tooltip>
    </IconButton>
  );
}
