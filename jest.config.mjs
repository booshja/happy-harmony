import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    preset: "ts-jest",
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/src/**/*.{js,jsx,ts,tsx}",
        "!**/*.stories.{js,jsx,ts,tsx}",
        "!**/*.test.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/.storybook/**",
        "!**/.next/**",
        "!**/.vscode/**",
    ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
