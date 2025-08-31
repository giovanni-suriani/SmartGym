import React, { useState } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"
import {
  Workout,
  Exercise,
  WorkoutSet,
  ExerciseCategory,
} from "@/constants/types/workout-types"
import { DUMMY_SET1 } from "@/constants/DummyWorkoutValues"
import { Picker } from "@react-native-picker/picker"
import { ViewProps } from "react-native"
import WorkoutTextInput from "../ui/workoutInputs/WorkoutTextInput"
import WorkoutPickerInput from "../ui/workoutInputs/WorkoutPickerInput"
import { useWorkoutContext } from "@/hooks/WorkoutContext"
import { createUserExercise, getMaxExerciseId, RowExercise } from "@/helperDB"
import * as helperDb from "@/helperDB"
import { useSQLiteContext } from "expo-sqlite"
// import { ScrollView } from "react-native-gesture-handler"
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated"

type Props = ViewProps & {
  position: number
  workoutCreateExercise?: (exercise: Exercise) => void
}

const CreatingExercise = ({ position = 0, workoutCreateExercise, ...otherProps }: Props) => {
  const colorScheme = useColorScheme()
  const db = useSQLiteContext()
  const { loadUnit, timeUnit, showWorkoutSetCheckbox } = useWorkoutContext()
  const theme = Colors[colorScheme ?? "light"]
  // const exerciseName = "arrozFrito"
  // const exerciseCategory = ExerciseCategory.DUMBBELL
  const [exerciseName, setExerciseName] = useState<string>("") //Obligatory
  const [exerciseCategory, setExerciseCategory] = useState<string>("") //Obligatory
  // const [plannedSets, setPlannedSets] = useState<number>(0) //It will be used to create default sets
  const [weightGap, setWeightGap] = useState<number>()
  const [restSec, setRestSec] = useState<number>()
  const [progressRate, setProgressRate] = useState<number>()
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([DUMMY_SET1]) //Obligatory

  return (
    // Change to ScrollView, items are fixed

    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ gap: 25 }}
    >
      <WorkoutTextInput
        value={exerciseName}
        label="Type the Exercise Name *"
        placeholder="Exercise Name"
        onChangeText={(text) => setExerciseName(text)}
      />

      <WorkoutPickerInput
        label="Select the Exercise Category *"
        selectedValue={exerciseCategory}
        onValueChange={(val) =>
          setExerciseCategory(val as ExerciseCategory | "")
        }
        mode="dropdown"
      >
        <Picker.Item
          label="Exercise Categories"
          value=""
          color={theme.placeholderText}
        />
        {Object.values(ExerciseCategory).map((cat) => (
          <Picker.Item key={cat} label={cat.replaceAll("_", " ")} value={cat} />
        ))}
      </WorkoutPickerInput>

      <WorkoutTextInput
        value={weightGap?.toString() ?? ""}
        label={`Weight Gap (e.g., 2.5 for 2.5${loadUnit} plates)`}
        placeholder="Weight Gap"
        placeholderTextColor={theme.placeholderText}
        onChangeText={(text) => setWeightGap(Number(text))}
        keyboardType="numeric"
      />

      <WorkoutTextInput
        value={restSec?.toString() ?? ""}
        label="Rest (seconds)"
        placeholder="Planned Rest"
        placeholderTextColor={theme.placeholderText}
        onChangeText={(text) => setRestSec(Number(text))}
        keyboardType="numeric"
      />

      <WorkoutTextInput
        value={progressRate?.toString() ?? ""}
        label="Progress Rate (% per workout session)"
        placeholder="Progress Rate"
        placeholderTextColor={theme.placeholderText}
        onChangeText={(text) => setProgressRate(Number(text))}
        keyboardType="numeric"
      />

      {/* Future implementation for notes */}
      {/* <WorkoutTextInput
        value={notes}
        label="Notes"
        placeholder="Additional Notes"
        onChangeText={(text) => setNotes(text)}
        multiline
      /> */}

      {/* Create Exercise Button */}
      <Pressable
        style={styles.createButton}
        onPress={async () => {
          if (
            exerciseName.trim() === "" ||
            exerciseCategory.trim() === "" ||
            workoutSets.length === 0
          ) {
            alert(
              "Please fill in all obligatory fields: Exercise Name, Exercise Category, Planned Sets (greater than 0) and at least one Set."
            )
            return
          }

          // const dummySet = DUMMY_SET1

          const newExercise: Omit<RowExercise, "id" | "workout_id"> = {
            name: exerciseName,
            category: exerciseCategory as ExerciseCategory,
            weightGap: weightGap,
            restSec: restSec,
            progressRate: progressRate,
            position: position,             
          }

          console.log(`trying to create exercise ...`);

          try {
            const id = await createUserExercise(db, newExercise);
            console.log(`Exercise created with ID: ${id}`);
            const createdExercise = await helperDb.getExercise(db, id); 
            if (createdExercise) {
              console.log(`Created Exercise:`, createdExercise);
              workoutCreateExercise?.(createdExercise);   
              // helperDb.deleteAllUserExercisesCreatedExercises(db); // Clear all after creating one              
            } else {
              console.warn("Inserted exercise not found by id:", id);
            }
          } catch (error) {
            console.error("Error creating exercise:", error);
            alert("There was an error creating the exercise. Please try again.");
          }

          // createUserExercise(db, newExercise)
          //   .then((id) => {
          //     console.log(`Exercise created with ID: ${id}`)
          //     const createdExercise = helperDb.getExercise(db, id) 

          //     // workoutCreateExercise?.(createdExercise as Exercise)
          //     // Optionally reset form or navigate away
          //   })
          //   .catch((error) => {
          //     console.error("Error creating exercise:", error)
          //     alert("There was an error creating the exercise. Please try again.")
          //   })
        }}
      >
        <ThemedText>Create Exercise</ThemedText>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    // gap: 35,
    paddingVertical: 10,
  },
  viewLabelInput: {
    gap: 10,
  },
  text: {
    marginHorizontal: "10%",
  },
  createButton: {
    width: "80%",
    marginTop: 10,
    padding: 7,
    backgroundColor: Colors.mutual.inWorkoutFinishWorkoutButtonBackground, // Blue
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
})
export default CreatingExercise
