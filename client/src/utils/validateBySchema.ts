import type { z } from 'zod'
import { createValidationResult } from './createValidationResult'

export function validateBySchema<T>(
  data: T,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const parsedData = schema.parse(data)
    return {
      success: true,
      data: parsedData
    }
  } catch (error) {
    console.log(error)

    const errors = createValidationResult(error as z.ZodError)

    return {
      success: false,
      errors
    }
  }
}
