function log(enabled, ...args) {
  if (!enabled) {
    return;
  }

  console.log("[cypherscan-ghost]", ...args);
}

module.exports = {
  log,
};