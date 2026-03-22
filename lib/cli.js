function parseCli(argv, flatConfig) {
  const tokens = argv.slice(2);
  let maxOutreach = Number(process.env.MAX_OUTREACH_EMAILS);
  if (!Number.isFinite(maxOutreach) || maxOutreach < 0) {
    maxOutreach = flatConfig.DEFAULT_MAX_OUTREACH;
  }

  let dryRun = false;
  const positional = [];
  for (const t of tokens) {
    if (t === '--dry-run' || t === '-n') {
      dryRun = true;
    } else if (t.startsWith('--max-outreach=')) {
      const v = parseInt(t.slice(15), 10);
      if (Number.isFinite(v) && v >= 0) maxOutreach = v;
    } else if (t === '--help' || t === '-h') {
      return { help: true, maxOutreach, dryRun };
    } else {
      positional.push(t);
    }
  }

  const query = positional.join(' ').trim() || null;
  return { query, maxOutreach, dryRun };
}

function printHelp() {
  console.log(`Usage: node index.js [options] "<product query>"

Options:
  --max-outreach=N   Max outbound emails (verified, highest score first). Env: MAX_OUTREACH_EMAILS
  --dry-run, -n      Research + verify + Excel only; no SMTP (only GROQ_API_KEY required in .env)
  -h, --help         Show this help

Example:
  node index.js "industrial servo motors" --max-outreach=5
  node index.js "stepper motors" --dry-run
`);
}

module.exports = { parseCli, printHelp };
