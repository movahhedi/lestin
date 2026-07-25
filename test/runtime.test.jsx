/* eslint-disable react/no-unknown-property */
import { createElement, fragment, jsx, jsxDEV, jsxs } from "lestin";
import { afterEach, describe, expect, it, vi } from "vitest";

const booleanAttributes = [
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"defer",
	"disabled",
	"formnovalidate",
	"hidden",
	"inert",
	"ismap",
	"itemscope",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"selected",
];

afterEach(() => {
	document.body.replaceChildren();
});

describe("JSX construction and exported runtime API", () => {
	it("exposes equivalent element factories and the fragment helper", () => {
		expect(jsx).toBe(createElement);
		expect(jsxs).toBe(createElement);
		expect(jsxDEV).toBe(createElement);
		expect(fragment({ children: ["first", "second"] })).toEqual(["first", "second"]);
	});

	it("creates empty and deeply nested HTML elements", () => {
		const element = (
			<main id="application">
				<section>
					<article>
						<h1>Heading</h1>
						<p>
							Plain <strong>nested</strong> text
						</p>
					</article>
				</section>
			</main>
		);

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element.tagName).toBe("MAIN");
		expect(element.querySelector("section > article > h1").textContent).toBe("Heading");
		expect(element.querySelector("p").textContent).toBe("Plain nested text");
		expect(<div />).toBeInstanceOf(HTMLDivElement);
	});

	it("preserves zero and removes top-level empty or falsy children", () => {
		const element = (
			<div>
				{false}
				{null}
				{undefined}
				{""}
				{[]}
				{0}
			</div>
		);

		expect(element.textContent).toBe("0");
		expect(element.childNodes).toHaveLength(1);
		expect(element.firstChild).toBeInstanceOf(Text);
	});

	it("recursively flattens child arrays and ignores falsy entries at every depth", () => {
		const children = ["alpha", [false, null, undefined, ["beta", 0]], [], ""];
		const element = <div>{children}</div>;

		expect(element.textContent).toBe("alphabeta0");
		expect([...element.childNodes].map((node) => node.textContent)).toEqual(["alpha", "beta", "0"]);
	});

	it("appends existing elements without cloning them", () => {
		const child = document.createElement("em");
		child.textContent = "same node";
		const parent = <div>{child}</div>;

		expect(parent.firstElementChild).toBe(child);
	});

	it("passes normalized children to function components", () => {
		const Card = (props) => (
			<article data-title={props.title}>
				<header>{props.title}</header>
				{props.children}
			</article>
		);
		const card = (
			<Card title="Profile">
				<span>Details</span>
			</Card>
		);

		expect(card.dataset.title).toBe("Profile");
		expect(card.textContent).toBe("ProfileDetails");
	});

	it("supports low-level calls with omitted or null props", () => {
		const omitted = createElement("div");
		let withNull;

		expect(() => {
			withNull = createElement("span", null);
		}).not.toThrow();
		expect(omitted.outerHTML).toBe("<div></div>");
		expect(withNull.outerHTML).toBe("<span></span>");
	});

	it("creates standards-compliant custom elements", () => {
		const element = <lestin-card data-state="ready">Custom</lestin-card>;

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element.localName).toBe("lestin-card");
		expect(element.dataset.state).toBe("ready");
		expect(element.textContent).toBe("Custom");
	});
});

describe("attributes, classes, and styles", () => {
	it("sets ordinary, numeric, empty, data, and ARIA attributes", () => {
		const element = (
			<div
				aria-label="Example"
				data-mode="compact"
				empty=""
				ignoredFalse={false}
				ignoredNull={null}
				ignoredUndefined={undefined}
				not-a-number={Number.NaN}
				tabindex={0}
				title="details"
			/>
		);

		expect(element.getAttribute("title")).toBe("details");
		expect(element.getAttribute("tabindex")).toBe("0");
		expect(element.getAttribute("data-mode")).toBe("compact");
		expect(element.getAttribute("aria-label")).toBe("Example");
		expect(element.getAttribute("empty")).toBe("");
		expect(element.getAttribute("not-a-number")).toBe("NaN");
		expect(element.hasAttribute("ignoredfalse")).toBe(false);
		expect(element.hasAttribute("ignorednull")).toBe(false);
		expect(element.hasAttribute("ignoredundefined")).toBe(false);
	});

	it("assigns dataset entries and label associations", () => {
		const fromHtmlFor = (
			<label dataset={{ state: "valid", longName: "value" }} htmlFor="email">
				Email
			</label>
		);
		const fromFor = <label for="name">Name</label>;

		expect(fromHtmlFor.htmlFor).toBe("email");
		expect(fromHtmlFor.dataset.state).toBe("valid");
		expect(fromHtmlFor.dataset.longName).toBe("value");
		expect(fromFor.htmlFor).toBe("name");
	});

	it.each(booleanAttributes)("handles the %s boolean attribute", (attribute) => {
		const present = createElement("input", { [attribute]: true });
		const absent = createElement("input", { [attribute]: false });
		const stringFalse = createElement("input", { [attribute]: "false" });

		expect(present.hasAttribute(attribute)).toBe(true);
		expect(present.getAttribute(attribute)).toBe(attribute);
		expect(absent.hasAttribute(attribute)).toBe(false);
		expect(stringFalse.getAttribute(attribute)).toBe("false");
	});

	it("ignores tooling props, empty names, and inherited enumerable props", () => {
		Object.defineProperty(Object.prototype, "__lestinInherited", {
			configurable: true,
			enumerable: true,
			value: "must not leak",
			writable: true,
		});

		try {
			const element = createElement("div", {
				"": "empty",
				// eslint-disable-next-line @typescript-eslint/naming-convention
				__source: "source",
				// eslint-disable-next-line @typescript-eslint/naming-convention
				__self: "self",
				tsxTag: "tag",
				id: "safe",
			});

			expect(element.id).toBe("safe");
			expect(element.hasAttribute("")).toBe(false);
			expect(element.hasAttribute("__source")).toBe(false);
			expect(element.hasAttribute("__self")).toBe(false);
			expect(element.hasAttribute("tsxtag")).toBe(false);
			expect(element.hasAttribute("__lestininherited")).toBe(false);
		} finally {
			delete Object.prototype.__lestinInherited;
		}
	});

	it("normalizes class and className strings and nested arrays", () => {
		const fromClass = <div class={[" alpha ", false, null, undefined, ["beta", 0, [" gamma "]]]} />;
		const fromClassName = <div className={["one", "", false, ["two", ["three"]]]} />;
		const precedence = <div class="first" className="second" />;
		const empty = <div class={[]} />;

		expect(fromClass.getAttribute("class")).toBe("alpha beta gamma");
		expect(fromClassName.getAttribute("class")).toBe("one two three");
		expect(precedence.getAttribute("class")).toBe("second");
		expect(empty.getAttribute("class")).toBe("");
	});

	it("supports style strings, object properties, and numeric zeroes", () => {
		const fromString = <div style="color: red; --brand: #123456;" />;
		const fromObject = (
			<div
				style={{
					backgroundColor: "rgb(1, 2, 3)",
					opacity: 0,
				}}
			/>
		);

		expect(fromString.style.color).toBe("red");
		expect(fromString.style.getPropertyValue("--brand")).toBe("#123456");
		expect(fromObject.style.backgroundColor).toBe("rgb(1, 2, 3)");
		expect(fromObject.style.opacity).toBe("0");
	});

	it("supports CSS variables in style objects", () => {
		const element = <div style={{ "--accent": "gold", "--size": "2rem" }} />;

		expect(element.style.getPropertyValue("--accent")).toBe("gold");
		expect(element.style.getPropertyValue("--size")).toBe("2rem");
	});

	it("passes the element to assign and treats non-functions as ordinary attributes", () => {
		const assign = vi.fn((element) => {
			element.dataset.assigned = "yes";
		});
		const element = <button assign={assign}>Assigned</button>;
		const metadata = createElement("div", { assign: "metadata" });

		expect(assign).toHaveBeenCalledOnce();
		expect(assign).toHaveBeenCalledWith(element);
		expect(element.dataset.assigned).toBe("yes");
		expect(metadata.getAttribute("assign")).toBe("metadata");
	});
});

describe("content properties", () => {
	it("sets innerHTML and retains real parsed descendants", () => {
		const element = <div innerHTML="<strong data-kind='html'>HTML</strong>" />;

		expect(element.firstElementChild).toBeInstanceOf(HTMLElement);
		expect(element.querySelector("strong").dataset.kind).toBe("html");
		expect(element.innerHTML).toBe('<strong data-kind="html">HTML</strong>');
	});

	it("sets innerText and textContent as text", () => {
		const innerTextElement = <div innerText={"line one\nline two"} />;
		const textContentElement = <div textContent="<em>literal</em>" />;
		document.body.append(innerTextElement, textContentElement);

		expect(innerTextElement.innerText).toBe("line one\nline two");
		expect(innerTextElement.textContent).toBe("line oneline two");
		expect(innerTextElement.querySelector("br")).toBeInstanceOf(HTMLBRElement);
		expect(textContentElement.textContent).toBe("<em>literal</em>");
		expect(textContentElement.children).toHaveLength(0);
	});

	it("applies content properties in prop order and then appends JSX children", () => {
		const element = (
			<div innerHTML="<b>replaced</b>" textContent="text wins">
				<span>child follows</span>
			</div>
		);

		expect(element.textContent).toBe("text winschild follows");
		expect(element.innerHTML).toBe("text wins<span>child follows</span>");
	});

	it("escapes ordinary JSX text rather than parsing it", () => {
		const element = <div>{"<em>not markup</em>"}</div>;

		expect(element.textContent).toBe("<em>not markup</em>");
		expect(element.children).toHaveLength(0);
		expect(element.outerHTML).toBe("<div>&lt;em&gt;not markup&lt;/em&gt;</div>");
	});
});
