import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function EditButton({
  handleClickOpen,
  currentStatus,
  isAdmin,
}) {
  if (!isAdmin) {
    return <></>;
  }
  return (
    <>
      <IconButton
        aria-label="edit"
        size="small"
        // disabled
        color="success"
        variant="contained"
        disabled={currentStatus !== "نامشخص" ? true : false}
        onClick={handleClickOpen}
      >
        <Tooltip title="ویرایش">
          <EditIcon
            fontSize="small"
            color={currentStatus !== "نامشخص" ? "disabled" : "green"}
          />
        </Tooltip>
      </IconButton>
    </>
  );
}
