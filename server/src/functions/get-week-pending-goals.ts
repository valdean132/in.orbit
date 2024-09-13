import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, sql, lte, count, gte, eq } from 'drizzle-orm'

export async function getWeekPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createAd: goals.createdAd,
            })
            .from(goals)
            .where(lte(goals.createdAd, lastDayOfWeek))
    )

    const goalCompletionCounts = db.$with('goal_completion_counts').as(
        db
            .select({
                goalId: goalCompletions.goalId,
                completionCount: count(goalCompletions.id).as(
                    'completionCount'
                ),
            })
            .from(goalCompletions)
            .where(
                and(
                    gte(goalCompletions.createdAd, firstDayOfWeek),
                    lte(goalCompletions.createdAd, lastDayOfWeek)
                )
            )
            .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
            id: goalsCreatedUpToWeek.id,
            title: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
            completionCount: sql /*sql*/`
                COALESCE(${goalCompletionCounts.completionCount}, 0)
            `.mapWith(Number),
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(
            goalCompletionCounts,
            eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
        )

    return {
        pendingGoals,
    }
}
