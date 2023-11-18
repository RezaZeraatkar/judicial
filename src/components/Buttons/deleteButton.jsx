import React from "react";
// import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
// custom components
import CircularProgress from "@mui/material/CircularProgress";
// APIs

export default function DeleteButton({
  id,
  handleDeleteClick,
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
      aria-label="delete"
      disabled={currentStatus !== "نامشخص" ? true : false}
      onClick={() => handleDeleteClick(id)}
    >
      <Tooltip title="حذف">
        {isLoading ? (
          <CircularProgress size={20} aria-busy={isLoading} />
        ) : (
          <DeleteIcon
            fontSize="small"
            color={currentStatus !== "نامشخص" ? "disabled" : ""}
          />
        )}
      </Tooltip>
    </IconButton>
  );
}
