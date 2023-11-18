import React from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

export default function circularProgress() {
  return (
    <Grid
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      width="100%"
    >
      <CircularProgress style={{ position: "absolute", right: "50%" }} />
    </Grid>
  );
}
