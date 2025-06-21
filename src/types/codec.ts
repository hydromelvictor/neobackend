import { z } from 'zod';

// Schémas de validation Zod
export const GenerateCodeSchema = z.object({
  username: z.string()
    .min(1, 'Le nom d\'utilisateur est requis')
    .trim()
});

export const ValidateCodeSchema = z.object({
  code: z.string()
    .length(6, 'Le code doit contenir exactement 6 caractères')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres')
});

export const RemoveCodeSchema = z.object({
  code: z.string()
    .length(6, 'Le code doit contenir exactement 6 caractères')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres')
});
