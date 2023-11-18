const express = require("express");
const { validationResult } = require("express-validator");
const {
  findUserByUsername,
  updateUserByUsername,
} = require("../../services/user.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const httpStatus = require("http-status");
const comparePasswords = require("../../utils/comparePasswords");

const router = express.Router();

router.patch("/", async (req, res, next) => {
  // get user data
  const {
    name,
    username,
    new_username,
    password,
    new_password,
    confirm_password,
  } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HandleError("خطا در ورودیهای کاربر", errors.array(), 400));
  }

  try {
    // check if the user is logged in
    if (!req.session.userdata.username) {
      return next(
        new HandleError(
          "برای ویرایش حساب کاربری ابتدا وارد سایت شوید!",
          [],
          httpStatus.BAD_REQUEST,
        ),
      );
    }
    // check if user exists
    const [users, fields] = await findUserByUsername(username);
    if (users.length === 0) {
      return next(
        new HandleError(
          "کاربری با این نام کاربری وجود ندارد!",
          [],
          httpStatus.NOT_FOUND,
        ),
      );
    }
    // Check if the provided password matches the old password in the database
    const user = users[0];
    if (!user || !(await comparePasswords(password, user.password))) {
      return next(
        new HandleError("رمز ورود نامتعبر!", [], httpStatus.BAD_REQUEST),
      );
    }

    // Check if new_password and confirm_password are identical
    if (new_password !== confirm_password) {
      return next(
        new HandleError("عدم تطابق پسوردهای جدید!", [], httpStatus.BAD_REQUEST),
      );
    }
    // update user in DB
    const [result] = await updateUserByUsername(username, {
      name,
      new_username,
      new_password,
    });

    // Check the number of affected rows to determine if the update was successful
    if (result.affectedRows === 0) {
      return next(
        new HandleError(
          "به روزرسانی کاربر با خطا مواجه شد!",
          [],
          httpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }

    // Update the session
    const updatedUser = {
      name: name || users[0].name,
      username: users[0].username,
      isAdmin: users[0].isAdmin,
    };
    req.session.userdata = updatedUser;

    // Send response
    return handleSuccess(
      res,
      "حساب کاربری با موفقیت به‌روزرسانی شد!",
      updatedUser,
    );
  } catch (error) {
    console.error(error);
    return next(
      new HandleError(
        "خطای سرور هنگام به‌روزرسانی اطلاعات کاربر",
        [],
        httpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});

module.exports = router;
