import React, { ReactNode, useState } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"
import { useSQLiteContext } from "expo-sqlite"
import ContentBoxView from "../ui/workoutBoxes/ContentBoxView"
import ContentBoxTable from "../ui/workoutBoxes/ContentBoxTable"
import ContentBoxLeftSeparatorRight from "../ui/workoutBoxes/ContentBoxLeftSeparatorRight"
import { useEffect } from "react"
import * as helperDB from "@/helperDB"
import { Workout, Exercise, WorkoutSet } from '@/constants/types/workout-types';

/* Data to display
| Name         | Category | Sets | Reps | Weight | Rest | Progression |
|--------------|----------|------|------|--------|------|-------------|
| Bench Press  | Barbell  | 4    | 8    | 135    | 60   | +5 lbs      |
| Squat        | Barbell  | 4    | 10   | 185    | 90   | +10 lbs     |
| Deadlift     | Barbell  | 3    | 5    | 225    | 120  | +15 lbs     |


*/

const ViewUserExercises = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"] // Fallback to light if undefined
  const db = useSQLiteContext()
  const header = ["Name", "Rest", "Progress"]
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    async function fetchExercises() {
      const exercisesFetched = await helperDB.getUserCreatedExercises(db) ?? []
      setExercises(exercisesFetched)
      console.log(`Fetched ${exercisesFetched?.length ?? 0} exercisesFetched from DB`, exercisesFetched[0]);
    }
    fetchExercises()
    return () => {
      // optional cleanup (runs before unmount OR before re-running the effect)
    }
  }, [db]) // when dependencies change, the effect runs again


  // Now it's a 2D array: [ [cell1, cell2, ...] ]
  // const headerNode: ReactNode[][] = [header.map((title) => <ThemedText type="default">{title}</ThemedText>)]
  const headerNode: ReactNode[] = header.map((title) => <ThemedText type="default">{title}</ThemedText>)
  
  const nameColumn = exercises.map((ex) => <ThemedText key={ex.name}  type="default">{ex.name}</ThemedText>)
  const restColumn = exercises.map((ex) => <ThemedText key={ex.restSec} style={{textAlign:"center"}} type="default">{ex.restSec ?? '-'}</ThemedText>)
  const progressionColumn = exercises.map((ex) => <ThemedText key={ex.progressRate} style={{textAlign:"center"}} type="default">{ex.progressRate ?? '-'}</ThemedText>)
  const rows = Array.from({ length: exercises.length }, (_, i) => i).map(i => [nameColumn[i], restColumn[i], progressionColumn[i]])
  // console.log(`rows:`, rows);

  const tableContent: ReactNode[][] = [
    headerNode,
    ...rows
  ]
  // headerNode.push(...tableContent)

  // Add more columns as needed

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <ContentBoxLeftSeparatorRight textH={0}></ContentBoxLeftSeparatorRight> */}
        <ContentBoxTable content={tableContent}></ContentBoxTable>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default ViewUserExercises
