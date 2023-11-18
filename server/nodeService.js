var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "judicialapp",
  description: "judicial application service",
  script: "server.js",
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
  env: {
    name: "NODE_ENV",
    value: process.env.NODE_ENV, // service is now able to access the user who created its' home directory
  },
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

module.exports = svc;
