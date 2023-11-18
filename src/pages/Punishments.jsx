import React, { lazy, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import PrintButton from "../components/Buttons/printButton";
import TableOptions from "../components/table/TableOptions";
import Suspense from "../components/suspense/Suspense";
import renderCellExpand from "../components/datagrid/renderCellExpand";
// components
import StatusButton from "../components/Buttons/statusButton";
// API
import {
  useFindPunishmentsQuery,
  useFindPunishmentMutation,
  useUpdatePunishmentStatusMutation,
  useDeletePunishmentMutation,
  usePrefetch,
} from "../services/api/punishments/punishmentsSlice";
import useServerErrors from "../utils/useServerErrors";
import { useUserContext } from "../hocs/UserProvider";

const AddPunishments = lazy(() =>
  import("../components/addInfo/AddPunishments"),
);

// Variables
const ToolBarHeaderText = "تنبیهات";
const Height = 500;

export default function Punishments() {
  const navigate = useNavigate();
  const punishmentsEntities = React.useRef([]);
  const punishmentsIds = React.useRef([]);
  const inputRef = React.useRef("");
  const [filterModel, setFilterModel] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [rowCount, setRowCountState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const handleServerErrors = useServerErrors();
  const { user } = useUserContext();
  const [initialPunishmentData, setInitialPunishmentData] = useState([]);
  const [status, setStatus] = React.useState(null);
  const [openDialog, setDialogOpen] = React.useState(false);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const [removedItemId, setRemovedItemId] = React.useState(null);
  const [updateStatus] = useUpdatePunishmentStatusMutation();
  const [deleteApplause] = useDeletePunishmentMutation();
  // Prefetch nextPages
  const prefetchPage = usePrefetch("findPunishments");
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
      headerName: "متخلف",
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
      field: "punishmentTypeDescription",
      headerName: "نوع تخلف",
      align: "left",
      headerAlign: "right",
      flex: 1,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "punishmentDescription",
      headerName: "شرح تخلف",
      align: "left",
      headerAlign: "right",
      flex: 1,
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "punishmentDate",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerName: "تاریخ تخلف",
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
      width: 160,
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
              currentStatus={params.row.status}
              handleStatusUpdate={handleStatusUpdate}
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
              currentStatus={params.row.status}
              handleDeleteClick={handleDeleteClick}
              isAdmin={user?.isAdmin}
              // isLoading={isDeleteLoading}
            />
            <PrintButton onPrintHandler={() => onPrintHandler(params.row.id)} />
          </>
        );
      },
    },
  ];
  // request one punishment record when user is to edit
  const [findPunishment] = useFindPunishmentMutation();
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
    data: punishments,
    isLoading,
    isFetching,
    isError,
    error,
  } = useFindPunishmentsQuery(queryOptions);

  useEffect(() => {
    handleServerErrors(error);
  }, [isError, error, handleServerErrors]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      punishments?.data?.rowCount !== undefined
        ? punishments?.data?.rowCount
        : prevRowCountState,
    );
  }, [punishments?.data?.rowCount, setRowCountState]);

  const handleLoadingRows = useCallback(() => {
    punishmentsEntities.current =
      punishments?.data?.punishments?.entities?.punishments;
    punishmentsIds.current = punishments?.data?.punishments?.result;
    const rows = punishmentsIds.current?.map((id) => {
      return punishmentsEntities.current[id];
    });
    return rows;
  }, [
    punishments?.data?.punishments?.entities?.punishments,
    punishments?.data?.punishments?.result,
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

  const onPrintHandler = async (id) => {
    // const app = await printApplause(id).unwrap();
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}/api/punishments/printpunishment/${id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        navigate("/login");
      } else if (res.status === 400) {
        // dispatch(deleteRecommender());
        return toast.error("درخواست نامعتبر", { position: "top-right" });
      } else if (res.status === 500) {
        // dispatch(deleteRecommender());
        return toast.error("خطای سرور", { position: "top-right" });
      } else {
        return toast.error("خطا نامشخص", { position: "top-right" });
      }
    } else {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${punishmentsEntities?.current[id]["name"]} - تنبیهی.docx`,
      );
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
    }
  };

  // rows = React.useMemo(() => {
  //   if (isSuccess) {
  //     return punishmnetsIds.map((id) => punishmentsEntities[id]);
  //   } else return [];
  // }, [isSuccess, punishmentsEntities, punishmnetsIds]);

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setRemovedItemId(id);
  };

  const handleItemDeleteAction = async () => {
    const id = removedItemId;
    setDeleteDialog(false);
    try {
      const deletedPunishment = await deleteApplause(id).unwrap();
      toast.success(deletedPunishment.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
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
    } else if (punishmentsEntities?.current[id]["status_id"] === 0) {
      try {
        const punishmentData = await findPunishment(id).unwrap();
        setInitialPunishmentData(punishmentData["entities"][id]);
        setOpen(true);
      } catch (error) {
        handleServerErrors(error);
      }
    }
  };

  const handleClose = () => {
    setInitialPunishmentData([]);
    setOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
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
                  <AddPunishments
                    dialogTitle={
                      !initialPunishmentData.id
                        ? "افزودن تنبیهی"
                        : "ویرایش تنبیهی"
                    }
                    handleClose={handleClose}
                    initialPunishmentData={initialPunishmentData}
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
