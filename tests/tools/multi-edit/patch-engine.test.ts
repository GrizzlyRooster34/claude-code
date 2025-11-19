/**
 * Unit tests for PatchEngine (HEI-76)
 */

import { PatchEngine, PatchSet, PatchOperation } from "../../../src/tools/multi-edit/patch-engine";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

describe("PatchEngine", () => {
  let engine: PatchEngine;
  let testDir: string;
  let backupDir: string;

  beforeEach(async () => {
    testDir = join("/tmp", `patch-test-${uuidv4()}`);
    backupDir = join("/tmp", `patch-backup-${uuidv4()}`);

    await mkdir(testDir, { recursive: true });
    await mkdir(backupDir, { recursive: true });

    engine = new PatchEngine(backupDir);
  });

  afterEach(async () => {
    // Cleanup test directories
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
    if (existsSync(backupDir)) {
      await rm(backupDir, { recursive: true, force: true });
    }
  });

  describe("applyPatchSet", () => {
    it("should apply single edit operation", async () => {
      const filePath = join(testDir, "test.txt");
      await writeFile(filePath, "old content", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Single edit",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "edit",
            oldContent: "old content",
            newContent: "new content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(result.appliedOperations).toBe(1);
      expect(result.failedOperations).toBe(0);

      const content = await readFile(filePath, "utf-8");
      expect(content).toBe("new content");
    });

    it("should apply multiple edit operations atomically", async () => {
      const file1 = join(testDir, "file1.txt");
      const file2 = join(testDir, "file2.txt");

      await writeFile(file1, "content1", "utf-8");
      await writeFile(file2, "content2", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Multi edit",
        createdAt: new Date(),
        operations: [
          {
            filePath: file1,
            operationType: "edit",
            oldContent: "content1",
            newContent: "modified1",
          },
          {
            filePath: file2,
            operationType: "edit",
            oldContent: "content2",
            newContent: "modified2",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(result.appliedOperations).toBe(2);

      const content1 = await readFile(file1, "utf-8");
      const content2 = await readFile(file2, "utf-8");

      expect(content1).toBe("modified1");
      expect(content2).toBe("modified2");
    });

    it("should create new file", async () => {
      const filePath = join(testDir, "new-file.txt");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Create file",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "create",
            newContent: "new file content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(existsSync(filePath)).toBe(true);

      const content = await readFile(filePath, "utf-8");
      expect(content).toBe("new file content");
    });

    it("should delete file", async () => {
      const filePath = join(testDir, "delete-me.txt");
      await writeFile(filePath, "content", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Delete file",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "delete",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(existsSync(filePath)).toBe(false);
    });

    it("should rename file", async () => {
      const oldPath = join(testDir, "old-name.txt");
      const newPath = join(testDir, "new-name.txt");

      await writeFile(oldPath, "content", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Rename file",
        createdAt: new Date(),
        operations: [
          {
            filePath: oldPath,
            operationType: "rename",
            newPath,
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(existsSync(oldPath)).toBe(false);
      expect(existsSync(newPath)).toBe(true);

      const content = await readFile(newPath, "utf-8");
      expect(content).toBe("content");
    });

    it("should fail validation if file not found", async () => {
      const filePath = join(testDir, "nonexistent.txt");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Edit nonexistent",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "edit",
            newContent: "new content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].error).toContain("not found");
    });

    it("should fail validation if file already exists for create", async () => {
      const filePath = join(testDir, "exists.txt");
      await writeFile(filePath, "content", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Create existing",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "create",
            newContent: "new content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(false);
      expect(result.errors[0].error).toContain("already exists");
    });

    it("should rollback on partial failure", async () => {
      const file1 = join(testDir, "file1.txt");
      const file2 = join(testDir, "nonexistent.txt");

      await writeFile(file1, "original content", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Partial failure",
        createdAt: new Date(),
        operations: [
          {
            filePath: file1,
            operationType: "edit",
            oldContent: "original content",
            newContent: "modified content",
          },
          {
            filePath: file2, // This will fail validation
            operationType: "edit",
            newContent: "new content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(false);

      // First file should not be modified due to validation failure
      const content = await readFile(file1, "utf-8");
      expect(content).toBe("original content");
    });

    it("should include diff in result", async () => {
      const filePath = join(testDir, "test.txt");
      await writeFile(filePath, "line1\nline2\nline3", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "With diff",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "edit",
            oldContent: "line1\nline2\nline3",
            newContent: "line1\nmodified\nline3",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(result.diff).toBeDefined();
      expect(result.diff?.getSummary().filesChanged).toBe(1);
    });
  });

  describe("rollback", () => {
    it("should rollback edit operation", async () => {
      const filePath = join(testDir, "test.txt");
      await writeFile(filePath, "original", "utf-8");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Rollback test",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "edit",
            oldContent: "original",
            newContent: "modified",
          },
        ],
      };

      // Apply and then rollback
      await engine.applyPatchSet(patchSet);
      await engine.rollback(patchSet);

      const content = await readFile(filePath, "utf-8");
      expect(content).toBe("original");
    });

    it("should rollback create operation", async () => {
      const filePath = join(testDir, "created.txt");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Create rollback",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "create",
            newContent: "new content",
          },
        ],
      };

      await engine.applyPatchSet(patchSet);
      await engine.rollback(patchSet);

      expect(existsSync(filePath)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty patch set", async () => {
      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Empty",
        createdAt: new Date(),
        operations: [],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(result.appliedOperations).toBe(0);
    });

    it("should handle nested directory creation", async () => {
      const filePath = join(testDir, "nested/dir/file.txt");

      const patchSet: PatchSet = {
        id: uuidv4(),
        description: "Nested create",
        createdAt: new Date(),
        operations: [
          {
            filePath,
            operationType: "create",
            newContent: "nested content",
          },
        ],
      };

      const result = await engine.applyPatchSet(patchSet);

      expect(result.success).toBe(true);
      expect(existsSync(filePath)).toBe(true);
    });
  });
});
