import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function dialog({
  open,
  onCloseHandler,
  onChangeHandler,
  dialogContentText,
  dialogContentTitle,
}) {
  return (
    <Dialog
      open={open}
      // onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogContentTitle ? dialogContentTitle : "هشدار"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCloseHandler(false)}>خیر</Button>
        <Button variant="contained" onClick={onChangeHandler} autoFocus>
          بله
        </Button>
      </DialogActions>
    </Dialog>
  );
}
