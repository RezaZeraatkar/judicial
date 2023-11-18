const handleSuccess = (res, message = "", data = [], statusCode = 200) => {
  res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: data,
  });
};

module.exports = handleSuccess;
