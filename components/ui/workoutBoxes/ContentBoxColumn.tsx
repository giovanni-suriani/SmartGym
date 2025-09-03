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
}

const ContentBoxColumn = ({ focused = false, content, style, styleCell }: BoxColumnProps) => {
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
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignContent: "center",
    // minHeight: 40,
  },
  separator: {
    height: 2,
  },
})

export default ContentBoxColumn
