const moment = require("jalali-moment");

function persianDate(date) {
  return String(moment(date, "YYYY-MM-DD").locale("fa").format("DD/MM/YYYY"));
}

module.exports = {
  persianDate,
};
