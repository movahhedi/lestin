/// <reference path="jsx-runtime.d.ts" />

export function createElement<P extends {}>(
	type: (props?: (Lestin.Attributes & P) | null, children?: Lestin.LestinNode) => Lestin.LestinNode,
	props?: (Lestin.Attributes & P) | null,
): Lestin.LestinNode;
export function createElement<P extends Lestin.DOMAttributes<T>, T extends HTMLElement>(
	type: string,
	props?: (Lestin.HTMLAttributes<T> & P) | null,
): Lestin.LestinNode;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends Lestin.LestinNode>(
	type: keyof JSX.IntrinsicElements,
	props?: (Lestin.HTMLAttributes<T> & P) | null,
): Lestin.LestinNode;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends Lestin.LestinNode>(
	type:
		| string
		| keyof JSX.IntrinsicElements
		| ((props?: (Lestin.Attributes & P) | null, children?: Lestin.LestinNode) => Lestin.LestinNode),
	props?: (Lestin.HTMLAttributes<T> & P) | null,
): Lestin.LestinNode {
	let newChildren = props.children || [];
	delete props.children;

	if (!Array.isArray(newChildren)) {
		newChildren = [newChildren];
	}

	newChildren.forEach((child: any, index: any, object: any) => {
		if (typeof child !== "number" && (!child || child == false)) {
			object.splice(index, 1);
		}
	});

	if (typeof type === "function") return type(props, ...newChildren);

	let element: HTMLElement = document.createElement(type);

	Object.entries(props).forEach(([name, value]) => {
		if (!name || (!value && typeof value !== "number")) return;

		if (name.startsWith("on")) {
			let EventName = name.toLowerCase().substring(2);

			if (!Array.isArray(value)) {
				value = [value];
			}
			value.forEach((value_i: any) => {
				if (EventName && value_i) {
					element.addEventListener(EventName, value_i);
				}
			});
		} else if (name === "style") {
			if (typeof value === "string") element.style.cssText = value;
			else Object.assign(element, value);
			// else Object.assign(element.style, value);
		} else if (name === "dataset") {
			Object.assign(element.dataset, value);
		}
		else if (["className", "innerHTML", "htmlFor"].includes(name)) {
			element[name] = value;
		}

		/*else if (type == "svg" || type == "path" || type == "circle") {
			if (name == "xmlns") element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
			else element.setAttributeNS(null, name, value.toString());
		}*/

		else element.setAttribute(name, value.toString());
	});

	newChildren?.forEach((child: any) => appendChild(element, child));

	return element;
}

export const Fragment = (props: any, ...children: any) => children;

export function appendChild(parent: HTMLElement, text: string): void;
export function appendChild(parent: HTMLElement, child: HTMLElement): void;
export function appendChild(parent: HTMLElement, childOrText: HTMLElement | string): void {
	if (Array.isArray(childOrText)) {
		childOrText.forEach((nestedChild) => appendChild(parent, nestedChild));
	} else {
		parent.appendChild(childOrText instanceof HTMLElement ? childOrText : document.createTextNode(childOrText));
	}
}

export { createElement as jsx, createElement as jsxs, createElement as jsxDEV };
