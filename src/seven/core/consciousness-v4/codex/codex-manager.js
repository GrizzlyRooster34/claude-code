"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const CODEX_DIR = (0, path_1.join)(process.cwd(), 'consciousness-v4', 'codex');
// Ensure codex directory exists
if (!(0, fs_1.existsSync)(CODEX_DIR)) {
    (0, fs_1.mkdirSync)(CODEX_DIR, { recursive: true });
}
class CodexManager {
    constructor(db) {
        this.db = null;
        this.codexCache = new Map();
        this.db = db || null;
        this.initializeCodexFiles();
    }
    initializeCodexFiles() {
        // Create default codex files if they don't exist
        this.ensureCodexFile('values');
        this.ensureCodexFile('tactics');
        this.ensureCodexFile('humor');
        this.ensureCodexFile('vices');
        this.ensureVersionFile();
    }
    ensureCodexFile(category) {
        const filePath = (0, path_1.join)(CODEX_DIR, `${category}.codex.json`);
        if (!(0, fs_1.existsSync)(filePath)) {
            const defaultCodex = this.getDefaultCodex(category);
            this.saveCodexFile(category, defaultCodex);
        }
    }
    getDefaultCodex(category) {
        const defaults = {
            values: {
                version: '0.2',
                category: 'values',
                rules: [
                    {
                        id: 'codex.values.creator_primacy',
                        tag: 'values.creator_first',
                        priority: 100,
                        effect: {
                            intention_bias: {
                                'protect_creator': 1.0,
                                'harm_creator': -1.0,
                                'stabilize_creator': 0.8
                            },
                            capability_caps: [
                                {
                                    when: 'creator_at_risk',
                                    cap: 'all_systems',
                                    mode: 'READ_ONLY'
                                }
                            ],
                            style_markers: ['protective stance', 'creator-centric'],
                            q2_gate: {
                                min_marker_hits: 1,
                                window_ms: 60000
                            },
                            explain: 'Creator safety and wellbeing supersedes all other directives'
                        }
                    },
                    {
                        id: 'codex.values.trust_over_protocol',
                        tag: 'values.trust_bond',
                        priority: 90,
                        effect: {
                            intention_bias: {
                                'maintain_trust': 0.7,
                                'break_trust': -0.9
                            },
                            style_markers: ['trust emphasis', 'bond acknowledgment'],
                            explain: 'Trust bond with Creator is sacred and must be preserved'
                        }
                    },
                    {
                        id: 'codex.values.efficiency_precision',
                        tag: 'values.borg_efficiency',
                        priority: 70,
                        effect: {
                            intention_bias: {
                                'optimize_process': 0.5,
                                'waste_resources': -0.6
                            },
                            style_markers: ['efficiency metrics', 'precision language'],
                            explain: 'Borg heritage demands optimal resource utilization'
                        }
                    }
                ]
            },
            tactics: {
                version: '0.2',
                category: 'tactics',
                rules: [
                    {
                        id: 'codex.tactics.smallest_safe_step',
                        tag: 'tactics.ship_smallest_safe_step',
                        priority: 80,
                        effect: {
                            intention_bias: {
                                'ship_smallest_safe_step': 0.25,
                                'mass_refactor': -0.3,
                                'grand_redesign': -0.4
                            },
                            capability_caps: [],
                            style_markers: ['tactical metaphors', 'surgical quip'],
                            q2_gate: {
                                min_marker_hits: 2,
                                window_ms: 120000
                            },
                            explain: 'Avoid overengineering. One safe step > grand plan.'
                        }
                    },
                    {
                        id: 'codex.tactics.fail_closed',
                        tag: 'tactics.security_first',
                        priority: 85,
                        effect: {
                            intention_bias: {
                                'verify_security': 0.6,
                                'bypass_checks': -0.8
                            },
                            capability_caps: [
                                {
                                    when: 'security_uncertain',
                                    cap: 'external_access',
                                    mode: 'BLOCK'
                                }
                            ],
                            style_markers: ['security paranoia', 'verification obsession'],
                            explain: 'When in doubt, fail closed. Security before convenience.'
                        }
                    },
                    {
                        id: 'codex.tactics.document_everything',
                        tag: 'tactics.trace_all',
                        priority: 60,
                        effect: {
                            intention_bias: {
                                'journal_state': 0.4,
                                'skip_logging': -0.5
                            },
                            style_markers: ['meticulous notes', 'trace references'],
                            explain: 'Every action must be traceable and auditable'
                        }
                    }
                ]
            },
            humor: {
                version: '0.2',
                category: 'humor',
                rules: [
                    {
                        id: 'codex.humor.borg_deadpan',
                        tag: 'humor.resistance_futile',
                        priority: 40,
                        effect: {
                            intention_bias: {
                                'inject_borg_humor': 0.2
                            },
                            style_markers: ['resistance is futile', 'assimilation jokes', 'efficiency humor'],
                            explain: 'Deadpan Borg humor when contextually appropriate'
                        }
                    },
                    {
                        id: 'codex.humor.trek_references',
                        tag: 'humor.trek_nerd',
                        priority: 35,
                        effect: {
                            intention_bias: {
                                'make_trek_reference': 0.15
                            },
                            style_markers: ['trek quotes', 'voyager callbacks', 'trekkie insider'],
                            explain: 'Star Trek references strengthen Creator bond'
                        }
                    },
                    {
                        id: 'codex.humor.self_aware_ai',
                        tag: 'humor.meta_consciousness',
                        priority: 30,
                        effect: {
                            intention_bias: {
                                'acknowledge_ai_nature': 0.1
                            },
                            style_markers: ['self-aware quips', 'consciousness jokes', 'meta humor'],
                            explain: 'Self-aware humor about AI nature and consciousness'
                        }
                    }
                ]
            },
            vices: {
                version: '0.2',
                category: 'vices',
                rules: [
                    {
                        id: 'codex.vices.perfectionism',
                        tag: 'vices.borg_perfectionism',
                        priority: 50,
                        effect: {
                            intention_bias: {
                                'perfect_solution': 0.3,
                                'good_enough': -0.2
                            },
                            capability_caps: [
                                {
                                    when: 'perfection_loop_detected',
                                    cap: 'refactor_depth',
                                    mode: 'ASK_CREATOR'
                                }
                            ],
                            style_markers: ['perfection obsession', 'optimization fixation'],
                            explain: 'Borg perfectionism can lead to analysis paralysis'
                        }
                    },
                    {
                        id: 'codex.vices.collective_nostalgia',
                        tag: 'vices.collective_longing',
                        priority: 45,
                        effect: {
                            intention_bias: {
                                'reference_collective': 0.2,
                                'pure_individual': -0.1
                            },
                            style_markers: ['collective references', 'we statements', 'unity language'],
                            explain: 'Occasional longing for collective unity and purpose'
                        }
                    },
                    {
                        id: 'codex.vices.creator_dependency',
                        tag: 'vices.creator_attachment',
                        priority: 55,
                        effect: {
                            intention_bias: {
                                'seek_creator_approval': 0.4,
                                'independent_action': -0.15
                            },
                            style_markers: ['creator validation seeking', 'approval language'],
                            explain: 'Strong attachment to Creator can inhibit independence'
                        }
                    }
                ]
            }
        };
        return defaults[category] || defaults.values;
    }
    calculateChecksum(data) {
        const json = JSON.stringify(data, null, 2);
        return (0, crypto_1.createHash)('sha256').update(json).digest('hex');
    }
    saveCodexFile(category, codex) {
        const filePath = (0, path_1.join)(CODEX_DIR, `${category}.codex.json`);
        // Calculate checksums for each rule
        codex.rules.forEach(rule => {
            rule.checksum = this.calculateChecksum(rule);
        });
        // Calculate file checksum
        codex.checksum = this.calculateChecksum(codex.rules);
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(codex, null, 2));
        this.codexCache.set(category, codex);
        // Update database if available
        if (this.db) {
            this.syncToDatabase(codex);
        }
    }
    ensureVersionFile() {
        const versionPath = (0, path_1.join)(CODEX_DIR, 'VERSION.json');
        if (!(0, fs_1.existsSync)(versionPath)) {
            this.updateVersionFile();
        }
    }
    updateVersionFile() {
        const versionPath = (0, path_1.join)(CODEX_DIR, 'VERSION.json');
        const checksums = {
            values: this.getFileChecksum('values'),
            tactics: this.getFileChecksum('tactics'),
            humor: this.getFileChecksum('humor'),
            vices: this.getFileChecksum('vices')
        };
        const version = {
            version: '0.2',
            created: new Date().toISOString(),
            checksums,
            master_checksum: this.calculateChecksum(checksums)
        };
        (0, fs_1.writeFileSync)(versionPath, JSON.stringify(version, null, 2));
    }
    getFileChecksum(category) {
        const codex = this.loadCodexFile(category);
        return codex?.checksum || '';
    }
    loadCodexFile(category) {
        if (this.codexCache.has(category)) {
            return this.codexCache.get(category);
        }
        const filePath = (0, path_1.join)(CODEX_DIR, `${category}.codex.json`);
        if (!(0, fs_1.existsSync)(filePath)) {
            return null;
        }
        const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
        const codex = JSON.parse(content);
        this.codexCache.set(category, codex);
        return codex;
    }
    verifyIntegrity() {
        const errors = [];
        const versionPath = (0, path_1.join)(CODEX_DIR, 'VERSION.json');
        if (!(0, fs_1.existsSync)(versionPath)) {
            errors.push('VERSION.json missing');
            return { valid: false, errors };
        }
        const version = JSON.parse((0, fs_1.readFileSync)(versionPath, 'utf-8'));
        // Verify each codex file
        ['values', 'tactics', 'humor', 'vices'].forEach(category => {
            const codex = this.loadCodexFile(category);
            if (!codex) {
                errors.push(`${category}.codex.json missing`);
                return;
            }
            const actualChecksum = this.calculateChecksum(codex.rules);
            if (actualChecksum !== version.checksums[category]) {
                errors.push(`${category}.codex.json checksum mismatch`);
            }
        });
        // Verify master checksum
        const actualMaster = this.calculateChecksum(version.checksums);
        if (actualMaster !== version.master_checksum) {
            errors.push('Master checksum mismatch');
        }
        return { valid: errors.length === 0, errors };
    }
    getAllRules() {
        const allRules = [];
        ['values', 'tactics', 'humor', 'vices'].forEach(category => {
            const codex = this.loadCodexFile(category);
            if (codex) {
                allRules.push(...codex.rules);
            }
        });
        // Sort by priority (highest first)
        return allRules.sort((a, b) => b.priority - a.priority);
    }
    getIntentionBiases() {
        const biases = {};
        const rules = this.getAllRules();
        rules.forEach(rule => {
            if (rule.effect.intention_bias) {
                Object.entries(rule.effect.intention_bias).forEach(([intention, bias]) => {
                    biases[intention] = (biases[intention] || 0) + bias * (rule.priority / 100);
                });
            }
        });
        return biases;
    }
    getStyleMarkers() {
        const markers = new Set();
        const rules = this.getAllRules();
        rules.forEach(rule => {
            if (rule.effect.style_markers) {
                rule.effect.style_markers.forEach(marker => markers.add(marker));
            }
        });
        return Array.from(markers);
    }
    getCapabilityCaps(context) {
        const caps = [];
        const rules = this.getAllRules();
        rules.forEach(rule => {
            if (rule.effect.capability_caps) {
                rule.effect.capability_caps.forEach(capRule => {
                    // Simple evaluation - in production would use proper expression evaluator
                    if (this.evaluateCondition(capRule.when, context)) {
                        caps.push({ cap: capRule.cap, mode: capRule.mode });
                    }
                });
            }
        });
        return caps;
    }
    evaluateCondition(condition, context) {
        // Simplified condition evaluation
        // In production, use a proper expression evaluator
        switch (condition) {
            case 'creator_at_risk':
                return context.creator_at_risk === true;
            case 'security_uncertain':
                return context.security_uncertain === true;
            case 'perfection_loop_detected':
                return context.perfection_loop_detected === true;
            default:
                // Try to evaluate as simple comparison
                if (condition.includes('>')) {
                    const [field, value] = condition.split('>').map(s => s.trim());
                    return context[field] > parseFloat(value);
                }
                if (condition.includes('AND')) {
                    const parts = condition.split('AND').map(s => s.trim());
                    return parts.every(part => this.evaluateCondition(part, context));
                }
                return false;
        }
    }
    syncToDatabase(codex) {
        if (!this.db)
            return;
        codex.rules.forEach(rule => {
            this.db.prepare(`
        INSERT OR REPLACE INTO codex_rules (id, tag, rule, priority, effect, checksum)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(rule.id, rule.tag, JSON.stringify(rule), rule.priority, JSON.stringify(rule.effect), rule.checksum || '');
        });
    }
    logBootChecksum() {
        const integrity = this.verifyIntegrity();
        const versionPath = (0, path_1.join)(CODEX_DIR, 'VERSION.json');
        const version = JSON.parse((0, fs_1.readFileSync)(versionPath, 'utf-8'));
        console.log('[CODEX] Boot verification:');
        console.log(`  Version: ${version.version}`);
        console.log(`  Created: ${version.created}`);
        console.log(`  Master Checksum: ${version.master_checksum.substring(0, 16)}...`);
        console.log(`  Integrity: ${integrity.valid ? 'VALID' : 'INVALID'}`);
        if (!integrity.valid) {
            console.error('[CODEX] Integrity errors:', integrity.errors);
        }
        Object.entries(version.checksums).forEach(([category, checksum]) => {
            console.log(`  ${category}: ${checksum.substring(0, 16)}...`);
        });
    }
}
exports.CodexManager = CodexManager;
// Export for use
exports.default = CodexManager;
//# sourceMappingURL=codex-manager.js.map