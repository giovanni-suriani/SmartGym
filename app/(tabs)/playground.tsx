import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { DUMMY_WORKOUT } from "@/constants/DummyWorkoutValues"
import ExerciseComponent from "@/components/in-workout-gym-stuff/ExerciseComponent"
import WorkoutComponent from "@/components/in-workout-gym-stuff/WorkoutComponent"


const ComponentName = () => {
  return (
    <WorkoutComponent workout={DUMMY_WORKOUT} focused={false}/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  
})
export default ComponentName
