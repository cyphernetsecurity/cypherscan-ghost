const path = require("node:path");

const DEFAULTS = {
  apiBaseUrl: "https://cyphernetsecurity.com",
  timeout: 30000,
  failOpen: true,
  debug: true,
  contentPath: path.join(process.cwd(), "content"),
};

function getConfig(options = {}) {
  return {
    apiKey: options.apiKey || "",
    apiBaseUrl: options.apiBaseUrl || DEFAULTS.apiBaseUrl,
    timeout: options.timeout || DEFAULTS.timeout,
    failOpen:
      typeof options.failOpen === "boolean"
        ? options.failOpen
        : DEFAULTS.failOpen,
    debug:
      typeof options.debug === "boolean"
        ? options.debug
        : DEFAULTS.debug,
    contentPath: options.contentPath || DEFAULTS.contentPath,
  };
}

module.exports = {
  getConfig,
};