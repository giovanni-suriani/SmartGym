import { DimensionValue, ViewStyle } from "react-native";

export const contentBoxViewConstants: ViewStyle = {
  padding: "5%" as DimensionValue,
  marginHorizontal: "10%" as DimensionValue,
  borderRadius: 10, 
  borderWidth: 2 
};

type workoutInputType = ViewStyle & {
  labelInputGap: number
}

export const workoutInputConstants: workoutInputType = {
  borderRadius: 8,
  height: 50,
  borderWidth: 2,
  padding: 10,
  labelInputGap: 10,
  marginHorizontal: "10%" as DimensionValue,
};
