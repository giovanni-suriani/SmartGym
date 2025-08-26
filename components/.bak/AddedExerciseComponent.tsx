import React, { useEffect, useState, useMemo } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import {
  Workout,
  Exercise,
  ExerciseCategory,
  WorkoutSet,
} from "@/constants/types/workout-types"
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons"
import ContentBoxLeftSeparatorRight from "../ui/ContentBoxLeftSeparatorRight"

type Props = {
  exercise: Exercise
  focused?: boolean
}

const iconMap: Record<
  ExerciseCategory,
  | "bicycle"
  | "body-outline"
  | "barbell"
  | "git-pull-request"
  | "settings"
  | "help-circle"
> = {
  [ExerciseCategory.CARDIO]: "bicycle",
  [ExerciseCategory.BODYWEIGHT]: "body-outline",
  [ExerciseCategory.DUMBBELL]: "body-outline",
  [ExerciseCategory.BARBELL]: "barbell",
  [ExerciseCategory.CABLE]: "git-pull-request",
  [ExerciseCategory.SMITH_MACHINE]: "settings",
  [ExerciseCategory.OTHER]: "help-circle",
}

const AddedExerciseComponent = ({ exercise, focused = false }: Props) => {
  const colorScheme = useColorScheme()
  const iconReturn = () => {
    if (exercise?.category === ExerciseCategory.DUMBBELL) {
      return (
        <MaterialCommunityIcons
          name={"dumbbell"}
          size={24}
          color={Colors[colorScheme ?? "light"].icon}
        />
      )
    }
    if (exercise?.category === ExerciseCategory.CARDIO) {
      return (
        <FontAwesome
          name={"heartbeat"}
          size={24}
          color={Colors[colorScheme ?? "light"].icon}
        />
      )
    } else {
      // console.log(`to te lascando kk`);
      return (
        <Ionicons
          name={iconMap[exercise?.category ?? ExerciseCategory.OTHER]}
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      )
    }
  }

  const [textH, setTextH] = useState(0)

  const styles = useMemo(
    () =>
      createStyles({
        // borderColor: focused
        //   ? Colors[colorScheme ?? "light"].borderColorUnfocused
        //   : Colors[colorScheme ?? "light"].borderColorFocused,
        borderColor: Colors[colorScheme ?? "light"].borderColorUnfocused,
        textH,
      }),
    [colorScheme, focused] // re-create styles only when color scheme changes
  )

  return (

    // <ContentBoxLeftSeparatorRight
    // leftViewContent={
    //   {exercise.category && iconReturn()}
    //   <ThemedText
    //     style={{ flexShrink: 1 }}
    //     type="defaultSemiBold"
    //     onLayout={(e) => setTextH(e.nativeEvent.layout.height)}
    //   >
    // }
    // rightViewContent={
    //   <ThemedText type="defaultSemiBold">
    //     {exercise.plannedSets} sets
    //   </ThemedText>
    // }
    // textH={textH}
    // focused={focused}
    // />


    <ThemedView style={styles.container}>
      {/* <FontAwesome5 name={"dumbbell"} size={24} color={Colors[colorScheme ?? "light"].text} /> */}
      <View style={styles.leftViewContent}>
        {/* <View> */}
        {exercise.category && iconReturn()}

        <ThemedText
          style={{ flexShrink: 1 }}
          type="defaultSemiBold"
          onLayout={(e) => setTextH(e.nativeEvent.layout.height)}
        >
          {exercise.name}
        </ThemedText>
        {/* </View> */}
      </View>
      {/* Separator Line */}
      <View style={styles.separatorLine} />
      {/* Sets Info */}
      <View style={styles.rightViewContent}>
        {/* <View style={{ flexGrow:1, flexDirection: "row", alignSelf: "center" }}> */}
        <ThemedText type="defaultSemiBold">
          {exercise.plannedSets} sets
        </ThemedText>
      </View>
    </ThemedView>
  )
}

const createStyles = ({
  borderColor,
  textH,
}: {
  borderColor: string
  textH: number
}) =>
  StyleSheet.create({
    container: {
      borderColor,
      borderWidth: 2,
      borderRadius: 10,
      marginHorizontal: "10%",
      paddingHorizontal: "5%",
      paddingVertical: "5%",
      alignSelf: "stretch",
      flexShrink: 1,
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    leftViewContent: {
      width: "55%",
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      paddingRight: 10,
      // backgroundColor: "blue",
    },
    separatorLine: {
      flexDirection: "column",
      height: textH,
      backgroundColor: "lightgray",
      width: 1,
    },
    rightViewContent: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: "green",
      alignItems: "stretch",
    },
  })
export default AddedExerciseComponent
