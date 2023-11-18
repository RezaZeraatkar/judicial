const express = require("express");
const { validationResult } = require("express-validator");
const {
  findUserByUsername,
  createUser,
} = require("../../services/user.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const httpStatus = require("http-status");
const comparePasswords = require("../../utils/comparePasswords");

const router = express.Router();

router.post("/", async (req, res, next) => {
  // get user data
  const { name, username } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HandleError("خطا در ورودیهای کاربر", errors.array(), 400));
  }

  try {
    // check DB if user exists
    const [users, fields] = await findUserByUsername(username);
    if (users.length > 0) {
      return next(
        new HandleError(
          "نام کاربری تکراری می‌باشد!",
          [],
          httpStatus.BAD_REQUEST,
        ),
      );
    }
    // save user to DB
    const [row] = await createUser(req.body);

    if (row.affectedRows === 0) {
      return next(
        new HandleError(
          "خطا در ایجاد حساب کاربری جدید!",
          [],
          httpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }

    // Create a Session
    const user = {
      name: name,
      username,
      isAdmin: 0,
    };

    req.session.userdata = user;
    // Send response
    return handleSuccess(res, "ثبت نام کاربر موفقیت‌آمیز بود!", user);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطای سرور هنگام ثبت کاربر", [], 500));
  }
});

module.exports = router;
