import React from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"
import DummyCrap from "@/components/ui/learningUsingSubComponents/DummyCrap"

const playgroundCrap = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"] // Fallback to light if undefined
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <DummyCrap>
          <DummyCrap.Child></DummyCrap.Child>
        </DummyCrap>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default playgroundCrap
