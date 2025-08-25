import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import {
  Workout,
  Exercise,
  ExerciseCategory,
  WorkoutSet,
} from "@/constants/types/workout-types"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

type Props = {
  exercise: Exercise
}

const iconMap: Record<
  ExerciseCategory,
  | "bicycle"
  | "body-outline"
  | "barbell"
  | "git-pull-request"
  | "settings"
  | "help-circle"
> = {
  [ExerciseCategory.CARDIO]: "bicycle",
  [ExerciseCategory.BODYWEIGHT]: "body-outline",
  [ExerciseCategory.DUMBBELL]: "body-outline",
  [ExerciseCategory.BARBELL]: "barbell",
  [ExerciseCategory.CABLE]: "git-pull-request",
  [ExerciseCategory.SMITH_MACHINE]: "settings",
  [ExerciseCategory.OTHER]: "help-circle",
}

const AddedExerciseComponent = ({ exercise }: Props) => {
  const colorScheme = useColorScheme()
  const iconReturn = () => {
    if (exercise?.category === ExerciseCategory.DUMBBELL) {
      return (
        <MaterialCommunityIcons
          name={"dumbbell"}
          size={24}
          color={Colors[colorScheme ?? "light"].icon}
        />
      )
    } else {
      // console.log(`to te lascando kk`);
      return (
        <Ionicons
          name={iconMap[exercise?.category ?? ExerciseCategory.OTHER]}
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      )
    }
  }

  const [textH, setTextH] = React.useState(0)

  return (
    <ThemedView
      style={[
        styles.container,
        { borderColor: Colors[colorScheme ?? "light"].borderColorUnfocused },
      ]}
    >
      {exercise.category && iconReturn()}
      {/* <FontAwesome5 name={"dumbbell"} size={24} color={Colors[colorScheme ?? "light"].text} /> */}
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <ThemedText
          type="defaultSemiBold"
          // style={[styles.text, { width: "65%" }]}
          style={{ width: "55%" }}
          onLayout={(e) => setTextH(e.nativeEvent.layout.height)}
        >
          {exercise.name}
        </ThemedText>
        {/* Separator Line */}
        <View
          style={{
            // position: "absolute",
            // left: "67%",
            // position: "relative"
            flexDirection: "column",
            height: textH,
            backgroundColor: "lightgray",
            width: 1,
          }}
        />
        {/* Sets Info */}
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "green",
            // position: "relative",
            // width: "10%",
            // position: "relative",
            // alignItems: "stretch",
          }}
        >
          {/* <View style={{ flexGrow:1, flexDirection: "row", alignSelf: "center" }}> */}
          <ThemedText
            type="defaultSemiBold"
            style={[styles.text]}
            // style={[styles.text, {paddingHorizontal:5}]}
            // style={[styles.text, {alignSelf: "center", backgroundColor: "green"}]}
          >
            {exercise.plannedSets} sets
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink:1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: "10%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // width: "80%",
    // padding: "2%",
  },
  text: {
    // flexWrap: "wrap",
    // flexShrink: 1,
    // backgroundColor: "orange",
    // width: "70%",
    // textOverflow: "ellipsis",
  },
})
export default AddedExerciseComponent
