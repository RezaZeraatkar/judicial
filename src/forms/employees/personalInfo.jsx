import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Components
import CustomTextField from "../../components/formInputs/customTextField";
import CustomDatePicker from "../../components/formInputs/customDatePicker";
import CustomAutoComplete from "../../components/formInputs/customAutoComplete";

// API REQUESTS
import {
  useCheckEmployeePasdariCodeMutation,
  useCheckEmployeeParvandeCodeMutation,
  useCheckEmployeeNationalityCodeMutation,
} from "../../services/api/employees/employeesSlice";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function PersonalInfo({
  selectorsData,
  formInputs,
  isIneditMode,
}) {
  const navigate = useNavigate();
  const { id, education, jens } = useWatch();
  const { setError, clearErrors } = useFormContext();
  const { tahsilat, jensiat } = selectorsData;

  const [checkEmployeePasdariCode] = useCheckEmployeePasdariCodeMutation();
  const [checkEmployeeParvandeCode] = useCheckEmployeeParvandeCodeMutation();
  const [checkEmployeeNationalityCode] =
    useCheckEmployeeNationalityCodeMutation();

  const checkEmployeePasdariCodeHandler = async (e) => {
    try {
      await checkEmployeePasdariCode(e.target.value).unwrap();
      clearErrors("pasdari_code");
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      if (error.status === 401) {
        navigate("/login");
      } else if (error.status === 400) {
        // toast.error(error.data.message, { position: "top-right" });
        setError("pasdari_code", { message: error.data.message });
      } else if (error.status === 500) {
        toast.error(error.data.message, { position: "top-right" });
      } else {
        toast.error(error.data.message, { position: "top-right" });
      }
    }
  };

  const checkEmployeeParvandeCodeHandler = async (e) => {
    try {
      await checkEmployeeParvandeCode(e.target.value).unwrap();
      clearErrors("parvande_code");
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      if (error.status === 401) {
        navigate("/login");
      } else if (error.status === 400) {
        // toast.error(error.data.message, { position: "top-right" });
        setError("parvande_code", { message: error.data.message });
      } else if (error.status === 500) {
        toast.error(error.data.message, { position: "top-right" });
      } else {
        toast.error(error.data.message, { position: "top-right" });
      }
    }
  };

  const checkEmployeeNationalityCodeHandler = async (e) => {
    try {
      await checkEmployeeNationalityCode(e.target.value).unwrap();
      // clearErrors("nationality_code");
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      if (error.status === 401) {
        navigate("/login");
      } else if (error.status === 400) {
        // toast.error(error.data.message, { position: "top-right" });
        setError("nationality_code", { message: error.data.message });
      } else if (error.status === 500) {
        toast.error(error.data.message, { position: "top-right" });
      } else {
        toast.error(error.data.message, { position: "top-right" });
      }
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: (theme) =>
                `1px dashed ${theme.palette.secondary.main}`,
              py: 2,
            }}
          >
            <Typography color="primary" variant="h6" align="left">
              اطلاعات انفرادی
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1 },
              mt: 2,
            }}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="id"
                  size="small"
                  sx={{ display: "none" }}
                />
                <CustomTextField
                  variant="outlined"
                  name="pasdari_code"
                  size="small"
                  label="شناسه پاسداری"
                  type="number"
                  onBlur={id ? () => {} : checkEmployeePasdariCodeHandler}
                  disabled={isIneditMode}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="parvande_code"
                  size="small"
                  label="کد پرونده"
                  type="number"
                  onBlur={id ? () => {} : checkEmployeeParvandeCodeHandler}
                  disabled={isIneditMode}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="name"
                  size="small"
                  label="نام"
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="surname"
                  size="small"
                  label="نام خانوادگی"
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="fathername"
                  size="small"
                  label="نام پدر"
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="nationality_code"
                  size="small"
                  label="کد ملی"
                  type="number"
                  onBlur={id ? () => {} : checkEmployeeNationalityCodeHandler}
                  disabled={isIneditMode}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomAutoComplete
                  size="small"
                  id="education"
                  name="education"
                  value={education || null}
                  options={
                    tahsilat ? tahsilat.value : [{ id: "0", description: "" }]
                  }
                  placeholder="تحصیلات"
                  label="تحصیلات"
                  getOptionLabel={(option) => option.description}
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
              <Grid item xs={4}>
                <CustomAutoComplete
                  size="small"
                  id="jens"
                  name="jens"
                  value={jens || null}
                  options={
                    jensiat ? jensiat.value : [{ id: "", description: "" }]
                  }
                  placeholder="جنسیت"
                  label="جنسیت"
                  getOptionLabel={(option) => option.description}
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
              <Grid item xs={4}>
                <CustomDatePicker name="birthdate" label="تاریخ تولد" />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
