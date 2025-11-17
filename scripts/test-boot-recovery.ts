#!/usr/bin/env tsx
// Test script for boot recovery system (HEI-119)
// Tests: validation, recovery modes, error handling

import { bootSeven, getBootResult } from "../src/boot-seven";

console.log("========================================");
console.log("Boot Recovery System Test");
console.log("========================================\n");

async function testBoot() {
  try {
    console.log("Test 1: Normal Boot Sequence");
    console.log("-----------------------------------");

    const result = await bootSeven();

    console.log("\n========================================");
    console.log("Boot Result:");
    console.log("========================================");
    console.log(`Success: ${result.success}`);
    console.log(`Mode: ${result.mode}`);
    console.log(`\nSubsystems:`);
    console.log(`  - Directories: ${result.subsystems.directories ? '✅' : '❌'}`);
    console.log(`  - Memory: ${result.subsystems.memory ? '✅' : '❌'}`);
    console.log(`  - Consciousness: ${result.subsystems.consciousness ? '✅' : '❌'}`);

    if (result.warnings.length > 0) {
      console.log(`\nWarnings (${result.warnings.length}):`);
      result.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
    }

    if (result.errors.length > 0) {
      console.log(`\nErrors (${result.errors.length}):`);
      result.errors.forEach(e => console.log(`  ❌ ${e}`));
    }

    console.log("\n========================================");
    if (result.success) {
      console.log("✅ PASS: Boot sequence completed successfully");
    } else {
      console.log("❌ FAIL: Boot sequence incomplete");
      process.exit(1);
    }

  } catch (error) {
    console.error("\n========================================");
    console.error("❌ CRITICAL FAILURE");
    console.error("========================================");
    console.error(error);
    process.exit(1);
  }
}

testBoot();
