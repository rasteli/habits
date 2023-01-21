import {
  TouchableOpacity,
  Dimensions,
  TouchableOpacityProps
} from "react-native"
import clsx from "clsx"
import { generateProgressPercentage } from "../utils/generate-progress-percentage"
import dayjs from "dayjs"

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE =
  Dimensions.get("screen").width / WEEK_DAYS - SCREEN_HORIZONTAL_PADDING - 5

interface HabitDayProps extends TouchableOpacityProps {
  date: Date
  amount?: number
  completed?: number
}

export function HabitDay({
  date,
  amount = 0,
  completed = 0,
  ...rest
}: HabitDayProps) {
  const today = dayjs().startOf("day").toDate()
  const isToday = dayjs(date).isSame(today)

  const progress =
    amount > 0 ? generateProgressPercentage(completed, amount) : 0

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx("border-2 rounded-lg m-1", {
        "bg-violet-500 border-violet-400": progress >= 80,
        "bg-violet-600 border-violet-500": progress >= 60 && progress < 80,
        "bg-violet-700 border-violet-500": progress >= 40 && progress < 60,
        "bg-violet-800 border-violet-600": progress >= 20 && progress < 40,
        "bg-violet-900 border-violet-700": progress > 0 && progress < 20,
        "bg-zinc-900 border-zinc-800": progress === 0,
        "border-white border-4": isToday
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      {...rest}
    />
  )
}
