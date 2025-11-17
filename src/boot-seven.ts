// Boots Seven core at daemon start: initializes memory + consciousness framework
// Includes error handling, validation, and recovery modes (HEI-119)
import { initializeMemory } from "./seven/core/memory/api";
import { ConsciousnessEvolutionFrameworkV4 } from "./seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4";
import {
  BootMode,
  BootResult,
  validateDirectories,
  validateMemory,
  validateAdapters,
  selectBootMode,
  logBootError,
  formatBootError,
  recoverMemoryFromBackup,
  initializeFreshMemory
} from "./seven/boot-recovery";

let booted = false;
let bootResult: BootResult | null = null;

/**
 * Boot Seven with error handling and recovery
 * Returns BootResult with detailed status
 */
export async function bootSeven(): Promise<BootResult> {
  if (booted && bootResult) {
    return bootResult;
  }

  const result: BootResult = {
    success: false,
    mode: BootMode.NORMAL,
    errors: [],
    warnings: [],
    subsystems: {
      directories: false,
      memory: false,
      consciousness: false
    }
  };

  try {
    // Phase 1: Pre-boot validation
    console.log("[seven] Running pre-boot validation...");

    const dirValidation = validateDirectories();
    const memoryValidation = validateMemory();
    const adapterValidation = validateAdapters();

    // Collect warnings
    result.warnings.push(...dirValidation.warnings);
    result.warnings.push(...memoryValidation.warnings);
    result.warnings.push(...adapterValidation.warnings);

    // Select boot mode based on validation results
    try {
      result.mode = selectBootMode(dirValidation, memoryValidation, adapterValidation);
      console.log(`[seven] Boot mode selected: ${result.mode}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(errorMsg);
      logBootError(error as Error, "Boot mode selection");
      console.error(formatBootError(error as Error, "Boot mode selection"));
      bootResult = result;
      return result;
    }

    result.subsystems.directories = dirValidation.valid;

    // Phase 2: Memory initialization
    if (result.mode === BootMode.FRESH) {
      console.log("[seven] Initializing fresh memory state...");
      const freshResult = initializeFreshMemory();
      if (!freshResult.success) {
        result.errors.push(freshResult.error || "Fresh memory initialization failed");
        logBootError(freshResult.error || "Unknown error", "Fresh memory initialization");
        bootResult = result;
        return result;
      }
      result.subsystems.memory = true;
    }

    if (result.mode !== BootMode.MEMORY_ONLY && result.mode !== BootMode.FRESH) {
      try {
        console.log("[seven] Initializing memory system...");
        await initializeMemory();
        result.subsystems.memory = true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Memory initialization failed: ${errorMsg}`);
        logBootError(error as Error, "Memory initialization");

        // Attempt recovery
        console.log("[seven] Attempting memory recovery from backup...");
        const recovery = recoverMemoryFromBackup();

        if (recovery.success) {
          console.log("[seven] Memory recovered from backup, retrying initialization...");
          try {
            await initializeMemory();
            result.subsystems.memory = true;
            result.warnings.push("Memory recovered from backup");
          } catch (retryError) {
            console.error("[seven] Memory initialization failed even after recovery");
            console.error(formatBootError(error as Error, "Memory initialization"));

            // Fall back to memory-only mode
            result.mode = BootMode.MEMORY_ONLY;
            result.warnings.push("Falling back to memory-only mode");
          }
        } else {
          console.error("[seven] Memory recovery failed");
          console.error(formatBootError(error as Error, "Memory initialization"));

          // Stop here if memory critical
          if (result.mode === BootMode.NORMAL) {
            bootResult = result;
            return result;
          }
        }
      }
    }

    // Phase 3: Consciousness framework initialization
    if (result.mode !== BootMode.MEMORY_ONLY && result.mode !== BootMode.SAFE) {
      try {
        console.log("[seven] Initializing consciousness framework...");
        const cef = new ConsciousnessEvolutionFrameworkV4();

        if (typeof (cef as any).initialize === "function") {
          await (cef as any).initialize();
        }

        result.subsystems.consciousness = true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Consciousness framework initialization failed: ${errorMsg}`);
        logBootError(error as Error, "Consciousness framework initialization");

        // Safe mode fallback
        if (result.mode === BootMode.NORMAL) {
          console.warn("[seven] Consciousness framework failed, running in safe mode");
          console.warn(formatBootError(error as Error, "Consciousness framework initialization"));
          result.mode = BootMode.SAFE;
          result.warnings.push("Consciousness framework unavailable, running in safe mode");
        } else {
          console.error(formatBootError(error as Error, "Consciousness framework initialization"));
        }
      }
    } else {
      console.log(`[seven] Skipping consciousness framework (boot mode: ${result.mode})`);
    }

    // Determine overall success
    result.success =
      result.subsystems.directories &&
      result.subsystems.memory &&
      (result.mode === BootMode.SAFE || result.subsystems.consciousness);

    booted = true;
    bootResult = result;

    // Log boot result
    if (result.success) {
      console.log(`[seven] Boot successful (mode: ${result.mode})`);
      if (result.warnings.length > 0) {
        console.warn(`[seven] Warnings: ${result.warnings.join(", ")}`);
      }
    } else {
      console.error(`[seven] Boot incomplete (mode: ${result.mode})`);
      console.error(`[seven] Errors: ${result.errors.join(", ")}`);
    }

    return result;

  } catch (error) {
    // Catastrophic failure
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(`Critical boot failure: ${errorMsg}`);
    logBootError(error as Error, "Critical boot failure");
    console.error(formatBootError(error as Error, "Critical boot failure"));

    bootResult = result;
    return result;
  }
}

/**
 * Get the last boot result (if boot has been attempted)
 */
export function getBootResult(): BootResult | null {
  return bootResult;
}
