const axios = require("axios");
const HandleError = require("./handleError");

// const urlValidation = require("url-validation");

module.exports = async function (url, next) {
  // if (!urlValidation(url)) {
  //   throw new Error("Invalid URL format.");
  // }

  const timeoutMs = 5000;

  console.log(url);

  try {
    const response = await axios.get(url, {
      timeout: timeoutMs,
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 500) {
      // Request was made, but the server responded with a non-2xx status code
      return next(
        new HandleError(
          "Request failed with status code " + error.response.status,
          [],
          500,
        ),
      );
    } else {
      return next(
        new HandleError(
          "Failed to make the HTTP request to Garrison Api.",
          [],
          500,
        ),
      );
    }
  }
};
