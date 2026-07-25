import { defineConfig } from "eslint/config";
import { eslintConfig } from "@movahhedi/eslint-config";

export default defineConfig([
	...eslintConfig({
		tsconfig: "./tsconfig.json",
	}),
]);
