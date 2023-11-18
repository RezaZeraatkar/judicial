import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Components
import CustomTable from "../../components/table/customTable";
import CustomDatePicker from "../../components/formInputs/customDatePicker";
import CustomTextField from "../../components/formInputs/customTextField";
import CustomSearchInput from "../../components/formInputs/customSearchInput";
import CustomAutoComplete from "../../components/formInputs/customAutoComplete";
import CustomRadioButtonGroup from "../../components/formInputs/customRadioButtonGroup";
import RequiredFieldIcon from "../../components/icons/requiredFieldIcon";

// API
import { useGetEmployeeMutation } from "../../services/api/employees/employeesSlice";
import { useGetSoldierMutation } from "../../services/api/garrisonAppApi";
import { useGetHoghughiOrganizationsQuery } from "../../services/api/crimes/crimesSlice";
import useServerErrors from "../../utils/useServerErrors";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Shaki({ disableInput, initialFormInputs }) {
  const { setValue } = useFormContext();
  const serverErrorsHandler = useServerErrors();
  const crime = initialFormInputs;
  const [isHoghughiDisabled, setHoghughiDisabled] = useState(true);
  const [tableShow, setTableShow] = useState(false);
  const [seachTableData, setSeachTableData] = useState([]);
  const { crimes_shaki_employee_type, crimes_shaki_hoghughi } = useWatch();
  const [getEmployee, { isLoading: isGetEmployeeLoading }] =
    useGetEmployeeMutation();
  const [getSoldiers] = useGetSoldierMutation();

  const {
    data: hoghughiOrganizations,
    isError,
    error,
  } = useGetHoghughiOrganizationsQuery();

  useEffect(() => {
    if (isError) {
      // handle Errors [todo: must be extracted to its hook]
      serverErrorsHandler(error);
    }
  }, [isError, error, serverErrorsHandler]);

  const crimeShakiTypeHandler = (crimes_shaki_type) => {
    setValue(
      "crimes_shaki_pasdari_code",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_pasdari_code"]
            ? crime["crimes_shaki_pasdari_code"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_parvande_code",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_parvande_code"]
            ? crime["crimes_shaki_parvande_code"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_nationality_code",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_nationality_code"]
            ? crime["crimes_shaki_nationality_code"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_number",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_number"]
            ? crime["crimes_shaki_number"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_name",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_name"]
            ? crime["crimes_shaki_name"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_surname",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_surname"]
            ? crime["crimes_shaki_surname"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_fathername",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_fathername"]
            ? crime["crimes_shaki_fathername"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_ozviyat_type",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_ozviyat_type_title"]
            ? crime["crimes_shaki_ozviyat_type_title"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_rank",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_daraje_title"]
            ? crime["crimes_shaki_daraje_title"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_unit",
      crimes_shaki_type === "1"
        ? crime
          ? crime["crimes_shaki_vahed_title"]
            ? crime["crimes_shaki_vahed_title"]
            : ""
          : ""
        : " ",
    );
    setValue(
      "crimes_shaki_hoghughi",
      crimes_shaki_type === "1"
        ? { id: 1, description: "" }
        : hoghughiOrganizations
        ? hoghughiOrganizations.data["0"]
        : { id: 1, description: "" },
    );
    setHoghughiDisabled(crimes_shaki_type === "1");
  };

  const handleSubmitRequest = async (value) => {
    if (crimes_shaki_employee_type === "1") {
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
        serverErrorsHandler(error);
      }
    } else if (crimes_shaki_employee_type === "2") {
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

  function clearFormData() {
    injectFormData([]);
  }

  function injectFormData(employee) {
    setValue(
      "crimes_shaki_pasdari_code",
      employee["pasdari_code"] ? String(employee["pasdari_code"]) : "",
    );
    setValue(
      "crimes_shaki_parvande_code",
      employee["code"] ? String(employee["code"]) : "",
    );
    setValue(
      "crimes_shaki_name",
      employee["firstname"] ? String(employee["firstname"]) : "",
    );
    setValue(
      "crimes_shaki_surname",
      employee["surname"] ? String(employee["surname"]) : "",
    );
    setValue(
      "crimes_shaki_fathername",
      employee["fathername"] ? String(employee["fathername"]) : "",
    );
    setValue(
      "crimes_shaki_nationality_code",
      employee["nationalcode"] ? String(employee["nationalcode"]) : "",
    );
    setValue(
      "crimes_shaki_ozviyat_type",
      employee["ozviyat_type_title"]
        ? String(employee["ozviyat_type_title"])
        : "",
    );
    setValue(
      "crimes_shaki_rank",
      employee["daraje_title"] ? String(employee["daraje_title"]) : "",
    );
    setValue(
      "crimes_shaki_position",
      employee["daraje_title"] ? String(employee["jaygah_title"]) : "",
    );
    setValue(
      "crimes_shaki_unit",
      employee["vahed_title"] ? String(employee["vahed_title"]) : "",
    );
    setValue(
      "crimes_shaki_responsibility",
      employee["masoliat"] ? String(employee["masoliat"]) : "",
    );
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
            <Grid container>
              <Grid item xs={1}>
                <Typography color="primary" variant="h6" align="left">
                  شاکی
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <CustomRadioButtonGroup
                  label=""
                  name={"crimes_shaki_type"}
                  defaultValue={"1"}
                  onClickHandler={(val) => crimeShakiTypeHandler(val)}
                  disabled={!!disableInput}
                >
                  <FormControlLabel
                    value={"1"}
                    control={<Radio />}
                    label="حقیقی"
                  />
                  <FormControlLabel
                    value={"2"}
                    control={<Radio />}
                    label="حقوقی"
                  />
                </CustomRadioButtonGroup>
              </Grid>
              <Grid item xs={8}>
                <Grid container>
                  {!isHoghughiDisabled && (
                    <Grid item xs={12}>
                      <CustomAutoComplete
                        size="small"
                        id="crimes_shaki_hoghughi"
                        name="crimes_shaki_hoghughi"
                        value={crimes_shaki_hoghughi || null}
                        options={
                          hoghughiOrganizations
                            ? hoghughiOrganizations["data"]
                            : [{ id: 1, description: "" }]
                        }
                        label={<RequiredFieldIcon label="حقوقی" />}
                        placeholder="حقوقی"
                        getOptionLabel={(option) =>
                          `${option.description} ${
                            option.notorious_service_row
                              ? option.notorious_service_row
                              : ""
                          }`
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ fontSize: 13 }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.notorious_service_row
                              ? `${option.notorious_service_row}) `
                              : ""}
                            {option.description}
                          </li>
                        )}
                        disabled={isHoghughiDisabled}
                      />
                    </Grid>
                  )}
                  {isHoghughiDisabled && (
                    <Grid item xs={6}>
                      <CustomRadioButtonGroup
                        label=""
                        name={"crimes_shaki_employee_type"}
                        defaultValue={1}
                        disabled={!!disableInput}
                      >
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label="سرباز"
                          onClick={clearFormData}
                        />
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="کادر"
                          onClick={clearFormData}
                        />
                      </CustomRadioButtonGroup>
                    </Grid>
                  )}
                  {isHoghughiDisabled && (
                    <Grid item xs={6}>
                      <CustomSearchInput
                        id="crimes_shaki_search"
                        type="text"
                        width="auto"
                        isLoading={isGetEmployeeLoading}
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
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
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
              {isHoghughiDisabled && (
                <>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_pasdari_code"
                      size="small"
                      label={<RequiredFieldIcon label="شناسه پاسداری" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_parvande_code"
                      size="small"
                      label={<RequiredFieldIcon label="کد پرونده" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_name"
                      size="small"
                      label={<RequiredFieldIcon label="نام" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_surname"
                      size="small"
                      label={<RequiredFieldIcon label="نام خانوادگی" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_fathername"
                      size="small"
                      label={<RequiredFieldIcon label="نام پدر" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_nationality_code"
                      size="small"
                      label={<RequiredFieldIcon label="کد ملی" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_ozviyat_type"
                      size="small"
                      label={<RequiredFieldIcon label="نوع عضویت" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_rank"
                      size="small"
                      label={<RequiredFieldIcon label="درجه" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_position"
                      size="small"
                      label="جایگاه"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      variant="outlined"
                      name="crimes_shaki_unit"
                      size="small"
                      label={<RequiredFieldIcon label="رده خدمتی" />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      size="small"
                      variant="outlined"
                      name="crimes_shaki_responsibility"
                      label="مسئولیت"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      size="small"
                      variant="outlined"
                      name="crimes_shaki_number"
                      label={<RequiredFieldIcon label="شماره شاکی" />}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={4}>
                <CustomDatePicker
                  name="crimes_crime_date"
                  label={<RequiredFieldIcon label="تاریخ شکایت" />}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
