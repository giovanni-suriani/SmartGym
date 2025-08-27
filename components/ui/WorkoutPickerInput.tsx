// WorkoutPicker.tsx
import React from "react"
import { View } from "react-native"
import { Picker, PickerProps } from "@react-native-picker/picker"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

type Props = PickerProps

export default function WorkoutPicker({ style, ...rest }: Props) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <View
      style={{
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: "10%",
        justifyContent: "center",
        borderColor: theme.borderColorUnfocused,
      }}
    >
      <Picker
        dropdownIconColor={theme.text}
        style={[{ color: theme.text, paddingHorizontal: 10 }, style]}
        {...rest}
      />
    </View>
  )
}
