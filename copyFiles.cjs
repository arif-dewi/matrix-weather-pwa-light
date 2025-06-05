#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Directories
const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'ai');

// Make sure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Recursive function to get all files
function getAllFiles(dirPath, fileList = []) {
  const entries = fs.readdirSync(dirPath);

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

// Copy files (flattened)
const files = getAllFiles(srcDir);

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  const destPath = path.join(destDir, fileName);

  fs.copyFileSync(filePath, destPath);
  console.log(`Copied: ${fileName}`);
});