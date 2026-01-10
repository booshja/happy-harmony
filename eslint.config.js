//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import typescriptSortKeysPlugin from "eslint-plugin-typescript-sort-keys";
import prettierConfig from "eslint-config-prettier";

const ignoredPaths = [
    "node_modules",
    "dist",
    ".output",
    ".turbo",
    "coverage",
    "test-results",
    "playwright-report",
    "blob-report",
    ".ai-docs",
    ".vscode",
    "eslint.config.js",
    "prettier.config.js",
];

export default [
    {
        ignores: ignoredPaths,
    },
    {
        files: [
            "eslint.config.js",
            "prettier.config.js",
            "**/*.config.js",
            "**/*.config.cjs",
            "**/*.config.mjs",
        ],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
    },
    ...tanstackConfig,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "jsx-a11y": jsxA11yPlugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "unused-imports": unusedImportsPlugin,
            "typescript-sort-keys": typescriptSortKeysPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    // Allow unused vars prefixed with an underscore or name "ignored"
                    varsIgnorePattern: "([iI]gnored)|(_\\w+)",
                },
            ],
            "@typescript-eslint/prefer-includes": "off",
            "@typescript-eslint/restrict-plus-operands": "off",

            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc" },
                    "newlines-between": "always",
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                },
            ],

            "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],

            "no-empty-function": "off",
            "no-restricted-imports": [
                "warn",
                {
                    patterns: [
                        {
                            group: ["*.css", "*.scss"],
                            message: "Please use CSS-in-JS instead",
                        },
                        {
                            group: ["**/dist/"],
                            message:
                                "Deep imports from 'dist' are not allowed. Instead import from the package root.",
                        },
                    ],
                },
            ],

            // Use the TS rule instead of base no-unused-vars in TS files
            "no-unused-vars": "off",

            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",

            "react/jsx-curly-spacing": ["error", { when: "never" }],
            "react/jsx-equals-spacing": ["error", "never"],
            "react/jsx-no-bind": "off",
            "react/jsx-tag-spacing": "error",
            "react/jsx-wrap-multilines": "error",
            "react/no-array-index-key": "error",
            "react/prop-types": "off",
            "react/self-closing-comp": "error",

            "typescript-sort-keys/interface": ["error", "asc", { requiredFirst: true }],

            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        files: ["**/*.test.*", "**/*.tests.*"],
        plugins: {
            react: reactPlugin,
        },
        rules: {
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "react/display-name": "off",
        },
    },
    // Must be last to override any formatting rules
    prettierConfig,
];
