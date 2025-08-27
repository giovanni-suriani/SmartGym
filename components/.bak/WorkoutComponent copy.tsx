import React, { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Exercise, Workout } from "@/constants/types/workout-types"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import ExerciseComponent from "./ExerciseComponent"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useRef } from "react"
import { Colors } from "@/constants/Colors"
import { calculateTotalSets } from "@/core/WorkoutMetrics"
import * as Progress from "react-native-progress"
import { Animated } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import * as testSettings from "@/settings"
import WorkoutProgressBar from "../ui/WorkoutProgressBar"
import CongratsConfetti from "@/components/ui/CongratsConfetti"

type Props = {
  workout: Workout
  focused?: boolean
}

// type checkedSetsByExercise = {
//   [id: number]: number[]
// }

type CheckedSetsByExercise = Record<number, number[]>

const WorkoutComponent = ({ workout, focused = false }: Props) => {
  const colorScheme = useColorScheme()
  const { showWorkoutProgressBar } = useWorkoutContext()
  const [progress, setProgress] = useState<number>(0)
  const [workoutSetsDone, setWorkoutSetsDone] = useState<number>(0)
  const exercisesQuery: ReadonlyArray<Exercise> = workout.exercises // Assuming you want to display the first set
  const [exercises, setExercises] = useState<ReadonlyArray<Exercise>>(
    workout.exercises
  )

  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const totalSets = calculateTotalSets({ workout })
  const totalExercises = workout.exercises.length
  const indexes = workout.exercises.map((ex) => ex.id)
  const [fire, setFire] = useState<boolean>(false)
  const [checkedSetsMap, setCheckedSetsMap] = useState<CheckedSetsByExercise>(
    indexes.reduce((accumulator, id, index) => {
      accumulator[id] = new Array(workout.exercises[index].sets.length).fill(0)
      return accumulator
    }, {} as CheckedSetsByExercise)
  )

  // const [checkedSetsMap, setCheckedSetsMap] = useState<checkedSetsByExercise>({})
  // Array.from(indexes, () => new Array(totalSets).fill(0)

  // Whenever an exercise reports a change in its checked sets

  const workoutHandleCheckChange = (
    checkedSets: number[],
    exerciseId: number
  ) => {
    console.log(
      `Exercise ID: ${exerciseId}, Checked Sets: ${JSON.stringify(checkedSets)}`
    )
    setCheckedSetsMap((prev) => {
      const next = { ...prev, [exerciseId]: checkedSets }
      const doneSets = Object.values(next)
        .flat()
        .filter((v) => v === 1 || v === 2).length
      setWorkoutSetsDone(doneSets)
      setProgress(doneSets / totalSets)
      if (doneSets === totalSets) {
        console.info("Workout Complete!")
        setFire(true)
        setTimeout(() => setFire(false), 5000) // Stop confetti after 5 seconds
        // Alert.alert("Workout Complete!", "Congratulations on finishing your workout!", [{ text: "OK" }], { cancelable: true })
      }
      return next
    })
  }

  const colorAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: Math.max(0, Math.min(1, progress)),
      duration: 300,
      useNativeDriver: false, // ❗ color interpolation cannot use native driver
    }).start()
  }, [progress])

  const barColor = colorAnim.interpolate({
    // inputRange: [0, 0.5, 1],
    // outputRange: ["rgb(34,197,94)", "rgb(144,238,144)", "rgb(255,215,0)"],
    inputRange: [0, 1],
    // outputRange: ["rgb(43, 255, 0)", "rgb(157, 0, 255)"],
    outputRange: ["rgb(157, 0, 255)", "rgb(18, 182, 0)"],
  })

  // const t = useRef(new Animated.Value(0)).current
  // const color = t.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["rgb(239,68,68)", "rgb(34,197,94)"], // red -> green
  // })

  // const paddingBottomFlatList = insets.bottom + tabBarHeight + 20*(totalExercises-1)
  const paddingBottomFlatList = insets.bottom + tabBarHeight + 15

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <ThemedView style={[styles.themedContainer, { marginBottom: paddingBottomFlatList }]}> */}
        <ThemedView style={styles.themedContainer}>
          <ThemedText
            type="title"
            style={[
              styles.titleText,
              {
                borderBottomColor:
                  Colors[colorScheme ?? "light"].borderColorUnfocused,
              },
            ]}
          >
            {workout.name}
          </ThemedText>
          {showWorkoutProgressBar && <WorkoutProgressBar progress={progress} />}
          <FlatList
            data={workout.exercises}
            renderItem={({ item }) => (
              <ExerciseComponent
                focused={focused}
                exercise={item}
                workoutHandleCheckChange={(checkedSets) =>
                  workoutHandleCheckChange(checkedSets, item.id)
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            style={{ alignSelf: "stretch" }} // Or "width: '100%'"
            contentContainerStyle={[
              styles.flatListContentStyle,
              { paddingBottom: paddingBottomFlatList },
            ]}
            ListFooterComponent={
              <Pressable
                style={styles.finishWorkoutButton}
                // onPress = {
                //   () => {
                //     setProgress(0)
                //     setWorkoutSetsDone(0)
                //     console.log(`Progress and setsDone set to 0`);
                //   }
                // }
                onPress={() => {
                  // Finish workout logic here
                  progress == 1
                    ? console.info("Workout already completed!")
                    : Alert.alert(
                        "Not all sets are done",
                        "Do you want to finish the workout anyway?",
                        [{ text: "Cancel" }, { text: "Finish anyway" }],
                        { cancelable: true }
                      )
                }}
              >
                <ThemedText>Finish Workout</ThemedText>
                <CongratsConfetti fire={fire} />
              </Pressable>
            }
          />
          {/* <View style={{ alignSelf: "stretch"}}>
            <ExerciseComponent exercise={workout.exercises[0]} />
            </View> */}
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
    marginBottom: 40,
    // paddingBottom:200
    // justifyContent: "center",
    // backgroundColor: "rgba(16, 163, 126, 0.1)",
  },
  titleText: {
    marginTop: "10%",
    borderBottomWidth: 4, // thickness
    borderRadius: 3,
    paddingBottom: 3, // space between text and border
    // textDecorationLine: "underline",
    // borderBottomColor: Colors[colorScheme ?? "light"].borderColorUnfocused,
    // marginBottom: 15,
  },
  flatListContentStyle: {
    paddingTop: 25,
    gap: 20,
    justifyContent: "center",
    // flexGrow: 1,
    // alignItems: "center",
    // paddingBottom: 100,
    // paddingBottom: insets.bottom + tabBarHeight + 20,
    // marginTop: 20,
    // paddingBottom: insets.bottom + tabBarHeight + 12,
    // backgroundColor: "rgba(159, 20, 20, 0.1)",
    // flexGrow: 1,
    // marginTop: 100,
    // justifyContent: "center",
    // paddingBottom: 20,
    // marginBottom: 20,
  },
  finishWorkoutButton: {
    width: "80%",
    marginTop: 10,
    padding: 7,
    backgroundColor: Colors.mutual.inWorkoutFinishWorkoutButtonBackground, // Blue
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
})
export default WorkoutComponent
