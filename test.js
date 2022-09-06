const fs = require('fs');
const html = fs.readFileSync('./public/index.html').toString();
console.log(html);
const version = 'V1';
const appName = 'online';
let buffer = Buffer.from(html);

const filterString = '</title>';
const filterPosition = buffer.indexOf(filterString) + filterString.length;
const leftPart = Buffer.alloc(filterPosition);
buffer.copy(leftPart, 0, 0, filterPosition);

const rightPart = Buffer.alloc(buffer.length - filterPosition);
buffer.copy(rightPart, 0, filterPosition, buffer.length);

const versionBuffer = Buffer.from(`<script>var baibuVersion = '${version}';var baibuAppName = '${appName}';</script>`);
buffer = Buffer.concat([leftPart, versionBuffer, rightPart]);

console.log('----------------------\n-----------------------');
console.log(buffer.toString());

const childProcess = require('child_process'); // !子进程,gitbash才可以运行
// childProcess.execSync('rm -fr dist/**/*.map'); // 清空/删除指定文件夹下文件
childProcess.execSync('rimraf dist/**/*.map');
