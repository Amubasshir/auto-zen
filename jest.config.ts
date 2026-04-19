import type { Config } from "jest";
import nextJest from "next/jest.js";

// Set test env vars before any module is imported
process.env.MONGODB_URI = "mongodb://localhost:27017/autozen-test";
process.env.AUTH_SECRET = "test-secret-32-chars-minimum-here";
process.env.GITHUB_CLIENT_ID = "test-github-id";
process.env.GITHUB_CLIENT_SECRET = "test-github-secret";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  // Runs AFTER the Jest test environment (expect, jest globals) is set up
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(next-auth|@auth|oauth4webapi|@panva)/)",
  ],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(config);
