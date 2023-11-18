import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number } from "zod";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as locales from "@mui/material/locale";
// Mui Icons
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

// Components
import Dialog from "../components/dialog/dialog";
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
import CustomTextField from "../components/formInputs/customTextField";
import renderCellExpand from "../components/datagrid/renderCellExpand";
import useServerErrors from "../utils/useServerErrors";

// API
import {
  useGetPunishmentWrongdoingsQuery,
  useAddPunishmentWrongDoingMutation,
  useDeletePunishmentWrongDoingMutation,
  useUpdatePunishmentWrongDoingMutation,
} from "../services/api/punishments/punishmentsSlice";

// Variables
const ToolBarHeaderText = "لیست انواع عمل قابل تنبیه";
const Height = 500;

// Form Schema validation
const formSchema = object({
  id: number().optional(),
  description: string({
    required_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishments_wrongdoings_recommended_days_off: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishments_wrongdoings_row: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishments_wrongdoings_table_number: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  made: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
});

function PunishmentWrongDoingForm({ cols, handleClick, isLoading }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      punishments_wrongdoings_recommended_days_off: "",
      punishments_wrongdoings_row: "",
      punishments_wrongdoings_table_number: "",
      code: "",
      made: "",
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

export default function PunishmentWrongdoings(props) {
  const handleServerErrors = useServerErrors();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [itemId, setItemId] = React.useState(null);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);

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
      headerName: "توضیحات",
      flex: 2,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
    {
      field: "punishments_wrongdoings_recommended_days_off",
      headerName: "تعداد روز",
      flex: 0.2,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
    {
      field: "punishments_wrongdoings_row",
      headerName: "بند ",
      flex: 0.2,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
    {
      field: "punishments_wrongdoings_table_number",
      headerName: "جدول",
      flex: 0.2,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      editable: true,
      show: true,
    },
    {
      field: "made",
      headerName: "ماده",
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      show: true,
      editable: true,
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
    data: punishmentWrongdoingsData,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useGetPunishmentWrongdoingsQuery();
  const [addPunishmentWrongDoing, { isLoading }] =
    useAddPunishmentWrongDoingMutation();
  const [deletePunishmentWrongDoing] = useDeletePunishmentWrongDoingMutation();
  const [updatePunishmentWrongDoing] = useUpdatePunishmentWrongDoingMutation();

  const theme = useTheme();

  useEffect(() => {
    if (isError) {
      handleServerErrors(error);
    }
  }, [handleServerErrors, isError, error]);

  if (isSuccess) {
    rows = punishmentWrongdoingsData.data?.map((el, index) => ({
      id: el.id,
      row: `${index + 1}`,
      description: `${el.description}`,
      punishments_wrongdoings_recommended_days_off: `${el.punishments_wrongdoings_recommended_days_off}`,
      punishments_wrongdoings_row: `${el.punishments_wrongdoings_row}`,
      punishments_wrongdoings_table_number: `${el.punishments_wrongdoings_table_number}`,
      made: `${el.punishments_wrongdoings_made}`,
      code: `${el.punishments_wrongdoings_code}`,
    }));
  }

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setItemId(id);
  };

  const deleteItemHandler = async () => {
    try {
      const deletedPunishment = await deletePunishmentWrongDoing(
        itemId,
      ).unwrap();
      setDeleteDialog(false);
      toast.success(deletedPunishment.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleAddRecord = async (record, methods) => {
    try {
      const applauseType = await addPunishmentWrongDoing(record).unwrap();
      methods.reset();
      toast.success(applauseType.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales["faIR"]),
    [theme],
  );

  function computeMutation(newRow, oldRow) {
    if (newRow.description !== oldRow.description) {
      return `توضیحات از '${oldRow.description}' به '${newRow.description}'`;
    }
    if (newRow.code !== oldRow.code) {
      return `کد از '${oldRow.code}' به '${newRow.code}'`;
    }
    if (newRow.made !== oldRow.made) {
      return `ماده از '${oldRow.made}' به '${newRow.made}'`;
    }
    if (
      newRow.punishments_wrongdoings_table_number !==
      oldRow.punishments_wrongdoings_table_number
    ) {
      return `جدول از '${oldRow.punishments_wrongdoings_table_number}' به '${newRow.punishments_wrongdoings_table_number}'`;
    }
    if (
      newRow.punishments_wrongdoings_row !== oldRow.punishments_wrongdoings_row
    ) {
      return `بند از '${oldRow.punishments_wrongdoings_row}' به '${newRow.punishments_wrongdoings_row}'`;
    }
    if (
      newRow.punishments_wrongdoings_recommended_days_off !==
      oldRow.punishments_wrongdoings_recommended_days_off
    ) {
      return `تعداد روز از '${oldRow.punishments_wrongdoings_recommended_days_off}' به '${newRow.punishments_wrongdoings_recommended_days_off}'`;
    }
    return null;
  }

  const processRowUpdate = React.useCallback((newRow, oldRow) => {
    const mutation = computeMutation(newRow, oldRow);
    if (mutation) {
      // Save the arguments to resolve or reject the promise later
      setPromiseArguments({ newRow, oldRow });
    } else {
      // Nothing was changed
      setPromiseArguments(null);
    }
  }, []);

  const handleNo = () => {
    // const { oldRow } = promiseArguments;
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const res = await updatePunishmentWrongDoing(newRow).unwrap();
      setPromiseArguments(null);
      toast.success(res.message, { position: "top-right" });
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

  return (
    <ThemeProvider theme={themeWithLocale}>
      {renderConfirmDialog()}
      <Box>
        <Paper sx={{ mb: 2, p: "15px" }}>
          <Typography variant="h5">{ToolBarHeaderText}</Typography>
          <PunishmentWrongDoingForm
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
          onCloseHandler={setDeleteDialog}
          onChangeHandler={deleteItemHandler}
          dialogContentText="این عملیات غیرقابل بازگشت می‌باشد. از انجام آن مطمئنید؟"
        />
      </Box>
    </ThemeProvider>
  );
}
