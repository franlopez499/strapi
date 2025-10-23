#!/usr/bin/env node
/**
 * Seed script for Strapi database
 * Usage: npm run seed
 */

const { default: Strapi } = require('@strapi/strapi');

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const strapi = await Strapi().load();

  try {
    // Load and run the safe seeder
    const seedDataSafe = require('../database/seeders/blog-data-safe.js');
    await seedDataSafe.seed(strapi);

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await strapi.destroy();
  }

  process.exit(0);
}

seed();