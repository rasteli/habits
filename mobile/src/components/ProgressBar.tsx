import { useEffect } from "react"
import { View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated"

interface ProgressBarProps {
  progress?: number
}

export function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const sharedProgress = useSharedValue(progress)

  useEffect(() => {
    sharedProgress.value = withTiming(progress)
  }, [progress])

  const style = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`
    }
  })

  return (
    <View className="bg-zinc-700 mt-4 rounded-xl w-full h-3">
      <Animated.View className="bg-violet-600 rounded-xl h-3" style={style} />
    </View>
  )
}
