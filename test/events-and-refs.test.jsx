/* eslint-disable react/no-unknown-property */
import { createRef } from "lestin";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
	document.body.replaceChildren();
});

describe("DOM events", () => {
	it("registers a single event handler with native event fields", () => {
		let observedEvent;
		const handler = vi.fn((event) => {
			observedEvent = {
				currentTarget: event.currentTarget,
				target: event.target,
				type: event.type,
			};
		});
		const button = <button onClick={handler}>Click</button>;
		document.body.append(button);

		button.click();

		expect(handler).toHaveBeenCalledOnce();
		const [event] = handler.mock.calls[0];
		expect(event).toBeInstanceOf(MouseEvent);
		expect(observedEvent.type).toBe("click");
		expect(observedEvent.target).toBe(button);
		expect(observedEvent.currentTarget).toBe(button);
		expect(event.currentTarget).toBe(null);
	});

	it("runs event arrays in order and ignores every falsy entry", () => {
		const calls = [];
		const first = vi.fn(() => calls.push("first"));
		const second = vi.fn(() => calls.push("second"));
		const button = <button onClick={[first, false, null, undefined, 0, second]} />;

		button.dispatchEvent(new MouseEvent("click"));

		expect(first).toHaveBeenCalledOnce();
		expect(second).toHaveBeenCalledOnce();
		expect(calls).toEqual(["first", "second"]);
	});

	it("honors capture and bubble phases in deterministic order", () => {
		const calls = [];
		const tree = (
			<div
				onClick={() => calls.push("parent bubble")}
				onClickCapture={() => calls.push("parent capture")}
			>
				<button
					onClick={() => calls.push("button bubble")}
					onClickCapture={() => calls.push("button capture")}
				>
					Target
				</button>
			</div>
		);
		document.body.append(tree);

		tree.querySelector("button").click();

		expect(calls).toEqual(["parent capture", "button capture", "button bubble", "parent bubble"]);
	});

	it("maps onDoubleClick to dblclick and supports custom events", () => {
		const doubleClick = vi.fn();
		const ready = vi.fn();
		const element = <div onDoubleClick={doubleClick} onReady={ready} />;

		element.dispatchEvent(new MouseEvent("dblclick"));
		element.dispatchEvent(new CustomEvent("ready", { detail: { status: "ok" } }));

		expect(doubleClick).toHaveBeenCalledOnce();
		expect(ready).toHaveBeenCalledOnce();
		expect(ready.mock.calls[0][0].detail).toEqual({ status: "ok" });
	});

	it("supports cancellation, keyboard events, and input events", () => {
		const cancel = vi.fn((event) => event.preventDefault());
		const keyDown = vi.fn();
		const input = vi.fn();
		const field = <input onBeforeInput={cancel} onInput={input} onKeyDown={keyDown} />;
		const beforeInputEvent = new InputEvent("beforeinput", {
			bubbles: true,
			cancelable: true,
			data: "x",
		});

		expect(field.dispatchEvent(beforeInputEvent)).toBe(false);
		field.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
		field.dispatchEvent(new InputEvent("input", { bubbles: true, data: "x" }));

		expect(cancel).toHaveBeenCalledOnce();
		expect(beforeInputEvent.defaultPrevented).toBe(true);
		expect(keyDown.mock.calls[0][0].key).toBe("Enter");
		expect(input.mock.calls[0][0].data).toBe("x");
	});

	it("ignores an event prop with no event name", () => {
		const handler = vi.fn();
		const element = <div {...{ on: handler }} />;

		element.dispatchEvent(new Event(""));

		expect(handler).not.toHaveBeenCalled();
	});
});

describe("refs", () => {
	it("creates empty and initialized refs", () => {
		expect(createRef()).toEqual({ current: undefined });
		expect(createRef("initial")).toEqual({ current: "initial" });
		expect(createRef(null)).toEqual({ current: null });
	});

	it("assigns exact HTML and SVG nodes", () => {
		const htmlRef = createRef();
		const svgRef = createRef();
		const input = <input ref={htmlRef} />;
		const circle = <circle ref={svgRef} cx="5" cy="5" r="4" />;

		expect(htmlRef.current).toBe(input);
		expect(htmlRef.current).toBeInstanceOf(HTMLInputElement);
		expect(svgRef.current).toBe(circle);
		expect(svgRef.current).toBeInstanceOf(SVGCircleElement);
	});

	it("updates a reused ref to the most recently created element", () => {
		const ref = createRef();
		const first = <div ref={ref} />;
		const second = <button ref={ref} />;

		expect(first).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(second);
	});

	it("ignores a falsy ref value", () => {
		expect(() => <div ref={null} />).not.toThrow();
	});
});
