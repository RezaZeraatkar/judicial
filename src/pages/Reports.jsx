import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { object, string, number } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Mui Icons
import DownloadIcon from "@mui/icons-material/Download";

// Components
import CustomDatePicker from "../components/formInputs/customDatePicker";
import CircularProgress from "../components/circularLoaders/circularProgress";
import CustomAutoComplete from "../components/formInputs/customAutoComplete";
import Suspense from "../components/suspense/Suspense";
import { exportExcel } from "../utils/exportExcel";

// Constans
import { reportCols, statisticalReportCols } from "../constants/reportCols";

// import RequiredFieldIcon from "../components/icons/requiredFieldIcon";

// API REQUESTS
import { useEmployeeFormQuery } from "../services/api/selectors/selectors";
import {
  useGetReportsMutation,
  useGetReportFiltersQuery,
} from "../services/api/reports/reportsSlice";
import useServerErrors from "../utils/useServerErrors";

import CustomSelect from "../components/formInputs/customSelectField";
import Report from "../components/reports/report";
import formValuesFormatHandler from "../utils/formValuesFormatHandler";
import FilteringOptions from "../components/filteringOptions/filteringOptions";
import Box from "@mui/material/Box";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const schema1 = object({
//   report_type: string().optional(),
//   report_filter: string().optional(),
// });

// const schema2 = object({
//   report_type: number().optional(),
//   report_filter: number({ required_error: "required" }),
// });

export default function Reports() {
  const [rows, setRows] = React.useState([]);
  const [cols, setCols] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [filterSelected, setFilterSelected] = React.useState(false);
  const [excelHeaders, setExcelHeaders] = React.useState([]);
  const handleServerErrors = useServerErrors();

  const methods = useForm({});

  const report_type = methods.watch("report_type");
  const report_filter = methods.watch("report_filter");

  const {
    data: reportFilters,
    isLoading: ReportFiltersIsLoading,
    isFetching: ReportFiltersIsFetching,
    isSuccess: ReportFiltersIsSuccess,
    isError: ReportFiltersIsError,
    error: formQueryError,
  } = useGetReportFiltersQuery();

  useEffect(() => {
    handleServerErrors(formQueryError);
  }, [ReportFiltersIsError, formQueryError, handleServerErrors]);

  const {
    data: filterOptions,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error: employeeFormQueryError,
  } = useEmployeeFormQuery();

  useEffect(() => {
    if (
      report_type === 1 ||
      report_type === 2 ||
      report_type === 3 ||
      report_type === 4
    ) {
      if (report_filter !== 1 && report_filter !== 2 && report_filter !== 3) {
        setFilterSelected(true);
        setWarningMessage(
          "انتخاب فیلتر گزارش برای انواع گزارش به غیر از گزارش کلی الزامی می‌باشد!",
        );
      } else {
        setFilterSelected(false);
      }
    } else {
      setFilterSelected(false);
      setWarningMessage("");
      methods.setValue("report_filter", "");
    }
  }, [report_type, report_filter, methods]);

  useEffect(() => {
    handleServerErrors(employeeFormQueryError);
  }, [isError, employeeFormQueryError, handleServerErrors]);

  const [
    getReport,
    { isLoading: isReportLoading, isFetching: isReportFetching },
  ] = useGetReportsMutation();

  const handleClose = async () => {
    setRows([]);
    setCols([]);
    setExcelHeaders([]);
    setOpen(false);
  };

  const submitReportHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "from_date");
    values = formValuesFormatHandler(vals, "to_date");
    switch (values.report_type) {
      // گزارش تشویقات
      case 1: // تشویقات
      case 2: // تنبیهات
      case 3: // جرایم
      case 4: // تذکرات
        try {
          const { data } = await getReport(values).unwrap();
          const { rows, headers } = data;
          setExcelHeaders(headers);
          setCols(statisticalReportCols);
          setRows(rows);
          setOpen(true);
        } catch (error) {
          handleServerErrors(error);
        }
        break;

      // گزارش کلی
      default:
        try {
          const { data } = await getReport(values).unwrap();
          const { rows, headers } = data;
          // setState cols
          setExcelHeaders(headers);
          setCols(reportCols);
          setRows(rows);
          // open Dialog
          setOpen(true);
        } catch (error) {
          handleServerErrors(error);
        }
        break;
    }
  };

  const onClickExportHandler = async () => {
    try {
      // save to excelsheet
      const cols = excelHeaders[0];
      // console.log(cols, rows);
      exportExcel(cols, rows);
    } catch (error) {
      handleServerErrors(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
        {isLoading ||
        isFetching ||
        ReportFiltersIsLoading ||
        ReportFiltersIsFetching ? (
          <CircularProgress />
        ) : (
          <>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              {/* <FormControl size="small" sx={{ marginRight: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    methods.setValue("jaygah-1", true);
                  }}
                >
                  دریافت خروجی
                </Button>
              </FormControl> */}
              <FormControl
                size="small"
                sx={{
                  marginRight: 2,
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "red" }}>
                    {warningMessage}
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<DownloadIcon />}
                    onClick={methods.handleSubmit(submitReportHandler)}
                  >
                    {isReportFetching || isReportLoading
                      ? "در حال بارگزاری اطلاعات"
                      : "مشاهده"}
                  </Button>
                </Box>
              </FormControl>
              <Suspense>
                <Report
                  rows={rows}
                  cols={cols}
                  open={open}
                  handleClose={handleClose}
                  isReportLoading={isReportLoading}
                  isReportFetching={isReportFetching}
                  onClickExport={onClickExportHandler}
                />
              </Suspense>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                p: 2,
              }}
            >
              <Grid item xs={12} sm={12} md={2}>
                <CustomSelect
                  labelId="reportType"
                  id="report-type"
                  name="report_type"
                  label="نوع گزارش"
                >
                  <MenuItem value="">
                    <em>انتخاب نوع گزارش</em>
                  </MenuItem>
                  <MenuItem value={1}>تشویقات</MenuItem>
                  <MenuItem value={2}>تنبیهات</MenuItem>
                  <MenuItem value={3}>جرایم</MenuItem>
                  <MenuItem value={4}>تذکرات</MenuItem>
                  <MenuItem value={5}>گزارش کلی</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <CustomSelect
                  labelId="demo-simple-select-required-label"
                  id="simple-select-required"
                  label="فیلتر گزارش"
                  name="report_filter"
                  sx={!filterSelected ? {} : { border: "2px solid red" }}
                  disabled={report_type === 5 || report_type === ""}
                >
                  <MenuItem value="">
                    <em>انتخاب فیلتر گزارش</em>
                  </MenuItem>
                  <MenuItem value={1}>براساس رده</MenuItem>
                  <MenuItem value={2}>براساس محتوا</MenuItem>
                  <MenuItem value={3}>آماری</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <CustomSelect
                  labelId="demo-simple-select-required-label"
                  id="simple-select-required"
                  label="بازه گزارش"
                  name="report_date_range"
                >
                  <MenuItem value="">
                    <em>انتخاب بازه گزارش</em>
                  </MenuItem>
                  <MenuItem value={1}>براساس تاریخ ثبت</MenuItem>
                  <MenuItem value={2}>براساس تاریخ وقوع</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <CustomDatePicker name="from_date" label="از تاریخ" />
                <CustomDatePicker name="to_date" label="تا تاریخ" />
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <CustomSelect
                  labelId="demo-simple-select-required-label"
                  id="select-status"
                  label="وضعیت تایید"
                  name="is_valid"
                >
                  <MenuItem value="">
                    <em>وضعیت تایید</em>
                  </MenuItem>
                  <MenuItem value={1}>تایید ‌شده</MenuItem>
                  <MenuItem value={2}>رد شده</MenuItem>
                </CustomSelect>
              </Grid>
            </Grid>
            {ReportFiltersIsSuccess && isSuccess && report_type && (
              <Grid item xs={12}>
                <Typography gutterBottom={true}>
                  <b>فیلتر اطلاعات اختصاصی</b>
                </Typography>
                {1 === report_type && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="notorious_services_type"
                        name="notorious_services_type"
                        options={
                          reportFilters.data.notServices
                            ? reportFilters.data.notServices
                            : [{ id: "", description: "" }]
                        }
                        label="نوع خدمات برجسته"
                        placeholder="نوع خدمات برجسته"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.notorious_services_row
                              ? `(${option.notorious_services_row}) `
                              : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="applause_type"
                        name="applause_type"
                        options={
                          reportFilters.data.applausesTypes
                            ? reportFilters.data.applausesTypes
                            : [{ id: "", description: "" }]
                        }
                        label="نوع تشویق"
                        placeholder="نوع تشویق"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.code ? `(${option.code}) ` : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
                {2 === report_type && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="punishment_wrongdoins_type"
                        name="punishment_wrongdoins_type"
                        options={
                          reportFilters.data.punWrongDoings
                            ? reportFilters.data.punWrongDoings
                            : [{ id: 0, description: "" }]
                        }
                        label="نوع عمل قابل تنبیه"
                        placeholder="نوع عمل قابل تنبیه"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.punishments_wrongdoings_row
                              ? `(${option.punishments_wrongdoings_row}) `
                              : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="punishment_type"
                        name="punishment_type"
                        options={
                          reportFilters.data.punTypes
                            ? reportFilters.data.punTypes
                            : [{ id: 0, description: "" }]
                        }
                        label="نوع تنبیه"
                        placeholder="نوع تنبیه"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.code ? `(${option.code}) ` : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
                {3 === report_type && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="crimes_crime_type"
                        name="crimes_crime_type"
                        options={
                          reportFilters.data.crimeTypes
                            ? reportFilters.data.crimeTypes
                            : [{ id: 1, description: "" }]
                        }
                        label="نوع جرم"
                        placeholder="نوع جرم"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.code ? `(${option.code}) ` : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="crimes_judicial_audit_reference"
                        name="crimes_judicial_audit_reference"
                        options={
                          reportFilters.data.crimeAuditReferee
                            ? reportFilters.data.crimeAuditReferee
                            : [{ id: 1, description: "" }]
                        }
                        label="مرجع قضایی رسیدگی‌کننده"
                        placeholder="مرجع قضایی رسیدگی‌کننده"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.code ? `(${option.code}) ` : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
                {4 === report_type && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="remark_wrongdoins_type"
                        name="remark_wrongdoins_type"
                        options={
                          reportFilters.data.punWrongDoings
                            ? reportFilters.data.punWrongDoings
                            : [{ id: "", description: "" }]
                        }
                        label="نوع عمل قابل تذکر"
                        placeholder="نوع عمل قابل تذکر"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.punishments_wrongdoings_row
                              ? `(${option.punishments_wrongdoings_row}) `
                              : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomAutoComplete
                        multiple
                        size="small"
                        id="remark_type"
                        name="remark_type"
                        options={
                          reportFilters.data.remarkTypes
                            ? reportFilters.data.remarkTypes
                            : [{ id: "", description: "" }]
                        }
                        label="نوع تذکر"
                        placeholder="نوع تذکر"
                        getOptionLabel={(option) => `${option.description}`}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.code ? `(${option.code}) ` : ""}
                            {option.description}
                          </li>
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography gutterBottom={true}>
                <b>فیلتر اطلاعات کلی</b>
              </Typography>
            </Grid>
            <FilteringOptions
              filterOptions={filterOptions}
              isSuccess={isSuccess}
            />
          </>
        )}
      </Grid>
    </FormProvider>
  );
}
