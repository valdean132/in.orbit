import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { getSummery } from '../http/get-summery'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { PendingGoals } from './pending-goals'

dayjs.locale(ptBR)

export function Summery() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummery,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  /* Data */
  const firstWeek = dayjs().startOf('week').format('MMM')
  const lastWeek = dayjs().startOf('week').format('MMM')
  const firstDayOfWeek = dayjs().startOf('week').format('DD')
  const lastDayOfWeek = dayjs().endOf('week').format('DD')

  const formatFirstWeek = firstWeek.charAt(0).toUpperCase() + firstWeek.slice(1)
  const formatLastWeek = lastWeek.charAt(0).toUpperCase() + lastWeek.slice(1)

  const weekGoals =
    firstWeek === lastWeek
      ? `${firstDayOfWeek} a ${lastDayOfWeek} de ${formatFirstWeek}`
      : `${firstDayOfWeek} de ${formatFirstWeek} a ${lastDayOfWeek} de ${formatLastWeek}`

  /* Data */

  /* Progresso calculo */
  const completedPercentege = Math.round((data.completed * 100) / data.total)
  /* Progresso calculo */

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex item-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">{weekGoals}</span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercentege}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de{' '}
            <span className="text-zinc-100">{data?.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentege}%</span>
        </div>

        <Separator />

        <PendingGoals />

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-medium">Sua semana</h2>

          {Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const formattedDate = dayjs(date).format('DD [de] MMMM')

            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay} </span>
                  <span className="text-zinc-400 text-xs">
                    ({formattedDate})
                  </span>
                </h3>

                <ul className="flex flex-col gap-3">
                  {goals.map(goal => {
                    const time = dayjs(goal.completedAd).format('HH:mm')

                    return (
                      <li key={goal.id} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{time}h</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
