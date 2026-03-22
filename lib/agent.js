const { researchSuppliers } = require('./research');
const { verifyAllEmails } = require('./verification');
const { buildExcel } = require('./excel-export');
const {
  createTransporter,
  sendReportEmail,
  emailSuppliers
} = require('./mail');

async function runAgent(productQuery, maxOutreach, options = {}) {
  const dryRun = Boolean(options.dryRun);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN — no email will be sent (report + outreach skipped).\n');
  }

  console.log('\n🚀 Supplier Agent Started\n');

  const suppliers = await researchSuppliers(productQuery);
  console.log(`Found ${suppliers.length} suppliers\n`);

  const verifiedSuppliers = await verifyAllEmails(suppliers);
  const excelFile = await buildExcel(verifiedSuppliers, productQuery);

  if (dryRun) {
    const n = verifiedSuppliers.filter((s) => s.emailVerified).length;
    console.log(`[dry-run] Excel: ${excelFile}`);
    console.log(`[dry-run] Would email summary to EMAIL_TO; ${n} verified addresses; outreach cap ${maxOutreach}`);
    console.log('\n✅ Dry run complete\n');
    return;
  }

  const transporter = createTransporter();
  await sendReportEmail(transporter, verifiedSuppliers, excelFile, productQuery);
  await emailSuppliers(transporter, verifiedSuppliers, productQuery, maxOutreach);

  console.log('\n✅ Agent Complete\n');
}

module.exports = { runAgent };
