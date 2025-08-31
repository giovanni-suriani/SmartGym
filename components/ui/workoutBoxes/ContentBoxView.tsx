import { View, Text, StyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { ViewProps, DimensionValue } from "react-native"
import { contentBoxViewConstants } from "@/constants/UIConstants"

type Props = ViewProps & {
  focused?: boolean
}

const ContentBoxView = ({ style, focused = false, ...otherProps }: Props) => {
  const colorScheme = useColorScheme()
  const borderColor = Colors[colorScheme ?? "light"].borderColorUnfocused
  const borderWidth = contentBoxViewConstants.borderWidth
  const borderRadius = contentBoxViewConstants.borderRadius
  const padding = contentBoxViewConstants.padding
  const marginHorizontal = contentBoxViewConstants.marginHorizontal
  const alignSelf = "stretch"
  // const marginHorizontal = marginToUseHorizontal
  // const borderColor = focused
  //   ? Colors[colorScheme ?? "light"].borderColorFocused
  //   : Colors[colorScheme ?? "light"].borderColorUnfocused
  return (
    <ThemedView
      style={[
        {
          borderColor,
          borderWidth,
          borderRadius,
          padding,
          marginHorizontal,
          alignSelf,
        },
        style,
      ]}
      {...otherProps}
    />
  )
}

export default ContentBoxView
