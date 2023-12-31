/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="index.d.ts" />

/**
 * https://meiert.com/en/blog/boolean-attributes-of-html/
 */
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

export function CreateElement(type, props = null) {
	let newChildren = props.children || [];
	delete props.children;

	if (!Array.isArray(newChildren)) {
		newChildren = [newChildren];
	}

	const newChildrenArrayLength = newChildren.length;

	for (let i = 0; i < newChildrenArrayLength; i++) {
		const child = newChildren[i];
		// if ((typeof child !== "number" && !child) || (child?.length && !child?.length)) {
		if (!((Boolean(child) && !(Array.isArray(child) && !child.length)) || child === 0)) {
			newChildren.splice(i, 1);
		}
	}

	if (typeof type === "function") return type(props, ...newChildren);

	const element = document.createElement(type);

	Object.entries(props).forEach(([name, value]) => {
		if (!name || (!value && typeof value !== "number")) return;

		if (name == "class" || name == "className") {
			let className = "";
			if (Array.isArray(value)) {
				value = value.flat(5);

				const arrayLength = value.length;
				for (let i = 0; i < arrayLength; i++) {
					// eslint-disable-next-line max-depth
					if (value[i]) {
						className += (className ? " " : "") + value[i].trim();
					}
				}
				value = className;
			}
			element.className = value;
		} else if (name.startsWith("on")) {
			// TODO ondblclick doesn't work (onDoubleClick)
			const eventName = name.toLowerCase().substring(2);

			if (!Array.isArray(value)) {
				value = [value];
			}

			const arrayLength = value.length;
			for (let i = 0; i < arrayLength; i++) {
				if (eventName && value[i]) {
					element.addEventListener(eventName, value[i]);
				}
			}
		} else if (name === "style") {
			if (typeof value === "string") element.style.cssText = value;
			// else Object.assign(element, value);
			else Object.assign(element.style, value);
		} else if (name === "dataset") {
			Object.assign(element.dataset, value);
		} else if (name == "htmlFor" || name == "for") {
			element.htmlFor = value;
		} else if (["innerHTML", "innerText", "textContent"].includes(name)) {
			element[name] = value;
		} else if (booleanAttributes.includes(name) && value) {
			element[name] = name;
		} else element.setAttribute(name, value.toString());

		/*else if (type == "svg" || type == "path" || type == "circle") {
			if (name == "xmlns") element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
			else element.setAttributeNS(null, name, value.toString());
		}*/
	});

	newChildren?.forEach((child) => AppendChild(element, child));

	return element;
}

export const Fragment = (props, ...children) => children;

export function AppendChild(parent, childOrText) {
	if (Array.isArray(childOrText)) {
		childOrText.forEach((nestedChild) => AppendChild(parent, nestedChild));
	} else {
		parent.appendChild(childOrText instanceof HTMLElement ? childOrText : document.createTextNode(childOrText));
	}
}

export { CreateElement as jsx, CreateElement as jsxs, CreateElement as jsxDEV };
