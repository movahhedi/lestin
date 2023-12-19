import Dts from "rollup-plugin-dts";
import Esbuild from "rollup-plugin-esbuild";
import Terser from "@rollup/plugin-terser";
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

const node = (name) => [
	bundle({
		plugins: [Esbuild(), Terser()],
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
		plugins: [Dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
		},
	}),
];

export default [...node(name), ...node(nameDev)];
