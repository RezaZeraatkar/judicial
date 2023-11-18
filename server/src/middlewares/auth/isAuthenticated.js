require("dotenv").config();
const HandleError = require("../../utils/handleError");

function isAuthenticated(req, res, next) {
  const user = req.session.userdata;
  console.log(user);
  if (!user) {
    req.isAuthenticated = false;
    return next(
      new HandleError(
        "نشست شما به پایان رسید. لطفا مجدد ورود نمایید",
        [{ isAuthenticated: false }],
        401,
      ),
    );
  } else {
    req.isAuthenticated = true;
    req.user = user;
    next();
  }
}
module.exports = isAuthenticated;
