import { useQuery } from '@tanstack/react-query'
import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/create-goal'
import { Summery } from './components/summery'
import { EmptyGoals } from './components/empty-goals'
import { getSummery } from './http/get-summery'

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummery,
    staleTime: 1000 * 60 // 60 seconds
  })

  return (
    <Dialog>
      {data?.total && data.total > 0 ? <Summery /> : <EmptyGoals />}

      <CreateGoal />
    </Dialog>
  )
}
