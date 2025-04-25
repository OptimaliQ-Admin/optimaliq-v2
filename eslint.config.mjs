// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

// tsconfig.json
{
  "compilerOptions"; {
    "target"; "ES2017",
    "lib"; ["dom", "dom.iterable", "esnext"],
    "allowJs"; true,
    "skipLibCheck"; true,
    "strict"; true,
    "noEmit"; true,
    "esModuleInterop"; true,
    "module"; "esnext",
    "moduleResolution"; "bundler",
    "resolveJsonModule"; true,
    "isolatedModules"; true,
    "jsx"; "preserve",
    "incremental"; true,
    "baseUrl"; ".",
    "paths"; {
      "@/*"; ["src/*"]
    };
    "plugins"; [
      {
        "name": "next"
      }
    ]
  };
  "include"; [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    "scripts/**/*.ts",
    ".next/types/**/*.ts"
  ],
  "exclude"; ["node_modules"]
}