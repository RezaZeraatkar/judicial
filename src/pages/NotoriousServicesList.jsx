import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number } from "zod";
import IconButton from "@mui/material/IconButton";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import * as locales from "@mui/material/locale";
// Mui Icons
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

// Components
import Dialog from "../components/dialog/dialog";
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
import CustomTextField from "../components/formInputs/customTextField";
// import EditButton from "../components/Buttons/editButton";
import renderCellExpand from "../components/datagrid/renderCellExpand";
import useServerErrors from "../utils/useServerErrors";

// API
import {
  useGetNotoriousServicesQuery,
  selectNotoriousServicesIds,
  selectAllNotoriousServicesEntities,
  useAddNotoriousServiceMutation,
  useEditNotoriousServiceMutation,
  useDeleteNotoriousServiceMutation,
} from "../services/api/applauses/applausesSlice";

// Variables
const ToolBarHeaderText = "لیست خدمات برجسته";
const Height = 500;

// Form Schema validation
const formSchema = object({
  id: number().optional(),
  description: string({
    required_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  notorious_services_recommended_days_off: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  notorious_services_row: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "فقط اعداد مجاز هستند!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  notorious_services_table_number: string({
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

function NotoriousServicesForm({ cols, handleClick, isLoading }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      notorious_services_recommended_days_off: "",
      notorious_services_row: "",
      notorious_services_table_number: "",
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

export default function NotoriousServicesList() {
  const handleServerErrors = useServerErrors();
  const [itemId, setItemId] = React.useState(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [openDeleteDialog, setDeleteDialog] = React.useState(false);

  const cols = [
    {
      field: "Actions",
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      headerName: "",
      sortable: false,
      hideable: false,
      show: false,
      editable: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <Tooltip title="حذف">
                <Delete />
              </Tooltip>
            </IconButton>
          </Box>
        );
      },
    },
    {
      field: "id",
      width: 0,
      hideable: true,
      show: false,
    },
    {
      field: "row",
      headerName: "ردیف",
      align: "center",
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
      show: true,
      editable: true,
    },
    {
      field: "notorious_services_recommended_days_off",
      headerName: "تعداد روز",
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      show: true,
      editable: true,
    },
    {
      field: "notorious_services_row",
      headerName: "بند ",
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      show: true,
      editable: true,
    },
    {
      field: "notorious_services_table_number",
      headerName: "جدول",
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      show: true,
      editable: true,
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
      flex: 0.2,
      align: "center",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      show: true,
      editable: true,
    },
  ];
  let rows = [];

  // request to get rows for table
  const { isSuccess, isFetching, isError, error } =
    useGetNotoriousServicesQuery();
  const notoriousServicesIds = useSelector(selectNotoriousServicesIds);
  const notoriousServicesEntities = useSelector((state) =>
    selectAllNotoriousServicesEntities(state),
  );

  const [addNotoriousService, { isLoading }] = useAddNotoriousServiceMutation();
  const [deleteNotoriousService] = useDeleteNotoriousServiceMutation();
  const [updateNotoriousService] = useEditNotoriousServiceMutation();

  const theme = useTheme();

  useEffect(() => {
    if (isError) {
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  }, [isError, error, handleServerErrors]);

  if (isSuccess) {
    rows = notoriousServicesIds?.map((id, index) => ({
      id: id,
      row: `${index + 1}`,
      description: `${notoriousServicesEntities[id].description}`,
      notorious_services_recommended_days_off: `${notoriousServicesEntities[id].notorious_services_recommended_days_off}`,
      notorious_services_row: `${notoriousServicesEntities[id].notorious_services_row}`,
      notorious_services_table_number: `${notoriousServicesEntities[id].notorious_services_table_number}`,
      code: `${notoriousServicesEntities[id].code}`,
      made: `${notoriousServicesEntities[id].made}`,
    }));
  }

  const handleDeleteClick = async (id) => {
    setDeleteDialog(true);
    setItemId(id);
  };

  const deleteItemHandler = async () => {
    try {
      const deletedNotoriousServices = await deleteNotoriousService(
        itemId,
      ).unwrap();
      setDeleteDialog(false);
      toast.success(deletedNotoriousServices.message, {
        position: "top-right",
      });
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const handleAddRecord = async (record, methods) => {
    try {
      const applauseType = await addNotoriousService(record).unwrap();
      methods.reset();
      toast.success(applauseType.message, { position: "top-right" });
    } catch (error) {
      handleServerErrors(error);
    }
  };

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
      newRow.notorious_services_table_number !==
      oldRow.notorious_services_table_number
    ) {
      return `جدول از '${oldRow.notorious_services_table_number}' به '${newRow.notorious_services_table_number}'`;
    }
    if (newRow.notorious_services_row !== oldRow.notorious_services_row) {
      return `بند از '${oldRow.notorious_services_row}' به '${newRow.notorious_services_row}'`;
    }
    if (
      newRow.notorious_services_recommended_days_off !==
      oldRow.notorious_services_recommended_days_off
    ) {
      return `تعداد روز از '${oldRow.notorious_services_recommended_days_off}' به '${newRow.notorious_services_recommended_days_off}'`;
    }
    return null;
  }

  const handleNo = () => {
    // const { oldRow } = promiseArguments;
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const res = await updateNotoriousService(newRow).unwrap();
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
          <NotoriousServicesForm
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
              loading={isFetching}
              processRowUpdate={processRowUpdate}
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
