import { z } from 'zod';

export const DiscoveryRequestSchema = z.object({
  platform: z.string().min(1, 'A plataforma é obrigatória'),
  accountId: z.string().optional(),
  query: z.string().min(1, 'O termo de busca (query) é obrigatório'),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['RELEVANCE', 'PRICE_LOW_HIGH', 'PRICE_HIGH_LOW', 'RATING', 'NEWEST']).optional().default('RELEVANCE'),
  limit: z.number().int().min(1).max(50, 'Limite máximo de 50 produtos por requisição').optional().default(20),
  page: z.number().int().min(1).max(10, 'Página máxima é 10').optional().default(1),
  country: z.string().optional().default('BR'),
  language: z.string().optional().default('pt-BR'),
  metadata: z.record(z.unknown()).optional(),
});

export type DiscoveryRequest = z.infer<typeof DiscoveryRequestSchema>;

export interface DiscoveryResult {
  success: boolean;
  searchId?: string;
  jobId?: string;
  platform: string;
  accountId?: string;
  query: string;
  totalFound: number;
  imported: number;
  updated: number;
  duplicates: number;
  rejected: number;
  products: any[];
  warnings: string[];
  errors: string[];
  executionTimeMs: number;
}

export interface DiscoveryCache {
  get(key: string): Promise<DiscoveryResult | null>;
  set(key: string, result: DiscoveryResult, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

export interface ManualImportInput {
  affiliatePlatformId: string;
  externalId: string;
  title: string;
  description?: string;
  productUrl: string;
  imageUrl?: string;
  currentPrice: number;
  previousPrice?: number;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  availability?: boolean;
  affiliateUrl?: string;
  notes?: string;
  source?: string;
}
