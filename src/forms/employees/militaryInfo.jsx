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
import CustomDatePicker from "../../components/formInputs/customDatePicker";
// import CustomNumberField from "../../components/formInputs/customNumberInput";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MilitaryInfo({ selectorsData }) {
  const { ozviat_type, vahed, rank, rotbe, jaygah, raste, vaziat_khedmat } =
    useWatch();

  const {
    ozviat: ozviatType,
    vahed: vahedType,
    daraje: RankType,
    rotbe: Rotbe,
    jaygah: jaygahType,
    raste: rasteType,
    vkhedmat: vaziatKhedmatType,
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
              اطلاعات نظامی
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <CustomAutoComplete
            size="small"
            id="ozviat_type"
            name="ozviat_type"
            value={ozviat_type || null}
            options={
              ozviatType ? ozviatType.value : [{ id: "", description: "" }]
            }
            label="نوع عضویت"
            placeholder="نوع عضویت"
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
            id="vahed"
            name="vahed"
            value={vahed || null}
            options={
              vahedType ? vahedType.value : [{ id: "", description: "" }]
            }
            label="رده خدمتی"
            placeholder="رده خدمتی"
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
            id="rank"
            name="rank"
            value={rank || null}
            options={RankType ? RankType.value : [{ id: "", description: "" }]}
            placeholder="درجه"
            label="درجه"
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
            id="rotbe"
            name="rotbe"
            value={rotbe || null}
            options={Rotbe ? Rotbe.value : [{ id: "", description: "" }]}
            placeholder="رتبه"
            label="رتبه"
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
            id="jaygah"
            name="jaygah"
            value={jaygah || null}
            options={
              jaygahType ? jaygahType.value : [{ id: "", description: "" }]
            }
            placeholder="جایگاه"
            label="جایگاه"
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
            id="raste"
            name="raste"
            value={raste || null}
            options={
              rasteType ? rasteType.value : [{ id: "", description: "" }]
            }
            placeholder="رسته"
            label="رسته"
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
            id="vaziat_khedmat"
            name="vaziat_khedmat"
            value={vaziat_khedmat || null}
            options={
              vaziatKhedmatType
                ? vaziatKhedmatType.value
                : [{ id: "", description: "" }]
            }
            placeholder="وضعیت خدمتی"
            label="وضعیت خدمتی"
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
            size="small"
            variant="outlined"
            name="masoliat"
            label="مسئولیت"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker name="ezamdate" label="تاریخ ورود به سپاه" />
        </Grid>
      </Grid>
    </Paper>
  );
}
