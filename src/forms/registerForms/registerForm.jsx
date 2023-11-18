import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useForm, FormProvider } from "react-hook-form";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import TextField from "../../components/formInputs/customTextField";
import { useRegisterMutation } from "../../services/api/auth/registerSlice";
// ? Login Schema with Zod
const signUpSchema = object({
  name: string().min(3, "نام انتخابی باید حداقل از سه حرف تشکیل شده باشد!"),
  username: string().min(3, "نام کاربری باید حداقل از سه حرف تشکیل شده باشد!"),
  password: string().min(6, "پسورد باید حداقل شامل 6 کاراکتر باشد"),
  confirm_password: string().min(
    6,
    "پسورد تایید باید حداقل شامل 6 کاراکتر باشد",
  ),
}).refine((data) => data.password === data.confirm_password, {
  path: ["confirm_password"],
  message: "عدم تطابق پسوردها",
});

export default function RegisterForm() {
  // ? Default Values
  const defaultValues = {
    name: "",
    username: "",
    password: "",
    confirm_password: "",
  };
  // ? The object returned from useForm Hook
  const methods = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const [registerHandler, { isLoading }] = useRegisterMutation();

  const username = methods.watch("username");
  useEffect(() => {
    methods.setValue("username", username.replace(/[^A-Za-z0-9]/gi, ""));
  }, [username, methods]);

  // ? Submit Handler
  const onSubmitHandler = async (values) => {
    try {
      const user = await registerHandler(values).unwrap();
      toast.success(user.message, { position: "top-right" });
    } catch (error) {
      console.error(error);
      toast.error(error.data.message, { position: "top-right" });
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
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ textAlign: "center", mb: "1rem" }}
        >
          ایجاد حساب کاربری جدید
          <Divider sx={{ m: "10px 0px" }}></Divider>
        </Typography>
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          label="نام خود را وارد نمایید"
          type="text"
          name="name"
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          label="یک نام کاربری برای خود انتخاب کنید"
          type="text"
          name="username"
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          type="password"
          label="یک رمز ورود برای خود انتخاب نمایید"
          name="password"
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          type="password"
          label="رمز ورود خود را مجدد وارد نمایید"
          name="confirm_password"
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
          {isLoading ? "...در حال ورود" : "ثبت نام"}
        </Button>
      </Box>
    </FormProvider>
  );
}
