// WorkoutTextInput.tsx
import React, { forwardRef, memo } from "react"
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

type Props = Omit<TextInputProps, "style"> & {
  style?: StyleProp<TextStyle>
}

const WorkoutTextInput = forwardRef<TextInput, Props>(
  ({ style, placeholderTextColor, ...rest }, ref) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]

    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: Colors[colorScheme ?? "light"].borderColorUnfocused,
            color: Colors[colorScheme ?? "light"].text,
          },
          style,
        ]}
        placeholderTextColor={placeholderTextColor ?? Colors[colorScheme ?? "light"].placeholderText}
        {...rest}
      />
    )
  }
)

WorkoutTextInput.displayName = "WorkoutTextInput"
export default memo(WorkoutTextInput)

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    // margin: 12,
    padding: 10,
  },
})
