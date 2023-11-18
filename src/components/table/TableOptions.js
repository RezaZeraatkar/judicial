import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import Slide from "@mui/material/Slide";

import { FixedAppbarContentPusher } from "../fixedAppBarContetnPusher/FixedAppbarContentPusher";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TableOptions(props) {
  const { render, open, handleClickOpen } = props;
  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="contained"
        endIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        افزودن
      </Button>

      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <FixedAppbarContentPusher />
        {render}
      </Dialog>
    </Stack>
  );
}
