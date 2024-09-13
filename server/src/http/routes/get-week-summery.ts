import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummery } from '../../functions/get-week-summery'

export const getWeekSummeryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summery', async () => {
    const { summery } = await getWeekSummery()

    return {
      summery,
    }
  })
}
