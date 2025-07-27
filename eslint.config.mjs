// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import { configs as tsConfigs, config as typedConfig } from "typescript-eslint";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default typedConfig(
    ...compat.config({ extends: ["next/core-web-vitals", "next/typescript"] }),
    {
        ignores: [
            "**/build/*",
            "**/node_modules/*",
            "**/.next/*",
            "**/.husky/*",
            "**/.vscode/*",
            "**/next.config.ts",
            "**/generated/*",
            "**/.changeset/*",
        ],
    },
    pluginJs.configs.recommended,
    ...tsConfigs.recommended,
    ...tsConfigs.recommendedTypeChecked,
    pluginJest.configs["flat/recommended"],
    perfectionist.configs["recommended-alphabetical"],
    {
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                projectService: true,
                tsconfigRoofDir: import.meta.dirname,
            },
            sourceType: "module",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    // Allow unused vars prefixed with an underscore or name "ignored"
                    varsIgnorePattern: "([iI]gnored)|(_\\w+)",
                },
            ],
            "@typescript-eslint/prefer-includes": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "jest/no-focused-tests": "error",
            "jsx-a11y/label-has-associated-control": [
                "error",
                {
                    assert: "either",
                },
            ],
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
            "no-unused-vars": [
                "error",
                {
                    // Allow unused variables prefixed with an underscore or name "ignored"
                    varsIgnorePattern: "([iI]gnored)|(_\\w+)",
                },
            ],
            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",
            "react/jsx-curly-spacing": [
                "error",
                {
                    when: "never",
                },
            ],
            "react/jsx-equals-spacing": ["error", "never"],
            "react/jsx-no-bind": "off",
            "react/jsx-tag-spacing": "error",
            "react/jsx-wrap-multilines": "error",
            "react/no-array-index-key": "error",
            "react/prop-types": "off",
            "react/self-closing-comp": "error",
            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        files: ["*.test.*", "*.tests.*", "**/*.spec.*"],
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
        rules: {
            ...pluginJest.configs["flat/recommended"].rules,
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
            "react/display-name": "off",
        },
    },
    {
        rules: {
            "react/react-in-jsx-scope": "off",
        },
    },
    prettierConfig,
);
