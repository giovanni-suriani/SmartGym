import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { DUMMY_EXERCISE } from "@/constants/DummyWorkoutValues"
import { Exercise } from "@/constants/types/workout-types"
import React, { useMemo } from "react"
import { StyleSheet, useColorScheme, ScrollView } from "react-native"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { Text } from "react-native"

type Props = {
  focused?: boolean
}

/*  
 Without useMemo
  const borderColor = focused
    ? colorScheme === "dark"
      ? "#bbb"
      : "#dda"
    : colorScheme === "dark"
    ? "#fff"
    : "#000" 
    */
const ballSize = 64

const ExerciseComponent = ({ focused = false }: Props) => {
  const colorScheme = useColorScheme()
  const item: Exercise = DUMMY_EXERCISE

  const styles = useMemo(() => {
    const borderColor = focused
      ? colorScheme === "dark"
        ? "#bbb"
        : "#dda"
      : colorScheme === "dark"
      ? "#fff"
      : "#000"
    return createStyles({ borderColor })
  }, [colorScheme, focused])

  // null means no ball is selected
  // number means the index of the selected ball
  const [ballSelected, setBallSelected] = useState<number | null>(null)

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedText type={"ft18"}>Oi</ThemedText> */}
      <ThemedText type={"title"}>{item.name}:</ThemedText>
      {/* <ThemedText type={"title"}>{item.name}:</ThemedText> */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        // indicatorStyle={"black"}
        // scrollIndicatorInsets={{ right: 2, bottom: 2 }} // Adjust insets to make scrollbar more visible
        // indicatorStyle={colorScheme === "dark" ? "white" : "black"}
        style={styles.ballsContainer}
      >
        {/* <View style={styles.ballsContainer}> */}
        <View style={styles.ballsContainer}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const isSelected = ballSelected === idx
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setBallSelected(isSelected ? null : idx)}
                style={[styles.ball, isSelected && styles.ballSelected]}
                accessibilityLabel={`Set ${idx + 1}`}
              >
              <Text style={{color:"black", fontSize:24}}>{idx + 1}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const createStyles = ({ borderColor }: { borderColor: string }) =>
  StyleSheet.create({
    container: {
      // flexDirection: "row",
      // margin: "10%",
      marginHorizontal: "10%",
      borderRadius: 10,
      fontSize: 20,
      borderWidth: 1,
      borderColor,
      paddingHorizontal: "5%",
      paddingVertical: "5%",
      // backgroundColor: "rgba(255, 255, 255, 0.57)", // semi-transparent white
      // borderColor,
      // borderColor: colorScheme === "dark" ? "#fff" : "#000",
    },
    ballsContainer: {
      flexDirection: "row",
      // flex:1,
      // gap: "15%",
      // justifyContent: "center",
      // alignItems: "center",
      paddingVertical: 15,
    },
    ball: {
      width: ballSize,
      height: ballSize,
      borderRadius: 9999,
      backgroundColor: "#fdd", // light red
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#f99",
      marginHorizontal: 15,
    },
    ballSelected: {
      backgroundColor: "rgba(73, 255, 85, 0.9)",
      borderColor: "rgba(73, 255, 85,0.5)",
      // transform: [{ scale: 1.05 }],
    },
    // text:{
    //   fontSize:28
    // }
  })
export default ExerciseComponent
