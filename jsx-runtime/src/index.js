/// <reference path="index.d.ts" />

export function createElement(type, props = null) {
	let newChildren = props.children || [];
	delete props.children;

	if (!Array.isArray(newChildren)) {
		newChildren = [newChildren];
	}

	newChildren.forEach((child, index, object) => {
		// if ((typeof child !== "number" && !child) || (child?.length && !child?.length)) {
		if (!((Boolean(child) && !(Array.isArray(child) && !child.length)) || child === 0)) {
			object.splice(index, 1);
		}
	});

	if (typeof type === "function") return type(props, ...newChildren);

	let element = document.createElement(type);

	Object.entries(props).forEach(([name, value]) => {
		if (!name || (!value && typeof value !== "number")) return;

		if (name.startsWith("on")) {
			// TODO ondblclick doesn't work (onDoubleClick)
			let EventName = name.toLowerCase().substring(2);

			if (!Array.isArray(value)) {
				value = [value];
			}
			value.forEach((value_i) => {
				if (EventName && value_i) {
					element.addEventListener(EventName, value_i);
				}
			});
		} else if (name === "style") {
			if (typeof value === "string") element.style.cssText = value;
			// else Object.assign(element, value);
			else Object.assign(element.style, value);
		} else if (name === "dataset") {
			Object.assign(element.dataset, value);
		}
		else if (["innerHTML", "htmlFor"].includes(name)) {
			element[name] = value;
		}
		else if (["class", "className"].includes(name)) {
			let className = "";
			if (value) {
				if (Array.isArray(value)) {
					const arrayLength = value.length;
					for (let i = 0; i < arrayLength; i++) {
						if (value[i]) {
							className += (className ? " " : "") + value[i].trim();
						}
					}
				}
				element.className = value;
			}
		}

		/*else if (type == "svg" || type == "path" || type == "circle") {
			if (name == "xmlns") element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
			else element.setAttributeNS(null, name, value.toString());
		}*/

		else element.setAttribute(name, value.toString());
	});

	newChildren?.forEach((child) => appendChild(element, child));

	return element;
}

export const Fragment = (props, ...children) => children;

export function appendChild(parent, childOrText) {
	if (Array.isArray(childOrText)) {
		childOrText.forEach((nestedChild) => appendChild(parent, nestedChild));
	} else {
		parent.appendChild(childOrText instanceof HTMLElement ? childOrText : document.createTextNode(childOrText));
	}
}

export { createElement as jsx, createElement as jsxs, createElement as jsxDEV };
