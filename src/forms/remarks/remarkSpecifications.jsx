import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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

// API
import {
  useGetRemarksTypesQuery,
  useGetRemarkWrongdoingsQuery,
  useGetRemarkDisciplinaryCitationsQuery,
  selectAllDisciplinaryCitations,
} from "../../services/api/remarks/remarksSlice";
import useServerErrors from "../../utils/useServerErrors";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RemarkSpecifications() {
  const { setValue } = useFormContext();
  const handleServerErrors = useServerErrors();
  const { remark_wrongdoins_type, remark_type, remark_citation_cases } =
    useWatch();

  const allDisciplinaryCitations = useSelector(selectAllDisciplinaryCitations);

  const {
    data: remarksTypes,
    isError: isTypesError,
    error,
  } = useGetRemarksTypesQuery();
  const {
    data: punishmentWrongDoings,
    isError: isServicesError,
    error: servicesError,
  } = useGetRemarkWrongdoingsQuery();
  const { isError: isCiteError, error: citeError } =
    useGetRemarkDisciplinaryCitationsQuery();
  // handling errors
  useEffect(() => {
    if (isTypesError || isServicesError || isCiteError) {
      handleServerErrors(error || servicesError || citeError);
    }
  }, [
    isTypesError,
    isServicesError,
    isCiteError,
    servicesError,
    citeError,
    error,
    handleServerErrors,
  ]);

  //
  useEffect(() => {
    const id = remark_wrongdoins_type?.id;
    // console.log(allDisciplinaryCitations);
    // console.log(selectDisciplinaryCitation);
    const disc = allDisciplinaryCitations.filter((item) => {
      return item.id === id;
    });

    setValue("remark_citation_cases", disc[0]);
  }, [remark_wrongdoins_type, allDisciplinaryCitations, setValue]);

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
              مشخصات تذکر
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="remark_wrongdoins_type"
            name="remark_wrongdoins_type"
            value={remark_wrongdoins_type || null}
            options={
              punishmentWrongDoings
                ? punishmentWrongDoings["data"]
                : [{ id: "", description: "" }]
            }
            label={<RequiredFieldIcon label="نوع عمل قابل تذکر" />}
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
            size="small"
            id="remark_type"
            name="remark_type"
            value={remark_type || null}
            options={
              remarksTypes
                ? remarksTypes["data"]
                : [{ id: "", description: "" }]
            }
            label={<RequiredFieldIcon label="نوع تذکر" />}
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
        <Grid item xs={6}>
          <CustomDatePicker
            name="remark_date"
            label={<RequiredFieldIcon label="تاریخ تذکر" />}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomDatePicker
            name="remark_do_date"
            label={<RequiredFieldIcon label="تاریخ ارتکاب تخلف" />}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="remark_citation_cases"
            name="remark_citation_cases"
            value={remark_citation_cases || null}
            options={
              allDisciplinaryCitations
                ? allDisciplinaryCitations
                : [{ id: "", description: "" }]
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
                {option.description}
              </li>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomTextField
            multiline
            name="remark_description"
            id="remark_description"
            sx={{ width: "100%" }}
            placeholder="شرح دلایل تذکر ..."
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
