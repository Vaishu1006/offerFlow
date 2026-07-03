import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {connectDB} from "../config/db.js";
import Company from "../models/Company.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for --fresh flag: node seeders/seedCompanies.js --fresh
const isFreshRun = process.argv.includes("--fresh");

const loadCompanies = () => {
  const file1Path = path.join(__dirname, "companies", "companySeed1.json");
  const file2Path = path.join(__dirname, "companies", "companySeed2.json");

  const file1 = JSON.parse(fs.readFileSync(file1Path, "utf-8"));
  const file2 = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

  return [...file1, ...file2];
};

const seedCompanies = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected for seeding...");

    if (isFreshRun) {
      const { deletedCount } = await Company.deleteMany({});
      console.log(`🗑️  Fresh run: removed ${deletedCount} existing companies.`);
    }

    const companies = loadCompanies();
    console.log(`📦 Total companies found in JSON: ${companies.length}`);

    let inserted = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    for (const company of companies) {
      try {
        const result = await Company.updateOne(
          { name: company.name, website: company.website },
          { $setOnInsert: company },
          { upsert: true }
        );

        if (result.upsertedCount && result.upsertedCount > 0) {
          inserted++;
        } else {
          skipped++;
        }
      } catch (err) {
        failed++;
        errors.push({ name: company.name, error: err.message });
      }
    }

    console.log("\n🎉 Seeding Complete!");
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Skipped (already existed): ${skipped}`);
    console.log(`   Failed: ${failed}`);

    if (errors.length > 0) {
      console.log("\n⚠️ Errors (check these — usually enum/field mismatches):");
      errors.forEach((e) => console.log(`   - ${e.name}: ${e.error}`));
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedCompanies();