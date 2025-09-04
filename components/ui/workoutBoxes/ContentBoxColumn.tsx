import React, { useEffect, useMemo } from "react"
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
import { useState } from "react"

import { LayoutChangeEvent } from "react-native"

export type BoxColumnProps = {
  focused?: boolean
  content?: React.ReactNode[]
  colWidthPct?: DimensionValue
  style?: StyleProp<ViewStyle>
  styleCell?: StyleProp<ViewStyle>
  key?: string | number
  handleColumnLayoutDimensions?: (e: LayoutChangeEvent) => void
  handleBiggestContentHeightChange?: (height: number) => void
}

const ContentBoxColumn = ({
  focused = false,
  content,
  style,
  styleCell,
  key,
  handleColumnLayoutDimensions,
  handleBiggestContentHeightChange,
}: BoxColumnProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]
  const borderColor = theme?.borderColorUnfocused ?? "lightgray"
  const [biggestContentHeight, setBiggestContentHeight] = useState<number>(0)
  const onCellLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setBiggestContentHeight((prev) => {
      const next = height > prev ? height : prev
      return next
    })
  }

  useEffect(() => {
      handleBiggestContentHeightChange?.(biggestContentHeight)
  }, [biggestContentHeight])

  return (
    <ContentBoxView
      style={[styles.column, style]}
      onLayout={handleColumnLayoutDimensions}
      key={key}
    >
      {Array.from({ length: content?.length ?? 3 }).map((_, cIdx) => (
        <>
          {content ? (
            <View
              style={[styles.cell, styleCell]}
              key={`cell-${cIdx}`}
              onLayout={onCellLayout}
            >
              {content[cIdx]}
            </View>
          ) : (
            <View style={[styles.cell, styleCell]} key={cIdx}>
              <ThemedText key={`cell-${cIdx}`}>{`col${cIdx}`}</ThemedText>
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
    // flexGrow: 1,
    // alignSelf: "stretch",
    // maxHeight: "80%"
    // height: "auto"
    // alignItems: "center",
    // justifyContent: "center",
  },
  cell: {
    paddingHorizontal: 8,
    flexGrow: 0,
    justifyContent: "center",
    alignContent: "center",
    // flex:1,
    // alignSelf:"center",
    // backgroundColor: "red",
    // minHeight: 50,
  },
  separator: {
    height: 2,
  },
})

export default ContentBoxColumn
