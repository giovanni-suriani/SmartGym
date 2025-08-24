import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useSQLiteContext } from "expo-sqlite";
import { Workout, Exercise, WorkoutSet } from '@/constants/types/workout-types';
import * as helperDb from '@/helperDB'

const createWorkout = () => {
  const db = useSQLiteContext()
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView>
          <ThemedText>Crie seu treino</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
export default createWorkout;