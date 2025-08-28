import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
const statistics = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={{ alignItems: "center", paddingVertical: 20 }}>
          <ThemedText>ola mundo</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default statistics
