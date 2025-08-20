import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { ThemeContext } from "@react-navigation/native";

const Workout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView>
                <ThemedText></ThemedText>
            </ThemedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
export default Workout;