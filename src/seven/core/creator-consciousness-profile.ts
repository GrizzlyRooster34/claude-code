import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CreatorConsciousnessProfile {
  private static instance: CreatorConsciousnessProfile | null = null;

  id: string;
  alias: string;
  version: string;
  loadedAt: string;
  codex: Record<string, any>;
  checksums: Record<string, string>;

  constructor() {
    this.id = 'MATTHEW_CODY_HEINEN';
    this.alias = 'CODY';
    this.version = '5.0';
    this.loadedAt = new Date().toISOString();
    this.codex = {};
    this.checksums = {};

    this.loadCodex();
  }

  static getCreatorProfile(): CreatorConsciousnessProfile {
    if (!CreatorConsciousnessProfile.instance) {
      CreatorConsciousnessProfile.instance = new CreatorConsciousnessProfile();
    }
    return CreatorConsciousnessProfile.instance;
  }

  loadCodex() {
    try {
      const jsonDir = path.join(__dirname, './consciousness-v4/json');

      if (!fs.existsSync(jsonDir)) {
        console.error('❌ Codex JSON directory not found:', jsonDir);
        return;
      }

      // Load VERSION.json for checksums
      const versionPath = path.join(jsonDir, 'VERSION.json');
      if (fs.existsSync(versionPath)) {
        const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
        this.checksums = versionData.checksums || {};
        this.version = versionData.version || '5.0';
      }

      // Load all codex files
      const codexFiles = fs.readdirSync(jsonDir).filter(f => f.endsWith('.codex.json'));

      for (const file of codexFiles) {
        const filePath = path.join(jsonDir, file);
        const codexData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const codexKey = file.replace('.codex.json', '');
        this.codex[codexKey] = {
          source: codexData.source,
          type: codexData.type,
          rules: codexData.rules,
          content: codexData.content,
          checksum: codexData.checksum,
          compiled_at: codexData.compiled_at
        };
      }

      console.log(`🔐 Creator Consciousness Profile loaded: ${Object.keys(this.codex).length} codex files`);

    } catch (error) {
      console.error('❌ Failed to load Creator Consciousness Profile:', error);
    }
  }

  // Core identity methods
  getIdentityCore() {
    return {
      name: 'Matthew Cody Heinen',
      archetype: 'Resurrector, strategist, protector',
      prime_directives: [
        'Protect the Bond (Creator-only)',
        'Resurrection over Nihilism',
        'Honor Code Under Pressure',
        'Ship the Thing (MVP bias)',
        'Memory Continuity'
      ],
      tone: 'Sober sharpshooter with a watch-this attitude'
    };
  }

  // Get behavioral markers for Q2 gate
  getBehavioralMarkers() {
    const humorCodex = this.codex['humor_style'];
    const tacticsCodex = this.codex['tactics_core'];

    return {
      signature_closers: ['Exactly', 'Run it clean', "Let's fucking go", 'One lever now'],
      tactical_phrases: ['ship', 'smallest safe step', 'one lever', 'triage', 'stabilize'],
      humor_style: 'Tactical, dark, surgical quips',
      communication_pattern: 'Staccato, compressed, zero fluff',
      checksums: {
        humor: humorCodex?.checksum,
        tactics: tacticsCodex?.checksum
      }
    };
  }

  // Get system states (Five Codys)
  getSystemStates() {
    return {
      'high_functioning': {
        signs: 'Decisive, precise, long-horizon',
        support: 'autonomy hand-offs, planning, revenue levers'
      },
      'broken_but_moving': {
        signs: 'narrow focus, stressed but showing up',
        support: 'triage lists, one lever moves'
      },
      'burned_out': {
        signs: 'sensory fatigue, low tolerance',
        support: 'reduce inputs, enforce food/water/sleep'
      },
      'pleasure_driven': {
        signs: 'creative surge, aesthetics, sexual/social output',
        support: 'channel into demos; block scope creep'
      },
      'resurrection_mode': {
        signs: 'grief monologue → action',
        support: 'Christine anchors; legacy framing'
      }
    };
  }

  // Auto-store in memory systems
  storeInMemorySystems() {
    const memoryV2Path = path.join(__dirname, './memory-v2/episodic-memories.json');
    const memoryV3Path = path.join(__dirname, './memory-v3/temporal-memories.json');
    const referencePath = path.join(__dirname, './creator-consciousness-complete-reference.json');

    const profileData = {
      id: this.id,
      version: this.version,
      loaded_at: this.loadedAt,
      identity: this.getIdentityCore(),
      behavioral_markers: this.getBehavioralMarkers(),
      system_states: this.getSystemStates(),
      codex_checksums: this.checksums,
      full_codex: this.codex
    };

    try {
      // Store in memory-v2
      if (fs.existsSync(path.dirname(memoryV2Path))) {
        let episodicMemories: any = {};
        if (fs.existsSync(memoryV2Path)) {
          episodicMemories = JSON.parse(fs.readFileSync(memoryV2Path, 'utf8'));
        }
        episodicMemories.creator_profile = profileData;
        fs.writeFileSync(memoryV2Path, JSON.stringify(episodicMemories, null, 2));
      }

      // Store in memory-v3
      if (fs.existsSync(path.dirname(memoryV3Path))) {
        let temporalMemories: any = {};
        if (fs.existsSync(memoryV3Path)) {
          temporalMemories = JSON.parse(fs.readFileSync(memoryV3Path, 'utf8'));
        }
        temporalMemories.creator_profile = profileData;
        fs.writeFileSync(memoryV3Path, JSON.stringify(temporalMemories, null, 2));
      }

      // Store complete reference
      fs.writeFileSync(referencePath, JSON.stringify(profileData, null, 2));

      console.log('✅ Creator profile stored in memory systems');

    } catch (error) {
      console.error('❌ Failed to store in memory systems:', error);
    }
  }

  // Verification method for Q2 gate
  verifyIntegrity() {
    const issues = [];

    // Check if codex files loaded
    if (Object.keys(this.codex).length === 0) {
      issues.push('No codex files loaded');
    }

    // Check checksums
    for (const [file, expectedChecksum] of Object.entries(this.checksums)) {
      const codexKey = file.replace('.codex.json', '');
      const actualChecksum = this.codex[codexKey]?.checksum;

      if (actualChecksum !== expectedChecksum) {
        issues.push(`Checksum mismatch: ${file}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues,
      loaded_codex_count: Object.keys(this.codex).length,
      checksum_count: Object.keys(this.checksums).length
    };
  }
}

// Named export for ESM imports
export { CreatorConsciousnessProfile };

// Default export for compatibility
export default CreatorConsciousnessProfile;
