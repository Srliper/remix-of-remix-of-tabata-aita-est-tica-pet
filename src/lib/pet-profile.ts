import { z } from "zod";

export const petProfileSchema = z.object({
  pet: z.string().trim().max(80),
  tipo: z.enum(["Cachorro", "Gato"]),
  porte: z.enum(["Pequeno", "Médio", "Grande"]),
  pelagem: z.enum(["Curta", "Longa", "Cacheada", "Dupla", "Sem pelos"]),
  necessidades: z.string().trim().min(10).max(2000),
  preferencias: z.string().trim().max(1000),
}).strict();

export type PetProfile = z.infer<typeof petProfileSchema>;
export const serviceNames = ["Banho", "Tosa", "Banho e Tosa", "Estética", "Avaliação veterinária"] as const;
export const recommendationSchema = z.object({
  servico: z.enum(serviceNames),
  motivo: z.string(),
  cuidados: z.array(z.string()),
  alerta: z.string().nullable(),
}).strict();
export type PetRecommendation = z.infer<typeof recommendationSchema>;