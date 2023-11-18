import React, { lazy, useEffect, useState, useCallback } from "react";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import * as locales from "@mui/material/locale";
import { toast } from "react-toastify";

// Mui Icons
import Typography from "@mui/material/Typography";

// Components
import Dialog from "../components/dialog/dialog";
import CustomDataGrid from "../components/datagrid/customDataGrid";
import EditButton from "../components/Buttons/editButton";
import DeleteButton from "../components/Buttons/deleteButton";
import ApprovealButton from "../components/Buttons/approvealButton";
import NotApprovealButton from "../components/Buttons/notApprovedButton";
// import PrintButton from "../components/Buttons/printButton";
import TableOptions from "../components/table/TableOptions";
import Suspense from "../components/suspense/Suspense";
import renderCellExpand from "../components/datagrid/renderCellExpand";
// components
import StatusButton from "../components/Buttons/statusButton";
// API
import {
  useFindRemarksQuery,
  useFindRemarkMutation,
  useDeleteRemarkMutation,
  useUpdateRemarkStatusMutation,
  usePrefetch,
} from "../services/api/remarks/remarksSlice";
import useServerErrors from "../utils/useServerErrors";
import { useUserContext } from "../hocs/UserProvider";

const AddRemark = lazy(() => import("../components/addInfo/AddRemark"));

// Variables
const ToolBarHeaderText = "تذکرات";
const Height = 500;

export default function Remark() {
  const handleServerErrors = useServerErrors();
  const { user } = useUserContext();
  const remarksEntities = React.useRef([]);
  const remarksIds = React.useRef([]);
  const inputRef = React.useRef("");
  const [filterModel, setFilterModel] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [rowCount, setRowCountState] = React.useState(0);
  const [initialRemarkData, setInitialRemarkData] = useState([]);
  const [status, setStatus] = React.useState(null);
  const [openDialog, setDialogOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [removedItemId, setRemovedItemId] = React.useState(null);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const [updateStatus] = useUpdateRemarkStatusMutation();
  const [deleteRemark] = useDeleteRemarkMutation();
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
      headerName: "مذکور",
      flex: 1,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "nationalCode",
      headerName: "کدملی",
      flex: 0.7,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "recommender",
      flex: 1,
      align: "left",
      headerAlign: "right",
      headerName: "مقام پیشنهاددهنده",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "commander",
      headerName: "مقام دستوردهنده",
      flex: 1,
      align: "left",
      headerAlign: "right",
      textAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "remarkTypeDescription",
      headerName: "نوع تذکر",
      align: "left",
      headerAlign: "right",
      flex: 1,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "remarkDescription",
      headerName: "شرح تذکر",
      align: "left",
      headerAlign: "right",
      flex: 1,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "remarkDate",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerName: "تاریخ تذکر",
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
              currentStatus={params.row.status}
              isAdmin={user?.isAdmin}
              // isLoading={isDeleteLoading}
            />
            {/* <PrintButton /> */}
          </>
        );
      },
    },
  ];

  // Prefetch nextPages
  const prefetchPage = usePrefetch("findRemarks");
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
    //   page: Math.ceil(applauses?.data?.rowCount/pageSize),
    //   pageSize: pageSize,
    // });
  }, [page, pageSize, prefetchPage, filterModel, sortModel]);

  // request one Remark record when user is to edit
  const [findRemark] = useFindRemarkMutation();
  // request to get rows for table
  const queryOptions = React.useMemo(
    () => ({
      page,
      pageSize,
      filterModel,
      sortModel,
    }),
    [page, pageSize, filterModel, sortModel],
  );
  const {
    data: remarks,
    isLoading,
    isFetching,
    isError,
    error,
  } = useFindRemarksQuery(queryOptions);

  const theme = useTheme();

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      remarks?.data?.rowCount !== undefined
        ? remarks?.data?.rowCount
        : prevRowCountState,
    );
  }, [remarks?.data?.rowCount, setRowCountState]);

  const handleLoadingRows = useCallback(() => {
    remarksEntities.current = remarks?.data?.remarks?.entities?.remarks;
    remarksIds.current = remarks?.data?.remarks?.result;
    const rows = remarksIds.current?.map((id) => {
      return remarksEntities.current[id];
    });
    return rows;
  }, [
    remarks?.data?.remarks?.entities?.remarks,
    remarks?.data?.remarks?.result,
  ]);

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

  useEffect(() => {
    handleServerErrors(error);
  }, [handleServerErrors, isError, error]);

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setRemovedItemId(id);
  };

  const handleStatusDbClick = async (status) => {
    try {
      await updateStatus(status).unwrap();
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleStatusUpdate = async (status) => {
    setDialogOpen(true);
    setStatus(status);
  };

  const handleUserAction = async () => {
    setDialogOpen(false);
    try {
      await updateStatus(status).unwrap();
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleClickOpen = async (id) => {
    if (!id || typeof id !== "number") {
      setOpen(true);
    } else if (remarksEntities?.current[id]["status_id"] === 0) {
      try {
        const remarkData = await findRemark(id).unwrap();
        setInitialRemarkData(remarkData["entities"][id]);
        setOpen(true);
      } catch (error) {
        handleServerErrors(error);
      }
    }
  };

  const handleClose = () => {
    setInitialRemarkData([]);
    setOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleItemDeleteAction = async () => {
    const id = removedItemId;
    setDeleteDialog(false);
    try {
      const deletedRemark = await deleteRemark(id).unwrap();
      toast.success(deletedRemark.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

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
                  <AddRemark
                    dialogTitle={
                      !initialRemarkData.remark_id
                        ? "افزودن تذکر"
                        : "ویرایش تذکر"
                    }
                    handleClose={handleClose}
                    initialRemarkData={initialRemarkData}
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
