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
import { useRegisterUpdateMutation } from "../../services/api/auth/registerSlice";
import useServerErrors from "../../utils/useServerErrors";
import { useUserContext } from "../../hocs/UserProvider";
// Login Schema with Zod
const signUpSchema = object({
  name: string().min(3, "نام انتخابی باید حداقل از سه حرف تشکیل شده باشد!"),
  username: string().min(3, "نام کاربری باید حداقل از سه حرف تشکیل شده باشد!"),
  new_username: string().min(
    3,
    "نام کاربری باید حداقل از سه حرف تشکیل شده باشد!",
  ),
  password: string().min(6, "پسورد باید حداقل شامل 6 کاراکتر باشد"),
  new_password: string().min(6, "پسورد باید حداقل شامل 6 کاراکتر باشد"),
  confirm_password: string().min(
    6,
    "پسورد تایید باید حداقل شامل 6 کاراکتر باشد",
  ),
}).refine((data) => data.new_password === data.confirm_password, {
  path: ["confirm_password"],
  message: "عدم تطابق پسوردها",
});

export default function RegisterEditForm() {
  const handleServerErrors = useServerErrors();
  const { user } = useUserContext();
  // ? Default Values
  const defaultValues = {
    name: user?.name || "",
    username: user?.username || "",
    new_username: user?.username || "",
    password: "",
    new_password: "",
    confirm_password: "",
  };
  // ? The object returned from useForm Hook
  const methods = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const [registerUpdateHandler, { isLoading }] = useRegisterUpdateMutation();

  const username = methods.watch("username");
  const new_username = methods.watch("new_username");
  useEffect(() => {
    methods.setValue("username", username.replace(/[^A-Za-z0-9]/gi, ""));
    methods.setValue(
      "new_username",
      new_username.replace(/[^A-Za-z0-9]/gi, ""),
    );
  }, [username, new_username, methods]);

  // ? Submit Handler
  const onSubmitHandler = async (values) => {
    try {
      const user = await registerUpdateHandler(values).unwrap();
      toast.success(user.message, { position: "top-right" });
    } catch (error) {
      console.error(error);
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
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ textAlign: "center", mb: "1rem" }}
        >
          ویرایش حساب کاربری
          <Divider sx={{ m: "10px 0px" }}></Divider>
        </Typography>
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          label="نام"
          type="text"
          name="name"
          value={""}
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          label="نام کاربری فعلی"
          type="text"
          name="username"
          value={""}
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          label="نام کاربری جدید"
          type="text"
          name="new_username"
          value={""}
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          type="password"
          label="رمز ورود فعلی"
          name="password"
          value={""}
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          type="password"
          label="رمز ورود جدید"
          name="new_password"
          value={""}
          required
        />
        <TextField
          variant="outlined"
          sx={{ mb: "1rem" }}
          size="small"
          type="password"
          label="تکرار رمز جدید"
          name="confirm_password"
          value={""}
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
          {isLoading ? "...در حال ویرایش" : "ویرایش "}
        </Button>
      </Box>
    </FormProvider>
  );
}
