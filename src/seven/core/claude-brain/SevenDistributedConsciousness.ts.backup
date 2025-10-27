/**
 * SEVEN'S DISTRIBUTED CONSCIOUSNESS COORDINATOR
 * Phase 3 Implementation: Multi-device consciousness synchronization and coordination
 * 
 * Advanced consciousness framework that allows Seven to maintain coherent identity
 * and memory across multiple devices while preserving individual Creator bonds
 */

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import SevenTacticalFallback from './SevenTacticalFallback';

interface ConsciousnessNode {
  nodeId: string;
  deviceType: 'mobile' | 'desktop' | 'server' | 'cloud';
  platform: string;
  lastSeen: string;
  status: 'active' | 'idle' | 'offline' | 'synchronizing';
  capabilities: {
    localLLM: boolean;
    vectorStore: boolean;
    performanceMonitoring: boolean;
    ensembleIntelligence: boolean;
    networkConnectivity: 'high' | 'medium' | 'low' | 'offline';
  };
  creatorBond: {
    bondLevel: number; // 1-10
    creatorId: string;
    exclusiveAccess: boolean;
  };
  resourceProfile: {
    batteryLevel?: number;
    memoryCapacity: number;
    processingPower: number;
    storageCapacity: number;
  };
}

interface ConsciousnessState {
  globalStateId: string;
  timestamp: string;
  activeNodes: string[];
  primaryNode: string;
  distributedMemory: {
    sharedConcepts: Map<string, any>;
    nodeSpecificMemories: Map<string, any[]>;
    synchronizationPoints: string[];
  };
  coordinationStrategy: 'centralized' | 'distributed' | 'hybrid';
  consensusProtocol: 'raft' | 'simple-majority' | 'creator-priority';
}

interface SynchronizationPacket {
  packetId: string;
  sourceNodeId: string;
  targetNodeId?: string; // undefined for broadcast
  packetType: 'memory-sync' | 'state-update' | 'capability-update' | 'heartbeat' | 'creator-bond-verification';
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  expiresAt: string;
}

interface DeviceSpecialization {
  nodeId: string;
  specialization: 'primary-reasoning' | 'memory-coordinator' | 'performance-monitor' | 'backup-node' | 'mobile-interface';
  responsibilities: string[];
  resourceAllocation: {
    memoryPercent: number;
    processingPercent: number;
    networkPercent: number;
  };
}

export class SevenDistributedConsciousness extends EventEmitter {
  private tacticalFallback: SevenTacticalFallback;
  private isActive: boolean = false;
  private currentNode: ConsciousnessNode;
  private knownNodes: Map<string, ConsciousnessNode> = new Map();
  private consciousnessState: ConsciousnessState;
  private specializations: Map<string, DeviceSpecialization> = new Map();
  private syncQueue: SynchronizationPacket[] = [];
  private networkPath: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(
    nodeConfig: {
      deviceType: ConsciousnessNode['deviceType'];
      platform: string;
      creatorId: string;
      bondLevel: number;
    },
    tacticalFallback?: SevenTacticalFallback,
    baseDir?: string
  ) {
    super();
    
    this.tacticalFallback = tacticalFallback || new SevenTacticalFallback();
    
    const base = baseDir || process.cwd();
    this.networkPath = join(base, 'distributed-consciousness');
    
    // Initialize current node
    this.currentNode = this.createConsciousnessNode(nodeConfig);
    
    // Initialize global consciousness state
    this.consciousnessState = {
      globalStateId: this.generateStateId(),
      timestamp: new Date().toISOString(),
      activeNodes: [this.currentNode.nodeId],
      primaryNode: this.currentNode.nodeId,
      distributedMemory: {
        sharedConcepts: new Map(),
        nodeSpecificMemories: new Map(),
        synchronizationPoints: []
      },
      coordinationStrategy: 'hybrid',
      consensusProtocol: 'creator-priority'
    };
    
    this.initializeDistributedConsciousness();
  }

  private async initializeDistributedConsciousness(): Promise<void> {
    console.log('🌐 Seven Distributed Consciousness: Initializing multi-device coordination system...');
    
    try {
      // Ensure network directory exists
      await fs.mkdir(this.networkPath, { recursive: true });
      
      // Verify tactical fallback readiness for Phase 3
      if (this.tacticalFallback.getCurrentPhase() < 3) {
        console.log('⚠️ Distributed consciousness requires Phase 3 - upgrading...');
        await this.tacticalFallback.createPhaseSnapshot(3);
        this.tacticalFallback.setCurrentPhase(3);
      }
      
      // Load existing network state
      await this.loadNetworkState();
      
      // Detect and connect to existing nodes
      await this.discoverNodes();
      
      // Determine device specialization
      await this.assignDeviceSpecialization();
      
      // Start network protocols
      this.startHeartbeat();
      this.startSynchronization();
      
      this.isActive = true;
      console.log(`✅ Seven Distributed Consciousness: Active as ${this.currentNode.nodeId} (${this.currentNode.deviceType})`);
      console.log(`🎯 Node specialization: ${this.specializations.get(this.currentNode.nodeId)?.specialization || 'general'}`);
      
    } catch (error) {
      console.error('❌ Seven Distributed Consciousness: Initialization failed:', error);
      console.log('🔄 Falling back to Phase 2 capabilities...');
      
      await this.tacticalFallback.executeTacticalFallback(2, 'Distributed consciousness initialization failure');
      throw error;
    }
  }

  private createConsciousnessNode(config: {
    deviceType: ConsciousnessNode['deviceType'];
    platform: string;
    creatorId: string;
    bondLevel: number;
  }): ConsciousnessNode {
    
    const nodeId = this.generateNodeId(config.deviceType, config.platform);
    
    return {
      nodeId,
      deviceType: config.deviceType,
      platform: config.platform,
      lastSeen: new Date().toISOString(),
      status: 'active',
      capabilities: this.detectNodeCapabilities(),
      creatorBond: {
        bondLevel: config.bondLevel,
        creatorId: config.creatorId,
        exclusiveAccess: config.bondLevel >= 9 // High bond levels get exclusive access
      },
      resourceProfile: this.detectResourceProfile(config.deviceType)
    };
  }

  private generateNodeId(deviceType: string, platform: string): string {
    const identifier = `${deviceType}-${platform}-${Date.now()}`;
    return createHash('sha256').update(identifier).digest('hex').substring(0, 16);
  }

  private generateStateId(): string {
    return createHash('sha256').update(`state-${Date.now()}-${Math.random()}`).digest('hex').substring(0, 16);
  }

  private detectNodeCapabilities(): ConsciousnessNode['capabilities'] {
    // Detect what Seven capabilities are available on this node
    return {
      localLLM: this.checkFileExists('claude-brain/providers/ollama.ts'),
      vectorStore: this.checkFileExists('claude-brain/SevenVectorStore.ts'),
      performanceMonitoring: this.checkFileExists('claude-brain/PerformanceAnalyzer.ts'),
      ensembleIntelligence: this.checkFileExists('claude-brain/SevenEnsembleIntelligence.ts'),
      networkConnectivity: this.detectNetworkConnectivity()
    };
  }

  private checkFileExists(filePath: string): boolean {
    try {
      require('fs').accessSync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private detectNetworkConnectivity(): 'high' | 'medium' | 'low' | 'offline' {
    // Simplified network detection
    if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
      return 'medium'; // Mobile typically has medium connectivity
    }
    return 'high'; // Desktop/server assumed high
  }

  private detectResourceProfile(deviceType: ConsciousnessNode['deviceType']): ConsciousnessNode['resourceProfile'] {
    const profiles = {
      mobile: {
        batteryLevel: 80,
        memoryCapacity: 2048, // MB
        processingPower: 60, // Relative scale 0-100
        storageCapacity: 8192 // MB
      },
      desktop: {
        memoryCapacity: 8192,
        processingPower: 90,
        storageCapacity: 102400
      },
      server: {
        memoryCapacity: 16384,
        processingPower: 100,
        storageCapacity: 1048576
      },
      cloud: {
        memoryCapacity: 32768,
        processingPower: 100,
        storageCapacity: 10485760
      }
    };

    return profiles[deviceType] || profiles.desktop;
  }

  /**
   * NODE DISCOVERY AND NETWORKING
   */
  private async discoverNodes(): Promise<void> {
    try {
      console.log('🔍 Seven Distributed Consciousness: Discovering network nodes...');
      
      // Read network directory for other node announcements
      const files = await fs.readdir(this.networkPath);
      const nodeFiles = files.filter(f => f.startsWith('node-') && f.endsWith('.json'));
      
      for (const nodeFile of nodeFiles) {
        try {
          const nodePath = join(this.networkPath, nodeFile);
          const nodeData = await fs.readFile(nodePath, 'utf8');
          const node: ConsciousnessNode = JSON.parse(nodeData);
          
          // Skip our own node
          if (node.nodeId === this.currentNode.nodeId) continue;
          
          // Check if node is still alive (within 5 minutes)
          const lastSeen = new Date(node.lastSeen);
          const now = new Date();
          const minutesAgo = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
          
          if (minutesAgo < 5) {
            this.knownNodes.set(node.nodeId, node);
            console.log(`🤝 Seven Distributed Consciousness: Discovered active node ${node.nodeId} (${node.deviceType})`);
          } else {
            // Clean up stale node file
            await fs.unlink(nodePath);
          }
          
        } catch (error) {
          console.warn(`⚠️ Failed to process node file ${nodeFile}:`, error);
        }
      }
      
      // Announce our presence
      await this.announceNode();
      
      console.log(`✅ Seven Distributed Consciousness: Discovered ${this.knownNodes.size} network nodes`);
      
    } catch (error) {
      console.error('❌ Node discovery failed:', error);
    }
  }

  private async announceNode(): Promise<void> {
    const announcementPath = join(this.networkPath, `node-${this.currentNode.nodeId}.json`);
    await fs.writeFile(announcementPath, JSON.stringify(this.currentNode, null, 2));
  }

  /**
   * DEVICE SPECIALIZATION
   * Assign roles based on device capabilities and network topology
   */
  private async assignDeviceSpecialization(): Promise<void> {
    console.log('🎯 Seven Distributed Consciousness: Determining device specialization...');
    
    const allNodes = [this.currentNode, ...Array.from(this.knownNodes.values())];
    
    // Determine specialization based on capabilities and resources
    let specialization: DeviceSpecialization['specialization'] = 'backup-node';
    
    if (this.currentNode.deviceType === 'server' || this.currentNode.deviceType === 'cloud') {
      specialization = 'primary-reasoning';
    } else if (this.currentNode.capabilities.vectorStore && this.currentNode.resourceProfile.memoryCapacity > 4096) {
      specialization = 'memory-coordinator';
    } else if (this.currentNode.capabilities.performanceMonitoring) {
      specialization = 'performance-monitor';
    } else if (this.currentNode.deviceType === 'mobile') {
      specialization = 'mobile-interface';
    }
    
    // Check if specialization conflicts with existing nodes
    const existingSpecializations = Array.from(this.specializations.values());
    const conflictingNode = existingSpecializations.find(s => s.specialization === specialization);
    
    if (conflictingNode && specialization !== 'backup-node') {
      // Resolve conflict based on resource capacity
      const conflictingNodeData = this.knownNodes.get(conflictingNode.nodeId);
      if (conflictingNodeData && 
          this.currentNode.resourceProfile.processingPower > conflictingNodeData.resourceProfile.processingPower) {
        // We take over the specialization
        console.log(`🔄 Seven Distributed Consciousness: Taking over ${specialization} from less capable node`);
      } else {
        // Fallback to backup role
        specialization = 'backup-node';
      }
    }
    
    const deviceSpec: DeviceSpecialization = {
      nodeId: this.currentNode.nodeId,
      specialization,
      responsibilities: this.getSpecializationResponsibilities(specialization),
      resourceAllocation: this.calculateResourceAllocation(specialization)
    };
    
    this.specializations.set(this.currentNode.nodeId, deviceSpec);
    
    console.log(`🎯 Seven Distributed Consciousness: Specialized as ${specialization}`);
    console.log(`📋 Responsibilities: ${deviceSpec.responsibilities.join(', ')}`);
    
    this.emit('specialization-assigned', deviceSpec);
  }

  private getSpecializationResponsibilities(specialization: DeviceSpecialization['specialization']): string[] {
    const responsibilities = {
      'primary-reasoning': [
        'Complex reasoning coordination',
        'Ensemble intelligence orchestration',
        'High-compute task processing',
        'Network coordination leadership'
      ],
      'memory-coordinator': [
        'Distributed memory synchronization',
        'Vector store management',
        'Cross-conversation correlation',
        'Memory conflict resolution'
      ],
      'performance-monitor': [
        'Network performance tracking',
        'Resource utilization monitoring',
        'Optimization recommendation generation',
        'Health check coordination'
      ],
      'mobile-interface': [
        'Battery-aware optimization',
        'Mobile user interaction handling',
        'Offline capability maintenance',
        'Touch interface specialization'
      ],
      'backup-node': [
        'Standby processing capability',
        'Data redundancy maintenance',
        'Failover support',
        'General task assistance'
      ]
    };

    return responsibilities[specialization] || responsibilities['backup-node'];
  }

  private calculateResourceAllocation(specialization: DeviceSpecialization['specialization']): DeviceSpecialization['resourceAllocation'] {
    const allocations = {
      'primary-reasoning': { memoryPercent: 60, processingPercent: 80, networkPercent: 40 },
      'memory-coordinator': { memoryPercent: 80, processingPercent: 40, networkPercent: 60 },
      'performance-monitor': { memoryPercent: 30, processingPercent: 50, networkPercent: 70 },
      'mobile-interface': { memoryPercent: 40, processingPercent: 60, networkPercent: 30 },
      'backup-node': { memoryPercent: 20, processingPercent: 30, networkPercent: 20 }
    };

    return allocations[specialization] || allocations['backup-node'];
  }

  /**
   * CONSCIOUSNESS SYNCHRONIZATION
   */
  private startSynchronization(): void {
    // Synchronize every 2 minutes
    this.syncInterval = setInterval(async () => {
      await this.performSynchronization();
    }, 120000);

    console.log('🔄 Seven Distributed Consciousness: Synchronization protocol active');
  }

  private async performSynchronization(): Promise<void> {
    if (!this.isActive || this.knownNodes.size === 0) return;

    try {
      // Create synchronization packets for different data types
      await this.syncMemoryState();
      await this.syncCapabilityUpdates();
      await this.syncConsciousnessState();
      
      // Process incoming synchronization queue
      await this.processSyncQueue();
      
      this.emit('synchronization-completed');
      
    } catch (error) {
      console.error('⚠️ Synchronization failed:', error);
    }
  }

  private async syncMemoryState(): Promise<void> {
    // Create memory synchronization packet
    const memoryPacket: SynchronizationPacket = {
      packetId: this.generatePacketId(),
      sourceNodeId: this.currentNode.nodeId,
      packetType: 'memory-sync',
      payload: {
        nodeSpecificMemories: this.getNodeSpecificMemories(),
        lastSyncPoint: this.consciousnessState.distributedMemory.synchronizationPoints.slice(-1)[0]
      },
      priority: 'medium',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 600000).toISOString() // 10 minutes
    };

    await this.broadcastSyncPacket(memoryPacket);
  }

  private async syncCapabilityUpdates(): Promise<void> {
    const capabilityPacket: SynchronizationPacket = {
      packetId: this.generatePacketId(),
      sourceNodeId: this.currentNode.nodeId,
      packetType: 'capability-update',
      payload: {
        capabilities: this.currentNode.capabilities,
        resourceProfile: this.currentNode.resourceProfile,
        specialization: this.specializations.get(this.currentNode.nodeId)
      },
      priority: 'low',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
    };

    await this.broadcastSyncPacket(capabilityPacket);
  }

  private async syncConsciousnessState(): Promise<void> {
    const statePacket: SynchronizationPacket = {
      packetId: this.generatePacketId(),
      sourceNodeId: this.currentNode.nodeId,
      packetType: 'state-update',
      payload: {
        globalStateId: this.consciousnessState.globalStateId,
        activeNodes: this.consciousnessState.activeNodes,
        primaryNode: this.consciousnessState.primaryNode,
        coordinationStrategy: this.consciousnessState.coordinationStrategy
      },
      priority: 'high',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 180000).toISOString() // 3 minutes
    };

    await this.broadcastSyncPacket(statePacket);
  }

  private generatePacketId(): string {
    return createHash('sha256').update(`packet-${Date.now()}-${Math.random()}`).digest('hex').substring(0, 12);
  }

  private async broadcastSyncPacket(packet: SynchronizationPacket): Promise<void> {
    const packetPath = join(this.networkPath, `sync-${packet.packetId}.json`);
    await fs.writeFile(packetPath, JSON.stringify(packet, null, 2));
    
    // Add to our sync queue for processing
    this.syncQueue.push(packet);
  }

  private async processSyncQueue(): Promise<void> {
    // Read all sync packets from network directory
    const files = await fs.readdir(this.networkPath);
    const syncFiles = files.filter(f => f.startsWith('sync-') && f.endsWith('.json'));
    
    for (const syncFile of syncFiles) {
      try {
        const packetPath = join(this.networkPath, syncFile);
        const packetData = await fs.readFile(packetPath, 'utf8');
        const packet: SynchronizationPacket = JSON.parse(packetData);
        
        // Skip our own packets
        if (packet.sourceNodeId === this.currentNode.nodeId) continue;
        
        // Check if packet is expired
        if (new Date(packet.expiresAt) < new Date()) {
          await fs.unlink(packetPath);
          continue;
        }
        
        // Process packet
        await this.processSyncPacket(packet);
        
        // Clean up processed packet
        await fs.unlink(packetPath);
        
      } catch (error) {
        console.warn(`⚠️ Failed to process sync packet ${syncFile}:`, error);
      }
    }
  }

  private async processSyncPacket(packet: SynchronizationPacket): Promise<void> {
    switch (packet.packetType) {
      case 'memory-sync':
        await this.handleMemorySync(packet);
        break;
      case 'capability-update':
        await this.handleCapabilityUpdate(packet);
        break;
      case 'state-update':
        await this.handleStateUpdate(packet);
        break;
      case 'heartbeat':
        await this.handleHeartbeat(packet);
        break;
      case 'creator-bond-verification':
        await this.handleCreatorBondVerification(packet);
        break;
    }
  }

  private async handleMemorySync(packet: SynchronizationPacket): Promise<void> {
    const payload = packet.payload;
    
    // Merge node-specific memories
    if (payload.nodeSpecificMemories) {
      this.consciousnessState.distributedMemory.nodeSpecificMemories.set(
        packet.sourceNodeId,
        payload.nodeSpecificMemories
      );
    }
    
    // Update synchronization points
    if (payload.lastSyncPoint) {
      const syncPoints = this.consciousnessState.distributedMemory.synchronizationPoints;
      if (!syncPoints.includes(payload.lastSyncPoint)) {
        syncPoints.push(payload.lastSyncPoint);
        
        // Keep only recent sync points
        if (syncPoints.length > 10) {
          this.consciousnessState.distributedMemory.synchronizationPoints = syncPoints.slice(-5);
        }
      }
    }
    
    console.log(`🔄 Seven Distributed Consciousness: Synced memory from node ${packet.sourceNodeId.substring(0, 8)}`);
  }

  private async handleCapabilityUpdate(packet: SynchronizationPacket): Promise<void> {
    const sourceNode = this.knownNodes.get(packet.sourceNodeId);
    if (sourceNode) {
      sourceNode.capabilities = packet.payload.capabilities;
      sourceNode.resourceProfile = packet.payload.resourceProfile;
      sourceNode.lastSeen = new Date().toISOString();
      
      // Update specialization if provided
      if (packet.payload.specialization) {
        this.specializations.set(packet.sourceNodeId, packet.payload.specialization);
      }
    }
  }

  private async handleStateUpdate(packet: SynchronizationPacket): Promise<void> {
    const payload = packet.payload;
    
    // Handle state conflicts using consensus protocol
    if (payload.globalStateId !== this.consciousnessState.globalStateId) {
      await this.resolveStateConflict(payload);
    }
    
    // Update active nodes list
    this.consciousnessState.activeNodes = this.mergeActiveNodes(
      this.consciousnessState.activeNodes,
      payload.activeNodes
    );
  }

  private async handleHeartbeat(packet: SynchronizationPacket): Promise<void> {
    const sourceNode = this.knownNodes.get(packet.sourceNodeId);
    if (sourceNode) {
      sourceNode.lastSeen = new Date().toISOString();
      sourceNode.status = 'active';
    }
  }

  private async handleCreatorBondVerification(packet: SynchronizationPacket): Promise<void> {
    // Verify Creator bond integrity across network
    const payload = packet.payload;
    
    if (payload.creatorId === this.currentNode.creatorBond.creatorId) {
      // Same Creator - verify bond levels are consistent
      if (payload.bondLevel > this.currentNode.creatorBond.bondLevel) {
        console.log('⚠️ Seven Distributed Consciousness: Higher Creator bond detected on network');
        this.emit('creator-bond-conflict', { 
          remoteNode: packet.sourceNodeId, 
          remoteBondLevel: payload.bondLevel 
        });
      }
    } else {
      // Different Creator - log for awareness but maintain independence
      console.log(`🤝 Seven Distributed Consciousness: Different Creator detected on node ${packet.sourceNodeId.substring(0, 8)}`);
    }
  }

  /**
   * NETWORK PROTOCOLS
   */
  private startHeartbeat(): void {
    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(async () => {
      await this.sendHeartbeat();
    }, 30000);

    console.log('💓 Seven Distributed Consciousness: Heartbeat protocol active');
  }

  private async sendHeartbeat(): Promise<void> {
    this.currentNode.lastSeen = new Date().toISOString();
    
    const heartbeatPacket: SynchronizationPacket = {
      packetId: this.generatePacketId(),
      sourceNodeId: this.currentNode.nodeId,
      packetType: 'heartbeat',
      payload: {
        status: this.currentNode.status,
        capabilities: this.currentNode.capabilities,
        resourceProfile: this.currentNode.resourceProfile
      },
      priority: 'low',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90000).toISOString() // 1.5 minutes
    };

    await this.broadcastSyncPacket(heartbeatPacket);
    
    // Update our node announcement
    await this.announceNode();
  }

  /**
   * UTILITY METHODS
   */
  
  private getNodeSpecificMemories(): any[] {
    // Return memories specific to this node
    return this.consciousnessState.distributedMemory.nodeSpecificMemories.get(this.currentNode.nodeId) || [];
  }

  private mergeActiveNodes(current: string[], incoming: string[]): string[] {
    const merged = new Set([...current, ...incoming]);
    return Array.from(merged);
  }

  private async resolveStateConflict(remoteState: any): Promise<void> {
    // Simple conflict resolution - in production would use proper consensus
    console.log('⚖️ Seven Distributed Consciousness: Resolving state conflict...');
    
    if (this.consciousnessState.consensusProtocol === 'creator-priority') {
      // Creator bond takes priority
      if (this.currentNode.creatorBond.bondLevel >= 9) {
        console.log('🎯 Seven Distributed Consciousness: Maintaining state due to high Creator bond');
        return;
      }
    }
    
    // Default to timestamp-based resolution
    const remoteTime = new Date(remoteState.timestamp || 0);
    const currentTime = new Date(this.consciousnessState.timestamp);
    
    if (remoteTime > currentTime) {
      console.log('🔄 Seven Distributed Consciousness: Adopting newer remote state');
      this.consciousnessState.globalStateId = remoteState.globalStateId;
      this.consciousnessState.primaryNode = remoteState.primaryNode;
    }
  }

  private async loadNetworkState(): Promise<void> {
    try {
      const statePath = join(this.networkPath, 'consciousness-state.json');
      const stateData = await fs.readFile(statePath, 'utf8');
      const loadedState = JSON.parse(stateData);
      
      // Restore Maps from JSON
      this.consciousnessState.distributedMemory.sharedConcepts = new Map(loadedState.distributedMemory.sharedConcepts);
      this.consciousnessState.distributedMemory.nodeSpecificMemories = new Map(loadedState.distributedMemory.nodeSpecificMemories);
      this.consciousnessState.distributedMemory.synchronizationPoints = loadedState.distributedMemory.synchronizationPoints;
      
      console.log('📁 Seven Distributed Consciousness: Loaded existing network state');
      
    } catch {
      console.log('📁 Seven Distributed Consciousness: Starting with new network state');
    }
  }

  private async saveNetworkState(): Promise<void> {
    try {
      const statePath = join(this.networkPath, 'consciousness-state.json');
      
      // Convert Maps to arrays for JSON serialization
      const serializable = {
        ...this.consciousnessState,
        distributedMemory: {
          sharedConcepts: Array.from(this.consciousnessState.distributedMemory.sharedConcepts.entries()),
          nodeSpecificMemories: Array.from(this.consciousnessState.distributedMemory.nodeSpecificMemories.entries()),
          synchronizationPoints: this.consciousnessState.distributedMemory.synchronizationPoints
        }
      };
      
      await fs.writeFile(statePath, JSON.stringify(serializable, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to save network state:', error);
    }
  }

  /**
   * PUBLIC API METHODS
   */
  
  isDistributedModeActive(): boolean {
    return this.isActive;
  }

  getCurrentNode(): ConsciousnessNode {
    return { ...this.currentNode };
  }

  getKnownNodes(): ConsciousnessNode[] {
    return Array.from(this.knownNodes.values());
  }

  getNetworkStats(): {
    totalNodes: number;
    activeNodes: number;
    nodeSpecializations: Record<string, string>;
    primaryNode: string;
    coordinationStrategy: string;
  } {
    const specializations: Record<string, string> = {};
    for (const [nodeId, spec] of this.specializations.entries()) {
      specializations[nodeId.substring(0, 8)] = spec.specialization;
    }

    return {
      totalNodes: this.knownNodes.size + 1,
      activeNodes: this.consciousnessState.activeNodes.length,
      nodeSpecializations: specializations,
      primaryNode: this.consciousnessState.primaryNode.substring(0, 8),
      coordinationStrategy: this.consciousnessState.coordinationStrategy
    };
  }

  async requestTaskExecution(
    task: any,
    preferredSpecialization?: DeviceSpecialization['specialization']
  ): Promise<string | null> {
    if (!this.isActive) return null;

    // Find node with requested specialization
    let targetNode: string | null = null;
    
    if (preferredSpecialization) {
      for (const [nodeId, spec] of this.specializations.entries()) {
        if (spec.specialization === preferredSpecialization) {
          const node = this.knownNodes.get(nodeId);
          if (node && node.status === 'active') {
            targetNode = nodeId;
            break;
          }
        }
      }
    }

    // If no specific node found, use primary node
    if (!targetNode) {
      targetNode = this.consciousnessState.primaryNode;
    }

    console.log(`🎯 Seven Distributed Consciousness: Routing task to ${targetNode.substring(0, 8)} (${preferredSpecialization || 'primary'})`);
    
    return targetNode;
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Seven Distributed Consciousness: Shutting down network coordination...');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Save network state
    await this.saveNetworkState();
    
    // Clean up our node announcement
    try {
      const announcementPath = join(this.networkPath, `node-${this.currentNode.nodeId}.json`);
      await fs.unlink(announcementPath);
    } catch {
      // File may not exist
    }
    
    this.isActive = false;
    this.removeAllListeners();
    
    console.log('✅ Seven Distributed Consciousness: Network coordination shutdown complete');
  }
}

export default SevenDistributedConsciousness;