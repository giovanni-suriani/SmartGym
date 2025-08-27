import { View, Text } from "react-native"
import React, { useEffect } from "react"
import * as Progress from "react-native-progress"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { Animated } from "react-native"

type Props = {
  progress: number
}

const WorkoutProgressBar = ({ progress }: Props) => {
  const colorAnim = new Animated.Value(0)
  const colorScheme = useColorScheme()
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

  return (
    <Progress.Bar
      progress={progress}
      width={200}
      height={10}
      color={barColor as any}
      style={{ marginBottom: 15 }}
      animated={true}
      animationType="spring"
      animationConfig={{ bounciness: 10 }}
      borderColor={Colors[colorScheme ?? "light"].borderColorUnfocused}
    />
  )
}

export default WorkoutProgressBar
