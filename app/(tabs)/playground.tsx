import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { DUMMY_WORKOUT } from "@/constants/DummyWorkoutValues"
import ExerciseComponent from "@/components/in-workout-gym-stuff/ExerciseComponent"
import WorkoutComponent from "@/components/in-workout-gym-stuff/WorkoutComponent"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { ExerciseCategory } from "@/constants/types/workout-types"
import CreatingExercise from "@/components/create-exercise-stuff/CreatingExercise"
import ViewUserExercises from "@/components/create-exercise-stuff/ViewUserExercises"
// import { DUMMY_WORKOUT } from "@/constants/DummyWorkoutValues"

const playground = () => {
  const [textH, setTextH] = useState(0)
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

  const leftViewContent = (
    <>
      <Ionicons name="bicycle" size={24} color={"orange"} />
      <ThemedText
        style={{ flexShrink: 1 }}
        type="defaultSemiBold"
        onLayout={(e) => setTextH(e.nativeEvent.layout.height)}
      >
        This is the content to put on left
      </ThemedText>
    </>
  )

  const rightViewContent = (
    <ThemedText type="defaultSemiBold">{/* Right Content */}4 sets</ThemedText>
  )

  return (
    <ViewUserExercises />
    // <SafeAreaProvider>
    //   <SafeAreaView style={styles.container}>
    //     <ContentBoxLeftSeparatorRight
    //       textH={textH}
    //       leftViewContent={leftViewContent}
    //       rightViewContent={rightViewContent}
    //     ></ContentBoxLeftSeparatorRight>
        
    //     <CreatingExercise position={0} />
    //   </SafeAreaView>
    // </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignContent: "center",
    // justifyContent: "center",
  },
})
export default playground
