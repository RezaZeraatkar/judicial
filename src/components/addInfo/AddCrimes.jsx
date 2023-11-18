import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, date } from "zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

// Components;
import Mojrem from "../../forms/crimes/mojrem";
import Shaki from "../../forms/crimes/shaki";
import CrimeSpecifications from "../../forms/crimes/crimeSpecifications";
import dateHandler from "../../utils/dateHandler";
import formValuesFormatHandler from "../../utils/formValuesFormatHandler";

import {
  useAddCrimeMutation,
  useEditCrimeMutation,
} from "../../services/api/crimes/crimesSlice";
import useServerErrors from "../../utils/useServerErrors";

// API REQUESTS
export const CrimesSchema = object({
  crimes_mojrem_pasdari_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_employee_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_ozviyat_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_position: string().optional(),
  crimes_mojrem_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojrem_responsibility: string(),
  crimes_shaki_pasdari_code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_parvande_code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_nationality_code: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "این فیلد الزامی است!",
  }).min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_ozviyat_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_employee_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_hoghughi: object(
    {
      id: number(),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  crimes_shaki_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_position: string().optional(),
  crimes_shaki_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_shaki_responsibility: string(),
  crimes_shaki_number: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "این فیلد الزامی است!",
  }).min(1, { message: "این فیلد الزامی است!" }),
  crimes_crime_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  crimes_hokm_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  crimes_crime_type: object(
    {
      id: number(),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  crimes_judicial_audit_reference: object(
    {
      id: number(),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  crimes_jorm_occurance_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  crimes_jorm_notify_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  crimes_issued_hokm: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_mojazat_amount: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  crimes_jorm_describtion: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
});

export default function AddCrimes({
  dialogTitle,
  initialCrimeFormData,
  handleClose,
}) {
  const initialFormInputs = initialCrimeFormData || {};
  const crimeId = initialCrimeFormData["id"];

  const defaultValues = {
    crimes_mojrem_pasdari_code:
      initialFormInputs["crimes_mojrem_pasdari_code"] || "",
    crimes_mojrem_parvande_code:
      initialFormInputs["crimes_mojrem_parvande_code"] || "",
    crimes_mojrem_name: initialFormInputs["crimes_mojrem_name"] || "",
    crimes_mojrem_surname: initialFormInputs["crimes_mojrem_surname"] || "",
    crimes_mojrem_fathername:
      initialFormInputs["crimes_mojrem_fathername"] || "",
    crimes_mojrem_nationality_code:
      initialFormInputs["crimes_mojrem_nationality_code"] || "",
    crimes_mojrem_employee_type: initialFormInputs?.crimes_mojrem_employee_type
      ? initialFormInputs?.crimes_mojrem_employee_type
      : "1",
    crimes_mojrem_ozviyat_type:
      initialFormInputs["crimes_mojrem_ozviyat_type_title"] || "",
    crimes_mojrem_rank: initialFormInputs["crimes_mojrem_daraje_title"] || "",
    crimes_mojrem_position:
      initialFormInputs["crimes_mojrem_jaygah_title"] || "",
    crimes_mojrem_unit: initialFormInputs["crimes_mojrem_vahed_title"] || "",
    crimes_mojrem_responsibility:
      initialFormInputs["crimes_mojrem_responsibility"] || "",
    crimes_shaki_hoghughi: {
      id: initialFormInputs["hoghughi_organizations_id"] || 0,
      description: initialFormInputs["hoghughi_organizations_title"] || "",
    },
    crimes_shaki_pasdari_code:
      initialFormInputs["crimes_shaki_pasdari_code"] || "",
    crimes_shaki_parvande_code:
      initialFormInputs["crimes_shaki_parvande_code"] || "",
    crimes_shaki_name: initialFormInputs["crimes_shaki_name"] || "",
    crimes_shaki_surname: initialFormInputs["crimes_shaki_surname"] || "",
    crimes_shaki_fathername: initialFormInputs["crimes_shaki_fathername"] || "",
    crimes_shaki_nationality_code:
      initialFormInputs["crimes_shaki_nationality_code"] || "",
    crimes_shaki_type: initialFormInputs["crimes_shaki_type"] || "1",
    crimes_shaki_employee_type: initialFormInputs["crimes_shaki_employee_type"]
      ? initialFormInputs["crimes_shaki_employee_type"]
      : "1",
    crimes_shaki_ozviyat_type:
      initialFormInputs["crimes_shaki_ozviyat_type_title"] || "",
    crimes_shaki_rank: initialFormInputs["crimes_shaki_daraje_title"] || "",
    crimes_shaki_position: initialFormInputs["crimes_shaki_jaygah_title"] || "",
    crimes_shaki_unit: initialFormInputs["crimes_shaki_vahed_title"] || "",
    crimes_shaki_responsibility:
      initialFormInputs["crimes_shaki_responsibility"] || "",
    crimes_shaki_number: initialFormInputs["crimes_shaki_number"] || "",
    crimes_crime_date: dateHandler(initialFormInputs["crimes_crime_date"], {
      format: false,
    }),
    crimes_hokm_date: dateHandler(initialFormInputs["crimes_hokm_date"], {
      format: false,
    }),
    crimes_crime_type: {
      id: initialFormInputs["crime_type_id"] || 0,
      description: initialFormInputs["crimes_type_title"] || "",
    },
    crimes_judicial_audit_reference: {
      id: initialFormInputs["crimes_judicial_audit_reference_id"] || 0,
      description:
        initialFormInputs["crimes_judicial_audit_reference_title"] || "",
    },
    crimes_jorm_occurance_date: dateHandler(
      initialFormInputs["crimes_jorm_occurance_date"],
      { format: false },
    ),
    crimes_jorm_notify_date: dateHandler(
      initialFormInputs["crimes_jorm_notify_date"],
      { format: false },
    ),
    crimes_issued_hokm: initialFormInputs["crimes_issued_hokm"] || "",
    crimes_mojazat_amount: initialFormInputs["crimes_mojazat_amount"] || "",
    crimes_jorm_describtion: initialFormInputs["crimes_jorm_describtion"] || "",
  };

  const handleServerErrors = useServerErrors();
  const [addCrime, { data, isLoading, isSuccess, isError, error }] =
    useAddCrimeMutation();
  const [editCrime, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditCrimeMutation();

  useEffect(() => {
    if (isError) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  }, [isError, data?.message, error, handleServerErrors]);

  const methods = useForm({
    resolver: zodResolver(CrimesSchema),
    defaultValues,
  });

  const onAddHandler = async (values) => {
    // console.log(values);
    let vals = formValuesFormatHandler(values, "crimes_crime_date");
    vals = formValuesFormatHandler(vals, "crimes_hokm_date");
    vals = formValuesFormatHandler(vals, "crimes_jorm_notify_date");
    vals = formValuesFormatHandler(vals, "crimes_jorm_occurance_date");
    await addCrime(vals).unwrap();
    methods.reset();
  };

  const onEditHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "crimes_crime_date");
    vals = formValuesFormatHandler(vals, "crimes_hokm_date");
    vals = formValuesFormatHandler(vals, "crimes_jorm_notify_date");
    vals = formValuesFormatHandler(vals, "crimes_jorm_occurance_date");
    values = {
      ...vals,
      id: initialFormInputs["crimes_id"],
    };
    try {
      await editCrime(values).unwrap();
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        display="flex"
        flexDirection="column"
        component="form"
        noValidate
        autoComplete="off"
        sx={{ padding: { sm: "0 2rem" } }}
      >
        <AppBar sx={{ position: "fixed" }}>
          <Toolbar>
            <IconButton
              onClick={handleClose}
              edge="start"
              color="inherit"
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {dialogTitle}
            </Typography>
            {isLoading ? "در حال ثبت جرم ..." : ""}
            {isSuccess ? "با موفقیت ثبت شد" : ""}
            {isEditLoading ? "در حال ویرایش جرم ..." : ""}
            {isEditSuccess ? "با موفقیت ویرایش شد" : ""}
            {!initialFormInputs.crimes_id ? (
              <Button
                type="button"
                startIcon={<SaveAltIcon />}
                autoFocus
                color="inherit"
                onClick={methods.handleSubmit(onAddHandler)}
              >
                ثبت
              </Button>
            ) : (
              <Button
                type="button"
                startIcon={<SaveAltIcon />}
                autoFocus
                color="inherit"
                onClick={methods.handleSubmit(onEditHandler)}
              >
                ویرایش
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Grid item xs={6}>
            <Mojrem
              initialFormInputs={initialFormInputs}
              disableInput={crimeId}
            />
          </Grid>
          <Grid item xs={6}>
            <Shaki
              initialFormInputs={initialFormInputs}
              id={crimeId}
              disableInput={crimeId}
            />
          </Grid>
          <Grid item xs={12}>
            <CrimeSpecifications
              initialFormInputs={initialFormInputs}
              disableInput={crimeId}
            />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
