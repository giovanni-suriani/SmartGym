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
import { useState, ReactNode, FC, useMemo } from "react"

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
  // const columnChildren = useMemo(
  //   () =>
  //     childArray.filter(
  //       (c) => React.isValidElement(c) && c.type === Column
  //     ) as React.ReactElement<BoxColumnProps>[],
  //   [childArray] // recompute only if children change
  // )

  const columnChildren = childArray as React.ReactElement<BoxColumnProps>[]

  const colCount = columnChildren.length

  const computedWidth = useMemo<DimensionValue | undefined>(
    () => colWidthPct ?? (colCount > 0 ? `${100 / colCount}%` : undefined),
    [colWidthPct, colCount] // recompute only if these change
  )

  const [biggestContentHeight, setBiggestContentHeight] = useState<number>(0) 

  const boxTableOnBiggestContentHeightChange = (height: number) => {
    console.debug(`Biggest content height in table: ${height}`)
    setBiggestContentHeight((prev) => {
      const next = height > prev ? height : prev
      console.log(`Biggest content height in table set to: ${next}`);
      return next
    }
    )
  }

  // console.debug(`colCount: ${colCount}, computedWidth: ${computedWidth}`)
  // If there are no Column children, just render whatever was passed
  if (colCount === 0) {
    return <View style={[styles.table, style]}>{children}</View>
  }

  return (
    <View style={[styles.table, style]}>
      {columnChildren.map((col, idx) =>
        React.cloneElement(col, {
          key: `column-${idx}`,
          colWidthPct: col.props.colWidthPct ?? computedWidth,
          handleBiggestContentHeightChange: boxTableOnBiggestContentHeightChange,
          style: [
            col.props.style,
            {
              width: col.props.colWidthPct ?? computedWidth,
              // minHeight: biggestContentHeight,
              // height: 300,
              // borderWidth:0,
              borderRightWidth: idx === colCount - 1 ? 2 : 0,
              // flexGrow: 1,
            },
          ],
          styleCell: {
            minHeight: biggestContentHeight,
          }
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
  table: {
    flexDirection: "row",
    marginHorizontal: "10%",
    // alignItems: "center",
    // height: 300,
    // justifyContent: "flex-start",
    // flexGrow: 1,
    // alignItems: "baseline"
    // alignContent: "stretch",
    // width: "100%",
  },
})

export default ContentBoxTableCompound
