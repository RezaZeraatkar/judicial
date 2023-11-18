import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number } from "zod";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import * as locales from "@mui/material/locale";
// Mui Icons
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

// Components
import Dialog from "../components/dialog/dialog";
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
import useServerErrors from "../utils/useServerErrors";
import CustomTextField from "../components/formInputs/customTextField";
import renderCellExpand from "../components/datagrid/renderCellExpand";

// API
import {
  useGetCrimesJudicialAuditRefereeQuery,
  useAddJudicialAuditRefMutation,
  useUpdateJudicialAuditRefMutation,
  useDeleteJudicialAuditRefMutation,
} from "../services/api/crimes/crimesSlice";

// Variables
const ToolBarHeaderText = "لیست مراجع قضایی رسیدگی‌کننده";
const Height = 500;

// Form Schema validation
const formSchema = object({
  id: number().optional(),
  description: string({
    required_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
});

function HoghoughiForm({ cols, handleClick, isLoading }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      code: "",
    },
  });

  const onSubmitHandler = (values) => {
    handleClick(values, methods);
  };

  return (
    <FormProvider {...methods}>
      <Grid container>
        <IconButton
          variant="contained"
          color="primary"
          onClick={methods.handleSubmit(onSubmitHandler)}
          disabled={isLoading}
        >
          <Typography>افزودن</Typography>
          <Add />
        </IconButton>
        {cols.map((col) => {
          switch (col.field) {
            case "description":
              if (col.show) {
                return (
                  <CustomTextField
                    variant="outlined"
                    dir="rtl"
                    key={col.field}
                    multiline
                    rows={2}
                    id={col.field}
                    name={col.field}
                    sx={{ width: "100%", marginLeft: 2, marginBottom: 1 }}
                    placeholder={`${col.headerName} ...`}
                  />
                );
              } else return null;

            default:
              if (col.show) {
                return (
                  <CustomTextField
                    size="small"
                    type="number"
                    key={col.field}
                    name={col.field}
                    label={col.headerName}
                  />
                );
              } else return null;
          }
        })}
      </Grid>
    </FormProvider>
  );
}

export default function HoghoughiList(props) {
  const handleServerErrors = useServerErrors();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const [removedItemId, setRemovedItemId] = React.useState(null);

  const cols = [
    {
      field: "Actions",
      width: 15,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      headerName: "",
      sortable: false,
      hideable: false,
      show: false,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <Delete />
          </IconButton>
        );
      },
    },
    {
      field: "id",
      headerName: "شناسه",
      flex: 0.1,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      hideable: false,
      show: false,
    },
    {
      field: "row",
      headerName: "ردیف",
      align: "left",
      flex: 0.2,
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      show: false,
    },
    {
      field: "description",
      headerName: "عنوان",
      flex: 2,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
    {
      field: "code",
      headerName: "کد",
      flex: 0.1,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
  ];
  let rows = [];

  // request to get rows for table
  const {
    data: CrimesJudicialAuditRefereesData,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useGetCrimesJudicialAuditRefereeQuery();
  const [addJudicialAuditRef, { isLoading }] = useAddJudicialAuditRefMutation();
  const [updateJudicialAuditRef] = useUpdateJudicialAuditRefMutation();
  const [deleteJudicialAuditRef] = useDeleteJudicialAuditRefMutation();

  const theme = useTheme();

  useEffect(() => {
    handleServerErrors(error);
  }, [handleServerErrors, isError, error]);

  if (isSuccess) {
    rows = CrimesJudicialAuditRefereesData.data?.map((el, index) => ({
      id: el.id,
      row: `${index + 1}`,
      description: `${el.description}`,
      code: `${el.code}`,
    }));
  }

  const handleDeleteRecord = async (id) => {
    try {
      const deletedPunishmentType = await deleteJudicialAuditRef(
        removedItemId,
      ).unwrap();
      setDeleteDialog(false);
      toast.success(deletedPunishmentType.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setRemovedItemId(id);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleAddRecord = async (record) => {
    try {
      const judicialAuditRefree = await addJudicialAuditRef(record).unwrap();
      toast.success(judicialAuditRefree.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  function computeMutation(newRow, oldRow) {
    if (newRow.description !== oldRow.description) {
      return `عنوان مرجع قضایی از '${oldRow.description}' به '${newRow.description}'`;
    }
    if (newRow.code !== oldRow.code) {
      return `کد مرجع قضایی از '${oldRow.code}' به '${newRow.code}'`;
    }
    return null;
  }

  const processRowUpdate = (newRow, oldRow) => {
    const mutation = computeMutation(newRow, oldRow);
    if (mutation) {
      // Save the arguments to resolve or reject the promise later
      setPromiseArguments({ newRow, oldRow });
    } else {
      // Nothing was changed
      setPromiseArguments(null);
    }
  };

  const handleNo = () => {
    // const { oldRow } = promiseArguments;
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow } = promiseArguments;
    try {
      // Make the HTTP request to save in the backend
      const punishmentType = await updateJudicialAuditRef(newRow).unwrap();
      setPromiseArguments(null);
      toast.success(punishmentType.message, { position: "top-right" });
    } catch (error) {
      setPromiseArguments(null);
      handleServerErrors(error);
    }
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);
    const dialogContentText = `در صورت تایید ${mutation} تغییر خواهت یافت.`;
    return (
      <Dialog
        open={!!promiseArguments}
        onCloseHandler={handleNo}
        onChangeHandler={handleYes}
        dialogContentText={dialogContentText}
      />
    );
  };

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales["faIR"]),
    [theme],
  );

  return (
    <ThemeProvider theme={themeWithLocale}>
      {renderConfirmDialog()}
      <Box>
        <Paper sx={{ mb: 2, p: "15px" }}>
          <Typography variant="h5">{ToolBarHeaderText}</Typography>
          <HoghoughiForm
            cols={cols}
            handleClick={handleAddRecord}
            isLoading={isLoading}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              py: 1,
            }}
          ></Box>
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
              processRowUpdate={processRowUpdate}
              loading={isFetching}
            />
          </Box>
        </Paper>
        <Dialog
          open={openDeleteDialog}
          onCloseHandler={handleDeleteDialogClose}
          onChangeHandler={handleDeleteRecord}
          dialogContentText={
            "این عملیات غیرقابل بازگشت می‌باشد. از انجام آن مطمئنید؟"
          }
        />
      </Box>
    </ThemeProvider>
  );
}