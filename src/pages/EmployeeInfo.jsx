import React, { lazy, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, date } from "zod";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TableOptions from "../components/table/TableOptions";
import Suspense from "../components/suspense/Suspense";
import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import moment from "jalali-moment";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import useServerErrors from "../utils/useServerErrors";
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
import renderCellExpand from "../components/datagrid/renderCellExpand";

// Employee API Request Slices
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMasoliatMutation,
  selectAllEmployeesEnt,
  selectEmplsIds,
} from "../services/api/employees/employeesSlice";

import dateHandler from "../utils/dateHandler";

const AddEmployee = lazy(() => import("../components/addInfo/AddEmployee"));
const Height = 500;

function isValidIranianNationalCode(input) {
  if (!/^\d{10}$/.test(input)) return false;
  const check = +input[9];
  const sum =
    input
      .split("")
      .slice(0, 9)
      .reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
  return sum < 2 ? check === sum : check + sum === 11;
}

const formSchema = object({
  id: string().optional(),
  pasdari_code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "ورودی نامعتبر",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  parvande_code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "ورودی نامعتبر",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  nationality_code: string()
    .min(1, { message: "این فیلد الزامی است!" })
    .regex(/^\d{10}$/)
    .refine((value) => isValidIranianNationalCode(value), {
      message: "کد ملی نامعتبر",
    }),
  masoliat: string().optional(),
  phone_number: string().optional(),
  address: string().optional(),
  birthdate: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  ezamdate: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  education: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  jens: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  ozviat_type: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  vahed: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  rank: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  rotbe: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  jaygah: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  raste: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  vaziat_khedmat: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  vaziat_jesmani: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  vaziat_ravani: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  marig_status: object(
    { id: number().positive(), description: string().min(1) },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
});

export default function EmployeeInfo() {
  const defaultValues = {
    id: "",
    pasdari_code: "",
    parvande_code: "",
    name: "",
    surname: "",
    fathername: "",
    nationality_code: "",
    masoliat: "",
    address: "",
    phone_number: "",
    birthdate: moment()._d,
    ezamdate: moment()._d,
    education: {
      id: 0,
      description: "",
    },
    jens: {
      id: 0,
      description: "",
    },
    ozviat_type: {
      id: null,
      description: "",
    },
    vahed: {
      id: null,
      description: "",
    },
    rank: {
      id: null,
      description: "",
    },
    rotbe: {
      id: 0,
      description: "",
    },
    jaygah: {
      id: null,
      description: "",
    },
    raste: {
      id: 0,
      description: "",
    },
    vaziat_khedmat: {
      id: 0,
      description: "",
    },
    vaziat_jesmani: {
      id: 0,
      description: "",
    },
    vaziat_ravani: {
      id: 0,
      description: "",
    },
    marig_status: {
      id: 0,
      description: "",
    },
  };
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
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
      field: "Actions",
      width: 30,
      headerName: "",
      align: "left",
      headerAlign: "right",
      sortable: false,
      hideable: false,
      headerClassName: "DatagridHeaderBGC",
      renderCell: (params) => {
        return (
          <IconButton
            aria-label="edit"
            size="small"
            // disabled
            color="success"
            variant="contained"
          >
            <Tooltip title="ویرایش">
              <EditIcon
                onClick={() => handleClickOpen(params.row.id)}
                fontSize="small"
              />
            </Tooltip>
          </IconButton>
        );
      },
    },
    {
      field: "row",
      headerName: "ردیف",
      flex: 0.2,
      align: "center",
      headerAlign: "center",
      headerClassName: "DatagridHeaderBGC",
    },
    {
      field: "parvandeCode",
      headerName: "شماره پرونده",
      align: "center",
      headerAlign: "center",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "name",
      headerName: "نام و نام خانوادگی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "pasdariCode",
      headerName: "کد پاسداری",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "nationalCode",
      headerName: "کد ملی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "fathername",
      headerName: "نام پدر",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "educaionalLevel",
      headerName: "تحصیلات",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "vahed_title",
      headerName: "رده خدمتی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "sexuality",
      headerName: "جنسیت",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "registerType",
      headerName: "عضویت",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "militaryRank",
      headerName: "درجه",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "militaryLevel",
      headerName: "رتبه",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "militaryJaygah",
      headerName: "جایگاه",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "address",
      headerName: "آدرس",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "phoneNumner",
      headerName: "شماره تلفن",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "physicalState",
      headerName: "وضعیت جسمانی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "mentalState",
      headerName: "وضعیت روانی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "serviceStatus",
      headerName: "وضعیت خدمتی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "serviceCategory",
      headerName: "رسته خدمتی",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "birthDate",
      headerName: "تاریخ تولد",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "serviceEntryDate",
      headerName: "تاریخ ورود به سپاه",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "maritalStatus",
      headerName: "وضعیت تاهل",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
    },
    {
      field: "masoliat",
      headerName: "مسئولیت",
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      editable: true,
      renderCell: renderCellExpand,
    },
  ];
  let rows = [];
  const handleServerErrors = useServerErrors();
  const noButtonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [snackbar, setSnackbar] = React.useState(null);

  const employees = useSelector((state) => selectAllEmployeesEnt(state));
  const employeesIds = useSelector((state) => selectEmplsIds(state));
  const { isLoading, isFetching, isSuccess, isError, error } =
    useGetEmployeesQuery();
  const [updateEmployee] = useUpdateEmployeeMasoliatMutation();

  useEffect(() => {
    if (isError) {
      handleServerErrors(error);
    }
  }, [isError, error, handleServerErrors]);

  if (isSuccess) {
    rows = employeesIds.map((employeeId, index) => ({
      id: employeeId,
      row: index + 1,
      parvandeCode: Number(employees[employeeId]["code"]) || "",
      name:
        `${employees[employeeId]["firstname"]} ${employees[employeeId]["surname"]}` ||
        "",
      pasdariCode: employees[employeeId]["pasdari_code"] || "",
      nationalCode: employees[employeeId]["nationalcode"] || "",
      fathername: employees[employeeId]["fathername"] || "",
      educaionalLevel: employees[employeeId]["tahsili_title"] || "",
      vahed_title: employees[employeeId]["vahed_title"] || "",
      sexuality: employees[employeeId]["jens_title"] || "",
      registerType: employees[employeeId]["ozviyat_type_title"] || "",
      militaryRank: employees[employeeId]["daraje_title"] || "",
      militaryLevel: employees[employeeId]["rotbe_title"] || "",
      militaryJaygah: employees[employeeId]["jaygah_title"] || "",
      address: employees[employeeId]["address"] || "",
      phoneNumner: employees[employeeId]["phone_number"] || "",
      physicalState: employees[employeeId]["vazjesmani_title"] || "",
      mentalState: employees[employeeId]["vazravani_title"] || "",
      serviceStatus: employees[employeeId]["vkhedmat_title"] || "",
      serviceCategory: employees[employeeId]["raste_title"] || "",
      birthDate: dateHandler(employees[employeeId]["birthdate"], {
        format: true,
      }),
      serviceEntryDate: dateHandler(employees[employeeId]["ezamDate"], {
        format: true,
      }),
      maritalStatus: employees[employeeId]["marig_title"] || "",
      masoliat: employees[employeeId]["masoliat"] || "",
    }));
  }
  const handleCloseSnackbar = () => setSnackbar(null);

  function computeMutation(newRow, oldRow) {
    if (newRow.masoliat !== oldRow.masoliat) {
      return `مسئولیت از '${oldRow.masoliat}' به '${newRow.masoliat}'`;
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
      await updateEmployee(newRow);
      setSnackbar({
        children: "اطلاعات کاربر با موفقیت ویرایش شد!",
        severity: "success",
      });
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
      setPromiseArguments(null);
    }
  };

  const handleClickOpen = async (id) => {
    if (!id || typeof id !== "number") {
      setOpen(true);
    } else {
      if (!employees[`${id}`]) {
        handleServerErrors(error);
      }
      const employee = employees[`${id}`];
      // methods
      methods.setValue("id", `${employee["id"]}`);
      methods.setValue("pasdari_code", `${employee["pasdari_code"]}`);
      methods.setValue("parvande_code", `${employee["code"]}`);
      methods.setValue("name", employee["firstname"]);
      methods.setValue("surname", employee["surname"]);
      methods.setValue("fathername", employee["fathername"]);
      methods.setValue("nationality_code", employee["nationalcode"]);
      methods.setValue("masoliat", employee["masoliat"]);
      methods.setValue("address", employee["address"]);
      methods.setValue("phone_number", employee["phone_number"]);
      methods.setValue(
        "birthdate",
        dateHandler(employee["birthdate"], { format: false }),
      );
      methods.setValue(
        "ezamdate",
        dateHandler(employee["ezamDate"], { format: false }),
      );
      methods.setValue("education", {
        id: employee["education"] || 0,
        description: employee["tahsili_title"] || "",
      });
      methods.setValue("jens", {
        id: employee["Jens"] || 0,
        description: employee["jens_title"] || "",
      });
      methods.setValue("ozviat_type", {
        id: employee["ozviyat_code"] || 0,
        description: employee["ozviyat_type_title"] || "",
      });
      methods.setValue("vahed", {
        id: employee["unit"] || 0,
        description: employee["vahed_title"] || "",
      });
      methods.setValue("rank", {
        id: employee["daraje"] || null,
        description: employee["daraje_title"] || "",
      });
      methods.setValue("rotbe", {
        id: employee["rotbe"] || null,
        description: employee["rotbe_title"] || "",
      });
      methods.setValue("jaygah", {
        id: employee["jaygah"] || 0,
        description: employee["jaygah_title"] || "",
      });
      methods.setValue("raste", {
        id: employee["RastehAsli"] || 0,
        description: employee["raste_title"] || "",
      });
      methods.setValue("vaziat_khedmat", {
        id: employee["vkhedmat"] || 0,
        description: employee["vkhedmat_title"] || "",
      });
      methods.setValue("vaziat_jesmani", {
        id: employee["vazjesmani"] || 0,
        description: employee["vazjesmani_title"] || "",
      });
      methods.setValue("vaziat_ravani", {
        id: employee["vazravani"] || 0,
        description: employee["vazravani_title"] || "",
      });
      methods.setValue("marig_status", {
        id: employee["marig"] || 0,
        description: employee["marig_title"] || "",
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    methods.reset();
    setOpen(false);
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog maxWidth="xs" open={!!promiseArguments}>
        <DialogTitle>آیا مطمئنید؟</DialogTitle>
        <DialogContent
          dividers
        >{`در صورت تایید ${mutation} تغییر خواهت یافت.`}</DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            خیر
          </Button>
          <Button onClick={handleYes}>بله</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <FormProvider {...methods}>
      <Box>
        {renderConfirmDialog()}
        <Paper sx={{ mb: 2, p: "15px" }}>
          <Typography variant="h5">اطلاعات پایوران</Typography>
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
                  <AddEmployee
                    dialogTitle="افزودن کارمند جدید"
                    handleClose={handleClose}
                    methods={methods}
                    // initialFormData={intialFormData}
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
            <CustomDataGrid
              rows={rows}
              columns={cols}
              height={Height}
              isLoading={isFetching || isLoading}
              processRowUpdate={processRowUpdate}
            />
            {!!snackbar && (
              <Snackbar
                open
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
              >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
}
