import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores (applies to all configs)
  {
    ignores: [
      ".next/**/*",
      "out/**/*",
      "dist/**/*",
      "build/**/*",
      "node_modules/**/*",
      "**/*.d.ts",
      ".next/types/**/*",
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Prettier integration
  ...compat.extends("prettier"),
  ...compat.plugins("prettier"),

  // TypeScript and React specific rules
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      ...compat.plugins("@typescript-eslint")[0].plugins,
      ...compat.plugins("react-hooks")[0].plugins,
      ...compat.plugins("jsx-a11y")[0].plugins,
      ...compat.plugins("import")[0].plugins,
    },
    rules: {
      // Prettier formatting
      "prettier/prettier": "error",

      // TypeScript strict rules - NO ANY ALLOWED
      "@typescript-eslint/no-explicit-any": "error",

      // Additional TypeScript quality rules (without type checking)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

      // React and JSX rules
      "react/jsx-props-no-spreading": "off", // Allow prop spreading in Next.js
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript instead
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import rules for better organization
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unresolved": "off", // Next.js handles this
      "import/prefer-default-export": "off",
      "import/no-default-export": "off", // Next.js needs default exports for pages

      // Accessibility rules
      "jsx-a11y/anchor-is-valid": "off", // Next.js Link component
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",

      // General code quality
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "arrow-spacing": "error",

      // Prevent common mistakes
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unreachable-loop": "error",
      "no-use-before-define": "off", // Disabled in favor of TypeScript version
      "@typescript-eslint/no-use-before-define": "error",
    },
  },

  // Specific rules for configuration files
  {
    files: ["*.config.{js,mjs,ts}", "*.config.*.{js,mjs,ts}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import/no-default-export": "off",
    },
  },
];

export default eslintConfig;
