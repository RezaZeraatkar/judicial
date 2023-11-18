// checking password confirmation rules
const { check } = require("express-validator");
module.exports = function checkLoginRules() {
  return [
    check("username")
      .notEmpty()
      .withMessage("نام کاربری نباید خالی باشد!")
      .isString()
      .withMessage("نام کاربری نمیتواند عدد باشد!")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("نام کاربری باید حداقل از سه حرف تشکیل شده باشد!")
      .isAlphanumeric()
      .withMessage("نام کاربری فقط باید شامل حروف و اعداد باشد!"),
    check("password")
      .notEmpty()
      .withMessage("پسورد تایید نباید خالی باشد!")
      .isLength({ min: 6 })
      .withMessage("پسورد باید حداقل شش کاراکتر باشد"),
  ];
};
