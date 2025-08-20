import { Tabs } from "expo-router"
import React from "react"
import { Platform } from "react-native"

import { SQLiteProvider } from "expo-sqlite"
import { initializeDatabase } from "@/helperDB"
import { HapticTab } from "@/components/HapticTab"
import { IconSymbol } from "@/components/ui/IconSymbol"
import TabBarBackground from "@/components/ui/TabBarBackground"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Ionicons } from "@expo/vector-icons"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <SQLiteProvider databaseName="myfirstdb" onInit={initializeDatabase}>
      <Tabs
        initialRouteName={"createWorkout"}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }: { color: string }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="createWorkout"
          options={{
            title: "Create Workout",
            tabBarIcon: ({ color }: { color: string }) => (
              // <IconSymbol size={28} name="plus.circle" color={color} />
              <Ionicons
                size={28}
                name="add-circle"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons
                size={28}
                name="bar-chart"
                color={color}
              />
              // <IconSymbol size={28} name="bar-chart" color={color} />
            ),
          }}
        />
      </Tabs>
    </SQLiteProvider>
  )
}
