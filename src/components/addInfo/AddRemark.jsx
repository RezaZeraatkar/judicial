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
import useServerErrors from "../../utils/useServerErrors";
import Recommender from "../../forms/remarks/recommender";
import Commander from "../../forms/remarks/commander";
import RemarkSubject from "../../forms/remarks/remarkSubject";
import RemarkSpecifications from "../../forms/remarks/remarkSpecifications";
import dateHandler from "../../utils/dateHandler";

import {
  useAddRemarkMutation,
  useEditRemarkMutation,
} from "../../services/api/remarks/remarksSlice";
import formValuesFormatHandler from "../../utils/formValuesFormatHandler";

// API REQUESTS
const RemarkSchema = object({
  remark_recommender_pasdari_code: string().optional(),
  remark_recommender_parvande_code: string().optional(),
  remark_recommender_name: string().optional(),
  remark_recommender_surname: string().optional(),
  remark_recommender_fathername: string().optional(),
  remark_recommender_nationality_code: string().optional(),
  remark_recommender_ozviyat_type: string().optional(),
  remark_recommender_rank: string().optional(),
  remark_recommender_position: string().optional(),
  remark_recommender_unit: string().optional(),
  remark_recommender_responsibility: string().optional(),
  remark_commander_pasdari_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_ozviyat_type: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_position: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_commander_responsibility: string().optional(),
  remark_subject_pasdari_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_ozviat_type: number().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_parvande_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_name: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_surname: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_fathername: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_nationality_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_ozviat_code: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_rank: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_position: string().optional(),
  remark_subject_unit: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_subject_education: string().min(1, {
    message: "این فیلد الزامی است!",
  }),
  remark_description: string().optional(),
  remark_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  remark_do_date: date({
    invalid_type_error: "تاریخ نامعتبر",
    required_error: "این فیلد الزامی است!",
  }),
  remark_wrongdoins_type: object(
    {
      id: number(),
      description: string(),
    },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  remark_type: object(
    { id: number(), description: string() },
    {
      required_error: "این فیلد الزامی است!",
      invalid_type_error: "یک گزینه را انتخاب کنید!",
    },
  ),
  remark_citation_cases: object({
    id: number(),
    description: string(),
  }).optional(),
});

export default function AddRemarks({
  dialogTitle,
  handleClose,
  initialRemarkData,
}) {
  const handleServerErrors = useServerErrors();

  const initialFormInputs = initialRemarkData || {};

  const defaultValues = {
    remark_recommender_pasdari_code:
      initialFormInputs["remark_recommender_pasdari_code"] || "",
    remark_recommender_parvande_code:
      initialFormInputs["remark_recommender_parvande_code"] || "",
    remark_recommender_name: initialFormInputs["remark_recommender_name"] || "",
    remark_recommender_surname:
      initialFormInputs["remark_recommender_surname"] || "",
    remark_recommender_fathername:
      initialFormInputs["remark_recommender_fathername"] || "",
    remark_recommender_nationality_code:
      initialFormInputs["remark_recommender_nationality_code"] || "",
    remark_recommender_ozviyat_type:
      initialFormInputs["remark_recommender_ozviyat_type_title"] || "",
    remark_recommender_rank:
      initialFormInputs["remark_recommender_daraje_title"] || "",
    remark_recommender_position:
      initialFormInputs["remark_recommender_jaygah_title"] || "",
    remark_recommender_unit:
      initialFormInputs["remark_recommender_vahed_title"] || "",
    remark_recommender_responsibility:
      initialFormInputs["remark_recommender_responsibility"] || "",
    remark_commander_pasdari_code:
      initialFormInputs["remark_commander_pasdari_code"] || "",
    remark_commander_parvande_code:
      initialFormInputs["remark_commander_parvande_code"] || "",
    remark_commander_name: initialFormInputs["remark_commander_name"] || "",
    remark_commander_surname:
      initialFormInputs["remark_commander_surname"] || "",
    remark_commander_fathername:
      initialFormInputs["remark_commander_fathername"] || "",
    remark_commander_nationality_code:
      initialFormInputs["remark_commander_nationality_code"] || "",
    remark_commander_ozviyat_type:
      initialFormInputs["remark_commander_ozviyat_type_title"] || "",
    remark_commander_rank:
      initialFormInputs["remark_commander_daraje_title"] || "",
    remark_commander_position:
      initialFormInputs["remark_commander_jaygah_title"] || "",
    remark_commander_unit:
      initialFormInputs["remark_commander_vahed_title"] || "",
    remark_commander_responsibility:
      initialFormInputs["remark_commander_responsibility"] || "",
    remark_subject_ozviat_type:
      initialFormInputs["remark_subject_ozviat_type"] || "",
    remark_subject_pasdari_code:
      initialFormInputs["remark_subject_pasdari_code"] || "",
    remark_subject_parvande_code:
      initialFormInputs["remark_subject_parvande_code"] || "",
    remark_subject_name: initialFormInputs["remark_subject_name"] || "",
    remark_subject_surname: initialFormInputs["remark_subject_surname"] || "",
    remark_subject_fathername:
      initialFormInputs["remark_subject_fathername"] || "",
    remark_subject_nationality_code:
      initialFormInputs["remark_subject_nationality_code"] || "",
    remark_subject_ozviat_code:
      initialFormInputs["remark_subject_ozviat_type_title"] || "",
    remark_subject_rank: initialFormInputs["remark_subject_daraje_title"] || "",
    remark_subject_position:
      initialFormInputs["remark_subject_jaygah_title"] || "",
    remark_subject_unit: initialFormInputs["remark_subject_vahed_title"] || "",
    remark_subject_education:
      initialFormInputs["remark_subject_tahsili_title"] || "",
    remark_description: initialFormInputs["remark_description"] || "",
    remark_date: dateHandler(initialFormInputs["remark_date"], {
      format: false,
    }),
    remark_do_date: dateHandler(initialFormInputs["remark_do_date"], {
      format: false,
    }),
    remark_wrongdoins_type: {
      id: Number(initialFormInputs["remark_wrongdoins_type_id"]) || null,
      description: initialFormInputs["remark_wrongdoings_description"] || "",
    },
    remark_type: {
      id: Number(initialFormInputs["remark_type_id"]) || null,
      description: initialFormInputs["remark_type_title"] || "",
    },
    remark_citation_cases: {
      id: Number(initialFormInputs["remark_citation_cases_id"]) || null,
      description: "",
    },
  };

  const [addremarks, { data, isLoading, isSuccess, isError, error }] =
    useAddRemarkMutation();
  const [editApplause, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditRemarkMutation();

  useEffect(() => {
    if (isError) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  }, [isError, data?.message, error, handleServerErrors]);

  const methods = useForm({
    resolver: zodResolver(RemarkSchema),
    defaultValues,
  });

  const onAddHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "remark_date");
    vals = formValuesFormatHandler(vals, "remark_do_date");
    await addremarks(vals).unwrap();
    methods.reset();
  };

  const onEditHandler = async (values) => {
    let vals = formValuesFormatHandler(values, "remark_date");
    vals = formValuesFormatHandler(vals, "remark_do_date");
    values = {
      ...vals,
      id: initialFormInputs["remark_id"],
    };
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
            {isLoading ? "در حال ثبت تذکر ..." : ""}
            {isSuccess ? "با موفقیت ثبت شد" : ""}
            {isEditLoading ? "در حال ویرایش تذکر ..." : ""}
            {isEditSuccess ? "با موفقیت ویرایش شد" : ""}
            {!initialRemarkData.remark_id ? (
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
            <Recommender disabledInput={initialFormInputs?.remark_id} />
          </Grid>
          <Grid item xs={6}>
            <Commander disabledInput={initialFormInputs?.remark_id} />
          </Grid>
          <Grid item xs={6}>
            <RemarkSubject disabledInput={initialFormInputs?.remark_id} />
          </Grid>
          <Grid item xs={6}>
            <RemarkSpecifications
              disabledInput={initialFormInputs?.remark_id}
            />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
