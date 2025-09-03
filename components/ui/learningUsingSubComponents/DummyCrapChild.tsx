import React from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet } from "react-native";
import {Colors} from '@/constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useColorScheme } from "@/hooks/useColorScheme"

const DummyCrapChild = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"] // Fallback to light if undefined
  return (
        <ThemedView>
          <ThemedText>I am just crap here</ThemedText>
        </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default DummyCrapChild;