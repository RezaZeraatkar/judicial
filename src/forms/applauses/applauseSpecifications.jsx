import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// components
import CustomDatePicker from "../../components/formInputs/customDatePicker";
import CustomAutoComplete from "../../components/formInputs/customAutoComplete";
import CustomTextField from "../../components/formInputs/customTextField";
import RequiredFieldIcon from "../../components/icons/requiredFieldIcon";
import useServerErrors from "../../utils/useServerErrors";

// API
import {
  useGetApplausesTypesQuery,
  useGetNotoriousServicesQuery,
  useGetDisciplinaryCitationsQuery,
  selectAllDisciplinaryCitations,
  selectAllNotoriousServices,
  // selectDisciplinaryCitationsById,
} from "../../services/api/applauses/applausesSlice";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ApplauseSpecifications({ initialFormInputs }) {
  const navigate = useNavigate();
  const handleServerErrors = useServerErrors();
  const { notorious_services_type, applause_type, citation_cases } = useWatch();
  const [showApplauseAmountType, setShowApplauseAmountType] = useState(true);
  const allDisciplinaryCitations = useSelector(selectAllDisciplinaryCitations);
  const allNotoriousServices = useSelector(selectAllNotoriousServices);
  // const selectDisciplinaryCitation = useSelector((state) =>
  //   selectDisciplinaryCitationsById(1),
  // );
  const { setValue } = useFormContext();

  const {
    data: applausesTypes,
    isError: isTypesError,
    error,
  } = useGetApplausesTypesQuery();

  const { isError: isServicesError } = useGetNotoriousServicesQuery();

  const { isError: isCiteError } = useGetDisciplinaryCitationsQuery();

  // handling errors
  useEffect(() => {
    if (isTypesError || isServicesError || isCiteError) {
      handleServerErrors(isTypesError || isServicesError || isCiteError);
    }
  }, [
    isTypesError,
    isServicesError,
    isCiteError,
    error,
    navigate,
    handleServerErrors,
  ]);

  // useEffects
  useEffect(() => {
    const id = notorious_services_type?.id;
    // console.log(allDisciplinaryCitations);
    // console.log(selectDisciplinaryCitation);
    const disc = allDisciplinaryCitations.filter((item) => {
      return item.id === id;
    });

    setValue("citation_cases", disc[0]);
  }, [notorious_services_type, allDisciplinaryCitations, setValue]);

  useEffect(() => {
    setValue("applause_padash", initialFormInputs["applause_padash"] || "");
    if (applause_type?.id === 7) {
      setValue("applause_count", "");
      setShowApplauseAmountType(false);
    } else {
      setValue("applause_padash", "");
      setShowApplauseAmountType(true);
    }
  }, [applause_type, setShowApplauseAmountType, setValue, initialFormInputs]);

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <Grid container spacing={2}>
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
              مشخصات تشویق
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="notorious_services_type"
            name="notorious_services_type"
            value={notorious_services_type || null}
            options={
              allNotoriousServices
                ? allNotoriousServices
                : [{ id: 0, description: "" }]
            }
            label={<RequiredFieldIcon label="نوع خدمات برجسته" />}
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
            size="small"
            id="applause_type"
            name="applause_type"
            value={applause_type || null}
            options={
              applausesTypes
                ? applausesTypes["data"]
                : [{ id: 0, description: "" }]
            }
            label={<RequiredFieldIcon label="نوع تشویق" />}
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
        <Grid item xs={6}>
          <CustomDatePicker
            name="applause_date"
            label={<RequiredFieldIcon label="تاریخ تشویق" />}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="citation_cases"
            name="citation_cases"
            value={citation_cases || null}
            options={
              allDisciplinaryCitations
                ? allDisciplinaryCitations
                : [{ id: 0, description: "" }]
            }
            placeholder="موارد استنادی آیین نامه انضباطی"
            label="موارد استنادی آیین نامه انضباطی"
            getOptionLabel={(option) => `${option.description}`}
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
          />
        </Grid>
        {!showApplauseAmountType ? (
          <Grid item xs={4}>
            <CustomTextField
              type="number"
              variant="outlined"
              name="applause_padash"
              id="applause_padash"
              size="small"
              label={<RequiredFieldIcon label="مقدار تشویق" />}
            />
          </Grid>
        ) : (
          <Grid item xs={4}>
            <CustomTextField
              type="number"
              variant="outlined"
              name="applause_count"
              id="applause_count"
              size="small"
              label={<RequiredFieldIcon label="تعداد تشویق" />}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <CustomTextField
            multiline
            name="applause_description"
            id="applause_description"
            sx={{ width: "100%" }}
            label={<RequiredFieldIcon label="شرح دلایل تشویق ..." />}
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
