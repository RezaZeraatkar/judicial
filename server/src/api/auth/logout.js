const express = require("express");

// const { validationResult } = require("express-validator");
// const checkPassword = require("../../utils/checkPassword");
// const { findUserByUsername } = require("../../services/user.service");
const handleSuccess = require("../../utils/handleSuccess");
// const HandleError = require("../../utils/handleError");

const router = express.Router();

router.post("/", (req, res, next) => {
  req.session.destroy();
  return handleSuccess(res, "شما با موفقیت از برنامه خارج شدید!", [], 200);
});

module.exports = router;
