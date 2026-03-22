const REQUIRED_GROQ = ['GROQ_API_KEY'];
const REQUIRED_MAIL = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'];

function validateRequiredEnv(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const keys = dryRun ? REQUIRED_GROQ : [...REQUIRED_GROQ, ...REQUIRED_MAIL];
  for (const key of keys) {
    if (!process.env[key] || process.env[key].startsWith('your_')) {
      console.error(`❌ ${key} not set in .env`);
      process.exit(1);
    }
  }
}

module.exports = { validateRequiredEnv, REQUIRED_GROQ, REQUIRED_MAIL };
