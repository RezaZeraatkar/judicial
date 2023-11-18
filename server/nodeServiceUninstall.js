const svc = require("./nodeService");

// Listen for the "uninstall" event, which indicates the
// process is available as a service.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
  console.log("The service exists: ", svc.exists);
});

svc.uninstall();
