import { expect, it } from "vitest";

it("supports automatic JSX fragment syntax and nested fragments", async () => {
	const { children, host } = await import("./fixtures/fragment.fixture.jsx");

	expect(Array.isArray(children)).toBe(true);
	expect(host.children).toHaveLength(2);
	expect(host.textContent).toBe("firstsecond");
});
