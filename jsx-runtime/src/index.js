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
	"hidden",
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

	Object.entries(props).forEach(([propName, propValue]) => {
		if (!propName || (!propValue && typeof propValue !== "number" && propValue !== "")) return;

		if (propName == "class" || propName == "className") {
			let className = "";
			if (Array.isArray(propValue)) {
				propValue = propValue.flat(5);

				const arrayLength = propValue.length;
				for (let i = 0; i < arrayLength; i++) {
					// eslint-disable-next-line max-depth
					if (propValue[i]) {
						className += (className ? " " : "") + propValue[i].trim();
					}
				}
				propValue = className;
			}
			element.className = propValue;
		} else if (propName.startsWith("on")) {
			// TODO ondblclick doesn't work (onDoubleClick)
			const eventName = propName.toLowerCase().substring(2);

			if (!Array.isArray(propValue)) {
				propValue = [propValue];
			}

			const arrayLength = propValue.length;
			for (let i = 0; i < arrayLength; i++) {
				if (eventName && propValue[i]) {
					element.addEventListener(eventName, propValue[i]);
				}
			}
		} else if (propName === "style") {
			if (typeof propValue === "string") element.style.cssText = propValue;
			// else Object.assign(element, value);
			else Object.assign(element.style, propValue);
		} else if (propName === "dataset") {
			Object.assign(element.dataset, propValue);
		} else if (propName == "htmlFor" || propName == "for") {
			element.htmlFor = propValue;
		} else if (["innerHTML", "innerText", "textContent"].includes(propName)) {
			element[propName] = propValue;
		} else if (booleanAttributes.includes(propName) && propValue) {
			// element[name] = name;
			element.setAttribute(propName, propName);
		} else element.setAttribute(propName, propValue.toString());

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
