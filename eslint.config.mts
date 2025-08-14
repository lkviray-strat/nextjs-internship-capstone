import { FlatCompat } from "@eslint/eslintrc";
import ts from "@eslint/js";
import query from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: ts.configs.recommended,
});

const eslintConfig = [
  {
    ignores: ["src/lib/db/__test__/.queries-test.example.ts"],
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      "@tanstack/query": query,
    },
    rules: {
      ...query.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...pluginReact.configs.recommended.rules,
      "no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  ...compat.config({
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
    },
    extends: ["next/typescript", "next/core-web-vitals"],
  }),
  {
    rules: {
      ...prettier.rules, // disables conflicting ESLint formatting rules
    },
  },
];

export default eslintConfig;
