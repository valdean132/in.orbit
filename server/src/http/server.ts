import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createCompletionRoute } from './routes/create-completions'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { getWeekSummeryRoute } from './routes/get-week-summery'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()


app.register(fastifyCors, { 
    origin: '*',
 })

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummeryRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server runnung!')
  })
