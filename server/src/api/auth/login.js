const express = require("express");

const { validationResult } = require("express-validator");
const comparePasswords = require("../../utils/comparePasswords");
const { findUserByUsername } = require("../../services/user.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

router.post("/", async (req, res, next) => {
  // get user data
  const { username, password } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HandleError("خطا در ورودیهای کاربر", errors.array(), 400));
  }
  // check DB if user exists
  try {
    const [users, fields] = await findUserByUsername(username);
    const isValidPassword = await comparePasswords(
      password,
      users[0]["password"],
    );

    if (users.length <= 0 || !isValidPassword) {
      return next(
        new HandleError("نام کاربری یا رمز عبور صحیح نمی‌باشد!", [], 401),
      );
    } else {
      // Create a Session if not exists
      const user = {
        id: users[0]["id"],
        name: users[0]["name"],
        username,
        isAdmin: users[0]["is_admin"],
      };
      req.session.userdata = user;

      // Send response
      return handleSuccess(res, "ورود موفقیت‌آمیز بود!", user);
    }
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطای سرور هنگام ورود کاربر", [], 500));
  }
});

module.exports = router;
