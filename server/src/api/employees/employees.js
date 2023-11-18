const express = require("express");
const httpStatus = require("http-status");
const {
  findEmployeeByCode,
  findEmployees,
  updateEmployeeMasoliat,
  updateEmployee,
  saveEmployee,
  findEmployeePasdariCode,
  findEmployeeParvandeCode,
  findEmployeeByNationalityCode,
} = require("../../services/employees.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

router.get("/employees", async (req, res, next) => {
  // get employees records
  try {
    const [employees, fields] = await findEmployees();
    return handleSuccess(
      res,
      "لیست کارمندان با موفقیت پیدا شد",
      employees,
      httpStatus.OK,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.put("/employee", async (req, res, next) => {
  // get employee data
  /**
   * eType: employee type => s for soldiers and p for pasdar employees
   * code: it can be nationality code or pasdari code or paravande code (in case of etype = s)
   *
   */
  const { id, masoliat } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  // check DB if user exists
  if (!id || !masoliat) {
    return next(
      new HandleError(
        "خطا در اطلاعات ارسالی کارمند!",
        [],
        httpStatus.BAD_REQUEST,
      ),
    );
  }
  try {
    const [employee, fields] = await updateEmployeeMasoliat(req.body);
    return handleSuccess(res, "کارمند با موفقیت ویرایش شد", employee, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.post("/employee", async (req, res, next) => {
  // get employee data
  /**
   * eType: employee type => s for soldiers and p for pasdar employees
   * code: it can be nationality code or pasdari code or paravande code (in case of etype = s)
   *
   */
  const { code } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  // check DB if user exists
  if (!code) {
    return next(
      new HandleError(
        "ورود کدملی یا شناسه پاسداری و یا قسمتی از فامیل فرد الزامی است!",
        [],
        httpStatus.BAD_REQUEST,
      ),
    );
  }
  try {
    const [employee, fields] = await findEmployeeByCode(code);
    if (employee.length === 0) {
      return next(
        new HandleError(
          "کارمند با این مشخصات یافت نشد! لطفا از صحت اطلاعات ورودی اطمینان حاصل فرمایید.",
          [],
          httpStatus.BAD_REQUEST,
        ),
      );
    }
    return handleSuccess(res, "کاربر با موفقیت پیدا شد", employee, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.post("/add-employee", async (req, res, next) => {
  try {
    const [employee, fields] = await saveEmployee(req.body);
    return handleSuccess(res, "با موفقیت ذخیره شد", employee, 200);
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return next(
        new HandleError(
          "عملیات ناموفق، پایور با این مشخصات قبلا ثبت شده است!",
          [],
          httpStatus.BAD_REQUEST,
        ),
      );
    }
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.put("/edit-employee", async (req, res, next) => {
  try {
    const [employee, fields] = await updateEmployee(req.body);
    return handleSuccess(res, "با موفقیت ذخیره شد", employee, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get(
  "/check-employee-pasdaricode/:pasdari_code",
  async (req, res, next) => {
    const { pasdari_code } = req.params;
    // check whether pasdari code exists or not
    try {
      const [empPasdariCode, fields] = await findEmployeePasdariCode(
        pasdari_code,
      );
      if (empPasdariCode.length > 0) {
        return next(
          new HandleError(
            `کارمند با کد پاسداری ${pasdari_code} قبلا ثبت شده است!`,
            [],
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      return handleSuccess(res, "", empPasdariCode, httpStatus.OK);
    } catch (error) {
      console.error(error);
      return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
    }
  },
);

router.get(
  "/check-employee-parvandecode/:parvande_code",
  async (req, res, next) => {
    const { parvande_code } = req.params;
    // check whether pasdari code exists or not
    try {
      const [empParvandeCode, fields] = await findEmployeeParvandeCode(
        parvande_code,
      );
      if (empParvandeCode.length > 0) {
        return next(
          new HandleError(
            `کارمند با کد پرونده ${parvande_code} قبلا ثبت شده است!`,
            [],
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      return handleSuccess(res, "", empParvandeCode, httpStatus.OK);
    } catch (error) {
      console.error(error);
      return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
    }
  },
);

router.get(
  "/check-employee-nationalitycode/:nationality_code",
  async (req, res, next) => {
    const { nationality_code } = req.params;
    // check whether pasdari code exists or not
    try {
      const [empNationalityCode, fields] = await findEmployeeByNationalityCode(
        nationality_code,
      );
      if (empNationalityCode.length > 0) {
        return next(
          new HandleError(
            `کارمند با کد ملی ${nationality_code} قبلا ثبت شده است!`,
            [],
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      return handleSuccess(res, "", empNationalityCode, httpStatus.OK);
    } catch (error) {
      console.error(error);
      return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
    }
  },
);

module.exports = router;
