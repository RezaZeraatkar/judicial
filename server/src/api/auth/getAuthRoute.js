const express = require("express");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const userIsAuthenticated = req.isAuthenticated;
  if (!userIsAuthenticated)
    return next(
      new HandleError(
        "نشست شما به پایان رسید. لطفا مجدد وارد شوید",
        [{ isAuthenticated: false }],
        401,
      ),
    );
  // Send response
  return handleSuccess(res, "ورود موفقیت‌آمیز بود!", req.user);
});

module.exports = router;
