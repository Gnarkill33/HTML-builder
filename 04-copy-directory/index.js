const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');
const path = require('path');

async function copyDir() {
  const originalFolder = path.join(__dirname, 'files');
  const copyFolder = path.join(__dirname, 'files-copy');

  await rm(copyFolder, { recursive: true, force: true });

  await mkdir(copyFolder, { recursive: true });

  const originalFiles = await readdir(originalFolder);

  for (const file of originalFiles) {
    const originalFile = path.join(originalFolder, file);
    const copiedFile = path.join(copyFolder, file);
    await copyFile(originalFile, copiedFile);
  }
}

copyDir().catch((err) => {
  console.error('Ошибка:', err);
});
