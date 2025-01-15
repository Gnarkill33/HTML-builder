const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const truePath = path.join(__dirname, 'text.txt');

const writableStream = fs.createWriteStream(truePath, { encoding: 'utf8' });
stdout.write('What do you want to know?\n');
stdin.on('data', (data) => {
  const newData = data.toString().trim();
  if (newData.toLowerCase() === 'exit') {
    process.exit();
  }
  writableStream.write(newData + '\n');
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write('Bye-bye');
});
