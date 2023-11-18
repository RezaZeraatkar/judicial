import React from "react";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

export default function downloadBtn({ onClickHandler, label }) {
  return (
    <FormControl size="small" sx={{ marginRight: 2 }}>
      <Button
        variant="contained"
        endIcon={<DownloadIcon />}
        onClick={onClickHandler}
      >
        {label}
      </Button>
    </FormControl>
  );
}
