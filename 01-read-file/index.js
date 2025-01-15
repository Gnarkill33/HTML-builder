const path = require('path');
const fs = require('fs');
const { stdout } = process;

const truePath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(truePath, { encoding: 'utf8' });
readableStream.on('data', (chunk) => stdout.write(chunk.toString()));
