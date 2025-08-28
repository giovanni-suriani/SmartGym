import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"

import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { WorkoutProvider } from "@/hooks/WorkoutContext"
import "react-native-reanimated"
import { useColorScheme } from "@/hooks/useColorScheme"
// import { Appearance } from "react-native"

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  // debug | info | warn | error | fatal 

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  // <ThemeProvider value={DarkTheme}>  
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> 
      <WorkoutProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="statistics" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </WorkoutProvider>
    </ThemeProvider>
  )
}
