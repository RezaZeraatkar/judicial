require("dotenv").config();
const express = require("express");
const moment = require("moment-timezone");
const winston = require("winston");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const pool = require("./src/services/database/db");
const path = require("path");
const multer = require("multer");

// **** import routes
const registerRoute = require("./src/api/auth/register");
const registerEditRoute = require("./src/api/auth/edit-register");
const loginRoute = require("./src/api/auth/login");
const logoutRoute = require("./src/api/auth/logout");
const getAuthRoute = require("./src/api/auth/getAuthRoute");
const getUsers = require("./src/api/auth/users");
// const homeRoute = require("./src/api/pages/home");
const employees = require("./src/api/employees/employees");
const applauses = require("./src/api/applauses/applauses");
const punishments = require("./src/api/punishments/punishments");
const crimes = require("./src/api/crimes/crimes");
const remarks = require("./src/api/remarks/remarks");
const selectors = require("./src/api/selectors/selectors");
const reports = require("./src/api/reports/reports");
// **** import middlewares
const checkRegistrationRules = require("./src/middlewares/inputValidators/checkRegisterationRules");
const checkEditRegisterationRules = require("./src/middlewares/inputValidators/checkEditRegisterationRules");
const checkLoginRules = require("./src/middlewares/inputValidators/checkLoginRules");
// const checkEmployeeRegisterationRules = require("./src/middlewares/inputValidators/checkEmployeeRegisterationRules");
const isAuthenticated = require("./src/middlewares/auth/isAuthenticated");
// const injectGarrisonBaseUrl = require("./src/middlewares/vars/injectGarrisonBaseUrl");
const uploadExcelFile = require("./src/api/upload/uploadExcelFile");
// const setAccessRoutes = require("./src/middlewares/auth/setAccessRoutes");
const port = 8081;

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path.join(__dirname)}/src/public/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, "excel.xlsx");
  },
});
const uploadFile = multer({ storage: storage });

// Set the default time zone to Tehran
moment.tz.setDefault("Asia/Tehran");

//**** Instatiate Express Server ****
const app = express();
//**** Express Middlewares *****
app.use(
  cors({
    origin: "https://reactjsystem.iran.liara.run",
    credentials: true,
  }),
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
app.set("trust proxy", 1);
const hr = 1000 * 60 * 60; // one hour unit
const sessionExpTime = parseInt(12 * hr);
const sessionOptions = {
  connectionLimit: 10,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DB_NAME,
  host: process.env.HOST,
  port: process.env.DB_PORT,
  createDatabaseTable: true,
  clearExpired: true,
  expiration: sessionExpTime,
  // schema: {
  //   tableName: "sessions",
  //   columnNames: {
  //     session_id: "session_id",
  //     expires: "expires",
  //     data: "data",
  //   },
  // },
};
const sessionStore = new mysqlStore(sessionOptions, pool);

//**** SERVER PORT ****
app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: sessionExpTime,
      sameSite: "lax",
      secure: false, // we have no https connection
    },
  }),
);

/** */
app.use(express.json()); // parses requests of application/json
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // parses requests of application/x-www-form-urlencode

// **** Server authentication Routes
// app.use(injectGarrisonBaseUrl);
app.use("/api/auth/register", ...checkRegistrationRules(), registerRoute);
app.use(
  "/api/auth/edit-register",
  ...checkEditRegisterationRules(),
  registerEditRoute,
);
app.use("/api/auth/login", ...checkLoginRules(), loginRoute);
app.use("/api/auth/logout", logoutRoute);
// **** server routes
// this middleware is for global authentication and authorization vars injecion into req body like sessions and access controls

app.use("/api/pages/getusercredentials", isAuthenticated, getAuthRoute);
// emplyoees api
app.use(
  "/api/employees",
  isAuthenticated,
  // ...checkEmployeeRegisterationRules(),
  employees,
);
// users api
app.use("/api/list", isAuthenticated, getUsers);
// applauses api
app.use("/api/applauses", isAuthenticated, applauses);
// punishments api
app.use("/api/punishments", isAuthenticated, punishments);
// crimes api
app.use("/api/crimes", isAuthenticated, crimes);
// remarks api
app.use("/api/remarks", isAuthenticated, remarks);
// selectors api
app.use("/api/selectors", isAuthenticated, selectors);

app.use("/api/reports", isAuthenticated, reports);

app.use(
  "/api/upload-excel",
  isAuthenticated,
  uploadFile.single("file"),
  uploadExcelFile,
);

// if (process.env.NODE_ENV !== "production") {
// app.use(express.static(path.join(__dirname, "./build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, ".", "build", "index.html"));
// });

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);
// }
// Error Handling middleware function [Catch all Error handler if any error in the app occured]
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    data: err.data,
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
