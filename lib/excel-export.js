const path = require('path');
const ExcelJS = require('exceljs');
const { EXCEL_COLUMNS } = require('./constants');
const { sanitizeInput } = require('./sanitize');
const { sortByScoreDesc } = require('./utils');

async function buildExcel(suppliers, productQuery) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Suppliers');

  sheet.columns = EXCEL_COLUMNS;

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };

  sortByScoreDesc(suppliers).forEach((s, i) => {
    sheet.addRow({ rank: i + 1, ...s });
  });

  const safeName = sanitizeInput(productQuery).replace(/[^\w]/g, '_');
  const filename = path.resolve(`suppliers_${safeName}_${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filename);
  console.log(`✅ Excel saved: ${filename}`);
  return filename;
}

module.exports = { buildExcel };
