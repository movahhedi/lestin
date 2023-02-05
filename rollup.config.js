import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import packageJson from "./package.json" assert { type: "json" };

const name = "dist/jsx-runtime";
// const name = packageJson.main.replace(/\.js$/, "");
// const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
	...config,
	input: "src/jsx-runtime.ts",
	external: (id) => !/^[./]/.test(id),
	dir: "dist",
});

export default [
	bundle({
		plugins: [esbuild()],
		output: [
			{
				file: `${name}.js`,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: `${name}.mjs`,
				format: "es",
				sourcemap: true,
			},
		],
	}),
	bundle({
		plugins: [dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
		},
	}),
];
