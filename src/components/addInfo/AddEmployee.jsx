import React, { useEffect } from "react";
import { useWatch } from "react-hook-form";
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
import CircularProgress from "../circularLoaders/circularProgress";
import MilitaryInfo from "../../forms/employees/militaryInfo";
import PersonalInfo from "../../forms/employees/personalInfo";
import ComplementaryInfo from "../../forms/employees/complementaryInfo";
import formValuesFormatHandler from "../../utils/formValuesFormatHandler";
import useServerErrors from "../../utils/useServerErrors";

// API REQUESTS
import {
  useAddEmployeeMutation,
  useEditEmployeeMutation,
} from "../../services/api/employees/employeesSlice";
import { useEmployeeFormQuery } from "../../services/api/selectors/selectors";

export default function AddEmployee({ handleClose, methods }) {
  const handleServerErrors = useServerErrors();
  const { id } = useWatch();

  const {
    data: formSelectorsData,
    isLoading: isFormSelectorsLoading,
    isSuccess: isFormSelectorsSuccess,
    isError: isFormSelectorsError,
    error: FormSelectorsError,
  } = useEmployeeFormQuery();

  const [addEmployee, { isLoading, isSuccess }] = useAddEmployeeMutation();
  const [editEmployee, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditEmployeeMutation();

  useEffect(() => {
    if (isFormSelectorsError) {
      console.error(FormSelectorsError);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(isFormSelectorsError);
    }
  }, [FormSelectorsError, isFormSelectorsError, handleServerErrors]);

  const onAddHandler = async (values) => {
    // preprocess form values for db insertion
    let vals = formValuesFormatHandler(values, "birthdate");
    vals = formValuesFormatHandler(vals, "ezamdate");

    // console.log("vals: ", vals);
    try {
      await addEmployee(vals).unwrap();
      methods.reset();
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  };

  const onEditHandler = async (values) => {
    // preprocess form values for db insertion
    let vals = formValuesFormatHandler(values, "birthdate");
    vals = formValuesFormatHandler(vals, "ezamdate");
    try {
      await editEmployee(vals).unwrap();
    } catch (error) {
      console.error(error);
      // handle Errors [todo: must be extracted to its hook]
      handleServerErrors(error);
    }
  };

  if (isFormSelectorsLoading) {
    return <CircularProgress />;
  }

  if (isFormSelectorsSuccess) {
    return (
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
              اطلاعات پایوران
            </Typography>
            {isLoading ? "در حال ثبت پایور ..." : ""}
            {isSuccess ? "با موفقیت ثبت شد" : ""}
            {isEditLoading ? "در حال ویرایش پایور ..." : ""}
            {isEditSuccess ? "با موفقیت ویرایش شد" : ""}
            {!id ? (
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
        {isFormSelectorsSuccess ? (
          <Grid
            container
            spacing={2}
            sx={{
              p: 2,
            }}
          >
            <Grid item xs={6}>
              <PersonalInfo
                selectorsData={formSelectorsData["data"]}
                // formInputs={initialFormInputs}
                // isIneditMode={!!initialFormInputs.id}
              />
            </Grid>
            <Grid item xs={6}>
              <MilitaryInfo selectorsData={formSelectorsData["data"]} />
            </Grid>
            <Grid item xs={6}>
              <ComplementaryInfo selectorsData={formSelectorsData["data"]} />
            </Grid>
          </Grid>
        ) : null}
      </Box>
    );
  }
}
