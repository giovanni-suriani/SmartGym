import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

const createWorkout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={{alignItems:"center"}}>
        <ThemedText>Create Workout</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
export default createWorkout;