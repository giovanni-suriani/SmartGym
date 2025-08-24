// logger.ts
// Typed, idempotent console level control for React Native (and web)

type LevelName = "error" | "warn" | "info" | "debug"

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const
type LevelsMap = typeof LEVELS

declare global {
  interface Console {
    setLevel(levelName: LevelName): void
    LEVELS: LevelsMap
    __loggerPatched?: boolean // internal guard
  }
}

;(function initConsoleLogger() {
  // Avoid re-wrapping on Fast Refresh / multiple imports
  if (console.__loggerPatched) return

  let currentLevel: 0 | 1 | 2 | 3 = __DEV__ ? LEVELS.debug : LEVELS.info

  console.setLevel = function setLevel(levelName: LevelName) {
    const lv = LEVELS[levelName]
    if (lv === undefined) throw new Error(`Unknown log level: ${levelName}`)
    currentLevel = lv
  }

  // Save originals
  const originals = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
    debug: console.debug
      ? console.debug.bind(console)
      : console.log.bind(console),
  } as const

  ;(["error", "warn", "info", "debug"] as LevelName[]).forEach((method) => {
    const allowedLevel = LEVELS[method]
    console[method] = (...args: unknown[]) => {
      if (currentLevel >= allowedLevel) {
        originals[method](...args)
      }
    }
  })

  // Expose for runtime checks
  console.LEVELS = LEVELS
  console.__loggerPatched = true
})()
