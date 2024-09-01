/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="index.d.ts" />

// import { classnames } from "tsx-dom-types";

export function CreateElement(type, props = {}) {
	// let children = props.children || [];
	// delete props.children;

	let { children, ...attrs } = props;

	if (!Array.isArray(children)) {
		children = [children];
	}

	let childrenArrayLength = children.length;

	for (let i = 0; i < childrenArrayLength; i++) {
		const child = children[i];
		// if ((typeof child !== "number" && !child) || (child?.length && !child?.length)) {
		if (!((Boolean(child) && !(Array.isArray(child) && !child.length)) || child === 0)) {
			children.splice(i, 1);
		}
	}

	props.children = children;

	if (typeof type === "function") {
		// return type({ ...props, children });
		return type(props);
	}

	const element = document.createElement(type);

	// Object.entries(attrs).forEach(([propName, propValue]) => {
	for (const propName in attrs) {
		if (!Object.hasOwn(attrs, propName)) {
			continue;
		}

		let propValue = attrs[propName];

		if (!propName || (!propValue && typeof propValue !== "number" && propValue !== "")) {
			continue;
		}

		// Ignore some debug props that might be added by bundlers
		if (propName === "__source" || propName === "__self" || propName === "tsxTag") {
			continue;
		}

		if (propName == "class" || propName == "className") {
			let className = "";
			if (Array.isArray(propValue)) {
				propValue = propValue.flat(5);

				// Slower version by 30%:
				// className = propValue.join(" ").replace(/(^ *)|( *$)/, "").replace(/ +/, " ");

				const arrayLength = propValue.length;
				// eslint-disable-next-line max-depth
				for (let i = 0; i < arrayLength; i++) {
					// eslint-disable-next-line max-depth
					if (propValue[i]) {
						className += (className ? " " : "") + propValue[i].trim();
					}
				}
				propValue = className;
			}

			element.className = propValue;
			// element.className = classnames(propValue);
		} else if (propName.startsWith("on")) {
			const finalName = propName.replace(/Capture$/, "");
			const useCapture = propName !== finalName;
			let eventName = finalName.toLowerCase().substring(2);

			// TODO make this better
			// ondblclick doesn't work (onDoubleClick)
			if (eventName === "doubleclick") {
				eventName = "dblclick";
			}

			if (!Array.isArray(propValue)) {
				propValue = [propValue];
			}

			const arrayLength = propValue.length;
			for (let i = 0; i < arrayLength; i++) {
				// eslint-disable-next-line max-depth
				if (eventName && propValue[i]) {
					element.addEventListener(eventName, propValue[i], useCapture);
				}
			}
		} else if (propName === "style") {
			if (typeof propValue === "string") {
				element.style.cssText = propValue;
			} else {
				// Object.assign(element, value);
				Object.assign(element.style, propValue);
			}
		} else if (propName === "dataset") {
			Object.assign(element.dataset, propValue);
		} else if (propName == "htmlFor" || propName == "for") {
			element.htmlFor = propValue;
		} else if (["innerHTML", "innerText", "textContent"].includes(propName)) {
			element[propName] = propValue;
		} else if (propValue === true) {
			// } else if (booleanAttributes.includes(propName) && propValue) {
			// element[name] = name;
			element.setAttribute(propName, propName);
		} else if (propName === "ref") {
			propValue.current = element;
		} else if (propName === "assign" && typeof propValue === "function") {
			propValue(element);
		} else {
			element.setAttribute(propName, propValue.toString());
		}

		/*else if (type == "svg" || type == "path" || type == "circle") {
			if (name == "xmlns") element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
			else element.setAttributeNS(null, name, value.toString());
		}*/
	}
	// });

	// children?.forEach((child) => AppendChild(element, child));
	// for (const child of children) {
	childrenArrayLength = children.length;
	for (let i = 0; i < childrenArrayLength; i++) {
		const child = children[i];
		AppendChild(element, child);
	}

	return element;
}

export const Fragment = (props) => props.children;

export function AppendChild(parent, childOrText) {
	if (Array.isArray(childOrText)) {
		// childOrText.forEach((nestedChild) => AppendChild(parent, nestedChild));
		// for (const nestedChild of childOrText) {
		const childOrTextArrayLength = childOrText.length;
		for (let i = 0; i < childOrTextArrayLength; i++) {
			const nestedChild = childOrText[i];
			AppendChild(parent, nestedChild);
		}
	} else {
		parent.appendChild(childOrText instanceof HTMLElement ? childOrText : document.createTextNode(childOrText));
		// HTMLElement or string or number or object or...
		// parent.appendChild(typeof childOrText === "" ? document.createTextNode(childOrText) : childOrText);
	}
}

export { CreateElement as jsx, CreateElement as jsxs, CreateElement as jsxDEV };

export const createRef = () => ({ current: undefined });
