/// <reference path="jsx-runtime.d.ts" />

// import _isEmpty from "lodash/isEmpty";

// export type ComponentChild = HTMLElement | string; // object | string | number | bigint | boolean | null | undefined;
// export type ComponentChildren = HTMLElement[] | HTMLElement | string;
/*
export interface LestinDOMAttributes {
	children?: HTMLElement[] | HTMLElement | string;
	dangerouslySetInnerHTML?: {
		__html: string;
	};
}*/

/*
// export function createElement(type: "input", props: DOMAttributes<HTMLInputElement> | null, ...children: ComponentChildren[]): HTMLElement;
export function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof IntrinsicElements, props: (DOMAttributes<T> & P) | null, ...children: ComponentChildren[]): HTMLElement;
export function createElement<P extends SVGAttributes<T>, T extends HTMLElement>(type: keyof IntrinsicElements, props: (DOMAttributes<T> & P) | null, ...children: ComponentChildren[]): HTMLElement;
export function createElement<T extends HTMLElement>(type: string, props: (DOMAttributes<T> & HTMLAttributes & SVGAttributes) | null, ...children: ComponentChildren[]): HTMLElement;
// export function createElement<P>(type: ComponentType<P>, props: (DOMAttributes<P> & P) | null, ...children: ComponentChildren[]): HTMLElement;
export function createElement(type: any, props: (DOMAttributes) | null = null, ...children: ComponentChildren[]) {*/

// export function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof IntrinsicElements, props: (DOMAttributes<T> & P) | null, ...children: ComponentChildren[]): HTMLElement {



// export function createElement(type: "input", props?: (InputHTMLAttributes<HTMLInputElement> & Attributes<HTMLInputElement>) | null, ...children: HTMLElement[]): DetailedLestinHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
// export function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof LestinHTML, props?: (Attributes<T> & P) | null, ...children: HTMLElement[]): DetailedLestinHTMLElement<P, T>;
// export function createElement<P extends SVGAttributes<T>, T extends SVGElement>(type: keyof LestinSVG, props?: (Attributes<T> & P) | null, ...children: HTMLElement[]): LestinSVGElement;
// export function createElement<P extends DOMAttributes<T>, T extends Element>(type: string, props?: (Attributes<T> & P) | null, ...children: HTMLElement[]): DOMElement<P, T>;

// export function createElement<P extends {}>(type: FunctionComponent<P>, props?: (Attributes & P) | null, ...children: HTMLElement[]): FunctionComponentElement<P>;
// export function createElement<P extends {}>(type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>, props?: (Attributes<ClassicComponent<P, ComponentState>> & P) | null, ...children: HTMLElement[]): CElement<P, ClassicComponent<P, ComponentState>>;
// export function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(type: ClassType<P, T, C>, props?: (Attributes<T> & P) | null, ...children: HTMLElement[]): CElement<P, T>;
// export function createElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string, props?: (Attributes & P) | null, ...children: HTMLElement[]): LestinElement<P>;

export function createElement<P extends {}>(type: (props?: (Lestin.Attributes & P) | null, ...children: HTMLElement[] | Lestin.LestinNode[]) => HTMLElement, props?: (Lestin.Attributes & P) | null, ...children: HTMLElement[]): HTMLElement;
export function createElement<P extends Lestin.DOMAttributes<T>, T extends HTMLElement>(type: string, props?: (Lestin.HTMLAttributes<T> & P) | null, ...children: HTMLElement[]): HTMLElement;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends HTMLElement>(type: keyof JSX.IntrinsicElements, props?: (Lestin.HTMLAttributes<T> & P) | null, ...children: HTMLElement[]): HTMLElement;
export function createElement<P extends Lestin.HTMLAttributes<T>, T extends HTMLElement>(type: string | keyof JSX.IntrinsicElements | ((props?: (Lestin.Attributes & P) | null, ...children: HTMLElement[]) => HTMLElement), props?: (Lestin.HTMLAttributes<T> & P) | null, ...children: HTMLElement[]): HTMLElement {
// export function createElement(type: IntrinsicElements, props: (HTMLAttributes<HTMLDivElement>), ...children: ComponentChildren[]): HTMLElement {

	// let newChildren = children || props.children || [];
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

	Object.entries(props || {}).forEach(([name, value]) => {

		if (name.startsWith("on") && name.toLowerCase() in window) {
			let EventName = name.toLowerCase().substring(2);
			if (Array.isArray(value)) {
				value.forEach((value_i) => element.addEventListener(EventName, value_i));
			} else element.addEventListener(EventName, value);
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

		else if (name === "children" || name === "childrenQ") {}

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
