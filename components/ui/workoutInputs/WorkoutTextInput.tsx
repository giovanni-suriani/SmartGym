// WorkoutTextInput.tsx
import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"
import { TextInput } from "react-native"
import { TextInputProps, StyleProp, TextStyle } from "react-native"
import { workoutInputConstants } from "@/constants/UIConstants"

// type Props = TextInputProps & {
//   style?: StyleProp<TextStyle>
// }
type Props = TextInputProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link"
  label?: string
}

const WorkoutTextInput = ({
  style,
  label,
  type = "default",
  placeholderTextColor,
  ...otherProps
}: Props) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]
  return (
    <View style={styles.container}>
      {
        label &&
        <ThemedText
        type="subtitle"
        >
          {label}
      </ThemedText>
      }
      <TextInput
        style={[
          type === "default" ? styles.default : undefined,
          type === "title" ? styles.title : undefined,
          type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
          type === "subtitle" ? styles.subtitle : undefined,
          type === "link" ? styles.link : undefined,
          {
            borderRadius: 8,
            height: workoutInputConstants.height,
            borderColor: theme.borderColorUnfocused,
            borderWidth: workoutInputConstants.borderWidth,
            padding: 10,
            color: theme.text,
          },
        ]}
        placeholderTextColor={theme.placeholderText}
        // placeholder="Type here to translate!"
        {...otherProps}
      />
    </View>
  )
}

export default WorkoutTextInput

const styles = StyleSheet.create({
  container:{
    flexShrink: 1,
    gap: workoutInputConstants.labelInputGap,
    marginHorizontal: workoutInputConstants.marginHorizontal,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  ft18: {
    fontSize: 18,
  },
})
