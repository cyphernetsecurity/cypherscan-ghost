const GhostStorageBase = require("ghost-storage-base");
const { getConfig } = require("./config");
const { log } = require("./logger");
const CypherScanClient = require("./client");

class CypherScanStorage extends GhostStorageBase {
  constructor(options = {}) {
    super();

    this.config = getConfig(options);
    this.client = new CypherScanClient(this.config);

    log(this.config.debug, "CypherScan Ghost adapter initialized");
  }

  async save(image) {
    throw new Error("save() not implemented yet.");
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