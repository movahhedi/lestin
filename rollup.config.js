import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
// import packageJson from "./package.json" assert { type: "json" };

const name = "dist/jsx-runtime";
const nameDev = "dist/jsx-dev-runtime";
// const name = packageJson.main.replace(/\.js$/, "");
// const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
	...config,
	input: "src/jsx-runtime.ts",
	external: (id) => !/^[./]/.test(id),
	// dir: "dist",
});

const node = (name) => ([
	bundle({
		plugins: [esbuild(), terser()],
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
]);

export default [
	...node(name),
	...node(nameDev),
];
