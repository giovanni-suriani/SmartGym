import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const Exercise = () => {
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
export default Exercise;