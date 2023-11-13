import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  globals: {
    "ts-jest": {
      useESM: true
    }
  },
  preset: 'ts-jest/presets/default-esm',
  roots: ["tests/"],
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/"
  ]
}

export default jestConfig