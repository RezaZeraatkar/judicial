class HandleError extends Error {
  /**
   * @vars message , data[], statusCode default 500, error default null
   */
  constructor(message, data = [], statusCode = 500, error = null) {
    let messageText = message;
    if (error?.errno === 1451) {
      messageText = "امکان حذف رکورد به دلیل مرجعیت این رکورد میسر نیست!";
    }
    if (error?.code === "ER_DUP_ENTRY" || error?.sqlMessage.includes("code")) {
      messageText = "کد تکراری است!";
    }
    super(message || messageText || "خطا در اجرای دستورات پایگاه داده");
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = HandleError;
