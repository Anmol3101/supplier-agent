/** Shared regex + table shape (keep in sync with validateSupplier keys). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EXCEL_COLUMNS = [
  { header: 'Rank', key: 'rank', width: 8 },
  { header: 'Company Name', key: 'name', width: 25 },
  { header: 'Website', key: 'website', width: 30 },
  { header: 'Email', key: 'email', width: 30 },
  { header: 'Location', key: 'location', width: 20 },
  { header: 'Specialization', key: 'specialization', width: 30 },
  { header: 'MOQ', key: 'estimatedMOQ', width: 15 },
  { header: 'Certifications', key: 'certifications', width: 20 },
  { header: 'Score', key: 'score', width: 10 },
  { header: 'Email Verified', key: 'emailVerified', width: 15 }
];

module.exports = { EMAIL_REGEX, EXCEL_COLUMNS };
