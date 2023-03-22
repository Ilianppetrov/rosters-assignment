import type { z } from 'zod'

export function createValidationResult(error: z.ZodError) {
  const result: Record<string, string> = {}

  for (const x of error.errors) {
    result[x.path.filter(Boolean).join('.')] = x.message
  }

  return result
}
