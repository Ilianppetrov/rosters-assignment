import { z } from 'zod'

export const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password must be at least 6 symbols' }),
  confirmPassword: z.string(),
  token: z.string({ required_error: 'Token is required' })
})

export type UserRegister = z.infer<typeof userRegisterSchema>

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  token: z.string({ required_error: 'Token is required' })
})

export type UserLogin = z.infer<typeof userLoginSchema>

export const teamShema = z.object({
  id: z.number(),
  name: z.string()
})

export type Team = z.infer<typeof teamShema>

const playerSchema = z.object({
  id: z.number(),
  name: z.string(),
  isInjured: z.boolean(),
  teamId: z.number()
})

export type Player = z.infer<typeof playerSchema>

export const teamDetailsSchema = z.object({
  team: teamShema,
  players: z.array(playerSchema)
})

export type TeamDetails = z.infer<typeof teamDetailsSchema>
