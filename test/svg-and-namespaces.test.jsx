/* eslint-disable react/no-unknown-property */
import { createElement, createRef } from "lestin";
import { afterEach, describe, expect, it, vi } from "vitest";

const namespaces = {
	html: "http://www.w3.org/1999/xhtml",
	mathMl: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",
	xmlns: "http://www.w3.org/2000/xmlns/",
};

afterEach(() => {
	document.body.replaceChildren();
});

describe("SVG construction", () => {
	it("creates a complex SVG tree with classes, attributes, and SVG namespaces", () => {
		const svg = (
			<svg
				className={["icon", false, ["icon--complex"]]}
				aria-label="Complex icon"
				viewBox="0 0 100 100"
			>
				<defs>
					<linearGradient id="paint" x1="0" x2="1" y1="0" y2="1">
						<stop offset="0%" stop-color="red" />
						<stop style={{ stopColor: "blue" }} offset="100%" />
					</linearGradient>
					<clipPath id="clip">
						<path d="M0 0h100v100H0z" />
					</clipPath>
					<mask id="mask">
						<rect width="100" height="100" fill="white" />
					</mask>
					<symbol id="shape" viewBox="0 0 10 10">
						<path d="M0 0L10 10" />
					</symbol>
					<filter id="shadow">
						<feGaussianBlur data-probe="blur" stdDeviation="2" />
						<feColorMatrix
							type="matrix"
							data-probe="matrix"
							values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"
						/>
						<feMerge data-probe="merge">
							<feMergeNode data-probe="merge-node" in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<g class={["layer", false, "layer--visible"]} clip-path="url(#clip)" mask="url(#mask)">
					<use href="#shape" xlinkHref="#shape" />
					<text x="10" y="20">
						<textPath href="#shape">
							<tspan>Label</tspan>
						</textPath>
					</text>
				</g>
			</svg>
		);

		expect(svg).toBeInstanceOf(SVGSVGElement);
		expect(svg.namespaceURI).toBe(namespaces.svg);
		expect(svg.getAttribute("class")).toBe("icon icon--complex");
		expect(svg.getAttribute("viewBox")).toBe("0 0 100 100");
		expect(svg.querySelector("g").getAttribute("class")).toBe("layer layer--visible");
		expect(svg.querySelector("stop:last-child").style.stopColor).toBe("blue");
		expect(svg.querySelector("textPath").textContent).toBe("Label");

		for (const descendant of svg.querySelectorAll("*")) {
			expect(descendant.namespaceURI, `${descendant.localName} must be SVG`).toBe(namespaces.svg);
		}
	});

	it("creates complex filter primitives in the SVG namespace", () => {
		const svg = (
			<svg>
				<filter>
					<feBlend data-probe="blend" mode="multiply" />
					<feComponentTransfer data-probe="transfer">
						<feFuncR type="linear" data-probe="red" slope="1.2" />
						<feFuncG type="gamma" amplitude="1" data-probe="green" exponent="2" />
						<feFuncB type="table" data-probe="blue" tableValues="0 1" />
						<feFuncA type="identity" data-probe="alpha" />
					</feComponentTransfer>
					<feTurbulence baseFrequency="0.05" data-probe="turbulence" numOctaves="2" />
					<feDisplacementMap data-probe="displacement" scale="8" />
				</filter>
			</svg>
		);

		for (const element of svg.querySelectorAll("[data-probe]")) {
			expect(element.namespaceURI, `${element.localName} must be SVG`).toBe(namespaces.svg);
		}
	});

	it("preserves SVG attribute spelling and assigns xlinkHref in the xlink namespace", () => {
		const use = <use href="#shape" xlinkHref="#legacy-shape" />;
		const path = <path fill-rule="evenodd" stroke-width="2" vector-effect="non-scaling-stroke" />;

		expect(path.getAttribute("stroke-width")).toBe("2");
		expect(path.getAttribute("fill-rule")).toBe("evenodd");
		expect(path.getAttribute("vector-effect")).toBe("non-scaling-stroke");
		expect(use.getAttribute("href")).toBe("#shape");
		expect(use.getAttributeNS(namespaces.xlink, "href")).toBe("#legacy-shape");
	});

	it("supports refs and events on SVG elements", () => {
		const ref = createRef();
		const click = vi.fn();
		const circle = <circle class={["dot", false, "active"]} ref={ref} onClick={click} r="5" />;

		circle.dispatchEvent(new MouseEvent("click"));

		expect(ref.current).toBe(circle);
		expect(circle.getAttribute("class")).toBe("dot active");
		expect(click).toHaveBeenCalledOnce();
		expect(click.mock.calls[0][0].target).toBe(circle);
	});
});

describe("XML namespace behavior", () => {
	it("adds the default xmlns declaration to implicit SVG elements", () => {
		const svg = <svg />;

		expect(svg.getAttribute("xmlns")).toBe(namespaces.svg);
		expect(svg.getAttributeNS(namespaces.xmlns, "xmlns")).toBe(namespaces.svg);
		expect(svg.attributes.getNamedItem("xmlns").namespaceURI).toBe(namespaces.xmlns);
	});

	it("creates elements in explicitly requested namespaces", () => {
		const explicitSvg = createElement("graphic", { xmlns: namespaces.svg });
		const explicitHtml = createElement("section", { xmlns: namespaces.html });
		const explicitMath = createElement("math", { xmlns: namespaces.mathMl });

		expect(explicitSvg.namespaceURI).toBe(namespaces.svg);
		expect(explicitHtml.namespaceURI).toBe(namespaces.html);
		expect(explicitMath.namespaceURI).toBe(namespaces.mathMl);
		for (const element of [explicitSvg, explicitHtml, explicitMath]) {
			expect(element.getAttributeNS(namespaces.xmlns, "xmlns")).toBe(element.namespaceURI);
		}
	});

	it("propagates an explicit MathML namespace through nested JSX", () => {
		const math = (
			<math xmlns={namespaces.mathMl}>
				<mrow>
					<mi>x</mi>
					<mo>+</mo>
					<mn>1</mn>
				</mrow>
			</math>
		);

		expect(math.namespaceURI).toBe(namespaces.mathMl);
		for (const descendant of math.querySelectorAll("*")) {
			expect(descendant.namespaceURI, `${descendant.localName} must be MathML`).toBe(namespaces.mathMl);
		}
	});

	it("keeps HTML descendants of SVG foreignObject in the HTML namespace", () => {
		const svg = (
			<svg>
				<foreignObject>
					<div className="html-content">
						<span>HTML</span>
					</div>
				</foreignObject>
			</svg>
		);
		const foreignObject = svg.querySelector("foreignObject");
		const div = foreignObject.querySelector("div");

		expect(foreignObject.namespaceURI).toBe(namespaces.svg);
		expect(div.namespaceURI).toBe(namespaces.html);
		expect(div.firstElementChild.namespaceURI).toBe(namespaces.html);
		expect(div.outerHTML).toBe('<div class="html-content"><span>HTML</span></div>');
	});
});
