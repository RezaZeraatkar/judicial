import React, { useEffect } from "react";
// import { createSelector } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useForm, FormProvider } from "react-hook-form";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import TextField from "../components/formInputs/customTextField";
import { toast, ToastContainer } from "react-toastify";

// apis
// import { useAuth } from "../hooks/useAuth";
import WithAuth from "../hocs/withAuth";
import { useLoginMutation } from "../services/api/auth/loginSlice";

// actions
// ? Login Schema with Zod
const loginSchema = object({
  username: string().min(3, "نام کاربری باید حداقل از سه حرف تشکیل شده باشد!"),
  password: string().min(6, "پسورد باید حداقل شامل 6 کاراکتر باشد"),
});

const Login = () => {
  const navigate = useNavigate();
  // ? Default Values
  const defaultValues = {
    username: "",
    password: "",
  };
  // Hooks
  // ? The object returned from useForm Hook
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const [loginHandler, { isLoading }] = useLoginMutation();

  const username = methods.watch("username");
  useEffect(() => {
    methods.setValue("username", username.replace(/[^A-Za-z0-9]/gi, ""));
  }, [username, methods]);

  // ? Submit Handler
  const onSubmitHandler = async (values) => {
    try {
      await loginHandler(values).unwrap();
      navigate("/");
    } catch (error) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        backgroundColor: { xs: "#f4f4f4" },
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid
          item
          sx={{
            marginTop: "30px",
            marginBottom: "30px",
            maxWidth: "25rem",
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <FormProvider {...methods}>
            <Paper>
              <Grid
                container
                sx={{
                  paddingTop: "30px",
                  paddingBottom: "30px",
                }}
              >
                <Grid
                  item
                  container
                  justifyContent="space-between"
                  rowSpacing={2}
                  sx={{
                    maxWidth: { sm: "22rem" },
                    marginInline: "auto",
                  }}
                >
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      component="form"
                      noValidate
                      autoComplete="off"
                      sx={{ padding: { sm: "0 2rem" } }}
                      onSubmit={methods.handleSubmit(onSubmitHandler)}
                    >
                      <Typography
                        variant="h6"
                        component="h1"
                        sx={{ textAlign: "center", mb: "1rem" }}
                      >
                        خوش آمدید!
                        <Divider sx={{ m: "10px 0px" }}></Divider>
                      </Typography>
                      <TextField
                        variant="outlined"
                        sx={{ mb: "1rem" }}
                        size="small"
                        label="نام کاربری خود را وارد نمایید"
                        type="text"
                        name="username"
                        required
                      />
                      <TextField
                        variant="outlined"
                        sx={{ mb: "1rem" }}
                        size="small"
                        type="password"
                        label="رمز ورود خودرا وارد نمایید"
                        name="password"
                        required
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          py: "0.8rem",
                          width: "80%",
                          marginInline: "auto",
                        }}
                      >
                        {isLoading ? "...در حال ورود" : "ورود"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                {/* <Grid container justifyContent="center">
                  <Stack sx={{ mt: "1rem", textAlign: "center" }}>
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      حساب کاربری ندارید?{" "}
                      <Link href="/register">
                        از اینجا یک حساب کاربری بسازید!
                      </Link>
                    </Typography>
                  </Stack>
                </Grid> */}
              </Grid>
            </Paper>
          </FormProvider>
          <ToastContainer />
        </Grid>
      </Grid>
    </Container>
  );
};

export default WithAuth(Login);
