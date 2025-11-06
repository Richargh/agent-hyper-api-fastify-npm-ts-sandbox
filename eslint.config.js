import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: globals.browser}
    },
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts}"],
        ignores: ["**/*.test.{js,ts}"],
        rules: {
            "no-restricted-imports": ["error", {
                patterns: ["*.test", "*.test.*", "**/*.test", "**/*.test.*"]
            }]
        }
    }
]);
