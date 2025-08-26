import React, { useEffect, useState, useMemo } from "react"
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
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons"
import ContentBoxLeftSeparatorRight from "../ui/ContentBoxLeftSeparatorRight"

type Props = {
  exercise: Exercise
  focused?: boolean
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

const AddedExerciseComponent = ({ exercise, focused = false }: Props) => {
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
    }
    if (exercise?.category === ExerciseCategory.CARDIO) {
      return (
        <FontAwesome
          name={"heartbeat"}
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

  const [textH, setTextH] = useState(0)

  const leftViewContent = (
    <>
      {exercise.category && iconReturn()}

      <ThemedText
        style={{ flexShrink: 1 }}
        type="defaultSemiBold"
        onLayout={(e) => setTextH(e.nativeEvent.layout.height)}
      >
        {exercise.name}
      </ThemedText>
    </>
  )
  // variable = variable ?? defalut value // If not provided (null or undefined), use default value
  // ifnot
  const rightViewContent = (
    <ThemedText style={{ flexShrink: 1 }} type="defaultSemiBold">
      {exercise?.category === ExerciseCategory.CARDIO
        ? `${
            exercise.sets[0]?.duration_time_secs != null
              ? exercise.sets[0].duration_time_secs / 60
              : "done"
          } min`
        : `${exercise.plannedSets} sets`}
    </ThemedText>
  )

  return (
    <ContentBoxLeftSeparatorRight
      leftViewContent={leftViewContent}
      rightViewContent={rightViewContent}
      textH={textH}
      focused={focused}
    />
  )
}

export default AddedExerciseComponent
