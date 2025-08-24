// File to describe some general settings, like logging level
const __DEV__ = true
export const LOG_LEVEL = __DEV__ ? "debug" : "info" // debug | info | warn | error | fatal

export const TEST_DONE_BUTTON = __DEV__ ? true : false // Show a "Done" button for testing purposes

// You can add more settings here as needed