import { Text } from "react-native"
import { useNavigation } from "@react-navigation/native"

export function EmptyHabits() {
  const { navigate } = useNavigation()

  return (
    <Text className="text-zinc-400 text-base">
      Você não tem hábitos para este dia.{" "}
      <Text
        className="text-violet-400 text-base underline active:violet-500"
        onPress={() => navigate("new")}
      >
        Cadastre um hábito.
      </Text>
    </Text>
  )
}
