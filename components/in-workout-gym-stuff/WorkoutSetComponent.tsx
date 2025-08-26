import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Exercise, WorkoutSet } from "@/constants/types/workout-types"
import { useState } from "react"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import Checkbox from "expo-checkbox"
import { StyleProp, ViewStyle } from "react-native"
import * as testSettings from "@/settings"

type Props = {
  style?: StyleProp<ViewStyle>
  workoutSet: WorkoutSet
  forceDone?: number
  handleCheckChange?: (value: number) => void
}

const WorkoutSetComponent = ({
  style,
  workoutSet,
  handleCheckChange,
  forceDone,
}: Props) => {
  const { loadUnit, timeUnit, showWorkoutSetCheckbox } = useWorkoutContext()
  const [checked, setChecked] = useState<number>(0)

  useEffect(() => {
    if ((forceDone ?? 0) > 0) {
      if (checked === 0) {
        setChecked(1)
        handleCheckChange?.(1)
      }
      if (testSettings.TEST_DONE_BUTTON && forceDone === 2) {
        setChecked(0)
        handleCheckChange?.(0)
      }
    }
  }, [forceDone]) // when dependencies change, the effect runs again
  // empty dependencies array [] means the effect runs only once after the initial render

  const onToggle = (value: boolean) => {
    switch (true) {
      case value && checked === 0:
        setChecked(1)
        handleCheckChange?.(1)
        break;
      case !value && checked === 1:
        setChecked(2)
        handleCheckChange?.(2)
        break;
      case !value && checked === 2:
        setChecked(0)
        handleCheckChange?.(0)
        break;
      default:
        break;
    }

  }

  const textCardioOrWeight = () => {
    if (workoutSet.loadKg !== undefined) {
      // console.log(`thing ncc reloaded`)
      return `${workoutSet.reps} x ${workoutSet.loadKg} ${loadUnit}`
    }
    const workoutSetRepsString = workoutSet.reps > 1 ? `${workoutSet.reps} x ` : ""
    
    if (
      workoutSet.duration_time_secs !== undefined &&
      (timeUnit === "sec" || workoutSet.duration_time_secs < 60)
    ) {
      return `${workoutSetRepsString}${workoutSet.duration_time_secs} ${timeUnit}`
    }
    if (workoutSet.duration_time_secs !== undefined && timeUnit === "min") {
      return `${workoutSetRepsString}${(workoutSet.duration_time_secs / 60).toFixed(1)} ${timeUnit}`
    }
    return `Wrong Data Provided`
  }

  const colorChecked = () => {
    if (checked === 1) {
      return "rgb(0, 172, 14)"
      // return "red"
    }
    if (checked === 2) {
      return "red"
    }
    return undefined
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.rowText]}>
        <ThemedText type={"default"} style={(checked === 1 || checked === 2) && styles.dashedText}>
          {`${workoutSet.position}. `}
          {`${workoutSet.isWarmup ? "Warmup Set" : "Working Set"}: `}
          {textCardioOrWeight()}
        </ThemedText>
      </View>
      {showWorkoutSetCheckbox && (
        <Checkbox
          style={styles.checkbox}
          value={checked === 1 || checked === 2}
          onValueChange={onToggle} // passing a callback function
          // onValueChange={setChecked, handleChildCheckChange}
          color={colorChecked()}
        />
      )}
    </View>
  )
}

const checkboxSize = 24

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
  },
  rowText: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    textDecorationLine: "line-through",
    // paddingTop: 15,
    // paddingVertical: 15,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  dashedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "dashed",
  },
  checkbox: {
    width: checkboxSize * 1.2,
    height: checkboxSize,
    borderRadius: 10,
    // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
    // margin: 8,
  },
})
export default WorkoutSetComponent
