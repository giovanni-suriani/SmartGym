// WorkoutPicker.tsx
import React from "react"
import { View } from "react-native"
import { Picker, PickerProps } from "@react-native-picker/picker"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import ContentBoxView from "./ContentBoxView"
import { ThemedText } from "../ThemedText"
import { StyleSheet } from "react-native"
import { workoutInputConstants } from "@/constants/UIConstants"

type Props = PickerProps & {
  label?: string
}

export default function WorkoutPicker({ style, label, ...rest }: Props) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="subtitle">
          {label}
        </ThemedText>
      )}
      <ContentBoxView style={{ padding: 10, marginHorizontal: 0 }}>
        <Picker
          dropdownIconColor={theme.text}
          style={[
            {
              color: theme.text,
            },
            style,
          ]}
          {...rest}
        />
      </ContentBoxView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    gap: workoutInputConstants.labelInputGap,
    marginHorizontal: workoutInputConstants.marginHorizontal,
  },
});
