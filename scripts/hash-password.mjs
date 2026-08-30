import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// Next.js's env loader treats unescaped "$" as variable-reference syntax and
// silently strips it, so the value must be escaped before going into .env.
const escaped = hash.replace(/\$/g, "\\$");
console.log(`ADMIN_PASSWORD_HASH="${escaped}"`);
