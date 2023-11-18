import React from "react";
import { useWatch } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// components
import CustomAutoComplete from "../../components/formInputs/customAutoComplete";
import CustomTextField from "../../components/formInputs/customTextField";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ApplauseSpecifications({ selectorsData }) {
  const { vaziat_jesmani, vaziat_ravani, marig_status } = useWatch();
  const {
    vazjesmani: vaziatJesmaniType,
    vazravani: vaziatRavaniType,
    marig: marigStatus,
  } = selectorsData;

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
              اطلاعات تکمیلی
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <CustomAutoComplete
            size="small"
            id="vaziat_jesmani"
            name="vaziat_jesmani"
            value={vaziat_jesmani || null}
            options={
              vaziatJesmaniType
                ? vaziatJesmaniType.value
                : [{ id: "", description: "" }]
            }
            label="وضعیت جسمانی"
            placeholder="وضعیت جسمانی"
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
            id="vaziat_ravani"
            name="vaziat_ravani"
            value={vaziat_ravani || null}
            options={
              vaziatRavaniType
                ? vaziatRavaniType.value
                : [{ id: "", description: "" }]
            }
            label="وضعیت روانی"
            placeholder="وضعیت روانی"
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
            id="marig_status"
            name="marig_status"
            value={marig_status || null}
            options={
              marigStatus ? marigStatus.value : [{ id: "", description: "" }]
            }
            label="وضعیت تاهل"
            placeholder="وضعیت تاهل"
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
          <CustomTextField
            variant="outlined"
            name="phone_number"
            size="small"
            label="تلفن"
            type="number"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            multiline
            name="address"
            id="address"
            sx={{ width: "100%" }}
            placeholder="آدرس"
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
