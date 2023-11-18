const express = require("express");
const httpStatus = require("http-status");
const {
  findJensiat,
  findJaygah,
  findDaraje,
  findMarig,
  findOzviat,
  findTahsilat,
  findVahed,
  findVazjesmani,
  findVazRavani,
  findVkhedmat,
  findRaste,
  findEmployeeFormInputs,
} = require("../../services/selectors.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

router.get("/jensiat", async (req, res, next) => {
  // get employees records
  try {
    const [jensiat, fields] = await findJensiat();
    return handleSuccess(res, "", jensiat, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/jaygah", async (req, res, next) => {
  // get employees records
  try {
    const [jaygah, fields] = await findJaygah();
    return handleSuccess(res, "", jaygah, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/marig", async (req, res, next) => {
  // get employees records
  try {
    const [marig, fields] = await findMarig();
    return handleSuccess(res, "", marig, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/ozviat", async (req, res, next) => {
  // get employees records
  try {
    const [ozviat, fields] = await findOzviat();
    return handleSuccess(res, "", ozviat, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/rank", async (req, res, next) => {
  // get employees records
  try {
    const [rank, fields] = await findDaraje();
    return handleSuccess(res, "", rank, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/raste", async (req, res, next) => {
  // get employees records
  try {
    const [raste, fields] = await findRaste();
    return handleSuccess(res, "", raste, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/ravani", async (req, res, next) => {
  // get employees records
  try {
    const [ravani, fields] = await findVazRavani();
    return handleSuccess(res, "", ravani, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/jesmani", async (req, res, next) => {
  // get employees records
  try {
    const [jesmani, fields] = await findVazjesmani();
    return handleSuccess(res, "", jesmani, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/vahed", async (req, res, next) => {
  // get employees records
  try {
    const [vahed, fields] = await findVahed();
    return handleSuccess(res, "", vahed, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/tahsilat", async (req, res, next) => {
  // get employees records
  try {
    const [tahsilat, fields] = await findTahsilat();
    return handleSuccess(res, "", tahsilat, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/vaziat-khedmat", async (req, res, next) => {
  // get employees records
  try {
    const [vaziat, fields] = await findVkhedmat();
    return handleSuccess(res, "", vaziat, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/employee-form", async (req, res, next) => {
  // get employees records
  try {
    const employeeForm = await findEmployeeFormInputs();
    return handleSuccess(res, "", employeeForm, httpStatus.OK);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

module.exports = router;
