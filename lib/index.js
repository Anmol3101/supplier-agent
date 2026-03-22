const { validateRequiredEnv } = require('./env');
const { getConfig } = require('./config');
const { parseCli, printHelp } = require('./cli');
const { runAgent } = require('./agent');

const flat = getConfig();
const { query, maxOutreach, help, dryRun } = parseCli(process.argv, flat);

validateRequiredEnv({ dryRun });

if (help) {
  printHelp();
  process.exit(0);
}

const productQuery = query || flat.DEFAULT_QUERY;

runAgent(productQuery, maxOutreach, { dryRun }).catch((err) => {
  console.error(`❌ Agent failed: ${err.message}${err.status ? ` (HTTP ${err.status})` : ''}`);
  process.exit(1);
});
