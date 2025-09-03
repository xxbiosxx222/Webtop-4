const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "public"); // adjust to your web root
const OUTPUT_FILE = path.join(ROOT_DIR, "assets.json");

// File extensions or names you don’t want in the cache
const IGNORE = [".map", ".DS_Store", "thumbs.db"];

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      if (IGNORE.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()))) {
        return; // skip
      }
      const webPath = "/" + path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
      fileList.push(webPath);
    }
  });
  return fileList;
}

const assets = walkDir(ROOT_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assets, null, 2));
console.log(`✅ Generated ${OUTPUT_FILE} with ${assets.length} assets.`);
