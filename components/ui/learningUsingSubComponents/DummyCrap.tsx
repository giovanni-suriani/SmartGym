// components/DummyCrap.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type DummyCrapProps = {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

type DummyCrapChildProps = {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

type CompoundDummyCrap = React.FC<DummyCrapProps> & {
  Child: React.FC<DummyCrapChildProps>;
};

const DummyCrapBase = ({ children, style }: DummyCrapProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={[styles.container, { borderColor: theme.borderColorUnfocused }, style]}>
      {children}
    </ThemedView>
  );
};

const DummyCrapChild: React.FC<DummyCrapChildProps> = ({children, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.child, { backgroundColor: theme.background }, style]}>
      <ThemedText>hello</ThemedText>
      {/* {typeof children === "string" ? <ThemedText>{children}</ThemedText> : children} */}
    </View>
  );
};

// Attach subcomponent for <DummyCrap.Child />
const DummyCrap = DummyCrapBase as CompoundDummyCrap;
DummyCrap.Child = DummyCrapChild;

export default DummyCrap;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  child: {
    padding: 10,
    borderRadius: 10,
  },
});
