import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";

// Components
import { FixedAppbarContentPusher } from "../../components/fixedAppBarContetnPusher/FixedAppbarContentPusher";
import CustomDataGrid from "../../components/datagrid/customDataGrid_bulk";

const Height = 500;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function report({
  rows,
  cols,
  open,
  handleClose,
  isReportLoading,
  isReportFetching,
  onClickExport,
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <Box>
          <FixedAppbarContentPusher />
          <Box
            display="flex"
            flexDirection="column"
            component="form"
            noValidate
            autoComplete="off"
            sx={{ padding: { sm: "0 2rem" } }}
          >
            <AppBar sx={{ position: "fixed" }}>
              <Toolbar>
                <IconButton
                  onClick={handleClose}
                  edge="start"
                  color="inherit"
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>
          <Paper sx={{ mb: 2, p: "15px", width: "calc(99vw + 1px)" }}>
            <Box
              sx={{
                height: Height,
                width: "100%",
                "& .textAlignRight": {
                  direction: "ltr",
                  textAlign: "right",
                },
              }}
              dir="ltr"
            >
              <CustomDataGrid
                rows={rows}
                columns={cols}
                height={Height}
                exportExcel={true}
                onClickExport={onClickExport}
                isLoading={isReportFetching || isReportLoading}
              />
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </Stack>
  );
}
