const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');
fs.readdir(secretFolderPath, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      const filePath = `${secretFolderPath}/${file}`;
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
        } else if (stats.isFile()) {
          const fileName = file.split('.').splice(0, 1).join('');
          const fileExt = path.extname(file).slice(1);
          const fileSize = stats.size;
          console.log(
            `${fileName} - ${fileExt} - ${(fileSize / 1024).toFixed(2)}kb`,
          );
        }
      });
    });
  }
});
