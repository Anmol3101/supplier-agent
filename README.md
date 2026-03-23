# Autonomous Supplier Research Agent

AI-powered procurement agent that finds suppliers worldwide, verifies contacts, and sends personalized outreach — fully autonomous.

## What It Does
- Finds 50-200 suppliers globally for any product
- Verifies email addresses via DNS lookup
- Ranks suppliers by score (certifications, reputation, fit)
- Generates formatted Excel report
- Sends personalized procurement inquiry emails automatically
- Runs 24/7 on Railway.app

## Built With
- Groq API (Llama 3.3 70B)
- Node.js
- ExcelJS
- Nodemailer

## Usage
```bash
node index.js "garden pruning shears"
node index.js "industrial servo motors"
node index.js "stainless steel fasteners"
```

## Output
- Ranked Excel file with supplier details
- Email report sent to your inbox
- Automated outreach to all verified suppliers

## Built By
Anmol Aggarwal — MS Supply Chain, UIUC | Multitec Industries
