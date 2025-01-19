const {
  readdir,
  mkdir,
  stat,
  rm,
  copyFile,
  readFile,
} = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

const projectFolder = path.join(__dirname, 'project-dist');

async function buildHTML() {
  const htmlTemplatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const newIndexPath = path.join(projectFolder, 'index.html');

  let htmlTemplate = await readFile(htmlTemplatePath, {
    encoding: 'utf8',
  });

  const componentsNames = await readdir(componentsPath, {
    encoding: 'utf8',
  });

  for (let component of componentsNames) {
    const componentName = path.basename(component, '.html');
    const componentContent = await readFile(
      path.join(componentsPath, component),
      { encoding: 'utf8' },
    );
    htmlTemplate = htmlTemplate.replace(
      `{{${componentName}}}`,
      componentContent,
    );
  }

  await mkdir(projectFolder, { recursive: true });

  const writableStream = fs.createWriteStream(newIndexPath, {
    encoding: 'utf8',
  });
  writableStream.on('error', (err) => {
    console.error('Something went wrong', err);
  });
  writableStream.write(htmlTemplate);
}

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const newStylesPath = path.join(__dirname, 'project-dist', 'style.css');

  const files = await readdir(stylesFolder);
  await mkdir(projectFolder, { recursive: true });

  const writableStream = fs.createWriteStream(newStylesPath, {
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

async function copyAssets() {
  const originalAssetsFolder = path.join(__dirname, 'assets');
  const copyAssetsFolder = path.join(__dirname, 'project-dist', 'assets');

  await rm(copyAssetsFolder, { recursive: true, force: true });

  await mkdir(copyAssetsFolder, { recursive: true });

  const originalAssetsFolders = await readdir(originalAssetsFolder);

  for (const folder of originalAssetsFolders) {
    const stats = await stat(path.join(originalAssetsFolder, folder));
    if (stats.isDirectory()) {
      await mkdir(path.join(copyAssetsFolder, folder), {
        recursive: true,
      });
      const innerFiles = await readdir(path.join(originalAssetsFolder, folder));
      for (const innerFile of innerFiles) {
        const originalAssetsFile = path.join(
          originalAssetsFolder,
          folder,
          innerFile,
        );
        const copyAssetsFile = path.join(copyAssetsFolder, folder, innerFile);
        await copyFile(originalAssetsFile, copyAssetsFile);
      }
    }
  }
}

buildHTML().catch((err) => {
  console.log('Something went wrong', err.message);
});

mergeStyles().catch((err) => {
  console.error('Something went wrong', err.message);
});

copyAssets().catch((err) => {
  console.error('Something went wrong', err.message);
});
