import { z } from 'zod'

export const clientSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
    phone: z.string().min(10, 'Telefone inválido'),
    birthdate: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    zipcode: z.string().length(8, 'CEP deve ter 8 dígitos'),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string()
})

export type ClientSchema = z.infer<typeof clientSchema> 