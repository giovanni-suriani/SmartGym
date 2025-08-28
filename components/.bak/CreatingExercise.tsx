import React, { useState } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet, TextInput } from "react-native"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Workout, Exercise, WorkoutSet, ExerciseCategory } from "@/constants/types/workout-types"
import { DUMMY_SET1 } from "@/constants/DummyWorkoutValues"
import { Picker } from "@react-native-picker/picker"
import { ViewProps } from "react-native"
import WorkoutTextInput from "../ui/WorkoutTextInput"
import WorkoutPickerInput from "../ui/WorkoutPickerInput"

type Props = ViewProps &{
  position: number
}

const CreatingExercise = ({ position, ...otherProps }: Props) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]
  const [exerciseName, setExerciseName] = useState<string>("") //Obligatory
  const [weightGap, setWeightGap] = useState<number>()
  const [exerciseCategory, setExerciseCategory] = useState<string>("") //Obligatory
  const [exerciseSets, setExerciseSets] = useState<WorkoutSet[]>([]) //Obligatory
  const [restSec, setRestSec] = useState<number>()
  const [notes, setNotes] = useState<string>()
  const [progressRate, setProgressRate] = useState<number>()
  const [plannedSets, setPlannedSets] = useState<number>(0) //Obligatory
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([DUMMY_SET1]) //Obligatory

  return (
    <ThemedView style = {styles.container}>
      <WorkoutTextInput
        placeholder="Exercise Name"
        onChangeText={(text) => setExerciseName(text)}
        value={exerciseName}
        style={{}}
      />
      <WorkoutPickerInput
      selectedValue={exerciseCategory}
      onValueChange={(val) => setExerciseCategory(val as ExerciseCategory | "")}
      mode="dropdown"
      >
         <Picker.Item
            label="Select Exercise Category"
            value=""
            color={Colors[colorScheme ?? "light"].placeholderText}
          />
          {Object.values(ExerciseCategory).map((cat) => (
            <Picker.Item
            key={cat} 
            label={cat.replaceAll("_", " ")} 
            value={cat} />
          ))}
      </WorkoutPickerInput>
      {/* <Picker
          selectedValue={exerciseCategory}
          onValueChange={(val) => setExerciseCategory(val as ExerciseCategory | "")}
          mode="dropdown"
          dropdownIconColor={Colors[colorScheme ?? "light"].text}
          style={{ color: Colors[colorScheme ?? "light"].text, marginHorizontal: "10%" }}
        >
          <Picker.Item
            label="Select Exercise Category"
            value=""
            color={Colors[colorScheme ?? "light"].placeholderText}
          />
          {Object.values(ExerciseCategory).map((cat) => (
            <Picker.Item
            key={cat} 
            label={cat.replaceAll("_", " ")} 
            value={cat} />
          ))}
        </Picker> */}
      <WorkoutTextInput
        style={{
          height: 40,
          borderColor: Colors[colorScheme ?? "light"].borderColorUnfocused,
          borderWidth: 1,
          margin: 12,
          padding: 10,
          color: Colors[colorScheme ?? "light"].text,
        }}
        placeholder="Exercise Category"
        placeholderTextColor={Colors[colorScheme ?? "light"].placeholderText}
        onChangeText={(text) => setExerciseCategory(text)}
        value={exerciseCategory}
      />
      {/* <TextInput
        style={{
          height: 40,
          borderColor: Colors[colorScheme ?? "light"].borderColorUnfocused,
          borderWidth: 1,
          margin: 12,
          padding: 10,
          color: Colors[colorScheme ?? "light"].text,
        }}
        placeholder="Planned Sets"
        placeholderTextColor={Colors[colorScheme ?? "light"].placeholderText}
        onChangeText={(text) => setPlannedSets(Number(text))}
        // value={plannedSets.toString()}
        keyboardType="numeric"
      /> */}
      {/* Add more inputs for other fields as needed */}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
})
export default CreatingExercise
