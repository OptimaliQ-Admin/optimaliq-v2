import { z } from 'zod';
import { AppError } from '@/utils';

// Clustering schemas
const DataPointSchema = z.object({
  id: z.string(),
  vector: z.array(z.number().finite()),
  metadata: z.record(z.any()).optional(),
});

const ClusterSchema = z.object({
  id: z.string(),
  centroid: z.array(z.number().finite()),
  points: z.array(DataPointSchema),
  size: z.number().finite(),
  inertia: z.number().finite(),
  metadata: z.record(z.any()).optional(),
});

const ClusteringResultSchema = z.object({
  clusters: z.array(ClusterSchema),
  totalInertia: z.number().finite(),
  iterations: z.number().finite(),
  converged: z.boolean(),
  silhouetteScore: z.number().finite().optional(),
});

type DataPoint = z.infer<typeof DataPointSchema>;
type Cluster = z.infer<typeof ClusterSchema>;
type ClusteringResult = z.infer<typeof ClusteringResultSchema>;

/**
 * K-Means Clustering Implementation
 * Optimized for high-dimensional embeddings
 */
export class KMeansClusterer {
  private maxIterations: number;
  private tolerance: number;
  private randomSeed: number;

  constructor(options?: {
    maxIterations?: number;
    tolerance?: number;
    randomSeed?: number;
  }) {
    this.maxIterations = options?.maxIterations || 100;
    this.tolerance = options?.tolerance || 1e-4;
    this.randomSeed = options?.randomSeed || Date.now();
  }

  /**
   * Perform K-means clustering
   */
  async cluster(
    dataPoints: DataPoint[],
    k: number,
    options?: {
      initMethod?: 'random' | 'kmeans++';
      validateInput?: boolean;
    }
  ): Promise<ClusteringResult> {
    try {
      if (options?.validateInput !== false) {
        this.validateInput(dataPoints, k);
      }

      // Initialize centroids
      let centroids = options?.initMethod === 'kmeans++' 
        ? this.initializeCentroidsKMeansPlusPlus(dataPoints, k)
        : this.initializeCentroidsRandom(dataPoints, k);

      let clusters: Cluster[] = [];
      let previousInertia = Infinity;
      let iterations = 0;
      let converged = false;

      for (iterations = 0; iterations < this.maxIterations; iterations++) {
        // Assign points to clusters
        clusters = this.assignPointsToClusters(dataPoints, centroids);
        
        // Calculate new centroids
        const newCentroids = this.calculateCentroids(clusters);
        
        // Calculate total inertia
        const totalInertia = this.calculateTotalInertia(clusters);
        
        // Check for convergence
        if (Math.abs(previousInertia - totalInertia) < this.tolerance) {
          converged = true;
          break;
        }
        
        centroids = newCentroids;
        previousInertia = totalInertia;
      }

      // Calculate silhouette score
      const silhouetteScore = this.calculateSilhouetteScore(clusters);

      return ClusteringResultSchema.parse({
        clusters,
        totalInertia: this.calculateTotalInertia(clusters),
        iterations: iterations + 1,
        converged,
        silhouetteScore,
      });
    } catch (error) {
      throw new AppError(
        `K-means clustering failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLUSTERING_ERROR',
        500
      );
    }
  }

  /**
   * Validate input data
   */
  private validateInput(dataPoints: DataPoint[], k: number): void {
    if (dataPoints.length === 0) {
      throw new AppError('No data points provided', 'VALIDATION_ERROR', 400);
    }

    if (k <= 0 || k > dataPoints.length) {
      throw new AppError(`Invalid k value: ${k}. Must be between 1 and ${dataPoints.length}`, 'VALIDATION_ERROR', 400);
    }

    const vectorLength = dataPoints[0].vector.length;
    if (vectorLength === 0) {
      throw new AppError('Vector dimension cannot be zero', 'VALIDATION_ERROR', 400);
    }

    // Check all vectors have same dimension
    for (const point of dataPoints) {
      if (point.vector.length !== vectorLength) {
        throw new AppError('All vectors must have the same dimension', 'VALIDATION_ERROR', 400);
      }
    }
  }

  /**
   * Initialize centroids randomly
   */
  private initializeCentroidsRandom(dataPoints: DataPoint[], k: number): number[][] {
    const centroids: number[][] = [];
    const vectorDim = dataPoints[0].vector.length;
    
    // Use simple random selection of existing points
    const shuffled = [...dataPoints].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < k; i++) {
      centroids.push([...shuffled[i % shuffled.length].vector]);
    }
    
    return centroids;
  }

  /**
   * Initialize centroids using K-means++ algorithm
   */
  private initializeCentroidsKMeansPlusPlus(dataPoints: DataPoint[], k: number): number[][] {
    const centroids: number[][] = [];
    
    // Choose first centroid randomly
    const firstIndex = Math.floor(Math.random() * dataPoints.length);
    centroids.push([...dataPoints[firstIndex].vector]);
    
    // Choose remaining centroids
    for (let i = 1; i < k; i++) {
      const distances = dataPoints.map(point => {
        // Find minimum distance to existing centroids
        let minDistance = Infinity;
        for (const centroid of centroids) {
          const distance = this.euclideanDistance(point.vector, centroid);
          minDistance = Math.min(minDistance, distance);
        }
        return minDistance * minDistance; // Square the distance for probability
      });
      
      // Choose next centroid with probability proportional to squared distance
      const totalDistance = distances.reduce((sum, d) => sum + d, 0);
      const random = Math.random() * totalDistance;
      
      let cumulativeDistance = 0;
      for (let j = 0; j < dataPoints.length; j++) {
        cumulativeDistance += distances[j];
        if (cumulativeDistance >= random) {
          centroids.push([...dataPoints[j].vector]);
          break;
        }
      }
    }
    
    return centroids;
  }

  /**
   * Assign points to clusters based on nearest centroid
   */
  private assignPointsToClusters(dataPoints: DataPoint[], centroids: number[][]): Cluster[] {
    const clusters: Cluster[] = centroids.map((centroid, index) => ({
      id: `cluster-${index}`,
      centroid,
      points: [],
      size: 0,
      inertia: 0,
    }));

    // Assign each point to nearest cluster
    for (const point of dataPoints) {
      let minDistance = Infinity;
      let nearestClusterIndex = 0;

      for (let i = 0; i < centroids.length; i++) {
        const distance = this.euclideanDistance(point.vector, centroids[i]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestClusterIndex = i;
        }
      }

      clusters[nearestClusterIndex].points.push(point);
    }

    // Update cluster metadata
    clusters.forEach(cluster => {
      cluster.size = cluster.points.length;
      cluster.inertia = this.calculateClusterInertia(cluster);
    });

    return clusters;
  }

  /**
   * Calculate new centroids from cluster points
   */
  private calculateCentroids(clusters: Cluster[]): number[][] {
    return clusters.map(cluster => {
      if (cluster.points.length === 0) {
        return cluster.centroid; // Keep existing centroid if no points
      }

      const vectorDim = cluster.points[0].vector.length;
      const newCentroid = new Array(vectorDim).fill(0);

      // Sum all vectors
      for (const point of cluster.points) {
        for (let i = 0; i < vectorDim; i++) {
          newCentroid[i] += point.vector[i];
        }
      }

      // Calculate mean
      for (let i = 0; i < vectorDim; i++) {
        newCentroid[i] /= cluster.points.length;
      }

      return newCentroid;
    });
  }

  /**
   * Calculate inertia (sum of squared distances) for a cluster
   */
  private calculateClusterInertia(cluster: Cluster): number {
    let inertia = 0;
    for (const point of cluster.points) {
      const distance = this.euclideanDistance(point.vector, cluster.centroid);
      inertia += distance * distance;
    }
    return inertia;
  }

  /**
   * Calculate total inertia across all clusters
   */
  private calculateTotalInertia(clusters: Cluster[]): number {
    return clusters.reduce((total, cluster) => total + cluster.inertia, 0);
  }

  /**
   * Calculate silhouette score for clustering quality
   */
  private calculateSilhouetteScore(clusters: Cluster[]): number {
    if (clusters.length <= 1) return 0;

    let totalScore = 0;
    let totalPoints = 0;

    for (const cluster of clusters) {
      for (const point of cluster.points) {
        const silhouette = this.calculatePointSilhouette(point, cluster, clusters);
        totalScore += silhouette;
        totalPoints++;
      }
    }

    return totalPoints > 0 ? totalScore / totalPoints : 0;
  }

  /**
   * Calculate silhouette score for a single point
   */
  private calculatePointSilhouette(point: DataPoint, ownCluster: Cluster, allClusters: Cluster[]): number {
    // Calculate average intra-cluster distance (a)
    let intraDistance = 0;
    if (ownCluster.points.length > 1) {
      for (const otherPoint of ownCluster.points) {
        if (otherPoint.id !== point.id) {
          intraDistance += this.euclideanDistance(point.vector, otherPoint.vector);
        }
      }
      intraDistance /= (ownCluster.points.length - 1);
    }

    // Calculate minimum average inter-cluster distance (b)
    let minInterDistance = Infinity;
    for (const otherCluster of allClusters) {
      if (otherCluster.id !== ownCluster.id && otherCluster.points.length > 0) {
        let interDistance = 0;
        for (const otherPoint of otherCluster.points) {
          interDistance += this.euclideanDistance(point.vector, otherPoint.vector);
        }
        interDistance /= otherCluster.points.length;
        minInterDistance = Math.min(minInterDistance, interDistance);
      }
    }

    // Calculate silhouette score
    if (minInterDistance === Infinity) return 0;
    const maxDistance = Math.max(intraDistance, minInterDistance);
    return maxDistance > 0 ? (minInterDistance - intraDistance) / maxDistance : 0;
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  private euclideanDistance(vector1: number[], vector2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      const diff = vector1[i] - vector2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Find optimal number of clusters using elbow method
   */
  async findOptimalK(
    dataPoints: DataPoint[],
    maxK?: number,
    options?: {
      method?: 'elbow' | 'silhouette';
      minK?: number;
    }
  ): Promise<{
    optimalK: number;
    scores: Array<{ k: number; score: number; inertia: number }>;
    method: string;
  }> {
    const minK = options?.minK || 2;
    const maxKValue = maxK || Math.min(10, Math.floor(dataPoints.length / 2));
    const method = options?.method || 'elbow';

    const scores: Array<{ k: number; score: number; inertia: number }> = [];

    for (let k = minK; k <= maxKValue; k++) {
      const result = await this.cluster(dataPoints, k, { validateInput: false });
      
      let score: number;
      if (method === 'silhouette') {
        score = result.silhouetteScore || 0;
      } else {
        // Elbow method - calculate rate of change in inertia
        score = k > minK ? scores[scores.length - 1].inertia - result.totalInertia : result.totalInertia;
      }

      scores.push({
        k,
        score,
        inertia: result.totalInertia,
      });
    }

    // Find optimal K
    let optimalK = minK;
    if (method === 'silhouette') {
      // Highest silhouette score
      optimalK = scores.reduce((best, current) => 
        current.score > best.score ? current : best
      ).k;
    } else {
      // Elbow method - find the "elbow" point
      optimalK = this.findElbowPoint(scores);
    }

    return {
      optimalK,
      scores,
      method,
    };
  }

  /**
   * Find elbow point in inertia scores
   */
  private findElbowPoint(scores: Array<{ k: number; score: number; inertia: number }>): number {
    if (scores.length < 3) return scores[0].k;

    let maxCurvature = 0;
    let elbowK = scores[0].k;

    for (let i = 1; i < scores.length - 1; i++) {
      const prev = scores[i - 1];
      const curr = scores[i];
      const next = scores[i + 1];

      // Calculate curvature using second derivative approximation
      const curvature = Math.abs(
        (next.inertia - curr.inertia) - (curr.inertia - prev.inertia)
      );

      if (curvature > maxCurvature) {
        maxCurvature = curvature;
        elbowK = curr.k;
      }
    }

    return elbowK;
  }
}

/**
 * Hierarchical Clustering Implementation
 * For when you need to understand cluster relationships
 */
export class HierarchicalClusterer {
  private linkage: 'single' | 'complete' | 'average' | 'ward';

  constructor(linkage: 'single' | 'complete' | 'average' | 'ward' = 'ward') {
    this.linkage = linkage;
  }

  /**
   * Perform hierarchical clustering
   */
  async cluster(
    dataPoints: DataPoint[],
    options?: {
      maxClusters?: number;
      distanceThreshold?: number;
    }
  ): Promise<{
    clusters: Cluster[];
    dendrogram: Array<{
      cluster1: number;
      cluster2: number;
      distance: number;
      size: number;
    }>;
  }> {
    try {
      if (dataPoints.length === 0) {
        throw new AppError('No data points provided', 'VALIDATION_ERROR', 400);
      }

      // Initialize each point as its own cluster
      let clusters = dataPoints.map((point, index) => ({
        id: `cluster-${index}`,
        centroid: [...point.vector],
        points: [point],
        size: 1,
        inertia: 0,
      }));

      const dendrogram: Array<{
        cluster1: number;
        cluster2: number;
        distance: number;
        size: number;
      }> = [];

      // Merge clusters until stopping condition is met
      while (clusters.length > 1) {
        // Find closest pair of clusters
        const { index1, index2, distance } = this.findClosestClusters(clusters);

        // Record merge in dendrogram
        dendrogram.push({
          cluster1: index1,
          cluster2: index2,
          distance,
          size: clusters[index1].size + clusters[index2].size,
        });

        // Merge clusters
        const mergedCluster = this.mergeClusters(clusters[index1], clusters[index2], clusters.length);
        
        // Remove old clusters and add merged cluster
        const newClusters = clusters.filter((_, i) => i !== index1 && i !== index2);
        newClusters.push(mergedCluster);
        clusters = newClusters;

        // Check stopping conditions
        if (options?.maxClusters && clusters.length <= options.maxClusters) {
          break;
        }
        if (options?.distanceThreshold && distance > options.distanceThreshold) {
          break;
        }
      }

      return {
        clusters,
        dendrogram,
      };
    } catch (error) {
      throw new AppError(
        `Hierarchical clustering failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLUSTERING_ERROR',
        500
      );
    }
  }

  /**
   * Find the closest pair of clusters
   */
  private findClosestClusters(clusters: Cluster[]): {
    index1: number;
    index2: number;
    distance: number;
  } {
    let minDistance = Infinity;
    let closestPair = { index1: 0, index2: 1, distance: Infinity };

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const distance = this.calculateClusterDistance(clusters[i], clusters[j]);
        if (distance < minDistance) {
          minDistance = distance;
          closestPair = { index1: i, index2: j, distance };
        }
      }
    }

    return closestPair;
  }

  /**
   * Calculate distance between two clusters based on linkage method
   */
  private calculateClusterDistance(cluster1: Cluster, cluster2: Cluster): number {
    switch (this.linkage) {
      case 'single':
        return this.singleLinkage(cluster1, cluster2);
      case 'complete':
        return this.completeLinkage(cluster1, cluster2);
      case 'average':
        return this.averageLinkage(cluster1, cluster2);
      case 'ward':
        return this.wardLinkage(cluster1, cluster2);
      default:
        return this.averageLinkage(cluster1, cluster2);
    }
  }

  /**
   * Single linkage (minimum distance)
   */
  private singleLinkage(cluster1: Cluster, cluster2: Cluster): number {
    let minDistance = Infinity;
    for (const point1 of cluster1.points) {
      for (const point2 of cluster2.points) {
        const distance = this.euclideanDistance(point1.vector, point2.vector);
        minDistance = Math.min(minDistance, distance);
      }
    }
    return minDistance;
  }

  /**
   * Complete linkage (maximum distance)
   */
  private completeLinkage(cluster1: Cluster, cluster2: Cluster): number {
    let maxDistance = 0;
    for (const point1 of cluster1.points) {
      for (const point2 of cluster2.points) {
        const distance = this.euclideanDistance(point1.vector, point2.vector);
        maxDistance = Math.max(maxDistance, distance);
      }
    }
    return maxDistance;
  }

  /**
   * Average linkage
   */
  private averageLinkage(cluster1: Cluster, cluster2: Cluster): number {
    let totalDistance = 0;
    let count = 0;
    
    for (const point1 of cluster1.points) {
      for (const point2 of cluster2.points) {
        totalDistance += this.euclideanDistance(point1.vector, point2.vector);
        count++;
      }
    }
    
    return count > 0 ? totalDistance / count : 0;
  }

  /**
   * Ward linkage (minimize within-cluster variance)
   */
  private wardLinkage(cluster1: Cluster, cluster2: Cluster): number {
    const n1 = cluster1.size;
    const n2 = cluster2.size;
    const centroidDistance = this.euclideanDistance(cluster1.centroid, cluster2.centroid);
    
    return Math.sqrt((n1 * n2) / (n1 + n2)) * centroidDistance;
  }

  /**
   * Merge two clusters
   */
  private mergeClusters(cluster1: Cluster, cluster2: Cluster, clusterCount: number): Cluster {
    const mergedPoints = [...cluster1.points, ...cluster2.points];
    const vectorDim = mergedPoints[0].vector.length;
    
    // Calculate new centroid
    const newCentroid = new Array(vectorDim).fill(0);
    for (const point of mergedPoints) {
      for (let i = 0; i < vectorDim; i++) {
        newCentroid[i] += point.vector[i];
      }
    }
    for (let i = 0; i < vectorDim; i++) {
      newCentroid[i] /= mergedPoints.length;
    }

    // Calculate inertia
    let inertia = 0;
    for (const point of mergedPoints) {
      const distance = this.euclideanDistance(point.vector, newCentroid);
      inertia += distance * distance;
    }

    return {
      id: `merged-cluster-${clusterCount}`,
      centroid: newCentroid,
      points: mergedPoints,
      size: mergedPoints.length,
      inertia,
    };
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  private euclideanDistance(vector1: number[], vector2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      const diff = vector1[i] - vector2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
}

// Export singleton instances
export const kMeansClusterer = new KMeansClusterer();
export const hierarchicalClusterer = new HierarchicalClusterer();

// Export types
export type { DataPoint, Cluster, ClusteringResult };
