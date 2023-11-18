import React, { useEffect, useState } from "react";
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
  useGetPunishmentsTypesQuery,
  useGetPunishmentWrongdoingsQuery,
  useGetPunishmentDisciplinaryCitationsQuery,
  selectAllDisciplinaryCitations,
} from "../../services/api/punishments/punishmentsSlice";
import useServerErrors from "../../utils/useServerErrors";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function PunishmentsSpecifications({ initialFormInputs }) {
  const [punsihmentKasreHoghoogh, setPunsihmentKasreHoghoogh] = useState(true);
  const handleServerErrors = useServerErrors();
  const { setValue } = useFormContext();
  const {
    punishment_wrongdoins_type,
    punishment_type,
    punishment_citation_cases,
  } = useWatch();

  const allDisciplinaryCitations = useSelector(selectAllDisciplinaryCitations);

  const {
    data: punishmentTypes,
    isError: isTypesError,
    error,
  } = useGetPunishmentsTypesQuery();
  const {
    data: punishmentWrongDoings,
    isError: isServicesError,
    error: servicesError,
  } = useGetPunishmentWrongdoingsQuery();
  const { isError: isCiteError, error: citeError } =
    useGetPunishmentDisciplinaryCitationsQuery();
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

  useEffect(() => {
    setValue(
      "punishment_kasr_hoghoogh",
      initialFormInputs["punishment_kasr_hoghoogh"] || "",
    );
    if (punishment_type.id === 8) {
      setPunsihmentKasreHoghoogh(false);
      setValue("punishment_count", "");
    } else {
      setPunsihmentKasreHoghoogh(true);
      setValue("punishment_kasr_hoghoogh", "");
    }
  }, [
    punishment_type,
    setPunsihmentKasreHoghoogh,
    initialFormInputs,
    setValue,
  ]);

  //
  useEffect(() => {
    const id = punishment_wrongdoins_type?.id;
    // console.log(allDisciplinaryCitations);
    // console.log(selectDisciplinaryCitation);
    const disc = allDisciplinaryCitations.filter((item) => {
      return item.id === id;
    });

    setValue("punishment_citation_cases", disc[0]);
  }, [punishment_wrongdoins_type, allDisciplinaryCitations, setValue]);

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
              مشخصات تنبیه
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="punishment_wrongdoins_type"
            name="punishment_wrongdoins_type"
            value={punishment_wrongdoins_type || null}
            options={
              punishmentWrongDoings
                ? punishmentWrongDoings["data"]
                : [{ id: 0, description: "" }]
            }
            label={<RequiredFieldIcon label="نوع عمل قابل تنبیه" />}
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
            size="small"
            id="punishment_type"
            name="punishment_type"
            value={punishment_type || null}
            options={
              punishmentTypes
                ? punishmentTypes["data"]
                : [{ id: 0, description: "" }]
            }
            label={<RequiredFieldIcon label="نوع تنبیه" />}
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
        <Grid item xs={6}>
          <CustomDatePicker
            name="punishment_date"
            label={<RequiredFieldIcon label="تاریخ تنبیه" />}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomDatePicker
            name="punishment_do_date"
            label={<RequiredFieldIcon label="تاریخ ارتکاب تخلف" />}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomAutoComplete
            size="small"
            id="punishment_citation_cases"
            name="punishment_citation_cases"
            value={punishment_citation_cases || null}
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
                {option.description}
              </li>
            )}
          />
        </Grid>
        {punsihmentKasreHoghoogh ? (
          <Grid item xs={4}>
            <CustomTextField
              type="number"
              variant="outlined"
              name="punishment_count"
              id="punishment_count"
              size="small"
              label={<RequiredFieldIcon label="تعداد روز تنبیه" />}
              placeholder="تعداد روز تنبیه"
              defaultValue=""
            />
          </Grid>
        ) : (
          <Grid item xs={4}>
            <CustomTextField
              type="number"
              variant="outlined"
              name="punishment_kasr_hoghoogh"
              id="punishment_kasr_hoghoogh"
              size="small"
              label={<RequiredFieldIcon label="میزان کسر حقوق" />}
              placeholder="میزان کسر حقوق"
              defaultValue=""
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <CustomTextField
            multiline
            name="punishment_description"
            id="punishment_description"
            sx={{ width: "100%" }}
            label={<RequiredFieldIcon label="شرح دلایل تنبیه ..." />}
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
