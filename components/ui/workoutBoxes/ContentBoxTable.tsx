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
import ContentBoxColumn from "./ContentBoxColumn"
import { useState, ReactNode, FC } from "react"

type ContentBoxTableProps = {
  focused?: boolean
  content?: ReactNode[][]
  columns?: ReactNode
  colWidthPct?: DimensionValue
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

type CompoundContentBoxTable = FC<ContentBoxTableProps> & {
  Column: FC<BoxColumnProps>
}

const ContentBoxTable = ({
  children,
  colWidthPct,
  style,
}: ContentBoxTableProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]
  // Normalize children to an array
  const childArray = React.Children.toArray(children)


  // Filter only our Column elements (others are passed through unchanged below)
  const columnChildren = childArray.filter(
    (c) => React.isValidElement(c) && c.type === Column
  ) as React.ReactElement<BoxColumnProps>[]

  const colCount = columnChildren.length
  const computedWidth: DimensionValue | undefined =
    colWidthPct ?? (colCount > 0 ? `${100 / colCount}%` : undefined)

  // If there are no Column children, just render whatever was passed
  if (colCount === 0) {
    return <View style={[styles.tableRow, style]}>{children}</View>
  }

  return (
    <View style={[styles.tableRow, style]}>
      {columnChildren.map((col, idx) =>
        React.cloneElement(col, {
          key: idx,
          colWidthPct: col.props.colWidthPct ?? computedWidth,
          style: [
            col.props.style,
            {
              width: col.props.colWidthPct ?? computedWidth,
              borderRightWidth: idx === colCount - 1 ? 2 : 0,
              // flexGrow: 1,
            },
          ],
          // borderRightWidth: idx < colCount - 1 ? 1 : 0,
        })
      )}
    </View>
  )
}

import { BoxColumnProps } from "./ContentBoxColumn"

const Column: React.FC<BoxColumnProps> = (props) => {
  return <ContentBoxColumn {...props} />
}

const ContentBoxTableCompound = ContentBoxTable as CompoundContentBoxTable
ContentBoxTableCompound.Column = Column

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    marginHorizontal: "10%",
    // alignContent: "stretch",
    // width: "100%",
  },
})

export default ContentBoxTableCompound
