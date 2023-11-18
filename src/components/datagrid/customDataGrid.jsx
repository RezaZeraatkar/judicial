import React, { useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Download from "@mui/icons-material/Download";
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  // GridToolbarFilterButton,
  GridToolbarDensitySelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ODD_OPACITY = 0.2;

const CssTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: "2px 6px",
  },
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
  color:
    theme.palette.mode === "light"
      ? "rgba(0,0,0,.85)"
      : "rgba(255,255,255,0.85)",
  WebkitFontSmoothing: "auto",
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    borderRight: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-cell": {
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.65)",
  },
}));

// Custom overlay
const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>هنوز هیچ اطلاعاتی ثبت نشده است</Box>
    </StyledGridOverlay>
  );
}

// Grid Pagination Toolbar
function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      dir="rtl"
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

// Custom quick filter component
const QuickFilterInput = React.memo(({ onQuickFilterChange, inputRef }) => {
  const [filterValue, setFilterValue] = React.useState(inputRef.current || ""); // State for storing the filter value

  const handleFilterClick = (e) => {
    const filterValues = filterValue.split("،").map((value) => value.trim());
    onQuickFilterChange(filterValues);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleFilterClick();
    }
  };

  return (
    <CssTextField
      autoFocus
      size="small"
      placeholder="جستجو سریع ..."
      value={filterValue}
      onChange={handleFilterChange}
      onKeyDown={handleKeyDown}
    />
  );
});

// Grid Customized Toolbar
function CustomToolbar({
  hanldeExportExcel,
  exportExcel,
  rowCount,
  onQuickFilterChange,
  inputRef,
}) {
  return (
    <GridToolbarContainer dir="rtl">
      <Grid container justifyContent={"center"}>
        <Grid item xs={11}>
          <QuickFilterInput
            onQuickFilterChange={onQuickFilterChange}
            inputRef={inputRef}
          />
          <GridToolbarColumnsButton />
          {/* <GridToolbarFilterButton /> */}
          <GridToolbarDensitySelector />
          {exportExcel && (
            <IconButton onClick={hanldeExportExcel}>
              <Download />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={1} sx={{ alignSelf: "center" }}>
          <Typography
            sx={{ fontSize: "10px", alignSelf: "center" }}
          >{`${rowCount} رکورد یافت شد.`}</Typography>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

const CustomDataGrid = ({
  columns,
  rows,
  processRowUpdate,
  onProcessRowUpdateError,
  toolbar,
  onClickExport,
  height,
  exportExcel,
  exportedExcelName,
  onQuickFilterChange,
  inputRef,
  ...props
}) => {
  // a workaround for rtl datagrid feature scroll bug
  useEffect(() => {
    const elementClass = ".MuiDataGrid-main .MuiDataGrid-virtualScroller";
    const timer = setInterval(() => {
      if (document.querySelector(elementClass)?.offsetWidth) {
        //  Get the width of the element
        const elemWith = document.querySelector(elementClass)?.offsetWidth;
        const mainDiv = document.querySelector(elementClass);
        mainDiv.scrollLeft = elemWith + 10000;
        clearInterval(timer);
      }
    }, 1000);
  }, []);

  const revertedColumns = [...columns].reverse();

  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        "& .textAlignRight": {
          direction: "ltr",
          textAlign: "right",
        },
        "& .DatagridHeaderBGC": {
          backgroundColor: "#F5F5F5",
        },
      }}
      dir="ltr"
    >
      <StyledDataGrid
        rows={rows}
        columns={revertedColumns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Hide column id, the other columns will remain visible
              id: false,
            },
          },
        }}
        components={{
          Toolbar: toolbar ? (
            <>{toolbar}</>
          ) : (
            () => (
              <>
                <CustomToolbar
                  exportExcel={exportExcel}
                  hanldeExportExcel={onClickExport}
                  exportedExcelName={exportedExcelName}
                  rowCount={props?.rowCount}
                  onQuickFilterChange={onQuickFilterChange}
                  inputRef={inputRef}
                />
              </>
            )
          ),
          Pagination: CustomPagination,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        pagination
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        sx={{
          overflowX: "scroll",
          px: 1,
        }}
        getCellClassName={(params) => "textAlignRight"}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={onProcessRowUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
        density="compact"
        disableColumnMenu
        {...props}
      />
    </Box>
  );
};

export default React.memo(CustomDataGrid);
