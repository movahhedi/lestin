import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.js"],
	format: ["esm", "cjs", "iife", "umd"],
	dts: false,
	clean: true,
	target: "es2020",
	platform: "browser",
	outputOptions: {
		name: "lestin",
	},
});
