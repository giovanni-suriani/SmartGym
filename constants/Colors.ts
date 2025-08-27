/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';
const tintColorDark = 'rgba(10, 126, 164, 0.8)';

export const Colors = {
  mutual:{
    inWorkoutDoneButtonBackground:'#4CAF50',
    inWorkoutFinishWorkoutButtonBackground:'#2196F3',
    /* So pra testar */
    borderColorFocused: '#bbb',
    borderColorUnfocused: '#fff',
    tint: tintColorLight,
  },
  light: {
    text: '#11181C',
    // text: "#0c72ad", // Slightly transparent for better readability on light backgrounds
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    // tabIconDefault: 'rgba(163, 201, 230, 0.5)',
    // tabIconSelected: 'rgba(10, 126, 164, 0.8)',
    tabIconSelected: tintColorLight,
    /* Gym Components colors */
    borderColorFocused: '#dda',
    borderColorUnfocused: 'rgb(0, 0, 0)',
    placeholderText: '#a0a0a0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    /* Gym Components colors */
    borderColorFocused: '#bbb',
    borderColorUnfocused: '#fff',
    placeholderText: '#555555',
  },
};
