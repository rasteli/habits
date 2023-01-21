import dayjs from "dayjs"
import { useCallback, useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { Header } from "../components/Header"
import { Loading } from "../components/Loading"
import { HabitDay, DAY_SIZE } from "../components/HabitDay"

import { api } from "../lib/axios"
import { generateDatesFromYearStart } from "../utils/generate-dates-from-year-start"

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]
const datesFromYearStart = generateDatesFromYearStart()
const minimumSummaryDateSize = 18 * 5
const amountOfDaysToFill = minimumSummaryDateSize - datesFromYearStart.length

export function Home() {
  const { navigate } = useNavigation()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>([])

  async function fetchData() {
    try {
      setLoading(true)

      const response = await api.get<Summary>("/summary")
      setSummary(response.data)
    } catch (error) {
      Alert.alert("Ops...", "Ocorreu um erro ao buscar os dados")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center m-1"
            style={{ width: DAY_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map(date => {
            const dayWithHabits = summary.find(day => {
              return dayjs(date).isSame(day.date, "day")
            })

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            )
          })}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 border-2 border-zinc-800 rounded-lg m-1 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  )
}
