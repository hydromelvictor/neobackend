import { z } from 'zod';

export const PasswordHash = z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .refine((val) => /[a-z]/.test(val), {
        message: "Le mot de passe doit contenir une lettre minuscule",
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: "Le mot de passe doit contenir une lettre majuscule",
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Le mot de passe doit contenir un chiffre",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: "Le mot de passe doit contenir un caractère spécial",
    });
