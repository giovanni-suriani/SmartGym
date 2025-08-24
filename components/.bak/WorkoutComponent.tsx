import React, { useEffect } from "react"
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Exercise, Workout } from "@/constants/types/workout-types"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import ExerciseComponent from "./ExerciseComponent"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useRef } from "react"
import { Colors } from "@/constants/Colors"
import { calculateTotalSets } from "@/core/WorkoutMetrics"
import * as Progress from "react-native-progress"
import { Animated } from "react-native"
import * as testSettings from  "@/settings"



type Props = {
  workout: Workout
  focused?: boolean
}

const WorkoutComponent = ({ workout, focused = false }: Props) => {
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

  const handleDoneDelta = (delta: number) => {
    setWorkoutSetsDone((prev) => {
      
      const next = prev >= 0 ? prev + delta : prev
      setProgress(next / totalSets)
      console.debug(
        `Workout sets done: ${next} / ${totalSets}, progress: ${
          next / totalSets
        }`
      )
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
    inputRange: [0, 0.5, 1],
    outputRange: ["rgb(34,197,94)", "rgb(144,238,144)", "rgb(255,215,0)"],
    // outputRange: ["rgb(43, 255, 0)", "rgb(157, 0, 255)"],
    // outputRange: ["rgb(157, 0, 255)", "rgb(43, 255, 0)" ],
  })

  // const t = useRef(new Animated.Value(0)).current
  // const color = t.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["rgb(239,68,68)", "rgb(34,197,94)"], // red -> green
  // })

  // const paddingBottomFlatList = insets.bottom + tabBarHeight + 20*(totalExercises-1)
  const paddingBottomFlatList = insets.bottom + tabBarHeight + 20

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        {/* <ThemedView style={[styles.themedContainer, { marginBottom: paddingBottomFlatList }]}> */}
        <ThemedView style={styles.themedContainer}>
          <ThemedText type="title" style={styles.titleText}>
            {workout.name}
          </ThemedText>
          {showWorkoutProgressBar && (
            <Progress.Bar
              progress={progress}
              width={200}
              color={barColor as any}
              style={{ marginBottom: 15 }}
              animated={true}
              animationType="spring"
              animationConfig={{ bounciness: 10 }}
              borderColor={
                focused
                  ? Colors.dark.borderColorFocused
                  : Colors.dark.borderColorUnfocused
              }
            />
          )}
          <FlatList
            data={workout.exercises}
            renderItem={({ item }) => (
              <ExerciseComponent
                focused={focused}
                exercise={item}
                onDoneDelta={handleDoneDelta}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            // style={{ alignItems:"center"}} // Or "width: '100%'"
            style={{ alignSelf: "stretch" }} // Or "width: '100%'"
            // contentContainerStyle={styles.flatListContentStyle}
            contentContainerStyle={[
              styles.flatListContentStyle,
              { paddingBottom: paddingBottomFlatList },
            ]}
            // style={{alignContent: "center"}}
            // contentContainerStyle={{ paddingBottom: 20 }}
          />
        </ThemedView>
        {/* <Pressable>
          <Text> </Text>
        </Pressable> */}
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
    gap: 20,
    marginBottom: 40,
    // paddingBottom:200
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
})
export default WorkoutComponent
