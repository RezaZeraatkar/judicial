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
import Recommender from "../../forms/applauses/recommender";
import Commander from "../../forms/applauses/commander";
import Applauser from "../../forms/applauses/applauser";
import formValuesFormatHandler from "../../utils/formValuesFormatHandler";
import ApplauseSpecifications from "../../forms/applauses/applauseSpecifications";
import {
  useAddApplausesMutation,
  useEditApplauseMutation,
} from "../../services/api/applauses/applausesSlice";
import useServerErrors from "../../utils/useServerErrors";
import dateHandler from "../../utils/dateHandler";

// Form Schema validation
const ApplausesSchema = object({
  recommender_pasdari_code: string().optional(),
  recommender_parvande_code: string().optional(),
  recommender_name: string().optional(),
  recommender_surname: string().optional(),
  recommender_fathername: string().optional(),
  recommender_nationality_code: string().optional(),
  recommender_ozviyat_type: string().optional(),
  recommender_rank: string().optional(),
  recommender_position: string().optional(),
  recommender_unit: string().optional(),
  recommender_responsibility: string().optional(),
  commander_pasdari_code: string().min(1, { message: "این فیلد الزامی است!" }),
  commander_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_ozviyat_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_position: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  commander_responsibility: string().optional(),
  applauser_ozviat_type: number().min(1, { message: "این فیلد الزامی است!" }),
  applauser_pasdari_code: string().min(1, { message: "این فیلد الزامی است!" }),
  applauser_parvande_code: string().min(1, { message: "این فیلد الزامی است!" }),
  applauser_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_ozviat_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_position: string().optional(),
  applauser_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applauser_education: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  applause_count: string().optional(),
  applause_padash: string().optional(),
  applause_description: string().min(1, { message: "این فیلد الزامی است!" }),
  applause_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  notorious_services_type: object(
    {
      id: number({
        required_error: "این فیلد الزامی است!",
        invalid_type_error: "یک گزینه را انتخاب کنید!",
      }).min(1, { message: "یک گزینه را انتخاب کنید!" }),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  applause_type: object(
    {
      id: number({
        required_error: "این فیلد الزامی است!",
        invalid_type_error: "یک گزینه را انتخاب کنید!",
      }).min(1, { message: "یک گزینه را انتخاب کنید!" }),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  citation_cases: object(
    {
      id: number({
        required_error: "این فیلد الزامی است!",
        invalid_type_error: "یک گزینه را انتخاب کنید!",
      }).min(1, { message: "یک گزینه را انتخاب کنید!" }),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
});

export default function AddApplauses({
  initialApplauseFormData,
  dialogTitle,
  handleClose,
}) {
  const handleServerErrors = useServerErrors();
  // console.log(moment().locale("fa").format("YYYY-MM-DD"));
  const initialFormInputs = initialApplauseFormData || {};

  const defaultValues = {
    recommender_pasdari_code:
      initialFormInputs["recommender_pasdari_code"] || "",
    recommender_parvande_code:
      initialFormInputs["recommender_parvande_code"] || "",
    recommender_name: initialFormInputs["recommender_name"] || "",
    recommender_surname: initialFormInputs["recommender_surname"] || "",
    recommender_fathername: initialFormInputs["recommender_fathername"] || "",
    recommender_nationality_code:
      initialFormInputs["recommender_nationality_code"] || "",
    recommender_ozviyat_type:
      initialFormInputs["recommender_ozviyat_type_title"] || "",
    recommender_rank: initialFormInputs["recommender_daraje_title"] || "",
    recommender_position: initialFormInputs["recommender_jaygah_title"] || "",
    recommender_unit: initialFormInputs["recommender_vahed_title"] || "",
    recommender_responsibility:
      initialFormInputs["recommender_responsibility"] || "",
    commander_pasdari_code: initialFormInputs["commander_pasdari_code"] || "",
    commander_parvande_code: initialFormInputs["commander_parvande_code"] || "",
    commander_name: initialFormInputs["commander_name"] || "",
    commander_surname: initialFormInputs["commander_surname"] || "",
    commander_fathername: initialFormInputs["commander_fathername"] || "",
    commander_nationality_code:
      initialFormInputs["commander_nationality_code"] || "",
    commander_ozviyat_type:
      initialFormInputs["commander_ozviyat_type_title"] || "",
    commander_rank: initialFormInputs["commander_daraje_title"] || "",
    commander_position: initialFormInputs["commander_jaygah_title"] || "",
    commander_unit: initialFormInputs["commander_vahed_title"] || "",
    commander_responsibility:
      initialFormInputs["commander_responsibility"] || "",
    applauser_ozviat_type: initialFormInputs["applauser_ozviat_type"] || "",
    applauser_pasdari_code: initialFormInputs["applauser_pasdari_code"] || "",
    applauser_parvande_code: initialFormInputs["applauser_parvande_code"] || "",
    applauser_name: initialFormInputs["applauser_name"] || "",
    applauser_surname: initialFormInputs["applauser_surname"] || "",
    applauser_fathername: initialFormInputs["applauser_fathername"] || "",
    applauser_nationality_code:
      initialFormInputs["applauser_nationality_code"] || "",
    applauser_ozviat_code:
      initialFormInputs["applauser_ozviat_type_title"] || "",
    applauser_rank: initialFormInputs["applauser_daraje_title"] || "",
    applauser_position: initialFormInputs["applauser_jaygah_title"] || "",
    applauser_unit: initialFormInputs["applauser_vahed_title"] || "",
    applauser_education: initialFormInputs["applauser_tahsili_title"] || "",
    applause_count: initialFormInputs["applause_count"] || "",
    applause_padash: initialFormInputs["applause_padash"] || "",
    applause_description: initialFormInputs["applause_description"] || "",
    applause_date: dateHandler(initialFormInputs["applause_date"], {
      format: false,
    }),
    notorious_services_type: {
      id: initialFormInputs["notorious_services_id"] || 0,
      description: initialFormInputs["notorious_services_description"] || "",
    },
    applause_type: {
      id: initialFormInputs["applause_type_id"] || 0,
      description: initialFormInputs["applause_type_description"] || "",
    },
    citation_cases: {
      id: initialFormInputs["notorious_services_id"] || 0,
      description: initialFormInputs["citations_description"] || "",
    },
  };

  const [addApplauses, { data, isLoading, isSuccess, isError, error }] =
    useAddApplausesMutation();
  const [editApplause, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditApplauseMutation();

  useEffect(() => {
    if (isError) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  }, [isError, data?.message, error, handleServerErrors]);

  const methods = useForm({
    resolver: zodResolver(ApplausesSchema),
    defaultValues,
  });

  const onAddHandler = async (values) => {
    // console.log(values);
    let vals = formValuesFormatHandler(values, "applause_date");
    // console.log(vals);
    await addApplauses(vals).unwrap();
    methods.reset();
  };

  const onEditHandler = async (values) => {
    values = {
      ...values,
      id: initialFormInputs["id"],
    };
    // console.log("values: ", values);
    try {
      await editApplause(values).unwrap();
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
            {isLoading ? "در حال ثبت تشویقی ..." : ""}
            {isSuccess ? "با موفقیت ثبت شد" : ""}
            {isEditLoading ? "در حال ویرایش تشویقی ..." : ""}
            {isEditSuccess ? "با موفقیت ویرایش شد" : ""}
            {!initialFormInputs.id ? (
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
            <Recommender disableInputs={initialFormInputs?.id} />
          </Grid>
          <Grid item xs={6}>
            <Commander disableInputs={initialFormInputs?.id} />
          </Grid>
          <Grid item xs={6}>
            <Applauser disableInputs={initialFormInputs?.id} />
          </Grid>
          <Grid item xs={6}>
            <ApplauseSpecifications
              initialFormInputs={initialFormInputs}
              disableInputs={initialFormInputs?.id}
            />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
