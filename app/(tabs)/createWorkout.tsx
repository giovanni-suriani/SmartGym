import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useSQLiteContext } from "expo-sqlite"
import { Workout, Exercise, WorkoutSet } from "@/constants/types/workout-types"
import * as helperDb from "@/helperDB"
import { Ionicons } from "@expo/vector-icons"
import  AddedExerciseComponent  from "@/components/create-workout-stuff/AddedExerciseComponent"
import { DUMMY_WORKOUT } from "@/constants/DummyWorkoutValues"
// import { DUMMY_EXERCISE4 } from "@/constants/DummyWorkoutValues"


const createWorkout = () => {
  const db = useSQLiteContext()

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <ThemedView style={[styles.themedContainer, { marginBottom: paddingBottomFlatList }]}> */}
        <ThemedView style={styles.themedContainer}>
          <ThemedText type="title" style={styles.titleText}>
            Create Workout
          </ThemedText>
          {/* Icon to add  */}
          <Ionicons name="add-circle" size={100} color="gray" />
          <ThemedText type="default" style={{ maxWidth: 300, textAlign: "center" }}>
            Press the icon above to create your first workout!
          </ThemedText>
          <AddedExerciseComponent exercise={DUMMY_WORKOUT.exercises[0]} />
          <AddedExerciseComponent exercise={DUMMY_WORKOUT.exercises[1]} />
          <AddedExerciseComponent exercise={DUMMY_WORKOUT.exercises[2]} />
          <AddedExerciseComponent exercise={DUMMY_WORKOUT.exercises[3]} />

        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themedContainer: {
    flexGrow: 1,
    alignItems: "center",
    gap: 20,
    // paddingTop: 30,
    // marginBottom: 40,
    // paddingBottom:200
    // justifyContent: "center",
    // backgroundColor: "rgba(16, 163, 126, 0.1)",
  },
  titleText: {
    marginTop: "10%",
  },
})
export default createWorkout
