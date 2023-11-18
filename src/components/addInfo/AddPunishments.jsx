import React, { useEffect } from "react";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, date, string } from "zod";
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
import Recommender from "../../forms/punishments/recommender";
import Commander from "../../forms/punishments/commander";
import PunishmentSubject from "../../forms/punishments/punishmentSubject";
import PunishmentSpecifications from "../../forms/punishments/punishmentSpecifications";
import useServerErrors from "../../utils/useServerErrors";

import {
  useAddPunishmentMutation,
  useEditPunishmentMutation,
} from "../../services/api/punishments/punishmentsSlice";
import formValuesFormatHandler from "../../utils/formValuesFormatHandler";
import dateHandler from "../../utils/dateHandler";

// API REQUESTS
const PunishmentSchema = object({
  punishment_recommender_pasdari_code: string().optional(),
  punishment_recommender_parvande_code: string().optional(),
  punishment_recommender_name: string().optional(),
  punishment_recommender_surname: string().optional(),
  punishment_recommender_fathername: string().optional(),
  punishment_recommender_nationality_code: string().optional(),
  punishment_recommender_ozviyat_type: string().optional(),
  punishment_recommender_rank: string().optional(),
  punishment_recommender_position: string().optional(),
  punishment_recommender_unit: string().optional(),
  punishment_recommender_responsibility: string().optional(),
  punishment_commander_pasdari_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_ozviyat_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_position: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_commander_responsibility: string(),
  punishment_subject_pasdari_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_ozviat_type: number().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_ozviat_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_position: string().optional(),
  punishment_subject_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_subject_education: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  punishment_count: string().optional(),
  punishment_kasr_hoghoogh: string().optional(),
  punishment_description: string().min(1, { message: "این فیلد الزامی است!" }),
  punishment_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  punishment_do_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  punishment_wrongdoins_type: object(
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
  punishment_type: object(
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
  punishment_citation_cases: object(
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

export default function AddPunishments({
  initialPunishmentData,
  handleClose,
  dialogTitle,
}) {
  const initialFormInputs = initialPunishmentData || {};

  const defaultValues = {
    punishment_recommender_pasdari_code:
      initialFormInputs["punishment_recommender_pasdari_code"] || "",
    punishment_recommender_parvande_code:
      initialFormInputs["punishment_recommender_parvande_code"] || "",
    punishment_recommender_name:
      initialFormInputs["punishment_recommender_name"] || "",
    punishment_recommender_surname:
      initialFormInputs["punishment_recommender_surname"] || "",
    punishment_recommender_fathername:
      initialFormInputs["punishment_recommender_fathername"] || "",
    punishment_recommender_nationality_code:
      initialFormInputs["punishment_recommender_nationality_code"] || "",
    punishment_recommender_ozviyat_type:
      initialFormInputs["punishment_recommender_ozviyat_type_title"] || "",
    punishment_recommender_rank:
      initialFormInputs["punishment_recommender_daraje_title"] || "",
    punishment_recommender_position:
      initialFormInputs["punishment_recommender_jaygah_title"] || "",
    punishment_recommender_unit:
      initialFormInputs["punishment_recommender_vahed_title"] || "",
    punishment_recommender_responsibility:
      initialFormInputs["punishment_recommender_responsibility"] || "",
    punishment_commander_pasdari_code:
      initialFormInputs["punishment_commander_pasdari_code"] || "",
    punishment_commander_parvande_code:
      initialFormInputs["punishment_commander_parvande_code"] || "",
    punishment_commander_name:
      initialFormInputs["punishment_commander_name"] || "",
    punishment_commander_surname:
      initialFormInputs["punishment_commander_surname"] || "",
    punishment_commander_fathername:
      initialFormInputs["punishment_commander_fathername"] || "",
    punishment_commander_nationality_code:
      initialFormInputs["punishment_commander_nationality_code"] || "",
    punishment_commander_ozviyat_type:
      initialFormInputs["punishment_commander_ozviyat_type_title"] || "",
    punishment_commander_rank:
      initialFormInputs["punishment_commander_daraje_title"] || "",
    punishment_commander_position:
      initialFormInputs["punishment_commander_jaygah_title"] || "",
    punishment_commander_unit:
      initialFormInputs["punishment_commander_vahed_title"] || "",
    punishment_commander_responsibility:
      initialFormInputs["punishment_commander_responsibility"] || "",
    punishment_subject_ozviat_type:
      initialFormInputs["punishment_subject_ozviat_type"] || "",
    punishment_subject_pasdari_code:
      initialFormInputs["punishment_subject_pasdari_code"] || "",
    punishment_subject_parvande_code:
      initialFormInputs["punishment_subject_parvande_code"] || "",
    punishment_subject_name: initialFormInputs["punishment_subject_name"] || "",
    punishment_subject_surname:
      initialFormInputs["punishment_subject_surname"] || "",
    punishment_subject_fathername:
      initialFormInputs["punishment_subject_fathername"] || "",
    punishment_subject_nationality_code:
      initialFormInputs["punishment_subject_nationality_code"] || "",
    punishment_subject_ozviat_code:
      initialFormInputs["punishment_subject_ozviat_type_title"] || "",
    punishment_subject_rank:
      initialFormInputs["punishment_subject_daraje_title"] || "",
    punishment_subject_position:
      initialFormInputs["punishment_subject_jaygah_title"] || "",
    punishment_subject_unit:
      initialFormInputs["punishment_subject_vahed_title"] || "",
    punishment_subject_education:
      initialFormInputs["punishment_subject_tahsili_title"] || "",
    punishment_count: initialFormInputs["punishment_count"] || "",
    punishment_kasr_hoghoogh:
      initialFormInputs["punishment_kasr_hoghoogh"] || "",
    punishment_description: initialFormInputs["punishment_description"] || "",
    punishment_date: dateHandler(initialFormInputs["punishment_date"], {
      format: false,
    }),
    punishment_do_date: dateHandler(initialFormInputs["punishment_do_date"], {
      format: false,
    }),
    punishment_wrongdoins_type: {
      id: Number(initialFormInputs["punishment_wrongdoins_type_id"]) || null,
      description:
        initialFormInputs["punishments_wrongdoings_description"] || "",
    },
    punishment_type: {
      id: Number(initialFormInputs["punishment_type_id"]) || null,
      description: initialFormInputs["punishments_type_description"] || "",
    },
    punishment_citation_cases: {
      id: Number(initialFormInputs["citations_id"]) || null,
      description: initialFormInputs["citations_description"] || "",
    },
  };

  const handleServerErrors = useServerErrors();
  const [addPunishments, { data, isLoading, isSuccess, isError, error }] =
    useAddPunishmentMutation();
  const [editApplause, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditPunishmentMutation();

  useEffect(() => {
    if (isError) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  }, [isError, data?.message, error, handleServerErrors]);

  const methods = useForm({
    resolver: zodResolver(PunishmentSchema),
    defaultValues,
  });

  const onAddHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "punishment_date");
    vals = formValuesFormatHandler(vals, "punishment_do_date");
    await addPunishments(vals).unwrap();
    methods.reset();
  };

  const onEditHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "punishment_date");
    vals = formValuesFormatHandler(vals, "punishment_do_date");
    values = {
      ...vals,
      id: initialFormInputs["id"],
    };
    // console.log(values);
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
            {isLoading ? "در حال ثبت تنبیهی ..." : ""}
            {isSuccess ? "با موفقیت ثبت شد" : ""}
            {isEditLoading ? "در حال ویرایش تنبیهی ..." : ""}
            {isEditSuccess ? "با موفقیت ویرایش شد" : ""}
            {!initialPunishmentData.id ? (
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
            <PunishmentSubject disableInputs={initialFormInputs?.id} />
          </Grid>
          <Grid item xs={6}>
            <PunishmentSpecifications initialFormInputs={initialFormInputs} />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
