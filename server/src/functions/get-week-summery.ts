import { and, count, gte, lte, eq, sql, desc } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'
import { string } from 'zod'

export async function getWeekSummery() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_uo_to_week').as(
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

    const goalsCompletedInWeek = db.$with('goal_completed_in_week').as(
        db
            .select({
                id: goalCompletions.id,
                title: goals.title,
                completedAd: goalCompletions.createdAd,
                completedAdDate: sql /*sql*/`
                    DATE(${goalCompletions.createdAd})
                `.as('completedAdDate'),
            })
            .from(goalCompletions)
            .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
            .orderBy(desc(goalCompletions.createdAd))
            .where(
                and(
                    gte(goalCompletions.createdAd, firstDayOfWeek),
                    lte(goalCompletions.createdAd, lastDayOfWeek)
                )
            )
    )

    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
        db
            .select({
                completedAdDate: goalsCompletedInWeek.completedAdDate,
                completions: sql /* sql */`
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ${goalsCompletedInWeek.id},
                            'title', ${goalsCompletedInWeek.title},
                            'completedAd', ${goalsCompletedInWeek.completedAd}
                        )
                    )
                `.as('completions'),
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAdDate)
            .orderBy(desc(goalsCompletedInWeek.completedAdDate))
    )

    type GoalsPerDay = Record<string, {
        id: string,
        title: string,
        completeAd: string
    }[] >

    const result = await db
        .with(
            goalsCreatedUpToWeek,
            goalsCompletedInWeek,
            goalsCompletedByWeekDay
        )
        .select({
            completed: sql /* sql */`
                    (SELECT count(*) FROM ${goalsCompletedInWeek})
                `.mapWith(Number),
            total: sql /* sql */`
                    (SELECT sum(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
                `.mapWith(Number),
            goalsPerDay: sql /* sql */<GoalsPerDay>`
                    JSON_OBJECT_AGG(
                        ${goalsCompletedByWeekDay.completedAdDate},
                        ${goalsCompletedByWeekDay.completions}
                    )
                `,
        })
        .from(goalsCompletedByWeekDay)

    return {
        summery: result[0],
    }
}
