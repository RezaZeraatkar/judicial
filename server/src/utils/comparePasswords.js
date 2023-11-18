const bcrypt = require("bcrypt");

module.exports = async (userPass, hashedPass) => {
  return await bcrypt.compare(userPass, hashedPass);
};
