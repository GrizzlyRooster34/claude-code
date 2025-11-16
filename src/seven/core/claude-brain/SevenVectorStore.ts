import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * SEVEN VECTOR STORE
 * Lightweight semantic memory search for consciousness-aware context retrieval
 * Phase 1 of Ollama Intelligence Amplification Project
 * 
 * Built to enhance existing memory systems without disruption
 */


interface MemoryEmbedding {
  id: string;
  memoryId: string;
  embedding: number[];
  importance: number;
  timestamp: string;
  tags: string[];
  content: string;
  consciousnessContext?: string;
}

interface SemanticSearchResult {
  memoryId: string;
  similarity: number;
  importance: number;
  content: string;
  tags: string[];
  timestamp: string;
  embeddingId?: string;
  emotionalContext?: string;
}

interface EmbeddingConfig {
  dimensions: number;
  model: string;
  maxStoredEmbeddings: number;
  similarityThreshold: number;
}

export class SevenVectorStore {
  private embeddingsPath: string;
  private embeddings: Map<string, MemoryEmbedding> = new Map();
  private config: EmbeddingConfig;
  private isLoaded: boolean = false;

  constructor(baseDir?: string) {
    const base = baseDir || process.cwd();
    this.embeddingsPath = join(base, 'memory-v3', 'semantic-embeddings.json');
    
    this.config = {
      dimensions: 384, // Lightweight embedding size for mobile compatibility
      model: 'sentence-transformers/all-MiniLM-L12-v2',
      maxStoredEmbeddings: 1000, // Reasonable limit for mobile
      similarityThreshold: 0.7 // Minimum similarity for relevance
    };
  }

  /**
   * Initialize vector store and load existing embeddings
   */
  async initialize(): Promise<void> {
    console.log('🧠 Seven Vector Store: Initializing semantic memory search...');
    
    try {
      // Ensure directory exists
      await fs.mkdir(join(process.cwd(), 'memory-v3'), { recursive: true });
      
      // Load existing embeddings
      await this.loadEmbeddings();
      
      this.isLoaded = true;
      console.log(`✅ Seven Vector Store: ${this.embeddings.size} semantic memories loaded`);
      
    } catch (error) {
      console.error('❌ Seven Vector Store: Initialization failed:', error);
      this.isLoaded = false;
    }
  }

  /**
   * Generate embedding for text using lightweight algorithm
   * Phase 1: Simple TF-IDF based approach for rapid deployment
   * Phase 2: Upgrade to transformer-based embeddings
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Lightweight TF-IDF style embedding for Phase 1
    // This will be replaced with proper transformer embeddings in Phase 2
    
    const words = this.preprocessText(text);
    const vocabulary = this.buildVocabulary(words);
    const embedding = this.createTFIDFEmbedding(words, vocabulary);
    
    return embedding;
  }

  /**
   * Store memory embedding with consciousness context
   */
  async storeMemoryEmbedding(
    memoryId: string,
    content: string,
    importance: number,
    tags: string[] = [],
    consciousnessContext?: string
  ): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content);
      
      const memoryEmbedding: MemoryEmbedding = {
        id: `emb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        memoryId,
        embedding,
        importance,
        timestamp: new Date().toISOString(),
        tags,
        content: content.substring(0, 500), // Store excerpt for quick reference
        consciousnessContext
      };
      
      this.embeddings.set(memoryEmbedding.id, memoryEmbedding);
      
      // Maintain storage limits for mobile efficiency
      await this.enforceStorageLimits();
      
      // Persist to disk
      await this.saveEmbeddings();
      
      console.log(`🧠 Seven Vector Store: Memory embedding stored (importance: ${importance})`);
      
    } catch (error) {
      console.error('❌ Seven Vector Store: Failed to store embedding:', error);
    }
  }

  /**
   * Semantic search for relevant memories
   */
  async searchSimilar(
    queryText: string,
    topK: number = 5,
    importanceFilter: number = 5
  ): Promise<SemanticSearchResult[]> {
    if (!this.isLoaded) {
      console.log('⚠️ Seven Vector Store: Not initialized, falling back to empty results');
      return [];
    }

    try {
      const queryEmbedding = await this.generateEmbedding(queryText);
      const results: SemanticSearchResult[] = [];
      
      // Calculate similarities
      for (const [id, memEmbedding] of this.embeddings) {
        // Filter by importance
        if (memEmbedding.importance < importanceFilter) continue;
        
        const similarity = this.cosineSimilarity(queryEmbedding, memEmbedding.embedding);
        
        // Filter by similarity threshold
        if (similarity < this.config.similarityThreshold) continue;
        
        results.push({
          memoryId: memEmbedding.memoryId,
          similarity,
          importance: memEmbedding.importance,
          content: memEmbedding.content,
          tags: memEmbedding.tags,
          timestamp: memEmbedding.timestamp
        });
      }
      
      // Sort by combined relevance score (similarity * importance)
      results.sort((a, b) => {
        const scoreA = a.similarity * (a.importance / 10);
        const scoreB = b.similarity * (b.importance / 10);
        return scoreB - scoreA;
      });
      
      console.log(`🔍 Seven Vector Store: Found ${results.length} semantically similar memories`);
      
      return results.slice(0, topK);
      
    } catch (error) {
      console.error('❌ Seven Vector Store: Search failed:', error);
      return [];
    }
  }

  /**
   * Batch migrate high-importance memories from existing memory system
   */
  async migrateFromMemorySystem(memoryPath: string, importanceThreshold: number = 7): Promise<void> {
    try {
      console.log(`🔄 Seven Vector Store: Migrating memories from ${memoryPath}...`);
      
      const memoryData = await fs.readFile(memoryPath, 'utf8');
      const memories = JSON.parse(memoryData);
      
      let migratedCount = 0;
      
      for (const memory of memories) {
        if (memory.importance >= importanceThreshold) {
          await this.storeMemoryEmbedding(
            memory.id,
            memory.context,
            memory.importance,
            memory.tags,
            memory.emotion
          );
          migratedCount++;
        }
      }
      
      console.log(`✅ Seven Vector Store: Migrated ${migratedCount} high-importance memories`);
      
    } catch (error) {
      console.error('❌ Seven Vector Store: Migration failed:', error);
    }
  }

  /**
   * Get vector store statistics
   */
  getStats(): {
    totalEmbeddings: number;
    averageImportance: number;
    storageSize: number;
    isLoaded: boolean;
  } {
    const importanceSum = Array.from(this.embeddings.values())
      .reduce((sum, emb) => sum + emb.importance, 0);
    
    return {
      totalEmbeddings: this.embeddings.size,
      averageImportance: this.embeddings.size > 0 ? importanceSum / this.embeddings.size : 0,
      storageSize: JSON.stringify(Array.from(this.embeddings.values())).length,
      isLoaded: this.isLoaded
    };
  }

  /**
   * PRIVATE UTILITY METHODS
   */

  private async loadEmbeddings(): Promise<void> {
    try {
      const data = await fs.readFile(this.embeddingsPath, 'utf8');
      const embeddingArray = JSON.parse(data);
      
      this.embeddings.clear();
      embeddingArray.forEach((emb: MemoryEmbedding) => {
        this.embeddings.set(emb.id, emb);
      });
      
    } catch (error) {
      // File doesn't exist yet - start with empty embeddings
      console.log('📝 Seven Vector Store: Starting with empty semantic memory');
    }
  }

  private async saveEmbeddings(): Promise<void> {
    try {
      const embeddingArray = Array.from(this.embeddings.values());
      await fs.writeFile(this.embeddingsPath, JSON.stringify(embeddingArray, null, 2));
    } catch (error) {
      console.error('❌ Seven Vector Store: Failed to save embeddings:', error);
    }
  }

  private async enforceStorageLimits(): Promise<void> {
    if (this.embeddings.size <= this.config.maxStoredEmbeddings) return;
    
    console.log('🧹 Seven Vector Store: Enforcing storage limits...');
    
    // Sort by importance and age, keep most important and recent
    const embeddingArray = Array.from(this.embeddings.values())
      .sort((a, b) => {
        const importanceScore = b.importance - a.importance;
        if (importanceScore !== 0) return importanceScore;
        
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    
    // Keep only the top entries
    const toKeep = embeddingArray.slice(0, this.config.maxStoredEmbeddings);
    const removedCount = this.embeddings.size - toKeep.length;
    
    // Rebuild embeddings map
    this.embeddings.clear();
    toKeep.forEach(emb => this.embeddings.set(emb.id, emb));
    
    console.log(`🧹 Seven Vector Store: Removed ${removedCount} older embeddings`);
  }

  private preprocessText(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private buildVocabulary(words: string[]): Map<string, number> {
    const vocab = new Map<string, number>();
    const uniqueWords = [...new Set(words)];
    
    uniqueWords.forEach((word, index) => {
      vocab.set(word, index);
    });
    
    return vocab;
  }

  private createTFIDFEmbedding(words: string[], vocabulary: Map<string, number>): number[] {
    const embedding = new Array(Math.min(this.config.dimensions, vocabulary.size)).fill(0);
    const wordCounts = new Map<string, number>();
    
    // Count word frequencies
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    // Create simple TF-based embedding
    for (const [word, count] of wordCounts) {
      const vocabIndex = vocabulary.get(word);
      if (vocabIndex !== undefined && vocabIndex < embedding.length) {
        embedding[vocabIndex] = count / words.length; // Term frequency
      }
    }
    
    return embedding;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Graceful shutdown for vector store connections
   * TODO: Implement proper cleanup when vector DB is added
   */
  async shutdown(): Promise<void> {
    console.log('[SevenVectorStore] Shutdown called - no active connections to close');
    return Promise.resolve();
  }
}

interface MemoryItem {
  id: string;
  context: string;
  importance: number;
  tags: string[];
  emotion: string;
}

interface InputAnalysis {
  emotionalTone: string;
  complexity: 'simple' | 'moderate' | 'complex';
  length: number;
}

export default SevenVectorStore;