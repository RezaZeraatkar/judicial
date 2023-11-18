const express = require("express");

const { findAllUsers, updateUser } = require("../../services/user.service");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

router.get("/users", async (req, res, next) => {
  // check DB if user exists
  try {
    const [users, field] = await findAllUsers();
    // Send response
    return handleSuccess(res, "", users, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطای سرور", [], 500));
  }
});

router.post("/user", async (req, res, next) => {
  // check DB if user exists
  const user = req.body;

  try {
    const [users, field] = await updateUser(user);
    // Send response
    return handleSuccess(res, "", users, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطای سرور", [], 500));
  }
});

module.exports = router;
