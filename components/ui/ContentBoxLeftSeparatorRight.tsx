import { View, Text, StyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useMemo } from "react"
import ContentBoxView from "./ContentBoxView"
import React, { useEffect, useState } from "react"

type Props = {
  focused?: boolean
  textH: number
  leftViewContent?: React.ReactNode
  rightViewContent?: React.ReactNode
}

const ContentBoxLeftSeparatorRight = ({
  focused = false,
  textH,
  leftViewContent,
  rightViewContent,
}: Props) => {
  const colorScheme = useColorScheme()
  const styles = useMemo(
    () =>
      createStyles({
        textH,
      }),
    [colorScheme, textH] // re-create styles only when color scheme changes
  )
  return (
    <ContentBoxView style={styles.container} focused={focused}>
      <View style={styles.leftView}>
        {leftViewContent}
      </View>
      <View style={styles.separatorLine} />
      <View style={styles.rightView}>
        {rightViewContent}
      </View>
      {/* <ThemedText>ContentBoxLeftSeparatorRight</ThemedText> */}
    </ContentBoxView>
  )
}

const createStyles = ({ textH }: { textH: number }) =>
  StyleSheet.create({
    container: {
      flexShrink: 1,
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    leftView: {
      width: "55%",
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      paddingRight: 10,
      // backgroundColor: "blue",
    },
    separatorLine: {
      flexDirection: "column",
      height: textH,
      backgroundColor: "lightgray",
      width: 1,
    },
    rightView: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      // backgroundColor: "green",
      // alignSelf: "stretch",
    },
  })

export default ContentBoxLeftSeparatorRight
