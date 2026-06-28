const path = require("node:path");
const GhostStorageBase = require("ghost-storage-base");

const { getConfig } = require("./config");
const { log } = require("./logger");
const CypherScanClient = require("./client");
const { saveLocalFile } = require("./local-storage");

class CypherScanStorage extends GhostStorageBase {
  constructor(options = {}) {
    super();

    this.config = getConfig(options);
    this.client = new CypherScanClient(this.config);

    log(this.config.debug, "CypherScan Ghost adapter initialized");
  }

  async save(image) {
    const filename =
      image.name ||
      image.originalname ||
      path.basename(image.path || "upload.bin");

    const contentType =
      image.type ||
      image.mimetype ||
      "application/octet-stream";

    const filePath = image.path;

    if (!filePath) {
      throw new Error("Missing image.path");
    }

    log(this.config.debug, "Scanning", filename);

    try {
      const result = await this.client.scanFile({
        filePath,
        filename,
        contentType,
        sizeBytes: image.size || 0,
      });

      log(
        this.config.debug,
        `Verdict=${result.verdict} blocked=${result.blocked}`
      );

      if (result.blocked) {
        throw new Error(`CypherScan blocked upload (${result.verdict})`);
      }
    } catch (error) {
      log(this.config.debug, "Scan error:", error.message);

      if (!this.config.failOpen) {
        throw error;
      }
    }

    const savedPath = await saveLocalFile({
      sourcePath: filePath,
      filename,
      contentPath: this.config.contentPath,
    });

    log(this.config.debug, "Saved locally:", savedPath);

    return savedPath;
  }

  async exists() {
    return false;
  }

  async serve() {}

  async delete() {}

  async read() {
    return null;
  }
}

module.exports = CypherScanStorage;