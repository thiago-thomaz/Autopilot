import { z } from 'zod';

export const n8nEventSchema = z.object({
  event: z.string().min(1, 'O nome do evento é obrigatório'),
  source: z.string().default('n8n'),
  timestamp: z.string().datetime({ message: 'Timestamp em formato ISO-8601 obrigatório' }),
  payload: z.record(z.unknown()).default({}),
});

export type N8NEventInput = z.infer<typeof n8nEventSchema>;
