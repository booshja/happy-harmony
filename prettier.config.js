//  @ts-check

/** @type {import('prettier').Config} */
const config = {
    trailingComma: "all",
    tabWidth: 4,
    printWidth: 88,
    overrides: [
        {
            files: "*.yml",
            options: { tabWidth: 2 },
        },
    ],
};

export default config;
