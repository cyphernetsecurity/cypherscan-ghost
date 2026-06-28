class CypherScanClient {
  constructor(config) {
    this.config = config;
  }

  async presign() {
    throw new Error("Not implemented yet.");
  }

  async upload() {
    throw new Error("Not implemented yet.");
  }

  async scan() {
    throw new Error("Not implemented yet.");
  }
}

module.exports = CypherScanClient;