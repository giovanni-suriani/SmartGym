import React from "react"
import { View, StyleSheet, StyleProp, ViewStyle, StyleSheet as RNStyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import ContentBoxView from "../ui/workoutBoxes/ContentBoxView"
import { ThemedText } from "@/components/ThemedText"

type Props = {
  focused?: boolean
  rows?: number
  columns?: number
  /** content[row][col] */
  content?: React.ReactNode[][]
  style?: StyleProp<ViewStyle>
  rowStyle?: StyleProp<ViewStyle>
}

const ContentBoxTable = ({
  focused = false,
  rows = 3,
  columns = 3,
  content,
  style,
  rowStyle,
}: Props) => {
  const colorScheme = useColorScheme()
  const borderColor = Colors[colorScheme ?? "light"]?.borderColorUnfocused ?? "lightgray"

  const rowCount = content?.length ?? rows
  const colCount = content?.[0]?.length ?? columns
  const colWidthPct = 100 / colCount

  return (
    <View style={[styles.table, style]}>
      {Array.from({ length: rowCount }).map((_, rIdx) => {
        const row = content?.[rIdx]
        return (
          <ContentBoxView key={rIdx} focused={focused} style={[styles.rowBox, rowStyle]}>
            {/* Row inner container so we can place absolute separators */}
            <View style={styles.rowInner}>
              {/* Columns */}
              {Array.from({ length: colCount }).map((_, cIdx) => (
                <View
                  key={cIdx}
                  style={[styles.cell, { width: `${colWidthPct}%` }]}
                >
                  {row?.[cIdx] ?? <ThemedText>R{rIdx + 1}C{cIdx + 1}</ThemedText>}
                </View>
              ))}

              {/* Vertical separators at left: k * 100/columns% (k = 1..colCount-1) */}
              {Array.from({ length: colCount - 1 }).map((_, k) => (
                <View
                  key={`sep-${k}`}
                  style={[
                    styles.separator,
                    {
                      left: `${(k + 1) * colWidthPct}%`,
                      backgroundColor: borderColor,
                      // center the hairline on the percentage
                      transform: [{ translateX: -RNStyleSheet.hairlineWidth }],
                    },
                  ]}
                />
              ))}
            </View>
          </ContentBoxView>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    // gap: -64,
  },
  rowBox: {
    padding: 0,
    borderRadius: 0,
    // let the content define height
  },
  rowInner: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    // paddingVertical: 8,
    // paddingHorizontal: 10,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  separator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width:  2,
  },
})

export default ContentBoxTable
