function sanitizeInput(input) {
  return input.replace(/[^\w\s\-.,()\/&#+"':@]/g, '').trim().slice(0, 200);
}

function sanitizeForEmail(input) {
  return input.replace(/[\r\n]/g, '').trim().slice(0, 200);
}

function sanitizeCell(value) {
  if (typeof value !== 'string') return value;
  if (/^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function validateSupplier(s) {
  return {
    name: sanitizeCell(String(s.name || 'Unknown')),
    website: sanitizeCell(String(s.website || 'N/A')),
    email: String(s.email || 'N/A'),
    location: sanitizeCell(String(s.location || 'N/A')),
    specialization: sanitizeCell(String(s.specialization || 'N/A')),
    estimatedMOQ: sanitizeCell(String(s.estimatedMOQ || 'N/A')),
    certifications: sanitizeCell(String(s.certifications || 'N/A')),
    score: Number(s.score) || 0
  };
}

module.exports = {
  sanitizeInput,
  sanitizeForEmail,
  sanitizeCell,
  validateSupplier
};
