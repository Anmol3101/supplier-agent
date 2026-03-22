const { getConfig } = require('./config');
const { getGroqClient } = require('./groq-client');
const { sanitizeInput, validateSupplier } = require('./sanitize');
const { sleep } = require('./utils');

function parseSupplierJsonArray(text, batchNum) {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error(`  ⚠️  Batch ${batchNum + 1} returned no valid JSON`);
    return [];
  }
  try {
    const raw = JSON.parse(jsonMatch[0]);
    return Array.isArray(raw) ? raw.map(validateSupplier) : [];
  } catch {
    console.error(`  ⚠️  Batch ${batchNum + 1} JSON parse failed`);
    return [];
  }
}

async function fetchSupplierBatch(productQuery, batchNum, totalBatches, existingNames) {
  const cfg = getConfig();
  const client = getGroqClient();

  const excludeList =
    existingNames.length > 0
      ? `\n\nDO NOT include any of these companies (already found): ${existingNames.join(', ')}`
      : '';

  const response = await client.chat.completions.create({
    model: cfg.MODEL,
    max_tokens: cfg.MAX_TOKENS_BATCH,
    temperature: 0.5 + batchNum * 0.05,
    messages: [
      {
        role: 'user',
        content: `You are a supplier research specialist. Find ${cfg.BATCH_SIZE} UNIQUE real suppliers for: "${sanitizeInput(productQuery)}"

      This is batch ${batchNum + 1} of ${totalBatches}. Find different suppliers than previous batches.${excludeList}

      For each supplier return ONLY a JSON array like this:
      [
        {
          "name": "Company Name",
          "website": "https://website.com",
          "email": "contact@company.com",
          "location": "Country/City",
          "specialization": "What they make",
          "estimatedMOQ": "Minimum order quantity",
          "certifications": "ISO etc",
          "score": 8
        }
      ]

      Include suppliers from all regions: Asia, Europe, Americas. Include both large and small/niche manufacturers.
      Score each supplier 1-10 based on reputation, certifications, and fit.
      Return ONLY the JSON array, nothing else.`
      }
    ]
  });

  const text = response.choices[0].message.content;
  return parseSupplierJsonArray(text, batchNum);
}

async function researchSuppliers(productQuery) {
  const cfg = getConfig();
  const target = cfg.BATCH_SIZE * cfg.TOTAL_BATCHES;
  console.log(`🔍 Researching up to ${target} suppliers for: ${productQuery}`);

  const { TOTAL_BATCHES, COOLDOWN_MS, RATE_LIMIT_BACKOFF_MS } = cfg;
  const allSuppliers = [];
  const seenNames = new Set();

  for (let i = 0; i < TOTAL_BATCHES; i++) {
    if (i > 0) {
      console.log(`  ⏳ Waiting ${COOLDOWN_MS / 1000}s for rate limit cooldown...`);
      await sleep(COOLDOWN_MS);
    }

    try {
      const existingNames = [...seenNames];
      const batch = await fetchSupplierBatch(productQuery, i, TOTAL_BATCHES, existingNames);

      for (const supplier of batch) {
        const key = supplier.name.toLowerCase().trim();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          allSuppliers.push(supplier);
        }
      }

      console.log(`  📦 Batch ${i + 1}/${TOTAL_BATCHES} done — ${allSuppliers.length} unique suppliers so far`);
    } catch (err) {
      if (err.status === 429) {
        console.log(`  ⏳ Rate limited — waiting ${RATE_LIMIT_BACKOFF_MS / 1000}s and retrying batch ${i + 1}...`);
        await sleep(RATE_LIMIT_BACKOFF_MS);
        i--;
      } else {
        console.error(`  ⚠️  Batch ${i + 1} failed: ${err.message}`);
      }
    }
  }

  if (allSuppliers.length === 0) {
    throw new Error('No suppliers found across all batches');
  }

  return allSuppliers;
}

module.exports = { fetchSupplierBatch, researchSuppliers };
