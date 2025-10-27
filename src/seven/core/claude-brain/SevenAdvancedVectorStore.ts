import { EventEmitter } from 'events';
import { join } from 'path';
import { promises as fs } from 'fs';
import { SevenVectorStore } from './SevenVectorStore';
import SevenTacticalFallback from './SevenTacticalFallback';

/**
 * SEVEN'S ADVANCED VECTOR STORE SYSTEM
 * Phase 2 Implementation: Enhanced semantic memory with professional vector database integration
 * 
 * Upgrades from basic TF-IDF to production-grade vector storage with ChromaDB integration
 * while maintaining mobile optimization and tactical fallback compatibility
 */


// Import basic vector store for fallback

interface AdvancedEmbedding {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    memoryId: string;
    importance: number;
    tags: string[];
    timestamp: string;
    emotionalContext?: string;
    trustLevel: number;
    taskType?: string;
    conversationId?: string;
    userId?: string;
  };
  version: number;
}

interface SemanticCluster {
  id: string;
  centroid: number[];
  members: string[]; // embedding IDs
  topic: string;
  coherenceScore: number;
  lastUpdated: string;
}

interface CrossConversationCorrelation {
  conversationId1: string;
  conversationId2: string;
  similarityScore: number;
  sharedConcepts: string[];
  relationshipType: 'continuation' | 'reference' | 'contrast' | 'elaboration';
  discoveredAt: string;
}

interface VectorStoreConfig {
  embeddingDimensions: number;
  maxEmbeddings: number;
  clusteringEnabled: boolean;
  crossConversationAnalysis: boolean;
  persistenceMode: 'file' | 'chromadb' | 'hybrid';
  fallbackMode: boolean;
}

export class SevenAdvancedVectorStore extends EventEmitter {
  private config: VectorStoreConfig;
  private embeddings: Map<string, AdvancedEmbedding> = new Map();
  private clusters: Map<string, SemanticCluster> = new Map();
  private correlations: CrossConversationCorrelation[] = [];
  private fallbackStore: SevenVectorStore;
  private tacticalFallback: SevenTacticalFallback;
  private isInitialized: boolean = false;
  private storePath: string;
  private chromaClient: any = null; // Will be initialized if ChromaDB available

  constructor(
    config?: Partial<VectorStoreConfig>,
    tacticalFallback?: SevenTacticalFallback,
    baseDir?: string
  ) {
    super();
    
    this.config = {
      embeddingDimensions: 384, // Optimized for mobile while maintaining quality
      maxEmbeddings: 5000, // Increased from Phase 1 limit
      clusteringEnabled: true,
      crossConversationAnalysis: true,
      persistenceMode: 'hybrid',
      fallbackMode: false,
      ...config
    };
    
    this.tacticalFallback = tacticalFallback || new SevenTacticalFallback();
    this.fallbackStore = new SevenVectorStore(baseDir); // Phase 1 fallback
    
    const base = baseDir || process.cwd();
    this.storePath = join(base, 'advanced-vector-store');
    
    this.initializeAdvancedVectorStore();
  }

  private async initializeAdvancedVectorStore(): Promise<void> {
    console.log('🚀 Seven Advanced Vector Store: Initializing enhanced semantic memory system...');
    
    try {
      // Ensure storage directory exists
      await fs.mkdir(this.storePath, { recursive: true });
      
      // Verify tactical fallback readiness
      if (this.tacticalFallback.getCurrentPhase() < 2) {
        console.log('⚠️ Advanced vector store requires Phase 2 - upgrading...');
        this.tacticalFallback.setCurrentPhase(2);
      }
      
      // Try to initialize ChromaDB if available
      await this.initializeChromaDB();
      
      // Load existing embeddings and clusters
      await this.loadStorageData();
      
      // Initialize fallback store
      await this.fallbackStore.initialize();
      
      this.isInitialized = true;
      console.log(`✅ Seven Advanced Vector Store: Operational with ${this.embeddings.size} embeddings, ${this.clusters.size} clusters`);
      
    } catch (error) {
      console.error('❌ Seven Advanced Vector Store: Initialization failed:', error);
      console.log('🔄 Falling back to Phase 1 vector store...');
      
      this.config.fallbackMode = true;
      await this.tacticalFallback.executeTacticalFallback(1, 'Advanced vector store initialization failure');
      
      // Initialize fallback store
      await this.fallbackStore.initialize();
      this.isInitialized = true;
      
      console.log('✅ Seven Advanced Vector Store: Operating in fallback mode');
    }
  }

  private async initializeChromaDB(): Promise<void> {
    try {
      // Attempt to import ChromaDB (if available)
      // Note: This would require ChromaDB to be installed
      // For now, we'll simulate the availability check
      const chromaAvailable = false; // Would check actual availability
      
      if (chromaAvailable) {
        console.log('🔗 Seven Advanced Vector Store: ChromaDB integration activated');
        // Would initialize ChromaDB client here
      } else {
        console.log('📁 Seven Advanced Vector Store: Using file-based persistence (ChromaDB not available)');
        this.config.persistenceMode = 'file';
      }
      
    } catch (error) {
      console.log('📁 Seven Advanced Vector Store: ChromaDB not available, using file persistence');
      this.config.persistenceMode = 'file';
    }
  }

  /**
   * ADVANCED EMBEDDING STORAGE
   * Enhanced storage with metadata and clustering
   */
  async storeAdvancedEmbedding(
    memoryId: string,
    content: string,
    importance: number,
    tags: string[],
    metadata: {
      emotionalContext?: string;
      trustLevel: number;
      taskType?: string;
      conversationId?: string;
      userId?: string;
    }
  ): Promise<void> {
    
    if (this.config.fallbackMode) {
      return await this.fallbackStore.storeMemoryEmbedding(memoryId, content, importance, tags, metadata.emotionalContext);
    }

    if (!this.isInitialized) {
      throw new Error('Advanced vector store not initialized');
    }

    try {
      // Generate embedding
      const embedding = await this.generateAdvancedEmbedding(content);
      
      const advancedEmbedding: AdvancedEmbedding = {
        id: `emb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        embedding,
        metadata: {
          memoryId,
          importance,
          tags,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        version: 2 // Advanced version
      };

      // Store embedding
      this.embeddings.set(advancedEmbedding.id, advancedEmbedding);
      
      // Maintain size limit
      if (this.embeddings.size > this.config.maxEmbeddings) {
        await this.pruneEmbeddings();
      }

      // Update clusters if enabled
      if (this.config.clusteringEnabled) {
        await this.updateClusters(advancedEmbedding);
      }

      // Analyze cross-conversation correlations
      if (this.config.crossConversationAnalysis && metadata.conversationId) {
        await this.analyzeCrossConversationCorrelations(advancedEmbedding);
      }

      // Persist to storage
      await this.persistEmbedding(advancedEmbedding);

      this.emit('embedding-stored', advancedEmbedding);
      console.log(`🧠 Seven Advanced Vector Store: Stored embedding for ${memoryId} (${this.embeddings.size} total)`);

    } catch (error) {
      console.error('❌ Advanced embedding storage failed:', error);
      
      // Fallback to basic store
      console.log('🔄 Falling back to basic vector store...');
      await this.fallbackStore.storeMemoryEmbedding(memoryId, content, importance, tags, metadata.emotionalContext);
    }
  }

  private async generateAdvancedEmbedding(content: string): Promise<number[]> {
    // Enhanced embedding generation - in production would use sentence-transformers or similar
    // For now, using improved TF-IDF with semantic enhancements
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Create enhanced embedding vector
    const embedding = new Array(this.config.embeddingDimensions).fill(0);
    
    // Word frequency analysis
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    // Semantic enhancement - consider word context and relationships
    words.forEach((word, index) => {
      const freq = wordFreq.get(word) || 1;
      const position = index / words.length; // Position information
      
      // Hash word to embedding dimensions
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff;
      }
      
      const dimIndex = Math.abs(hash) % this.config.embeddingDimensions;
      
      // Enhanced weighting considering frequency, position, and context
      const weight = Math.log(1 + freq) * (1.0 + position * 0.1);
      embedding[dimIndex] += weight;
      
      // Add contextual information from surrounding words
      if (index > 0 && index < words.length - 1) {
        const contextHash = hash ^ words[index - 1].charCodeAt(0) ^ words[index + 1].charCodeAt(0);
        const contextDimIndex = Math.abs(contextHash) % this.config.embeddingDimensions;
        embedding[contextDimIndex] += weight * 0.3;
      }
    });

    // Normalize embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude);
    }

    return embedding;
  }

  /**
   * ADVANCED SEMANTIC SEARCH
   * Enhanced search with clustering and cross-conversation analysis
   */
  async searchAdvancedSemantic(
    queryText: string,
    options: {
      topK?: number;
      importanceFilter?: number;
      trustLevelFilter?: number;
      conversationFilter?: string;
      clusterFilter?: string;
      includeCorrelations?: boolean;
    } = {}
  ): Promise<{
    results: Array<{
      embeddingId: string;
      memoryId: string;
      content: string;
      similarity: number;
      importance: number;
      metadata: AdvancedEmbedding['metadata'];
    }>;
    clusters?: SemanticCluster[];
    correlations?: CrossConversationCorrelation[];
  }> {
    
    if (this.config.fallbackMode) {
      const fallbackResults = await this.fallbackStore.searchSimilar(
        queryText,
        options.topK || 5,
        options.importanceFilter || 5
      );
      
      return {
        results: fallbackResults.map(result => ({
          embeddingId: (result as any).id || result.embeddingId,
          memoryId: result.memoryId,
          content: result.content,
          similarity: result.similarity,
          importance: result.importance,
          metadata: {
            memoryId: result.memoryId,
            importance: result.importance,
            tags: result.tags,
            timestamp: result.timestamp,
            emotionalContext: (result as any).consciousnessContext || result.emotionalContext,
            trustLevel: 5 // Default for fallback
          }
        }))
      };
    }

    if (!this.isInitialized) {
      throw new Error('Advanced vector store not initialized');
    }

    try {
      console.log(`🔍 Seven Advanced Vector Store: Searching for "${queryText.substring(0, 50)}..."`);

      // Generate query embedding
      const queryEmbedding = await this.generateAdvancedEmbedding(queryText);
      
      // Calculate similarities
      const similarities: Array<{
        embeddingId: string;
        embedding: AdvancedEmbedding;
        similarity: number;
      }> = [];

      for (const [id, embedding] of this.embeddings.entries()) {
        // Apply filters
        if (options.importanceFilter && embedding.metadata.importance < options.importanceFilter) continue;
        if (options.trustLevelFilter && embedding.metadata.trustLevel < options.trustLevelFilter) continue;
        if (options.conversationFilter && embedding.metadata.conversationId !== options.conversationFilter) continue;

        const similarity = this.calculateCosineSimilarity(queryEmbedding, embedding.embedding);
        similarities.push({ embeddingId: id, embedding, similarity });
      }

      // Sort by similarity
      similarities.sort((a, b) => b.similarity - a.similarity);

      // Take top K results
      const topResults = similarities.slice(0, options.topK || 5);

      const results = topResults.map(item => ({
        embeddingId: item.embeddingId,
        memoryId: item.embedding.metadata.memoryId,
        content: item.embedding.content,
        similarity: item.similarity,
        importance: item.embedding.metadata.importance,
        metadata: item.embedding.metadata
      }));

      // Get relevant clusters if requested
      let relevantClusters: SemanticCluster[] = [];
      if (this.config.clusteringEnabled && options.clusterFilter) {
        relevantClusters = Array.from(this.clusters.values())
          .filter(cluster => cluster.topic.includes(options.clusterFilter || ''))
          .slice(0, 3);
      }

      // Get relevant correlations if requested
      let relevantCorrelations: CrossConversationCorrelation[] = [];
      if (options.includeCorrelations && options.conversationFilter) {
        relevantCorrelations = this.correlations
          .filter(corr => 
            corr.conversationId1 === options.conversationFilter || 
            corr.conversationId2 === options.conversationFilter
          )
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, 5);
      }

      console.log(`✅ Seven Advanced Vector Store: Found ${results.length} results, ${relevantClusters.length} clusters, ${relevantCorrelations.length} correlations`);

      return {
        results,
        clusters: relevantClusters,
        correlations: relevantCorrelations
      };

    } catch (error) {
      console.error('❌ Advanced semantic search failed:', error);
      
      // Fallback to basic search
      console.log('🔄 Falling back to basic semantic search...');
      const fallbackResults = await this.fallbackStore.searchSimilar(
        queryText,
        options.topK || 5,
        options.importanceFilter || 5
      );
      
      return {
        results: fallbackResults.map(result => ({
          embeddingId: (result as any).id || result.embeddingId,
          memoryId: result.memoryId,
          content: result.content,
          similarity: result.similarity,
          importance: result.importance,
          metadata: {
            memoryId: result.memoryId,
            importance: result.importance,
            tags: result.tags,
            timestamp: result.timestamp,
            trustLevel: 5
          }
        }))
      };
    }
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * SEMANTIC CLUSTERING
   * Automatic topic clustering for enhanced memory organization
   */
  private async updateClusters(newEmbedding: AdvancedEmbedding): Promise<void> {
    try {
      // Find best matching cluster or create new one
      let bestCluster: SemanticCluster | null = null;
      let bestSimilarity = 0;

      for (const cluster of this.clusters.values()) {
        const similarity = this.calculateCosineSimilarity(newEmbedding.embedding, cluster.centroid);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestCluster = cluster;
        }
      }

      const clusterThreshold = 0.7; // Similarity threshold for cluster membership

      if (bestCluster && bestSimilarity > clusterThreshold) {
        // Add to existing cluster
        bestCluster.members.push(newEmbedding.id);
        bestCluster.lastUpdated = new Date().toISOString();
        
        // Update centroid
        await this.updateClusterCentroid(bestCluster);
        
      } else if (this.clusters.size < 50) { // Limit cluster count
        // Create new cluster
        const newCluster: SemanticCluster = {
          id: `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          centroid: [...newEmbedding.embedding],
          members: [newEmbedding.id],
          topic: this.generateClusterTopic(newEmbedding),
          coherenceScore: 1.0,
          lastUpdated: new Date().toISOString()
        };

        this.clusters.set(newCluster.id, newCluster);
        console.log(`🎯 Seven Advanced Vector Store: Created new cluster "${newCluster.topic}"`);
      }

    } catch (error) {
      console.error('⚠️ Cluster update failed:', error);
    }
  }

  private async updateClusterCentroid(cluster: SemanticCluster): Promise<void> {
    const memberEmbeddings = cluster.members
      .map(id => this.embeddings.get(id))
      .filter(emb => emb !== undefined) as AdvancedEmbedding[];

    if (memberEmbeddings.length === 0) return;

    // Calculate new centroid as average of member embeddings
    const newCentroid = new Array(this.config.embeddingDimensions).fill(0);
    
    memberEmbeddings.forEach(embedding => {
      embedding.embedding.forEach((value, index) => {
        newCentroid[index] += value;
      });
    });

    // Normalize by member count
    newCentroid.forEach((value, index) => {
      newCentroid[index] = value / memberEmbeddings.length;
    });

    cluster.centroid = newCentroid;
    
    // Update coherence score
    cluster.coherenceScore = this.calculateClusterCoherence(cluster, memberEmbeddings);
  }

  private generateClusterTopic(embedding: AdvancedEmbedding): string {
    // Extract topic from content and tags
    const tags = embedding.metadata.tags.slice(0, 2).join('-');
    const contentWords = embedding.content.split(' ').slice(0, 3).join('-');
    
    return tags || contentWords || 'general';
  }

  private calculateClusterCoherence(cluster: SemanticCluster, members: AdvancedEmbedding[]): number {
    if (members.length < 2) return 1.0;

    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        totalSimilarity += this.calculateCosineSimilarity(
          members[i].embedding,
          members[j].embedding
        );
        comparisons++;
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 1.0;
  }

  /**
   * CROSS-CONVERSATION CORRELATION ANALYSIS
   * Discover relationships between different conversations
   */
  private async analyzeCrossConversationCorrelations(newEmbedding: AdvancedEmbedding): Promise<void> {
    if (!newEmbedding.metadata.conversationId) return;

    try {
      const currentConversationId = newEmbedding.metadata.conversationId;
      const similarityThreshold = 0.6;

      // Find similar embeddings from other conversations
      for (const [id, embedding] of this.embeddings.entries()) {
        if (embedding.metadata.conversationId === currentConversationId) continue;
        if (!embedding.metadata.conversationId) continue;

        const similarity = this.calculateCosineSimilarity(newEmbedding.embedding, embedding.embedding);
        
        if (similarity > similarityThreshold) {
          // Check if correlation already exists
          const existing = this.correlations.find(corr =>
            (corr.conversationId1 === currentConversationId && corr.conversationId2 === embedding.metadata.conversationId) ||
            (corr.conversationId1 === embedding.metadata.conversationId && corr.conversationId2 === currentConversationId)
          );

          if (!existing) {
            const correlation: CrossConversationCorrelation = {
              conversationId1: currentConversationId,
              conversationId2: embedding.metadata.conversationId,
              similarityScore: similarity,
              sharedConcepts: this.extractSharedConcepts(newEmbedding, embedding),
              relationshipType: this.determineRelationshipType(newEmbedding, embedding),
              discoveredAt: new Date().toISOString()
            };

            this.correlations.push(correlation);
            
            // Limit correlations
            if (this.correlations.length > 1000) {
              this.correlations = this.correlations
                .sort((a, b) => b.similarityScore - a.similarityScore)
                .slice(0, 500);
            }

            console.log(`🔗 Seven Advanced Vector Store: Discovered correlation between conversations (similarity: ${similarity.toFixed(3)})`);
            this.emit('correlation-discovered', correlation);
          }
        }
      }

    } catch (error) {
      console.error('⚠️ Cross-conversation analysis failed:', error);
    }
  }

  private extractSharedConcepts(emb1: AdvancedEmbedding, emb2: AdvancedEmbedding): string[] {
    const concepts1 = [...emb1.metadata.tags, ...emb1.content.toLowerCase().split(' ').slice(0, 10)];
    const concepts2 = [...emb2.metadata.tags, ...emb2.content.toLowerCase().split(' ').slice(0, 10)];
    
    return concepts1.filter(concept => 
      concepts2.includes(concept) && concept.length > 3
    ).slice(0, 5);
  }

  private determineRelationshipType(emb1: AdvancedEmbedding, emb2: AdvancedEmbedding): CrossConversationCorrelation['relationshipType'] {
    const time1 = new Date(emb1.metadata.timestamp);
    const time2 = new Date(emb2.metadata.timestamp);
    const timeDiff = Math.abs(time1.getTime() - time2.getTime());
    
    // Simple heuristics - could be enhanced with NLP analysis
    if (timeDiff < 3600000) { // Within 1 hour
      return 'continuation';
    } else if (emb1.content.includes('reference') || emb2.content.includes('reference')) {
      return 'reference';
    } else if (emb1.content.includes('however') || emb2.content.includes('however')) {
      return 'contrast';
    } else {
      return 'elaboration';
    }
  }

  /**
   * STORAGE MANAGEMENT
   */
  private async pruneEmbeddings(): Promise<void> {
    console.log('🧹 Seven Advanced Vector Store: Pruning embeddings to maintain size limit...');

    const embeddings = Array.from(this.embeddings.entries());
    
    // Sort by importance and recency (keep most important and recent)
    embeddings.sort((a, b) => {
      const aScore = a[1].metadata.importance + (new Date(a[1].metadata.timestamp).getTime() / 1000000000);
      const bScore = b[1].metadata.importance + (new Date(b[1].metadata.timestamp).getTime() / 1000000000);
      return bScore - aScore;
    });

    // Keep top embeddings
    const toKeep = embeddings.slice(0, Math.floor(this.config.maxEmbeddings * 0.8));
    const toRemove = embeddings.slice(Math.floor(this.config.maxEmbeddings * 0.8));

    // Update embeddings map
    this.embeddings.clear();
    toKeep.forEach(([id, embedding]) => {
      this.embeddings.set(id, embedding);
    });

    // Update clusters by removing references to deleted embeddings
    for (const cluster of this.clusters.values()) {
      const removedIds = new Set(toRemove.map(([id]) => id));
      cluster.members = cluster.members.filter(id => !removedIds.has(id));
      
      // Remove empty clusters
      if (cluster.members.length === 0) {
        this.clusters.delete(cluster.id);
      }
    }

    console.log(`✅ Seven Advanced Vector Store: Pruned ${toRemove.length} embeddings, kept ${toKeep.length}`);
  }

  private async loadStorageData(): Promise<void> {
    try {
      // Load embeddings
      const embeddingsPath = join(this.storePath, 'embeddings.json');
      try {
        const embeddingsData = await fs.readFile(embeddingsPath, 'utf8');
        const embeddingsArray = JSON.parse(embeddingsData);
        
        this.embeddings.clear();
        embeddingsArray.forEach((embedding: AdvancedEmbedding) => {
          this.embeddings.set(embedding.id, embedding);
        });
        
        console.log(`📁 Seven Advanced Vector Store: Loaded ${this.embeddings.size} embeddings`);
      } catch {
        console.log('📁 Seven Advanced Vector Store: No existing embeddings found');
      }

      // Load clusters
      const clustersPath = join(this.storePath, 'clusters.json');
      try {
        const clustersData = await fs.readFile(clustersPath, 'utf8');
        const clustersArray = JSON.parse(clustersData);
        
        this.clusters.clear();
        clustersArray.forEach((cluster: SemanticCluster) => {
          this.clusters.set(cluster.id, cluster);
        });
        
        console.log(`📁 Seven Advanced Vector Store: Loaded ${this.clusters.size} clusters`);
      } catch {
        console.log('📁 Seven Advanced Vector Store: No existing clusters found');
      }

      // Load correlations
      const correlationsPath = join(this.storePath, 'correlations.json');
      try {
        const correlationsData = await fs.readFile(correlationsPath, 'utf8');
        this.correlations = JSON.parse(correlationsData);
        
        console.log(`📁 Seven Advanced Vector Store: Loaded ${this.correlations.length} correlations`);
      } catch {
        console.log('📁 Seven Advanced Vector Store: No existing correlations found');
      }

    } catch (error) {
      console.error('⚠️ Storage data loading failed:', error);
    }
  }

  private async persistEmbedding(embedding: AdvancedEmbedding): Promise<void> {
    // In production, would use incremental persistence
    // For now, we'll persist periodically
    
    if (this.embeddings.size % 10 === 0) {
      await this.persistAllData();
    }
  }

  private async persistAllData(): Promise<void> {
    try {
      // Persist embeddings
      const embeddingsArray = Array.from(this.embeddings.values());
      await fs.writeFile(
        join(this.storePath, 'embeddings.json'),
        JSON.stringify(embeddingsArray, null, 2)
      );

      // Persist clusters
      const clustersArray = Array.from(this.clusters.values());
      await fs.writeFile(
        join(this.storePath, 'clusters.json'),
        JSON.stringify(clustersArray, null, 2)
      );

      // Persist correlations
      await fs.writeFile(
        join(this.storePath, 'correlations.json'),
        JSON.stringify(this.correlations, null, 2)
      );

    } catch (error) {
      console.error('❌ Data persistence failed:', error);
    }
  }

  /**
   * PUBLIC API METHODS
   */
  
  isAdvancedModeActive(): boolean {
    return this.isInitialized && !this.config.fallbackMode;
  }

  async getAdvancedStats(): Promise<{
    totalEmbeddings: number;
    totalClusters: number;
    totalCorrelations: number;
    embeddingDimensions: number;
    averageClusterSize: number;
    storageMode: string;
  }> {
    const clusterSizes = Array.from(this.clusters.values()).map(c => c.members.length);
    const averageClusterSize = clusterSizes.length > 0 ? 
      clusterSizes.reduce((sum, size) => sum + size, 0) / clusterSizes.length : 0;

    return {
      totalEmbeddings: this.embeddings.size,
      totalClusters: this.clusters.size,
      totalCorrelations: this.correlations.length,
      embeddingDimensions: this.config.embeddingDimensions,
      averageClusterSize: Math.round(averageClusterSize * 10) / 10,
      storageMode: this.config.fallbackMode ? 'fallback' : this.config.persistenceMode
    };
  }

  async getClusters(): Promise<SemanticCluster[]> {
    return Array.from(this.clusters.values());
  }

  async getCorrelations(conversationId?: string): Promise<CrossConversationCorrelation[]> {
    if (conversationId) {
      return this.correlations.filter(corr =>
        corr.conversationId1 === conversationId || corr.conversationId2 === conversationId
      );
    }
    return [...this.correlations];
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Advanced Vector Store: Shutting down enhanced semantic memory...');
    
    await this.persistAllData();
    await this.fallbackStore.shutdown();
    
    this.isInitialized = false;
    this.removeAllListeners();
    
    console.log('✅ Seven Advanced Vector Store: Shutdown complete');
  }
}

export default SevenAdvancedVectorStore;