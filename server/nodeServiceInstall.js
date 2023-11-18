const svc = require("./nodeService");

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  const s = svc.start();
  console.log(process.env.NODE_ENV);
});
// svc.on("uninstall", function () {
//   console.log("Uninstall complete.");
//   console.log("The service exists: ", svc.exists);
// });

// svc.uninstall();
svc.install();
