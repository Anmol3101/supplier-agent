const dns = require('dns').promises;
const { getConfig } = require('./config');
const { EMAIL_REGEX } = require('./constants');

const mxCache = new Map();

async function verifyEmail(email) {
  if (!email || email === 'N/A' || !EMAIL_REGEX.test(email)) return false;

  const domain = email.split('@')[1].toLowerCase();
  if (mxCache.has(domain)) return mxCache.get(domain);

  try {
    const mxRecords = await dns.resolveMx(domain);
    const ok = Boolean(mxRecords && mxRecords.length > 0);
    mxCache.set(domain, ok);
    return ok;
  } catch {
    mxCache.set(domain, false);
    return false;
  }
}

async function verifyAllEmails(suppliers) {
  const { DNS_CHUNK } = getConfig();
  console.log('📧 Verifying supplier emails (DNS MX lookup)...');
  const results = [];

  for (let i = 0; i < suppliers.length; i += DNS_CHUNK) {
    const slice = suppliers.slice(i, i + DNS_CHUNK);
    const part = await Promise.all(
      slice.map(async (s) => {
        const valid = await verifyEmail(s.email);
        const status = valid ? '✅' : '❌';
        console.log(`  ${status} ${s.name} — ${s.email}`);
        return { ...s, emailVerified: valid };
      })
    );
    results.push(...part);
  }

  const verified = results.filter((s) => s.emailVerified).length;
  console.log(`📧 ${verified}/${results.length} emails verified\n`);
  return results;
}

module.exports = { verifyEmail, verifyAllEmails };
