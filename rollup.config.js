// import Terser from "@rollup/plugin-terser";
import Typescript from "@rollup/plugin-typescript";
// import Dts from "rollup-plugin-dts";
import Esbuild from "rollup-plugin-esbuild";
// import packageJson from "./package.json" assert { type: "json" };

const name = "jsx-runtime/dist/jsx-runtime";
const nameDev = "jsx-dev-runtime/dist/jsx-dev-runtime";
// const name = packageJson.main.replace(/\.js$/, "");
// const name = require("./package.json").main.replace(/\.js$/, "");

/** @type {import('rollup').RollupOptions} */
const bundle = (config) => ({
	...config,
	input: "jsx-runtime/src/index.js",
	external: (id) => {
		if (id.includes(":")) {
			return false;
		}

		return !/^[./]/.test(id);
	},
});

const node = (name) => [
	/** @type {import('rollup').RollupOptions} */
	bundle({
		plugins: [
			Esbuild(),
			// Terser(),
			Typescript({
				include: ["src/**/*"],
			}),
		],
		output: [
			/* {
				file: `${name}.js`,
				format: "cjs",
				sourcemap: true,
			}, */
			{
				file: `${name}.js`,
				format: "es",
				sourcemap: true,
			},
			{
				file: `${name}.mjs`,
				format: "es",
				sourcemap: true,
			},
			{
				name: "jsx-runtime",
				file: `${name}.umd.js`,
				format: "umd",
				sourcemap: true,
			},
		],
	}),
	/* bundle({
		plugins: [Dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
			sourcemap: true,
		},
	}), */
];

export default [...node(name), ...node(nameDev)];
