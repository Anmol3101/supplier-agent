const path = require('path');
const nodemailer = require('nodemailer');
const { getConfig } = require('./config');
const { getGroqClient } = require('./groq-client');
const { sanitizeInput, sanitizeForEmail } = require('./sanitize');
const { sleep, sortByScoreDesc, mailFrom } = require('./utils');

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendReportEmail(transporter, suppliers, excelFile, productQuery) {
  const cfg = getConfig();
  const { reportFromName } = cfg.BRAND;
  const top = sortByScoreDesc(suppliers).slice(0, cfg.TOP_REPORT);
  const topSuppliers = top
    .map((s, i) => `${i + 1}. ${s.name} — Score: ${s.score}/10 — ${s.location}`)
    .join('\n');
  const verified = suppliers.filter((s) => s.emailVerified).length;

  await transporter.sendMail({
    from: mailFrom(reportFromName),
    to: process.env.EMAIL_TO,
    subject: sanitizeForEmail(`Supplier Shortlist Ready: ${productQuery}`),
    text: `Your supplier research is complete.\n\nTotal: ${suppliers.length} suppliers found | ${verified} emails verified\n\nTop ${cfg.TOP_REPORT} Suppliers:\n${topSuppliers}\n\nFull list attached.\n\nRegards,\n${reportFromName}`,
    attachments: [{ filename: path.basename(excelFile), path: excelFile }]
  });

  console.log('✅ Report email sent');
}

async function emailSuppliers(transporter, suppliers, productQuery, maxOutreach) {
  const cfg = getConfig();
  const client = getGroqClient();
  const { reportFromName, companyName, roleTitle } = cfg.BRAND;

  const candidates = sortByScoreDesc(suppliers.filter((s) => s.emailVerified)).slice(0, maxOutreach);

  if (maxOutreach === 0) {
    console.log('📧 Outreach skipped (--max-outreach=0)\n');
    return;
  }

  console.log(`📧 Sending outreach to top ${candidates.length} verified supplier(s) (cap ${maxOutreach})\n`);

  for (const supplier of candidates) {
    try {
      const emailBody = await client.chat.completions.create({
        model: cfg.MODEL,
        max_tokens: cfg.MAX_TOKENS_OUTREACH,
        messages: [
          {
            role: 'user',
            content: `Write a short professional procurement inquiry email to ${sanitizeInput(supplier.name)} for sourcing "${sanitizeInput(productQuery)}".
          We are ${companyName}, a manufacturer looking to source components.
          Ask about pricing, MOQ, lead time, and certifications.
          Keep it under 150 words. Professional but direct.
          Sign off as: ${reportFromName}, ${roleTitle}, ${companyName}.
          Do NOT use any placeholders like [Your Name] or [Company Name].`
          }
        ]
      });

      await transporter.sendMail({
        from: mailFrom(reportFromName),
        to: supplier.email,
        subject: sanitizeForEmail(`Procurement Inquiry — ${productQuery}`),
        text: emailBody.choices[0].message.content
      });

      console.log(`📧 Emailed: ${supplier.name}`);
    } catch (err) {
      console.error(`❌ Failed to email ${supplier.name}: ${err.message}`);
    }

    await sleep(cfg.OUTREACH_DELAY_MS);
  }
}

module.exports = {
  createTransporter,
  sendReportEmail,
  emailSuppliers
};
