import { z } from 'zod';

const TadminCreate = z.object({
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(20),
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    cni: z.string().min(5).max(20),
    position: z.string().min(3).max(20)
});

export { TadminCreate };
