import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	oxc: {
		jsx: {
			runtime: "automatic",
			importSource: "lestin",
		},
	},
	test: {
		attachmentsDir: "test/.vitest-attachments",
		include: ["test/**/*.test.jsx"],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright({
				launchOptions: {
					channel: "chrome",
				},
			}),
			instances: [{ browser: "chromium" }],
		},
		coverage: {
			provider: "v8",
			include: ["dist/index.js"],
			reporter: ["text", "json-summary", "html"],
			reportsDirectory: "test/coverage",
			thresholds: {
				100: true,
			},
		},
	},
});
