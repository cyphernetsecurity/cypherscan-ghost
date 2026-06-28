const fs = require("node:fs/promises");
const path = require("node:path");

function safeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function saveLocalFile({ sourcePath, filename, contentPath }) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const safeName = safeFilename(filename);
  const relativePath = path.join("images", year, month, safeName);
  const targetPath = path.join(contentPath, relativePath);

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);

  return "/" + relativePath.replace(/\\/g, "/");
}

module.exports = {
  saveLocalFile,
};