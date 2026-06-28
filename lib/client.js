const fs = require("node:fs/promises");

class CypherScanClient {
  constructor(config) {
    this.config = config;
  }

  async presign({ filename, contentType, sizeBytes }) {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/v1/upload/presign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          contentType,
          sizeBytes,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        `Presign failed with status ${response.status}: ${JSON.stringify(data)}`
      );
    }

    if (!data || !data.url || !data.key) {
      throw new Error("Invalid presign response");
    }

    return data;
  }

  async upload({ url, filePath, contentType }) {
    const fileBuffer = await fs.readFile(filePath);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: fileBuffer,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed with status ${response.status}`);
    }

    return true;
  }

  async scan({ objectKey }) {
    const response = await fetch(`${this.config.apiBaseUrl}/api/v1/scan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objectKey,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        `Scan failed with status ${response.status}: ${JSON.stringify(data)}`
      );
    }

    return data;
  }

  async scanFile({ filePath, filename, contentType, sizeBytes }) {
    const presign = await this.presign({
      filename,
      contentType,
      sizeBytes,
    });

    await this.upload({
      url: presign.url,
      filePath,
      contentType,
    });

    return this.scan({
      objectKey: presign.key,
    });
  }
}

module.exports = CypherScanClient;