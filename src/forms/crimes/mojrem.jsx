import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";

// Components
import CustomTable from "../../components/table/customTable";
import { useGetEmployeeMutation } from "../../services/api/employees/employeesSlice";
import { useGetSoldierMutation } from "../../services/api/garrisonAppApi";
import CustomTextField from "../../components/formInputs/customTextField";
import CustomSearchInput from "../../components/formInputs/customSearchInput";
import CustomRadioButtonGroup from "../../components/formInputs/customRadioButtonGroup";
import RequiredFieldIcon from "../../components/icons/requiredFieldIcon";
import useServerErrors from "../../utils/useServerErrors";

export default function Mojrem({ disableInput }) {
  const { setValue } = useFormContext();
  const handleServerErrors = useServerErrors();
  const { crimes_mojrem_employee_type } = useWatch();
  const [tableShow, setTableShow] = useState(false);
  const [seachTableData, setSeachTableData] = useState([]);
  const [getEmployee, { isLoading }] = useGetEmployeeMutation();
  const [getSoldiers] = useGetSoldierMutation();

  const handleSubmitRequest = async (value) => {
    if (crimes_mojrem_employee_type === "1") {
      try {
        const employees = await getEmployee({
          code: value,
        }).unwrap();
        // console.log(employee);

        if (employees["ids"].length > 1) {
          setTableShow(employees["ids"]?.length > 1);
          setSeachTableData(employees);
        } else {
          setSeachTableData([]);
          const employee_id = employees["ids"][0];
          const employee = employees["entities"][employee_id];
          injectFormData(employee);
        }
      } catch (error) {
        handleServerErrors(error);
      }
    } else if (crimes_mojrem_employee_type === "2") {
      try {
        const soldiers = await getSoldiers({
          code: value,
        }).unwrap();
        if (soldiers["ids"].length > 1) {
          setTableShow(soldiers["ids"]?.length > 1);
          setSeachTableData(soldiers);
        } else {
          const soldier_id = soldiers["ids"][0];
          const soldier = soldiers["entities"][soldier_id];
          injectFormData(soldier);
        }
      } catch (error) {
        console.error(error);
        if (error.name === "TypeError") {
          toast.error("سرباز موردنظر در سامانه ثبت نشده است!", {
            position: "top-right",
          });
        } else {
          toast.error(error.data, {
            position: "top-right",
          });
        }
      }
    }
  };

  function setFormData(soldierId) {
    setTableShow(false);
    const soldier = seachTableData["entities"][`${soldierId}`];
    injectFormData(soldier);
  }

  function injectFormData(employee) {
    setValue(
      "crimes_mojrem_pasdari_code",
      employee["pasdari_code"] ? employee["pasdari_code"] : "",
    );
    setValue(
      "crimes_mojrem_parvande_code",
      employee["code"] ? employee["code"] : "",
    );
    setValue(
      "crimes_mojrem_name",
      employee["firstname"] ? employee["firstname"] : "",
    );
    setValue(
      "crimes_mojrem_surname",
      employee["surname"] ? employee["surname"] : "",
    );
    setValue(
      "crimes_mojrem_fathername",
      employee["fathername"] ? employee["fathername"] : "",
    );
    setValue(
      "crimes_mojrem_nationality_code",
      employee["nationalcode"] ? employee["nationalcode"] : "",
    );
    setValue(
      "crimes_mojrem_ozviyat_type",
      employee["ozviyat_type_title"] ? employee["ozviyat_type_title"] : "",
    );
    setValue(
      "crimes_mojrem_rank",
      employee["daraje_title"] ? employee["daraje_title"] : "",
    );
    setValue(
      "crimes_mojrem_position",
      employee["jaygah_title"] ? employee["jaygah_title"] : "",
    );
    setValue(
      "crimes_mojrem_unit",
      employee["vahed_title"] ? employee["vahed_title"] : "",
    );
    setValue(
      "crimes_mojrem_education",
      employee["tahsili_title"] ? employee["tahsili_title"] : "",
    );
    setValue(
      "crimes_mojrem_responsibility",
      employee["masoliat"] ? employee["masoliat"] : "",
    );
  }

  function clearFormData() {
    injectFormData([]);
  }

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
              مجرم
            </Typography>
            <CustomSearchInput
              id="crimes_mojrem_search"
              type="text"
              isLoading={isLoading}
              handleSubmit={handleSubmitRequest}
              setTableShow={setTableShow}
              disabled={!!disableInput}
              renderSearchResult={
                <CustomTable
                  show={tableShow}
                  data={seachTableData}
                  setFormData={(soldierId) => {
                    setFormData(soldierId);
                  }}
                />
              }
            />
            <CustomRadioButtonGroup
              label=""
              name="crimes_mojrem_employee_type"
              defaultValue={"1"}
              disabled={!!disableInput}
            >
              <FormControlLabel
                value={"2"}
                control={<Radio />}
                label="سرباز"
                onClick={clearFormData}
              />
              <FormControlLabel
                value={"1"}
                control={<Radio />}
                label="کادر"
                onClick={clearFormData}
              />
            </CustomRadioButtonGroup>
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
                  name="crimes_mojrem_pasdari_code"
                  size="small"
                  label={<RequiredFieldIcon label="شناسه پاسداری" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_parvande_code"
                  size="small"
                  label={<RequiredFieldIcon label="کد پرونده" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_name"
                  size="small"
                  label={<RequiredFieldIcon label="نام" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_surname"
                  size="small"
                  label={<RequiredFieldIcon label="نام خانوادگی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_fathername"
                  size="small"
                  label={<RequiredFieldIcon label="نام پدر" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_nationality_code"
                  size="small"
                  label={<RequiredFieldIcon label="کد ملی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_ozviyat_type"
                  size="small"
                  label={<RequiredFieldIcon label="نوع عضویت" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_rank"
                  size="small"
                  label={<RequiredFieldIcon label="درجه" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_position"
                  size="small"
                  label="جایگاه"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="crimes_mojrem_unit"
                  size="small"
                  label={<RequiredFieldIcon label="رده خدمتی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  size="small"
                  variant="outlined"
                  name="crimes_mojrem_responsibility"
                  label="مسئولیت"
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
