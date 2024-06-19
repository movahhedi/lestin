import eslintJs from "@eslint/js";
import { defineFlatConfig } from "eslint-define-config";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import tsEslint from "typescript-eslint";

const longParentPath = "{.," + Array.from({ length: 10 }, (_, i) => "../".repeat(i + 1).slice(0, -1)).join(",") + "}";

//#region import plugin rules
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const importPluginRules = {
	"sort-imports": [
		"off",
		{
			ignoreCase: true,
			ignoreDeclarationSort: false,
			ignoreMemberSort: false,
			memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
			allowSeparatedGroups: false,
		},
	],
	// "import/default": "error",
	"import/dynamic-import-chunkname": ["off"],
	"import/export": "error",
	"import/exports-last": "off",
	"import/extensions": [
		"off",
		"ignorePackages",
		{
			js: "never",
			mjs: "never",
			jsx: "never",
		},
	],
	"import/first": "error",
	"import/group-exports": "off",
	"import/max-dependencies": ["off", { max: 10 }],
	"import/named": "error",
	"import/namespace": "off",
	// "import/newline-after-import": "error",
	"import/no-absolute-path": "error",
	// "import/no-amd": "error",
	"import/no-anonymous-default-export": "off",
	"import/no-commonjs": "off",
	"import/no-cycle": "error",
	"import/no-default-export": "off",
	"import/no-deprecated": "off",
	"import/no-duplicates": "error",
	"import/no-dynamic-require": "error",
	"import/no-extraneous-dependencies": "off",
	"import/no-internal-modules": "off",
	"import/no-mutable-exports": "off",
	"import/no-named-as-default": "off",
	// "import/no-named-as-default-member": "error",
	"import/no-named-default": "error",
	"import/no-named-export": "off",
	"import/no-namespace": "off",
	"import/no-nodejs-modules": "off",
	"import/no-relative-parent-imports": "off",
	"import/no-restricted-paths": "off",
	"import/no-self-import": "error",
	"import/no-unassigned-import": "off",
	"import/no-unresolved": ["off", { commonjs: true, caseSensitive: true }],
	"import/no-unused-modules": "off",
	"import/no-useless-path-segments": "error",
	"import/no-webpack-loader-syntax": "error",
	"import/order": [
		"off",
		{
			groups: ["builtin", "external", "internal", "parent", "index", "sibling", "unknown"],
			pathGroups: [
				{
					pattern: "lestin",
					group: "external",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Basics/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Auth/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Account/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Tables/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Models/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Components/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Utilities/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `${longParentPath}/Entities/**`,
					group: "parent",
					position: "before",
				},
				{
					pattern: `@/**`,
					group: "unknown",
					position: "before",
				},
				{
					pattern: `${longParentPath}/shared/**`,
					group: "unknown",
					position: "before",
				},
				{
					pattern: `${longParentPath}/images/**`,
					patternOptions: { partial: true },
					group: "unknown",
					position: "before",
				},
				{
					pattern: `${longParentPath}/styles/**/*.{css,scss}`,
					patternOptions: { partial: true },
					group: "unknown",
					position: "before",
				},
			],
			alphabetize: {
				order: "asc",
				caseInsensitive: true,
			},
			warnOnUnassignedImports: true,
			"newlines-between": "always",
			distinctGroup: false,
		},
	],
	"import/prefer-default-export": "off",
	"import/unambiguous": "off",
};
//#endregion

//#region main rules
const rules = {
	// "redos/no-vulnerable": "error",

	"perfectionist/sort-named-imports": [
		"warn",
		{
			type: "natural",
			"group-kind": "values-first",
			"ignore-case": true,
			"ignore-alias": true,
		},
	],
	"perfectionist/sort-exports": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
		},
	],
	"perfectionist/sort-imports": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
			"newlines-between": "always",
			groups: [
				["builtin", "builtin-type"],
				"lestin",
				["external", "external-type"],
				["internal", "internal-type"],

				"AdmoPro-Basics",
				"AdmoPro-Auth",
				"AdmoPro-Account",
				"AdmoPro-Tables",
				"AdmoPro-Models",
				"AdmoPro-Components",
				"AdmoPro-Utilities",
				"AdmoPro-Entities",

				["parent", "parent-type"],
				["index", "index-type"],
				["sibling", "sibling-type"],
				"AdmoPro-shared",
				"AdmoPro-images",
				["styles", "styles2"],
				"side-effect-style",
				"side-effect",
				"object",
				"unknown",
			],
			"custom-groups": {
				value: {
					lestin: "lestin",
					styles2: `${longParentPath}/**/*.module.scss`,
					"AdmoPro-Basics": `${longParentPath}/Basics/**`,
					"AdmoPro-Auth": `${longParentPath}/Auth/**`,
					"AdmoPro-Account": `${longParentPath}/Account/**`,
					"AdmoPro-Tables": `${longParentPath}/Tables/**`,
					"AdmoPro-Models": `${longParentPath}/Models/**`,
					"AdmoPro-Components": `${longParentPath}/Components/**`,
					"AdmoPro-Utilities": `${longParentPath}/Utilities/**`,
					"AdmoPro-Entities": `${longParentPath}/Entities/**`,
					"AdmoPro-shared": [`@/**`, `${longParentPath}/shared/**`],
					"AdmoPro-images": `${longParentPath}/images/**`,
				},
				type: {
					lestin: "lestin",
					styles2: `${longParentPath}/**/*.module.scss`,
					"AdmoPro-Basics": `${longParentPath}/Basics/**`,
					"AdmoPro-Auth": `${longParentPath}/Auth/**`,
					"AdmoPro-Account": `${longParentPath}/Account/**`,
					"AdmoPro-Tables": `${longParentPath}/Tables/**`,
					"AdmoPro-Models": `${longParentPath}/Models/**`,
					"AdmoPro-Components": `${longParentPath}/Components/**`,
					"AdmoPro-Utilities": `${longParentPath}/Utilities/**`,
					"AdmoPro-Entities": `${longParentPath}/Entities/**`,
					"AdmoPro-shared": [`@/**`, `${longParentPath}/shared/**`],
					"AdmoPro-images": `${longParentPath}/images/**`,
				},
			},
		},
	],
	"perfectionist/sort-jsx-props": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
			groups: [
				"name",
				"id",
				"class",
				"label",
				"componentText",
				"checked",
				"changedChecked",
				"value",
				"changedValue",
				"src",
				"disabled",
				"direction",
				"language",
				"assign",
				"event",
				"unknown",
				"shorthand",
			],
			"custom-groups": {
				name: "name",
				id: "id",
				class: ["class", "className"],
				label: "label",
				componentText: ["checkboxText", "radioText"],
				checked: "checked",
				changedChecked: "changedChecked",
				value: "value",
				changedValue: "changedValue",
				src: "src",
				disabled: "disabled",
				direction: "direction",
				language: "language",
				assign: "assign",
				event: "on*",
			},
		},
	],
	"perfectionist/sort-object-types": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
		},
	],
	"perfectionist/sort-interfaces": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
			"optionality-order": "required-first",
			"partition-by-new-line": true,
			groups: ["id", "unknown"],
			"custom-groups": {
				id: "id",
			},
		},
	],
	/* "perfectionist/sort-objects": [
			"warn",
			{
				type: "natural",
				"ignore-case": true,
				"partition-by-new-line": true,
				"partition-by-comment": true,
			},
		], */
	"perfectionist/sort-named-exports": [
		"warn",
		{
			type: "natural",
			"ignore-case": true,
			"group-kind": "values-first",
		},
	],

	camelcase: ["off", { ignoreImports: true }],
	"no-mixed-operators": "warn",
	"no-mixed-spaces-and-tabs": "off",
	"no-inner-declarations": "off",
	"prefer-arrow-callback": ["warn"],
	semi: ["warn", "always"],
	strict: 0,
	"no-unused-vars": ["off"],
	"no-undef": ["off"],
	"prettier/prettier": ["warn", { useTabs: true, tabWidth: 4 }],
	"no-tabs": ["off", { allowIndentationTabs: true }],
	quotes: ["warn", "double", { avoidEscape: true }],
	"prefer-const": [
		"warn",
		{
			destructuring: "all",
			ignoreReadBeforeAssign: true,
		},
	],
	"no-var": ["off"],
	"no-unreachable": ["warn"],
	"no-multi-spaces": [
		"warn",
		{
			exceptions: {
				VariableDeclarator: true,
				FunctionExpression: true,
			},
		},
	],
	"key-spacing": [0, { align: "value" }],
	"no-underscore-dangle": 0,
	"newline-per-chained-call": ["off", { ignoreChainWithDepth: 3 }],
	"max-lines": ["warn", 600],
	"max-depth": ["warn", 3],
	"max-params": ["warn", 3],
	"max-len": [
		"off",
		{
			code: 90,
			tabWidth: 4,
			ignoreComments: true,
			ignoreTrailingComments: true,
			ignoreUrls: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
			ignoreRegExpLiterals: true,
		},
	],
	indent: ["off", "tab"],
	"@typescript-eslint/indent": ["off", "tab"],
	"@typescript-eslint/ban-ts-comment": "off",
	"@typescript-eslint/no-inferrable-types": ["off"],
	"@typescript-eslint/no-empty-interface": ["warn", { allowSingleExtends: true }],
	"@typescript-eslint/no-explicit-any": ["off"],
	"@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
	"@typescript-eslint/consistent-type-imports": [
		"warn",
		{
			prefer: "type-imports",
			disallowTypeAnnotations: true,
			fixStyle: "inline-type-imports",
		},
	],
	"@typescript-eslint/naming-convention": [
		"warn",
		{
			selector: "default",
			format: ["camelCase"],
			leadingUnderscore: "forbid",
			trailingUnderscore: "forbid",
		},
		{
			selector: "import",
			format: [],
			leadingUnderscore: "forbid",
			trailingUnderscore: "forbid",
			custom: {
				regex: "(^[xzv]?(?:_?[A-Z][a-z]*\\d*)*$)|(^_$)",
				match: true,
			},
		},
		{
			selector: "property",
			format: ["camelCase", "snake_case"],
			leadingUnderscore: "allow",
		},
		{
			selector: "property",
			modifiers: ["private"],
			format: ["camelCase", "snake_case"],
			leadingUnderscore: "require",
			trailingUnderscore: "allow",
		},
		{
			selector: "property",
			modifiers: ["requiresQuotes"],
			format: [],
		},
		{
			selector: "variable",
			format: [],
			custom: {
				regex: "^[A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*\\d*$",
				match: true,
			},
		},
		/* {
				"selector": "variable",
				"types": ["function"],
				"format": [],
				"custom": {
					"regex": "^[A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*\\d*$",
					"match": true
				}
			}, */
		{
			selector: "variable",
			types: ["array", "boolean", "number", "string"],
			// "modifiers": ["const"],
			format: [],
			custom: {
				regex: "(^[a-z]+(?:_?[A-Z][a-z]*\\d*)*$)|(^_$)",
				match: true,
			},
		},
		{
			selector: "enumMember",
			format: [],
			custom: {
				regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]*\\d*)*$",
				match: true,
			},
		},
		{
			selector: "function",
			format: ["PascalCase"],
		},
		{
			selector: "method",
			format: ["camelCase", "PascalCase"],
			leadingUnderscore: "allow",
		},
		/* {
				"selector": "variable-Q",
				"modifiers": ["const"],
				"format": [],
				"custom": {
					"regex": "^_|([A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*)$",
					"match": true
				}
			}, */
		{
			selector: "variable",
			types: ["boolean"],
			format: ["PascalCase"],
			prefix: ["is", "should", "has", "can", "did", "will", "go", "obeys", "needs"],
		},
		{
			selector: "typeParameter",
			format: ["PascalCase"],
			prefix: ["T"],
		},
		{
			selector: ["variable", "function"],
			format: ["camelCase"],
			leadingUnderscore: "allow",
		},
		{
			selector: "class",
			format: [],
			custom: {
				regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
				match: true,
			},
		},
		{
			selector: ["interface", "typeAlias"],
			format: [],
			prefix: ["I"],
			custom: {
				regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
				match: true,
			},
		},
		{
			selector: "typeLike",
			format: [],
			custom: {
				regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
				match: true,
			},
		},
	],
	"react/jsx-key": ["off"],
	"react/jsx-max-props-per-line": ["warn", { maximum: 4, when: "multiline" }],
	"react/prop-types": ["off"],
	"react/react-in-jsx-scope": ["off"],
	"react/no-unknown-property": [
		"error",
		{
			ignore: [
				"assign",
				"class",
				"innerHTML",
				"stroke-width",
				"stroke-linecap",
				"stroke-linejoin",
				"stroke-miterlimit",
				"stroke-opacity",
				"stroke-dasharray",
				"funcShow",
				"funcDismiss",
			],
		},
	],
};
//#endregion

//#region client rules
// TODO does not work
const clientRules = {
	"@typescript-eslint/no-restricted-imports": [
		"error",
		{
			paths: [
				{
					name: "**/server/**",
					message: "Don't import server code in the client.",
					allowTypeImports: true,
				},
			],
			// patterns: [
			// 	{
			// 		group: ["**/server/**"],
			// 		importNamePattern: "^foo",
			// 	},
			// ],
		},
	],
};
//#endregion

//#region server rules
const serverRules = {
	"@typescript-eslint/no-restricted-imports": [
		"error",
		{
			paths: [
				{
					name: "**/client/*",
					message: "Don't import client code in the server.",
					allowTypeImports: true,
				},
			],
		},
	],
};
//#endregion

//#region eslint config
export default defineFlatConfig([
	eslintJs.configs.recommended,
	...tsEslint.configs.recommended,
	{
		settings: {
			// ecmascript: 6,
			react: {
				version: "999.999.999",
			},
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			parser: tsEslint.parser,
			parserOptions: {
				parser: tsEslint.parser,
				project: "./tsconfig.json",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		ignores: [
			// "eslint.config.*",
			"**/node_modules",
			"**/vendor",
			"**/temp/**",
			"**/dist/**",
			"**/build/**",
		],
		plugins: {
			// import: importPlugin,
			"@typescript-eslint": tsEslint.plugin,
			react: reactPlugin,
			perfectionist,
		},

		rules,
	},
	{
		files: ["**/*.cjs", "**/*.cts"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "commonjs",
			globals: {
				...globals.node,
				...globals.amd,
			},
		},
		rules,
	},
	{
		files: ["**/client/**"],
		rules: clientRules,
	},
	{
		files: ["**/server/**"],
		rules: serverRules,
	},

	prettierPluginRecommended,
	{
		rules: {
			"prettier/prettier": "warn",
		},
	},
]);
//#endregion
