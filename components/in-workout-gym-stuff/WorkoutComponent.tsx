import React from "react"
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Exercise, Workout } from "@/constants/types/workout-types"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import ExerciseComponent from "./ExerciseComponent"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import { Colors } from "@/constants/Colors"

type Props = {
  workout: Workout
  focused?: boolean
}

const WorkoutComponent = ({ workout, focused = false }: Props) => {
  // const renderItem = () => {}
  // const [exercises, setExercises] = useState<ReadonlyArray<Exercise>>(DUMMY_EXERCISE)
  const exercisesQuery: ReadonlyArray<Exercise> = workout.exercises // Assuming you want to display the first set
  const [exercises, setExercises] = useState<ReadonlyArray<Exercise>>(
    workout.exercises
  )
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()

  
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ThemedView style={styles.themedContainer}>
          <ThemedText type="title" style={styles.titleText}>
            {workout.name}
          </ThemedText>
          <FlatList
            data={workout.exercises}
            renderItem={({ item }) => (
              <ExerciseComponent focused={focused} exercise={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            // style={{ alignItems:"center"}} // Or "width: '100%'"
            style={{ alignSelf: "stretch" }} // Or "width: '100%'"
            contentContainerStyle={[styles.flatListContentStyle, { paddingBottom: insets.bottom + tabBarHeight }]}
            // style={{alignContent: "center"}}
            // contentContainerStyle={{ paddingBottom: 20 }}
            />
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  themedContainer: {
    flexGrow: 1,
    paddingTop: 30,
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "rgba(16, 163, 126, 0.1)",
  },
  titleText: {
    // textDecorationLine: "underline",
    marginTop: "10%",
    borderBottomWidth: 4, // thickness
    borderRadius: 3,
    paddingBottom: 3, // space between text and border
    borderBottomColor: Colors.dark.borderColorUnfocused,
    marginBottom: 15,
  },
  flatListContentStyle: {
    paddingTop: 25,
    gap: 20,
    justifyContent: "center",
    // marginTop: 20,
    // paddingBottom: insets.bottom + tabBarHeight + 12,
    // backgroundColor: "rgba(159, 20, 20, 0.1)",
    // flexGrow: 1,
    // marginTop: 100,
    // justifyContent: "center",
    // paddingBottom: 20,
    // marginBottom: 20,
  },
})
export default WorkoutComponent
