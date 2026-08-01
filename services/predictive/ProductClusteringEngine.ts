import { FeatureVector } from '../../types/predictive/features.types';

export interface ProductClusterAssignment {
  clusterId: string;
  clusterName: string;
  category: string;
  priceRange: string;
}

export class ProductClusteringEngine {
  public assignCluster(featureVector: FeatureVector, category: string): ProductClusterAssignment {
    const price = Number(featureVector.features['price'] ?? 0);
    
    let priceRange = 'MID';
    if (price < 30) priceRange = 'BUDGET';
    else if (price > 150) priceRange = 'PREMIUM';

    const clusterId = `cluster-${category.toLowerCase()}-${priceRange.toLowerCase()}`;
    const clusterName = `${category.toUpperCase()} ${priceRange} Cluster`;

    return {
      clusterId,
      clusterName,
      category,
      priceRange
    };
  }
}
