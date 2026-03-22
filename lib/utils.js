function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sortByScoreDesc(suppliers) {
  return [...suppliers].sort((a, b) => b.score - a.score);
}

function mailFrom(reportFromName) {
  return `${reportFromName} <${process.env.EMAIL_USER}>`;
}

module.exports = { sleep, sortByScoreDesc, mailFrom };
