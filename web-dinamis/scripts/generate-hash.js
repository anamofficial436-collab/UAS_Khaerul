#!/usr/bin/env node
/**
 * Script untuk generate bcrypt hash password admin
 * Jalankan: node scripts/generate-hash.js
 *
 * Output hash ini digunakan di sql/init.sql untuk seeding admin default
 */

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;
const PASSWORD = "admin123";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  console.log("\n✅ Bcrypt hash untuk password:", PASSWORD);
  console.log("\nHash:\n", hash);
  console.log(
    "\n📋 SQL Update:\nUPDATE users SET password = '" +
      hash +
      "' WHERE username = 'admin';\n"
  );
}

main();
