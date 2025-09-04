import React from "react"
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  StyleSheet as RNStyleSheet,
  DimensionValue,
} from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import ContentBoxView from "./ContentBoxView"
import { ThemedText } from "@/components/ThemedText"
import {
  contentBoxTableConstants,
  workoutInputConstants,
} from "@/constants/UIConstants"

export type BoxColumnProps = {
  focused?: boolean
  content?: React.ReactNode[]
  colWidthPct?: DimensionValue
  style?: StyleProp<ViewStyle>
  styleCell?: StyleProp<ViewStyle>
  key ?: string | number
}

const ContentBoxColumn = ({ focused = false, content, style, styleCell, key }: BoxColumnProps) => {
  const colorScheme = useColorScheme()
  const borderColor =
    Colors[colorScheme ?? "light"]?.borderColorUnfocused ?? "lightgray"

  return (
    <ContentBoxView style={[styles.column, style]}>
      {Array.from({ length: content?.length ?? 3 }).map((_, cIdx) => (
        <>
          {content ? (
            <View style={[styles.cell, styleCell]} key={cIdx}>
              {content[cIdx]}
            </View>
          ) : (
            <View style={[styles.cell, styleCell]} key={cIdx}>
              <ThemedText key={cIdx}>{`col${cIdx}`}</ThemedText>
            </View>
          )}
          {cIdx < (content?.length ?? 3) - 1 && (
            <View
              key={`sep-${cIdx}`}
              style={[
                styles.separator,
                {
                  backgroundColor: borderColor,
                  alignContent: "stretch",
                },
              ]}
            />
          )}
        </>
      ))}
    </ContentBoxView>
  )
}

const styles = StyleSheet.create({
  column: {
    padding: 0,
    marginHorizontal: 0,
    borderRadius: 0,
    borderWidth: 2,
    // flexGrow: 1,
    // alignSelf: "stretch",
    // maxHeight: "80%"
    // height: "auto"
    // alignItems: "center",
    // justifyContent: "center",
  },
  cell: {
    paddingHorizontal: 8,
    flexGrow: 0,
    // flex:1,
    justifyContent: "center",
    alignContent: "center",
    // alignSelf:"center",
    // backgroundColor: "red",
    minHeight: 50,
  },
  separator: {
    height: 2,
  },
})

export default ContentBoxColumn
import React from "react"
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  StyleSheet as RNStyleSheet,
  DimensionValue,
} from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import ContentBoxView from "./ContentBoxView"
import { ThemedText } from "@/components/ThemedText"
import {
  contentBoxTableConstants,
  workoutInputConstants,
} from "@/constants/UIConstants"
import ContentBoxColumn from "./ContentBoxColumn"
import { useState, ReactNode, FC, useMemo } from "react"

type ContentBoxTableProps = {
  focused?: boolean
  content?: ReactNode[][]
  columns?: ReactNode
  colWidthPct?: DimensionValue
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

type CompoundContentBoxTable = FC<ContentBoxTableProps> & {
  Column: FC<BoxColumnProps>
}

const ContentBoxTable = ({
  children,
  colWidthPct,
  style,
}: ContentBoxTableProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]
  // Normalize children to an array
  const childArray = React.Children.toArray(children)

  // Filter only our Column elements (others are passed through unchanged below)
  // const columnChildren = useMemo(
  //   () =>
  //     childArray.filter(
  //       (c) => React.isValidElement(c) && c.type === Column
  //     ) as React.ReactElement<BoxColumnProps>[],
  //   [childArray] // recompute only if children change
  // )

  const columnChildren = childArray as React.ReactElement<BoxColumnProps>[]

  const colCount = columnChildren.length

  const computedWidth = useMemo<DimensionValue | undefined>(
    () => colWidthPct ?? (colCount > 0 ? `${100 / colCount}%` : undefined),
    [colWidthPct, colCount] // recompute only if these change
  )
  console.log(`colCount: ${colCount}, computedWidth: ${computedWidth}`)
  // If there are no Column children, just render whatever was passed
  if (colCount === 0) {
    return <View style={[styles.table, style]}>{children}</View>
  }

  return (
    <View style={[styles.table, style]}>
      {columnChildren.map((col, idx) =>
        React.cloneElement(col, {
          key: idx,
          colWidthPct: col.props.colWidthPct ?? computedWidth,
          style: [
            col.props.style,
            {
              width: col.props.colWidthPct ?? computedWidth,
              // height: 300,
              // borderWidth:0,
              borderRightWidth: idx === colCount - 1 ? 2 : 0,
              // flexGrow: 1,
            },
          ],
          // borderRightWidth: idx < colCount - 1 ? 1 : 0,
        })
      )}
    </View>
  )
}

import { BoxColumnProps } from "./ContentBoxColumn"

const Column: React.FC<BoxColumnProps> = (props) => {
  return <ContentBoxColumn {...props} />
}

const ContentBoxTableCompound = ContentBoxTable as CompoundContentBoxTable
ContentBoxTableCompound.Column = Column

const styles = StyleSheet.create({
  table: {
    flexDirection: "row",
    marginHorizontal: "10%",
    alignItems: "flex-end",
    // height: 300,
    // justifyContent: "flex-start",
    // flexGrow: 1,
    // alignItems: "baseline"
    // alignContent: "stretch",
    // width: "100%",
  },
})

export default ContentBoxTableCompound
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
      // let nameCol: ReactNode = [headerNode[0]] // start with header
      const nameCol = [
        headerNode[0],
        ...exercisesFetched.map((ex) => (
          <ThemedText key={ex.name} type="default" style={{ textAlign: "center" }}>
            {ex.name}
          </ThemedText>
        )),
      ]
      setNameColumn(nameCol)

      // restCol logic
      const restCol = [
        headerNode[1],
        ...exercisesFetched.map((ex) => (
          <ThemedText
            key={`rest-${ex.name}`} // safer unique key
            style={{ textAlign: "center" }}
            type="default"
          >
            {ex.restSec ?? "-"}
          </ThemedText>
        )),
      ]
      setRestColumn(restCol)

      // progressionCol logic
      const progCol = [
        headerNode[2],
        ...exercisesFetched.map((ex) => (
          <ThemedText
            key={`prog-${ex.name}`}
            style={{ textAlign: "center", justifyContent: "center", fontSize:16 }}
            type="default"
          >
            {ex.progressRate ?? "-"}
          </ThemedText>
        )),
      ]
      setProgressionColumn(progCol)

      setExercises(exercisesFetched)
      console.log(
        `Fetched ${exercisesFetched?.length ?? 0} exercisesFetsched from DB`,
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
  console.log(`render`, progressionColumn.length)
  // headerNode.push(...tableContent)

  // Add more columns as needed

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <ContentBoxTable colWidthPct={"30%"}> */}
        <ContentBoxTable>
          <ContentBoxTable.Column content={nameColumn} />
          <ContentBoxTable.Column content={restColumn} />
          <ContentBoxTable.Column content={progressionColumn} />
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
