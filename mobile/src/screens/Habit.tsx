import { useEffect, useState } from "react"
import clsx from "clsx"
import dayjs from "dayjs"
import { useRoute } from "@react-navigation/native"
import { Alert, ScrollView, Text, View } from "react-native"

import { BackButton } from "../components/BackButton"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"
import { Loading } from "../components/Loading"
import { EmptyHabits } from "../components/EmptyHabits"

import { api } from "../lib/axios"
import { generateProgressPercentage } from "../utils/generate-progress-percentage"

interface RouteParams {
  date: string
}

interface HabitsInfo {
  possibleHabits: {
    id: string
    title: string
    createdAt: string
  }[]
  completedHabits: string[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  const route = useRoute()
  const { date } = route.params as RouteParams

  const parsedDate = dayjs(date)
  const weekDay = parsedDate.format("dddd")
  const dayAndMonth = parsedDate.format("DD/MM")

  const isDayInPast = parsedDate.endOf("day").isBefore(new Date())

  const progress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(
        habitsInfo.completedHabits.length,
        habitsInfo.possibleHabits.length
      )
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get("/day", {
        params: { date }
      })

      setHabitsInfo(response.data)
    } catch (error) {
      console.log(error)
      Alert.alert("Ops...", "Não foi possível carregar os hábitos")
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    const isHabitCompleted = habitsInfo!.completedHabits.includes(habitId)

    try {
      await api.patch(`/habits/${habitId}/toggle`)

      let completedHabits: string[] = []

      if (isHabitCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter(
          id => id !== habitId
        )
      } else {
        completedHabits = [...habitsInfo!.completedHabits, habitId]
      }

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits
      })
    } catch (error) {
      console.log(error)
      Alert.alert("Ops...", "Não foi possível marcar o hábito")
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {weekDay}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={progress} />

        <View
          className={clsx("mt-6", {
            "opacity-50": isDayInPast
          })}
        >
          {habitsInfo?.possibleHabits ? (
            habitsInfo?.possibleHabits.map(habit => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                disabled={isDayInPast}
                checked={habitsInfo.completedHabits.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <EmptyHabits />
          )}
        </View>

        {isDayInPast && (
          <Text className="mt-6 text-zinc-400 text-sm">
            Você não pode alterar os hábitos de um dia que já passou.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}
