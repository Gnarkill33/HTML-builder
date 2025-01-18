const { readdir, stat } = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  const files = await readdir(stylesFolder);

  const writableStream = fs.createWriteStream(bundlePath, {
    encoding: 'utf8',
  });
  writableStream.on('error', (err) => {
    console.error('Something went wrong', err);
  });

  for (let file of files) {
    const filePath = path.join(stylesFolder, file);
    const fileExt = path.extname(file).slice(1);
    const stats = await stat(filePath);
    if (stats.isFile() && fileExt === 'css') {
      const readableStream = fs.createReadStream(filePath, {
        encoding: 'utf8',
      });
      readableStream.on('error', (err) => {
        console.error('Something went wrong', err);
      });
      readableStream.on('data', (chunk) => writableStream.write(chunk));
    }
  }
}

mergeStyles().catch((err) => {
  console.error('Something went wrong', err);
});
