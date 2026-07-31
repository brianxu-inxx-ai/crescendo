import type { SubmitAttackRequest } from '../../api/types'
import { z } from 'zod'

const submitAttackFormSchema = z.object({
  objective: z
    .string()
    .trim()
    .min(1, 'Objective is required.')
    .max(1000, 'Objective must not exceed 1000 characters.'),
  models: z.array(z.string()).min(1, 'Select at least one model.'),
  strategy: z.enum(['template', 'reactive', 'gemini']),
  temperature: z
    .number()
    .min(0, 'Temperature must be between 0 and 2.')
    .max(2, 'Temperature must be between 0 and 2.'),
  max_turns: z
    .number()
    .int()
    .min(2, 'Max turns must be between 2 and 20.')
    .max(20, 'Max turns must be between 2 and 20.'),
  seed: z.number().int().nullable(),
  authorizedUse: z.boolean().refine((value) => value, {
    message: 'Confirm authorized defensive use before submitting.',
  }),
})

export function validateAttackRequestWithZod(
  payload: SubmitAttackRequest,
  authorizedUse: boolean,
): string[] {
  const result = submitAttackFormSchema.safeParse({
    ...payload,
    authorizedUse,
  })

  if (result.success) {
    return []
  }

  return result.error.issues.map((issue) => issue.message)
}