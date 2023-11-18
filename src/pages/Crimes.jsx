import React, { lazy, useEffect, useState, useCallback } from "react";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import * as locales from "@mui/material/locale";
import { toast } from "react-toastify";
// Mui Icons
import Typography from "@mui/material/Typography";

// Components
import useServerErrors from "../utils/useServerErrors";
import Dialog from "../components/dialog/dialog";
import CustomDataGrid from "../components/datagrid/customDataGrid";
import EditButton from "../components/Buttons/editButton";
import DeleteButton from "../components/Buttons/deleteButton";
import ApprovealButton from "../components/Buttons/approvealButton";
import NotApprovealButton from "../components/Buttons/notApprovedButton";
import TableOptions from "../components/table/TableOptions";
import Suspense from "../components/suspense/Suspense";
import renderCellExpand from "../components/datagrid/renderCellExpand";

// API
import {
  useFindCrimesQuery,
  useFindCrimeMutation,
  useUpdateCrimeStatusMutation,
  useDeleteCrimeMutation,
  usePrefetch,
} from "../services/api/crimes/crimesSlice";
import StatusButton from "../components/Buttons/statusButton";
import { useUserContext } from "../hocs/UserProvider";

const AddCrimes = lazy(() => import("../components/addInfo/AddCrimes"));

// Variables
const ToolBarHeaderText = "جرایم";
const Height = 500;

export default function Crimes(props) {
  const handleServerErrors = useServerErrors();
  const crimesEntities = React.useRef([]);
  const crimesIds = React.useRef([]);
  const inputRef = React.useRef("");
  const [filterModel, setFilterModel] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const { user } = useUserContext();
  const [initialCrimeData, setInitialCrimeData] = useState([]);
  const [status, setStatus] = React.useState(null);
  const [openDialog, setDialogOpen] = React.useState(false);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const [removedItemId, setRemovedItemId] = React.useState(null);
  const [findCrime] = useFindCrimeMutation();
  const [updateCrimeStatus] = useUpdateCrimeStatusMutation();
  const [deleteCrime] = useDeleteCrimeMutation();

  const queryOptions = React.useMemo(
    () => ({
      page,
      pageSize,
      filterModel,
      sortModel,
    }),
    [page, pageSize, filterModel, sortModel],
  );

  // request to get rows for table
  const {
    data: crimes,
    isLoading,
    isFetching,
    isError,
    error,
  } = useFindCrimesQuery(queryOptions);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const cols = [
    {
      field: "id",
      headerName: "شناسه",
      flex: 0.5,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      hideable: false,
    },
    {
      field: "row",
      headerName: "ردیف",
      flex: 0.5,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
    },
    {
      field: "parvandeCode",
      headerName: "شماره پرونده",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "name",
      headerName: "مجرم",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "nationalCode",
      headerName: "کدملی مجرم",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "shaki",
      flex: 1,
      align: "left",
      headerAlign: "right",
      headerName: "شاکی",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "shakiNumber",
      headerName: "شماره شاکی",
      flex: 0.7,
      align: "left",
      headerAlign: "right",
      textAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "crimeType",
      headerName: "نوع جرم",
      align: "left",
      headerAlign: "right",
      flex: 1,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "issuedVerdict",
      headerName: "حکم صادره",
      align: "left",
      headerAlign: "right",
      flex: 0.8,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "crimeOccuranceDate",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerName: "تاریخ وقوع جرم",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "status",
      width: 70,
      align: "left",
      headerAlign: "right",
      headerName: "وضعیت",
      headerClassName: "DatagridHeaderBGC",
      renderCell: (params) => {
        return (
          <StatusButton
            id={params.row.id}
            status={params.row.status}
            handleStatusDbClick={handleStatusDbClick}
            // isLoading={isNeutralStatusLoading}
          >
            <div>{params.value}</div>
          </StatusButton>
        );
      },
    },
    {
      field: "Actions",
      width: 130,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      headerName: "",
      sortable: false,
      hideable: false,
      renderCell: (params) => {
        return (
          <>
            <ApprovealButton
              id={params.row.id}
              handleStatusUpdate={handleStatusUpdate}
              currentStatus={params.row.status}
              isAdmin={user?.isAdmin}
              // isLoading={isNeutralStatusLoading}
            />
            <NotApprovealButton
              id={params.row.id}
              handleStatusUpdate={handleStatusUpdate}
              currentStatus={params.row.status}
              isAdmin={user?.isAdmin}
              // isLoading={isNeutralStatusLoading}
            />
            <EditButton
              handleClickOpen={() => handleClickOpen(params.row.id)}
              currentStatus={params.row.status}
              isAdmin={user?.isAdmin}
            ></EditButton>
            <DeleteButton
              id={params.row.id}
              handleDeleteClick={handleDeleteClick}
              // isLoading={isDeleteLoading}
              currentStatus={params.row.status}
              isAdmin={user?.isAdmin}
            />
            {/* <PrintButton /> */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    handleServerErrors(error);
  }, [isError, error, handleServerErrors]);

  // Prefetch nextPages
  const prefetchPage = usePrefetch("findCrimes");
  React.useEffect(() => {
    prefetchPage({
      page: page + 1,
      pageSize: pageSize,
      filterModel,
      sortModel,
    });
    prefetchPage({
      page: page - 1 > 0 ? page - 1 : 0,
      pageSize: pageSize,
      filterModel,
      sortModel,
    });
    // prefetchPage({
    //   page: Math.ceil(crimes?.data?.rowCount/pageSize),
    //   pageSize: pageSize,
    // });
  }, [page, pageSize, prefetchPage, filterModel, sortModel]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCount, setRowCountState] = React.useState(0);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      crimes?.data?.rowCount !== undefined
        ? crimes?.data?.rowCount
        : prevRowCountState,
    );
  }, [crimes?.data?.rowCount, setRowCountState]);

  const handleLoadingRows = useCallback(() => {
    crimesEntities.current = crimes?.data?.crimes?.entities?.crimes;
    crimesIds.current = crimes?.data?.crimes?.result;
    const rows = crimesIds.current?.map((id) => {
      return crimesEntities.current[id];
    });
    return rows;
  }, [crimes?.data?.crimes?.entities?.crimes, crimes?.data?.crimes?.result]);

  const handleStatusDbClick = async (status) => {
    try {
      await updateCrimeStatus(status).unwrap();
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleClickOpen = async (id) => {
    if (!id || typeof id !== "number") {
      setOpen(true);
    } else if (crimesEntities?.current[id]["status_id"] === 0) {
      try {
        const crimeData = await findCrime(id).unwrap();
        setInitialCrimeData(crimeData["entities"][id]);
        setOpen(true);
      } catch (error) {
        handleServerErrors(error);
      }
    } else {
      return;
    }
  };

  const handleClose = () => {
    setInitialCrimeData([]);
    setOpen(false);
  };

  const handleStatusUpdate = async (status) => {
    setDialogOpen(true);
    setStatus(status);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setRemovedItemId(id);
  };

  const handleItemDeleteAction = async () => {
    const id = removedItemId;
    setDeleteDialog(false);
    try {
      const deletedItem = await deleteCrime(id).unwrap();
      toast.success(deletedItem.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUserAction = async () => {
    setDialogOpen(false);
    try {
      await updateCrimeStatus(status).unwrap();
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const onFilterClick = React.useCallback((filterModel) => {
    // Here you save the data you need from the filter model
    // setQueryOptions({ filterModel: { ...filterModel } });
    inputRef.current = filterModel.join("،");
    setFilterModel(filterModel);
    setPage(0);
  }, []);

  const handleSortModelChange = React.useCallback((sortModel) => {
    // Here you save the data you need from the filter model
    // setQueryOptions({ filterModel: { ...filterModel } });
    setSortModel(sortModel);
  }, []);

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales["faIR"]),
    [theme],
  );

  return (
    <ThemeProvider theme={themeWithLocale}>
      <Box>
        <Paper sx={{ mb: 2, p: "15px" }}>
          <Typography variant="h5">{ToolBarHeaderText}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              py: 1,
            }}
          >
            <div></div>
            <TableOptions
              open={open}
              handleClickOpen={handleClickOpen}
              render={
                <Suspense>
                  <AddCrimes
                    dialogTitle={
                      !initialCrimeData?.id ? "افزودن جرم" : "ویرایش جرم"
                    }
                    handleClose={handleClose}
                    initialCrimeFormData={initialCrimeData}
                  />
                </Suspense>
              }
            ></TableOptions>
          </Box>
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
            {handleLoadingRows() && (
              <CustomDataGrid
                rows={handleLoadingRows()}
                columns={cols}
                height={Height}
                loading={isLoading || isFetching}
                rowCount={rowCount}
                paginationMode="server"
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                filterMode="server"
                inputRef={inputRef}
                onQuickFilterChange={onFilterClick}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
              />
            )}
          </Box>
        </Paper>
        <Dialog
          open={openDialog}
          onCloseHandler={handleDialogClose}
          onChangeHandler={handleUserAction}
          dialogContentText={
            "این عملیات غیرقابل بازگشت می‌باشد. از انجام آن مطمئنید؟"
          }
        />
        <Dialog
          dialogContentTitle={<Typography color={"red"}>حذف رکورد!</Typography>}
          open={openDeleteDialog}
          onCloseHandler={handleDeleteDialogClose}
          onChangeHandler={handleItemDeleteAction}
          dialogContentText={
            "این عملیات غیرقابل بازگشت می‌باشد. از انجام آن مطمئنید؟"
          }
        />
      </Box>
    </ThemeProvider>
  );
}
