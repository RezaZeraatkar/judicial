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

export default function PunishmentSubject({ disableInputs }) {
  const { setValue } = useFormContext();
  const handleServerErrors = useServerErrors();
  const { punishment_subject_ozviat_type } = useWatch();
  const [tableShow, setTableShow] = useState(false);
  const [seachTableData, setSeachTableData] = useState([]);
  const [getEmployee, { isLoading }] = useGetEmployeeMutation();
  const [getSoldiers] = useGetSoldierMutation();

  const handleSubmitRequest = async (value) => {
    if (punishment_subject_ozviat_type === 1) {
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
    } else if (punishment_subject_ozviat_type === 2) {
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
      "punishment_subject_pasdari_code",
      employee["pasdari_code"] ? employee["pasdari_code"] : "",
    );
    setValue(
      "punishment_subject_parvande_code",
      employee["code"] ? employee["code"] : "",
    );
    setValue(
      "punishment_subject_name",
      employee["firstname"] ? employee["firstname"] : "",
    );
    setValue(
      "punishment_subject_surname",
      employee["surname"] ? employee["surname"] : "",
    );
    setValue(
      "punishment_subject_fathername",
      employee["fathername"] ? employee["fathername"] : "",
    );
    setValue(
      "punishment_subject_nationality_code",
      employee["nationalcode"] ? employee["nationalcode"] : "",
    );
    setValue(
      "punishment_subject_ozviat_code",
      employee["ozviyat_type_title"] ? employee["ozviyat_type_title"] : "",
    );
    setValue(
      "punishment_subject_rank",
      employee["daraje_title"] ? employee["daraje_title"] : "",
    );
    setValue(
      "punishment_subject_position",
      employee["jaygah_title"] ? employee["jaygah_title"] : "",
    );
    setValue(
      "punishment_subject_unit",
      employee["vahed_title"] ? employee["vahed_title"] : "",
    );
    setValue(
      "punishment_subject_education",
      employee["tahsili_title"] ? employee["tahsili_title"] : "",
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
              متخلف
            </Typography>
            {/* <FormControl required sx={{ m: 1, minWidth: 180 }} size="small"> */}
            <Select
              labelId="punishment_subject_ozviat_type-label"
              id="punishment_subject_ozviat_type"
              label={<RequiredFieldIcon label="نوع عضویت" />}
              name="punishment_subject_ozviat_type"
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
            {!punishment_subject_ozviat_type ? (
              <CustomSearchInput id="punishment_subject_search1" disabled />
            ) : (
              <CustomSearchInput
                id="punishment_subject_search2"
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
                  name="punishment_subject_pasdari_code"
                  size="small"
                  label={<RequiredFieldIcon label="شناسه پاسداری" />}
                  required={false}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_parvande_code"
                  size="small"
                  label={<RequiredFieldIcon label="شماره پرونده" />}
                  required={false}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_name"
                  size="small"
                  label={<RequiredFieldIcon label="نام" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_surname"
                  size="small"
                  label={<RequiredFieldIcon label="نام خانوادگی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_fathername"
                  size="small"
                  label={<RequiredFieldIcon label="نام پدر" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_nationality_code"
                  size="small"
                  label={<RequiredFieldIcon label="کد ملی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_ozviat_code"
                  size="small"
                  label={<RequiredFieldIcon label="نوع عضویت" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_rank"
                  size="small"
                  label={<RequiredFieldIcon label="درجه" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_position"
                  size="small"
                  label="جایگاه"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_unit"
                  size="small"
                  label={<RequiredFieldIcon label="رده خدمتی" />}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_subject_education"
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
