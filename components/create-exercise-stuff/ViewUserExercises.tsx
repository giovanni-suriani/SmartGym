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
import ContentBoxColumn from "../ui/workoutBoxes/ContentBoxColumn"
import ContentBoxLeftSeparatorRight from "../ui/workoutBoxes/ContentBoxLeftSeparatorRight"
import { useEffect } from "react"
import * as helperDB from "@/helperDB"
import { Workout, Exercise, WorkoutSet } from "@/constants/types/workout-types"
import DummyCrap from "../ui/learningUsingSubComponents/DummyCrap"

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
  const [nameColumn, setNameColumn] = useState<ReactNode[]>([])
  const [restColumn, setRestColumn] = useState<ReactNode[]>([])
  const [progressionColumn, setProgressionColumn] = useState<ReactNode[]>([])

  const headerNode: ReactNode[] = header.map((title, idx) => {
    return (
      <ThemedText key={title} type="default" style={{ textAlign: "center" }}>
        {title}
      </ThemedText>
    )
  })

  useEffect(() => {
    async function fetchExercises() {
      const exercisesFetched =
        (await helperDB.getUserCreatedExercises(db)) ?? []
      
      // nameCol logic
      const nameCol = exercisesFetched.map((ex, idx) => {
        if (idx === 0) {
          return headerNode[0] // render header first
        }
        return (
          <ThemedText key={ex.name} type="default">
            {ex.name}
          </ThemedText>
        )
      })
      setNameColumn(nameCol)

      // restCol logic
      const restCol = exercisesFetched.map((ex, idx) => {
        if (idx === 0) {
          return headerNode[1] // render header first
        }
        return (
          <ThemedText
            key={ex.restSec}
            style={{ textAlign: "center" }}
            type="default"
          >
            {ex.restSec ?? "-"}
          </ThemedText>
        )
      })
      setRestColumn(restCol)

      // progressionCol logic
      const progCol = exercisesFetched.map((ex, idx) => {
        if (idx === 0) {
          return headerNode[2] // render header first
        }
        return (
          <ThemedText
            key={ex.progressRate}
            style={{ textAlign: "center" }}
            type="default"
          >
            {ex.progressRate ?? "-"}
          </ThemedText>
        )
      })
      setProgressionColumn(progCol)


      setExercises(exercisesFetched)
      console.log(
        `Fetched ${exercisesFetched?.length ?? 0} exercisesFetched from DB`,
        exercisesFetched[0]
      )
      
    }
    fetchExercises()
  }, [db]) // when dependencies change, the effect runs again

  // Now it's a 2D array: [ [cell1, cell2, ...] ]
  // const headerNode: ReactNode[][] = [header.map((title) => <ThemedText type="default">{title}</ThemedText>)]

  // console.log(`rows:`, rows);

  const tableContent2: ReactNode[][] = [
    nameColumn,
    restColumn,
    progressionColumn,
  ]
  console.log(`render`)
  // headerNode.push(...tableContent)

  // Add more columns as needed

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ContentBoxTable colWidthPct={"30%"}>
          <ContentBoxTable.Column content={nameColumn} />
          {/* <ContentBoxTable.Column content={restColumn} /> */}
          {/* <ContentBoxTable.Column content={progressionColumn} /> */}
        </ContentBoxTable>
        {/* <ContentBoxColumn content={nameColumn}></ContentBoxColumn> */}
        {/* <ContentBoxColumn ></ContentBoxColumn> */}
        {/* <ContentBoxTable content={tableContent}></ContentBoxTable> */}
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
