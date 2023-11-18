import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";

// Components
import CustomTable from "../../components/table/customTable";
import { useGetEmployeeMutation } from "../../services/api/employees/employeesSlice";
import { useGetSoldierMutation } from "../../services/api/garrisonAppApi";
import CustomSearchInput from "../../components/formInputs/customSearchInput";
import CustomTextField from "../../components/formInputs/customTextField";
import Select from "../../components/formInputs/customSelectField";
import RequiredFieldIcon from "../../components/icons/requiredFieldIcon";
import useServerErrors from "../../utils/useServerErrors";

export default function Applauser({ disableInputs }) {
  const { setValue } = useFormContext();
  const handleServerErrors = useServerErrors();
  const { applauser_ozviat_type } = useWatch();
  const [tableShow, setTableShow] = useState(false);
  const [seachTableData, setSeachTableData] = useState([]);
  const [getEmployee, { isLoading }] = useGetEmployeeMutation();
  const [getSoldiers] = useGetSoldierMutation();

  // useEffect(() => {
  //   console.log(applause_applauser_search);
  // }, [applause_applauser_search]);

  const handleSubmitRequest = async (value) => {
    if (applauser_ozviat_type === 1) {
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
    } else if (applauser_ozviat_type === 2) {
      try {
        const soldiers = await getSoldiers({
          code: value,
        }).unwrap();
        // console.log("soldiers: ", soldiers);
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
      "applauser_pasdari_code",
      employee["pasdari_code"] ? employee["pasdari_code"] : "",
    );
    setValue(
      "applauser_parvande_code",
      employee["code"] ? employee["code"] : "",
    );
    setValue(
      "applauser_name",
      employee["firstname"] ? employee["firstname"] : "",
    );
    setValue(
      "applauser_surname",
      employee["surname"] ? employee["surname"] : "",
    );
    setValue(
      "applauser_fathername",
      employee["fathername"] ? employee["fathername"] : "",
    );
    setValue(
      "applauser_nationality_code",
      employee["nationalcode"] ? employee["nationalcode"] : "",
    );
    setValue("applauser_ozviat_code", employee["ozviyat_type_title"]);
    setValue("applauser_rank", employee["daraje_title"]);
    setValue("applauser_position", employee["jaygah_title"]);
    setValue("applauser_unit", employee["vahed_title"]);
    setValue("applauser_education", employee["tahsili_title"]);
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
              تشویق‌شونده
            </Typography>
            {/* <FormControl required sx={{ m: 1, minWidth: 180 }} size="small"> */}
            <Select
              labelId="demo-simple-select-required-label"
              id="simple-select-required"
              label={<RequiredFieldIcon label="نوع عضویت" />}
              name="applauser_ozviat_type"
              disabled={!!disableInputs}
            >
              <MenuItem value={0}>
                <em>انتخاب کنید</em>
              </MenuItem>
              <MenuItem value={1} onClick={clearFormData}>
                کادر
              </MenuItem>
              <MenuItem value={2} onClick={clearFormData}>
                سرباز وظیفه
              </MenuItem>
            </Select>
            {!applauser_ozviat_type ? (
              <CustomSearchInput disabled />
            ) : (
              <CustomSearchInput
                id="applause_applauser_search"
                name="applause_applauser_search"
                handleSubmit={handleSubmitRequest}
                isLoading={isLoading}
                setTableShow={setTableShow}
                disabled={!!disableInputs}
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
            )}
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
                  name="applauser_pasdari_code"
                  size="small"
                  label={<RequiredFieldIcon label="شناسه پاسداری" />}
                  required={false}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_parvande_code"
                  size="small"
                  label={<RequiredFieldIcon label="شماره پرونده" />}
                  required={false}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_name"
                  size="small"
                  label={<RequiredFieldIcon label="نام" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_surname"
                  size="small"
                  label={<RequiredFieldIcon label="نام خانوادگی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_fathername"
                  size="small"
                  label={<RequiredFieldIcon label="نام پدر" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_nationality_code"
                  size="small"
                  label={<RequiredFieldIcon label="کد ملی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_ozviat_code"
                  size="small"
                  label={<RequiredFieldIcon label="نوع عضویت" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_rank"
                  size="small"
                  label={<RequiredFieldIcon label="درجه" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_position"
                  size="small"
                  label="جایگاه"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_unit"
                  size="small"
                  label={<RequiredFieldIcon label="رده خدمتی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="applauser_education"
                  size="small"
                  label={<RequiredFieldIcon label="میزان تحصیلات" />}
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
