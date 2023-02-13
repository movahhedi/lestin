/// <reference path="jsx-runtime.d.ts" />

export function createElement<P extends {}>(type: (props?: (Lestin.Attributes & P) | null, children?: Lestin.LestinNode) => Lestin.LestinNode, props?: (Lestin.Attributes & P) | null, ...children: HTMLElement[]): Lestin.LestinNode;
export function createElement<P extends Lestin.DOMAttributes<T>, T extends HTMLElement>(type: string, props?: (Lestin.HTMLAttributes<T> & P) | null, children?: Lestin.LestinNode): Lestin.LestinNode;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends Lestin.LestinNode>(type: keyof JSX.IntrinsicElements, props?: (Lestin.HTMLAttributes<T> & P) | null, children?: Lestin.LestinNode): Lestin.LestinNode;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends Lestin.LestinNode>(type: string | keyof JSX.IntrinsicElements | ((props?: (Lestin.Attributes & P) | null, children?: Lestin.LestinNode) => Lestin.LestinNode), props?: (Lestin.HTMLAttributes<T> & P) | null, children?: Lestin.LestinNode): Lestin.LestinNode {

	let newChildren = props.children || [];
	delete props["children"];

	if ( ! Array.isArray(newChildren)) {
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

		if (name.startsWith("on") && name.toLowerCase() in window) {
			let EventName = name.toLowerCase().substring(2);
			if (Array.isArray(value)) {
				value.forEach((value_i) => {
					if (EventName && value_i) {
						element.addEventListener(EventName, value_i);
					}
				});
			} else if (EventName && value) {
				element.addEventListener(EventName, value);
			}
		}

		else if (name === "style") {
			if (typeof value === "string") element.style.cssText = value;
			else Object.assign(element, value);
			// else Object.assign(element.style, value);
		}

		else if (name === "innerHTML") element.innerHTML = value;
		else if (name === "htmlFor" && element instanceof HTMLLabelElement) element.htmlFor = value;
		else if (name === "className" || name === "class") element.className = value;
		else if (name === "data" || name === "dataset") Object.assign(element.dataset, value);

		// else if (name.startsWith("func") && typeof value === "function") element[name.substring(4)] = value;

		/*else if (name !== name.toLowerCase()) {
			let att = document.createAttribute(name);
			att.value = value as string;
			element.setAttributeNode(att);
		}*/

		/*else if (type == "svg" || type == "path" || type == "circle") {
			if (name == "xmlns") element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
			else element.setAttributeNS(null, name, value.toString());
		}*/

		// else if (name === "children") {}

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
	}
	else if (childOrText instanceof HTMLElement) {
		parent.appendChild(childOrText);
	}
	else {
		parent.appendChild(document.createTextNode(childOrText));
	}
}

export {
	createElement as jsx,
	createElement as jsxs,
	createElement as jsxDEV,
};
