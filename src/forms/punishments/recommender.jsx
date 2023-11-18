import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Components
import CustomTable from "../../components/table/customTable";
import { useGetEmployeeMutation } from "../../services/api/employees/employeesSlice";
import CustomTextField from "../../components/formInputs/customTextField";
import CustomSearchInput from "../../components/formInputs/customSearchInput";
import useServerErrors from "../../utils/useServerErrors";

export default function Recommender({ disableInputs }) {
  const { setValue } = useFormContext();
  const handleServerErrors = useServerErrors();
  const [tableShow, setTableShow] = useState(false);
  const [seachTableData, setSeachTableData] = useState([]);
  const [getEmployee, { isLoading }] = useGetEmployeeMutation();

  const handleSubmitRequest = async (value) => {
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
  };

  function setFormData(soldierId) {
    setTableShow(false);
    const soldier = seachTableData["entities"][`${soldierId}`];
    injectFormData(soldier);
  }

  function injectFormData(employee) {
    setValue("punishment_recommender_pasdari_code", employee["pasdari_code"]);
    setValue("punishment_recommender_parvande_code", employee["code"]);
    setValue("punishment_recommender_name", employee["firstname"]);
    setValue("punishment_recommender_surname", employee["surname"]);
    setValue("punishment_recommender_fathername", employee["fathername"]);
    setValue(
      "punishment_recommender_nationality_code",
      employee["nationalcode"],
    );
    setValue(
      "punishment_recommender_ozviyat_type",
      employee["ozviyat_type_title"],
    );
    setValue("punishment_recommender_rank", employee["daraje_title"]);
    setValue("punishment_recommender_position", employee["jaygah_title"]);
    setValue("punishment_recommender_unit", employee["vahed_title"]);
    setValue("punishment_recommender_responsibility", employee["masoliat"]);
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
              مقام پیشنهاددهنده
            </Typography>
            <CustomSearchInput
              id="punishment_subject_search"
              type="text"
              isLoading={isLoading}
              handleSubmit={handleSubmitRequest}
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
                  name="punishment_recommender_pasdari_code"
                  size="small"
                  label="شناسه پاسداری"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_parvande_code"
                  size="small"
                  label="کد پرونده"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_name"
                  size="small"
                  label="نام"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_surname"
                  size="small"
                  label="نام خانوادگی"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_fathername"
                  size="small"
                  label="نام پدر"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_nationality_code"
                  size="small"
                  label="کد ملی"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_ozviyat_type"
                  size="small"
                  label="نوع عضویت"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_rank"
                  size="small"
                  label="درجه"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_position"
                  size="small"
                  label="جایگاه"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  variant="outlined"
                  name="punishment_recommender_unit"
                  size="small"
                  label="رده خدمتی"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  size="small"
                  variant="outlined"
                  name="punishment_recommender_responsibility"
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
