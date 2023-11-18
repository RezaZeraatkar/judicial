const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Backup database function
function backupDatabase(connection) {
  const date = new Date();
  const currentBackupFileName = `backup_${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.sql`;
  const backupDirectory = path.join(__dirname, "../../db_backups");
  const currentBackupPath = `${backupDirectory}/${currentBackupFileName}`;

  // for sending to remote system the backup file
  // const remoteSystemIP = "172.20.8.49";
  // const remoteSystemUser = "your_remote_user";
  // const remoteSystemPassword = "your_remote_password";
  // const remoteSystemBackupPath = `path_to_remote_backup_directory/${backupFileName}`;

  // Find previous backup files
  const backupFiles = fs
    .readdirSync(backupDirectory)
    .filter((file) => file.startsWith("backup_") && file.endsWith(".sql"))
    .sort()
    .reverse();

  // Remove older backups if more than 5 backups exist
  if (backupFiles.length >= 5) {
    const backupsToRemove = backupFiles.slice(4);
    backupsToRemove.forEach((backupFile) => {
      const backupFilePath = `${backupDirectory}/${backupFile}`;
      // console.log(backupFilePath);
      fs.unlinkSync(backupFilePath);
    });
  }

  // MySQL dump command
  const dumpCommand = `mysqldump --user=${connection.config.user} --password=${
    connection.config.password || ""
  } --host=${connection.config.host} --port=${
    connection.config.port
  } --single-transaction --routines --events --triggers --databases ${
    connection.config.database
  } > ${currentBackupPath}`;

  // Execute the MySQL dump command
  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error creating database backup:", error);
    } else {
      console.log("Database backup created:", currentBackupFileName);
      // // Copy the backup file to the remote system using SCP
      // const scpCommand = `sshpass -p '${remoteSystemPassword}' scp ${currentBackupPath} ${remoteSystemUser}@${remoteSystemIP}:${remoteSystemBackupPath}`;

      // // Execute the SCP command
      // exec(scpCommand, (scpError, scpStdout, scpStderr) => {
      //   if (scpError) {
      //     console.error(
      //       "Error copying backup file to remote system:",
      //       scpError,
      //     );
      //   } else {
      //     console.log(
      //       "Backup file copied to remote system:",
      //       currentBackupFileName,
      //     );
      //   }
      // });
    }
  });
}

module.exports = backupDatabase;
