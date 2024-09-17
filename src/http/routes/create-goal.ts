import { createGoal } from '../../app/functions/create-goal'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const createGoalSchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export const createGoalRoute: FastifyPluginAsync = async app => {
  app.post(
    '/goals',
    async request => {
      // Validate the body using zod
      const result = createGoalSchema.safeParse(request.body)

      if (!result.success) {
        return { error: result.error.errors } // Return validation error
      }

      const { title, desiredWeeklyFrequency } = result.data

      const { goal } = await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      return { goalId: goal.id }
    }
  )
}
