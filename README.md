# Supplier agent

CLI tool: **Groq (Llama)** → supplier JSON → **DNS MX** checks → **Excel** → optional **Gmail** (summary + outreach).

## Requirements

- **Node.js 18+**
- **Groq API key** ([console.groq.com](https://console.groq.com))
- **Gmail** app password (only if not using `--dry-run`)

## Setup

```bash
npm ci
cp .env.example .env
# Edit .env: GROQ_API_KEY, EMAIL_USER, EMAIL_PASS, EMAIL_TO
```

Tune behavior in **`agent.config.json`** (model, batch sizes, brand, defaults).

## Usage

```bash
node index.js "your product" --max-outreach=5
node index.js --dry-run "your product"   # no email; only GROQ_API_KEY required
node index.js --help
```

Optional: `npm run view` (macOS) opens `excel-viewer.html` for local `.xlsx` files.

## Safety

- Supplier rows are **LLM-generated** — treat as leads, not verified facts.
- **MX** checks domain mail capability, not that the mailbox exists.
- Use **`--dry-run`** to preview Excel without sending mail.

## Test

```bash
npm test
```

## License

ISC
