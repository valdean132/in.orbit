type SummeryResponse = {
    completed: number
    total: number
    goalsPerDay: Record<
      string,
      {
        id: string
        title: string
        completedAd: string
      }[]
    >
  }

export async function getSummery(): Promise<SummeryResponse> {
    const response = await fetch('http://localhost:3333/summery')
      const data = await response.json()

      return data.summery
}