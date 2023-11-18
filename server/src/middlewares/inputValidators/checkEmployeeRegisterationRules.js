// checking password confirmation rules
const { check } = require("express-validator");
module.exports = function chechEmployeeRegisterationRules() {
  return [
    check("pasdari_code")
      .isString()
      .trim()
      .isLength({ min: 3 })
      .withMessage("نام باید حداقل از سه حرف تشکیل شده باشد!"),
    check("parvande_code")
      .isString()
      .withMessage("نام کاربری نمیتواند عدد باشد!")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("نام کاربری باید حداقل از سه حرف تشکیل شده باشد!")
      .isAlphanumeric()
      .withMessage("نام کاربری فقط باید شامل حروف و اعداد باشد!"),
    check("nationality_code")
      .isLength({ min: 6 })
      .withMessage("پسورد باید حداقل شامل شش کاراکتر باشد"),
    check("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "لطفا از تطابق پسوردهای موردنظر خود اطمینان حاصل فرمایید!",
        );
      }
      return true;
    }),
  ];
};
