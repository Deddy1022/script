const { exec } = require("child_process");

const serverUser = "studia";
const serverIP = "192.168.1.10";
const remoteExportPath = "/home/studia/disk_export";
const remoteSourceBasePath = "/share/smb/CNAV_TOURS/Année\\ 1991";

const start = 201;
const end = 400;

function generateFolderName(base, number) {
  return `${base}_${number}`;
}

function executeRemoteCommand(command) {
  return new Promise((resolve, reject) => {
    const sshCommand = `wsl -u root sshpass -p 123456 ssh ${serverUser}@${serverIP} "${command}"`;
    exec(sshCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Erreur : ${stderr}`);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

(async () => {
  try {
    for (let i = start; i <= end; i++) {
      const folderName = generateFolderName("91", i);
      const sourcePath = `${remoteSourceBasePath}/${folderName}`;
      const zipFile = `${remoteExportPath}/${folderName}.zip`;

      
      const check = `cd ${sourcePath} && echo "exists"`;
      try {
        const existFolder = await executeRemoteCommand(check);
        if(existFolder.trim() !== "exists") continue;
      } catch (error) {
        continue;
      }


      const command = `cd ${remoteSourceBasePath} && zip -r ${zipFile} ${folderName}`;

      console.log(`Exécution de la commande pour ${folderName}...`);
      const output = await executeRemoteCommand(command);
      console.log(output);
    }
    console.log("Compression terminée !");
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
})();
