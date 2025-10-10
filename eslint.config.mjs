// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Define global ignores as the VERY FIRST item.
  {
    ignores: ["dist/", "build/", "node_modules/", "jest.config.js"],
  },

  // Your other configs come after the ignores.
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  // You can have a separate object for your custom rules.
  {
    rules: {
      // "no-console": "error",
      // "dot-notation": "error",
    },
  },
);
