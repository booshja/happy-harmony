// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
// import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import { config as typedConfig, configs as tsConfigs } from "typescript-eslint";
import globals from "globals";
// import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginJest from "eslint-plugin-jest";
import typescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import unusedImports from "eslint-plugin-unused-imports";

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
        ],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    },
    pluginJs.configs.recommended,
    reactPlugin.configs.flat.recommended,
    ...tsConfigs.recommended,
    ...tsConfigs.recommendedTypeChecked,
    pluginJest.configs["flat/recommended"],
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                projectService: true,
                tsconfigRoofDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["*.ts", "*.tsx"],
        plugins: {
            "typescript-sort-keys": typescriptSortKeys,
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
            "import/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                    },
                    "newlines-between": "always",
                    groups: [
                        "builtin",
                        ["external", "internal"],
                        "parent",
                        "sibling",
                        "index",
                    ],
                },
            ],
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
            "typescript-sort-keys/interface": [
                "error",
                "asc",
                {
                    requiredFirst: true,
                },
            ],
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
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "react/display-name": "off",
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
        },
    },
    {
        rules: {
            "react/react-in-jsx-scope": "off",
        },
    },
    prettierConfig,
);
