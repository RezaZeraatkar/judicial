import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
// Custom Components
import ReportTable from "../components/table/reportTable";
import CustomSearchTextField from "../components/formInputs/customSearchTextField";
import useServerErrors from "../utils/useServerErrors";

import armImg from "../assets/images/arm.png";
import { useGetPersonalReportMutation } from "../services/api/reports/reportsSlice";

const Img = styled("img")({
  display: "block",
  maxWidth: "90%",
  maxHeight: "90%",
});

const Bold = styled(Typography)({
  fontWeight: "bold",
});

const TableCaption = styled(Bold)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  width: "100%",
  textAlign: "center",
  padding: 4,
  border: "1px solid black",
  borderBottom: "0px",
}));

const StyledPaper = styled(Paper)({
  border: "1px solid black",
  borderRadius: "5px",
  padding: "7px",
});

const Item = styled("span")(({ theme, textAlign }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: textAlign,
  // color: theme.palette.text.secondary,
}));

const StyledGridContainer = styled(Grid)({
  border: "1px solid black",
  borderRadius: "5px",
  padding: "7px",
  margin: "5px",
});

const applauserColumns = [
  { field: "row", headerName: "ردیف" },
  { field: "type", headerName: "نوع تشویق" },
  { field: "title", headerName: "نوع خدمت برجسته" },
  { field: "doDate", headerName: "تاریخ تشویق" },
  { field: "commander", headerName: "مقام تشویق‌کننده" },
  { field: "commander_responsibility", headerName: "مسئولیت مقام تشویق‌کننده" },
  { field: "amount", headerName: "مقدار تشویق" },
];

const punishmentsColumns = [
  { field: "row", headerName: "ردیف" },
  { field: "type", headerName: "نوع تنبیه" },
  { field: "doDate", headerName: "تاریخ تنبیه" },
  { field: "title", headerName: "تخلف ارتکابی" },
  { field: "ertekabDoDate", headerName: "تاریخ ارتکاب تخلف" },
  { field: "commander", headerName: "مقام تنبیه‌کننده" },
  { field: "commander_responsibility", headerName: "مسئولیت مقام تنبیه‌کننده" },
  { field: "amount", headerName: "مقدار تنبیه" },
  { field: "description", headerName: "شرح دلایل" },
];

const crimesColumns = [
  { field: "row", headerName: "ردیف" },
  { field: "type", headerName: "نوع جرم" },
  { field: "occureDate", headerName: "تاریخ وقوع جرم" },
  { field: "title", headerName: "مرجع قضایی رسیدگی‌کننده" },
  { field: "notifyDate", headerName: "تاریخ اعلام به مرجع قضایی" },
  { field: "hokmDate", headerName: "تاریخ حکم" },
  { field: "hokm", headerName: "حکم صادره" },
  { field: "amount", headerName: "مقدار مجازات" },
];

const remarksColumns = [
  { field: "row", headerName: "ردیف" },
  { field: "type", headerName: "نوع تذکر" },
  { field: "doDate", headerName: "تاریخ تذکر" },
  { field: "title", headerName: "تخلف ارتکابی" },
  { field: "remarkDoDate", headerName: "تاریخ ارتکاب تخلف" },
  { field: "commander", headerName: "مقام متذکر" },
  { field: "commander_responsibility", headerName: "مسئولیت مقام متذکر" },
];

const PersonalReportSchema = object({
  search: string({
    required_error: "این فیلد الزامی است!",
    invalid_type_error: "Name must be a string",
  })
    .min(1, {
      message: "این فیلد الزامی است!",
    })
    .refine((val) => /^[0-9]*$/.test(val), {
      message: "ورودی نامعتبر! فقط عدد بدون فاصله مجاز است!",
    }),
});

export default function PersonalReport() {
  const navigate = useNavigate();
  const handleServerErrors = useServerErrors();
  const methods = useForm({
    resolver: zodResolver(PersonalReportSchema),
    // defaultValues,
  });

  const [getPersonalReport, { data, isSuccess, isLoading, isFetching }] =
    useGetPersonalReportMutation();

  const handlePageChange = (newPage) => {
    // console.log("Page changed:", newPage);
    // Perform additional actions on page change if needed
  };

  const handleDisplayReport = async ({ search }) => {
    try {
      await getPersonalReport({
        personnel: search,
      }).unwrap();
    } catch (error) {
      handleServerErrors(error);
    }
  };

  const submitReportHandler = async ({ search }) => {
    // const app = await printApplause(id).unwrap();
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}/api/reports/print-personal-report/${search}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        navigate("/login");
      } else if (res.status === 400) {
        // dispatch(deleteRecommender());
        return toast.error("درخواست نامعتبر", { position: "top-right" });
      } else if (res.status === 500) {
        // dispatch(deleteRecommender());
        return toast.error("خطای سرور", { position: "top-right" });
      } else {
        return toast.error("خطا نامشخص", { position: "top-right" });
      }
    } else {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${data?.data?.personnelData?.fullname || "گزارش فردی"}.docx`,
      );
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <Paper
          sx={{
            marginBottom: 1,
            padding: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomSearchTextField
            name="search"
            label="جستجو براساس کدملی"
            handleSubmit={methods.handleSubmit(handleDisplayReport)}
            isLoading={isLoading}
            isFetching={isFetching}
          />
          <Button
            variant="contained"
            endIcon={<DownloadIcon />}
            onClick={methods.handleSubmit(submitReportHandler)}
          >
            دریافت گزارش
          </Button>
          {/* <DownloadBtn
            label="دریافت کزارش"
            onClickHandler={methods.handleSubmit(submitReportHandler)}
          /> */}
        </Paper>
      </FormProvider>
      <StyledPaper
        sx={{
          p: 2,
          margin: "auto",
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <StyledGridContainer container>
          <Grid item xs={2} textAlign="left">
            <Item>
              <Img src={armImg} />
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item textAlign="center">
              <Stack spacing={2}>
                <Bold>بسمه تعالی</Bold>
                <Typography gutterBottom>تیپ زرهی 21 امام رضا (ع)</Typography>
                <Bold gutterBottom>استعلام پرونده قضایی</Bold>
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={2}>
            <Item textAlign="left">
              <Stack spacing={2}>
                <Typography>
                  شماره: {isSuccess ? data?.data?.personnelData?.code : ""}
                </Typography>
                <Typography>
                  تاریخ: {isSuccess ? data?.data?.personnelData?.date_now : ""}
                </Typography>
                <Typography gutterBottom>پیوست: </Typography>
                <Bold>
                  طبقه‌بندی:{" "}
                  <Box
                    component="span"
                    sx={{ border: "1px solid black", padding: 1 }}
                  >
                    خیلی محرمانه
                  </Box>
                </Bold>
              </Stack>
            </Item>
          </Grid>
        </StyledGridContainer>
        <StyledGridContainer container>
          <Grid item xs={3}>
            <Bold gutterBottom>
              نام و نام خانوادگی:{" "}
              {isSuccess ? data?.data?.personnelData?.fullname : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              شناسه پاسداری:{" "}
              {isSuccess ? data?.data?.personnelData?.pasdari_code : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              کد ملی: {isSuccess ? data?.data?.personnelData?.nationalcode : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              نام پدر: {isSuccess ? data?.data?.personnelData?.fathername : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              تاریخ تولد:{" "}
              {isSuccess ? data?.data?.personnelData?.birthdate_p : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              مسئولیت: {isSuccess ? data?.data?.personnelData?.masoliat : ""}
            </Bold>
          </Grid>
          <Grid item xs={3}>
            <Bold gutterBottom>
              رده خدمتی:{" "}
              {isSuccess ? data?.data?.personnelData?.vahed_title : ""}
            </Bold>
          </Grid>
        </StyledGridContainer>
        <StyledGridContainer container>
          <TableCaption>خدمات برجسته و تشویقات</TableCaption>
          <ReportTable
            columns={applauserColumns}
            rows={data?.data?.applauses}
            rowsPerPage={5}
            onPageChange={handlePageChange}
          />
        </StyledGridContainer>
        <StyledGridContainer container>
          <TableCaption>تخلفات و تنبیهات</TableCaption>
          <ReportTable
            columns={punishmentsColumns}
            rows={data?.data?.punsihments}
            rowsPerPage={5}
            onPageChange={handlePageChange}
          />
        </StyledGridContainer>
        <StyledGridContainer container>
          <TableCaption>جرائم و مجازات</TableCaption>
          <ReportTable
            columns={crimesColumns}
            rows={data?.data?.crimes}
            rowsPerPage={5}
            onPageChange={handlePageChange}
          />
        </StyledGridContainer>
        <StyledGridContainer container>
          <TableCaption>تذکرات</TableCaption>
          <ReportTable
            columns={remarksColumns}
            rows={data?.data?.remarks}
            rowsPerPage={5}
            onPageChange={handlePageChange}
          />
        </StyledGridContainer>
      </StyledPaper>
    </>
  );
}
