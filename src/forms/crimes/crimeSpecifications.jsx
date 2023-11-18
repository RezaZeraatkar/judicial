import React, { useEffect } from "react";
import { useWatch } from "react-hook-form";

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
  useGetCrimesTypesQuery,
  useGetCrimesJudicialAuditRefereeQuery,
} from "../../services/api/crimes/crimesSlice";
import useServerErrors from "../../utils/useServerErrors";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CrimeSpecifications() {
  const handleServerErrors = useServerErrors();
  const { crimes_crime_type, crimes_judicial_audit_reference } = useWatch();
  const {
    data: crimesTypes,
    isError: isTypesError,
    error,
  } = useGetCrimesTypesQuery();

  const {
    data: crimesAuditReferee,
    isError: isAuditRefereeError,
    error: auditRefereeError,
  } = useGetCrimesJudicialAuditRefereeQuery();

  // handling errors
  useEffect(() => {
    if (isTypesError || isAuditRefereeError) {
      handleServerErrors(error || auditRefereeError);
    }
  }, [
    isTypesError,
    isAuditRefereeError,
    auditRefereeError,
    error,
    handleServerErrors,
  ]);

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
              مشخصات جرم
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <CustomAutoComplete
            size="small"
            id="crimes_crime_type"
            name="crimes_crime_type"
            value={crimes_crime_type || null}
            options={
              crimesTypes ? crimesTypes["data"] : [{ id: 1, description: "" }]
            }
            label={<RequiredFieldIcon label="نوع جرم" />}
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
        <Grid item xs={3}>
          <CustomAutoComplete
            size="small"
            id="crimes_judicial_audit_reference"
            name="crimes_judicial_audit_reference"
            value={crimes_judicial_audit_reference || null}
            options={
              crimesAuditReferee
                ? crimesAuditReferee["data"]
                : [{ id: 1, description: "" }]
            }
            label={<RequiredFieldIcon label="مرجع قضایی رسیدگی‌کننده" />}
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
        <Grid item xs={3}>
          <CustomDatePicker
            name="crimes_jorm_occurance_date"
            label={<RequiredFieldIcon label="تاریخ وقوع جرم" />}
            size="small"
          />
        </Grid>
        <Grid item xs={3}>
          <CustomDatePicker
            name="crimes_jorm_notify_date"
            label={<RequiredFieldIcon label="تاریخ اعلام جرم به مرجع قضایی" />}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomDatePicker
            name="crimes_hokm_date"
            label={<RequiredFieldIcon label="تاریخ حکم" />}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            variant="outlined"
            name="crimes_issued_hokm"
            id="crimes_issued_hokm"
            size="small"
            label={<RequiredFieldIcon label="حکم صادره" />}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            multiline
            name="crimes_mojazat_amount"
            id="crimes_mojazat_amount"
            sx={{ width: "100%" }}
            label={<RequiredFieldIcon label="مقدار مجازات..." />}
            rows={2}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            multiline
            name="crimes_jorm_describtion"
            id="crimes_jorm_describtion"
            sx={{ width: "100%" }}
            label={<RequiredFieldIcon label="توضیحات ..." />}
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
