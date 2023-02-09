/// <reference path="global.d.ts" />

import * as CSS from "csstype";
import * as PropTypes from "prop-types";
// import { Interaction as SchedulerInteraction } from "scheduler/tracing";

type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | "true" | "false";

export = Lestin;
export as namespace Lestin;

declare namespace Lestin {
	//
	// Lestin Elements
	// ----------------------------------------------------------------------

	type ElementType<P = any> =
		| {
				[K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never;
		  }[keyof JSX.IntrinsicElements]
		| ComponentType<P>;
	type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

	type JSXElementConstructor<P> = ((props: P) => LestinElement<any, any> | null) | (new (props: P) => Component<any, any>);

	type ComponentState = any;

	type Key = string | number;

	/**
	 * @internal You shouldn't need to use this type since you never see these attributes
	 * inside your component or have to validate them.
	 */
	interface Attributes<T = {}> {}

	interface LestinElement extends HTMLElement {}
	interface LestinElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> extends HTMLElement {}

	interface LestinComponentElement<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, "key" | "ref">>> extends LestinElement<P, Exclude<T, number>> {}

	// string fallback for custom web-components
	interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends LestinElement<P, string> {}

	// LestinHTML for LestinHTMLElement
	interface LestinHTMLElement<T extends HTMLElement> extends DetailedLestinHTMLElement<AllHTMLAttributes<T>, T> {}

	interface DetailedLestinHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {}

	// LestinSVG for LestinSVGElement
	interface LestinSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
		type: keyof LestinSVG;
	}

	type DOMFactory<P extends DOMAttributes<T>, T extends Element> = (props?: (Attributes<T> & P) | null, ...children: LestinNode[]) => DOMElement<P, T>;

	interface HTMLFactory<T extends HTMLElement> extends DetailedHTMLFactory<AllHTMLAttributes<T>, T> {}

	interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
		(props?: (Attributes<T> & P) | null, ...children: LestinNode[]): DetailedLestinHTMLElement<P, T>;
	}

	interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
		(props?: (Attributes<SVGElement> & SVGAttributes<SVGElement>) | null, ...children: LestinNode[]): LestinSVGElement;
	}

	/**
	 * @deprecated - This type is not relevant when using Lestin. Inline the type instead to make the intent clear.
	 */
	type LestinText = string | number;
	/**
	 * @deprecated - This type is not relevant when using Lestin. Inline the type instead to make the intent clear.
	 */
	type LestinChild = LestinElement | string | number;

	type LestinFragment = Iterable<LestinNode>;
	type LestinNode = LestinElement | string | number | LestinFragment | boolean | null | undefined;

	//
	// Top Level API
	// ----------------------------------------------------------------------

	// DOM Elements
	// TODO: generalize this to everything in `keyof LestinHTML`, not just "input"
	function createElement(type: "input", props?: (InputHTMLAttributes<HTMLInputElement> & Attributes<HTMLInputElement>) | null, ...children: LestinNode[]): DetailedLestinHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
	function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof LestinHTML, props?: (Attributes<T> & P) | null, ...children: LestinNode[]): DetailedLestinHTMLElement<P, T>;
	function createElement<P extends SVGAttributes<T>, T extends SVGElement>(type: keyof LestinSVG, props?: (Attributes<T> & P) | null, ...children: LestinNode[]): LestinSVGElement;
	function createElement<P extends DOMAttributes<T>, T extends Element>(type: string, props?: (Attributes<T> & P) | null, ...children: LestinNode[]): DOMElement<P, T>;

	// Custom components

	// function createElement<P extends {}>(type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>, props?: (Attributes<ClassicComponent<P, ComponentState>> & P) | null, ...children: LestinNode[]): CElement<P, ClassicComponent<P, ComponentState>>;
	// function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(type: ClassType<P, T, C>, props?: (Attributes<T> & P) | null, ...children: LestinNode[]): CElement<P, T>;
	function createElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string, props?: (Attributes & P) | null, ...children: LestinNode[]): LestinElement<P>;

	// DOM Elements
	// LestinHTMLElement
	function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(element: DetailedLestinHTMLElement<P, T>, props?: P, ...children: LestinNode[]): DetailedLestinHTMLElement<P, T>;
	// LestinHTMLElement, less specific
	function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(element: LestinHTMLElement<T>, props?: P, ...children: LestinNode[]): LestinHTMLElement<T>;
	// SVGElement
	function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(element: LestinSVGElement, props?: P, ...children: LestinNode[]): LestinSVGElement;
	// DOM Element (has to be the last, because type checking stops at first overload that fits)
	function cloneElement<P extends DOMAttributes<T>, T extends Element>(element: DOMElement<P, T>, props?: DOMAttributes<T> & P, ...children: LestinNode[]): DOMElement<P, T>;

	// Custom components
	function cloneElement<P>(element: LestinElement<P>, props?: Partial<P> & Attributes, ...children: LestinNode[]): LestinElement<P>;

	function isValidElement<P>(object: {} | null | undefined): object is LestinElement<P>;

	// Sync with `LestinChildren` until `LestinChildren` is removed.
	const Children: {
		map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
		forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
		count(children: any): number;
		only<C>(children: C): C extends any[] ? never : C;
		toArray(children: LestinNode | LestinNode[]): Array<Exclude<LestinNode, boolean | null | undefined>>;
	};

	//
	// Component API
	// ----------------------------------------------------------------------

	// Base component for plain JS classes
	interface Component<P = {}, S = {}, SS = any> {}
	class Component<P, S> {}

	interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {}

	//
	// Class Interfaces
	// ----------------------------------------------------------------------

	interface FunctionComponent<P = {}> {}
	interface ComponentClass<P = {}, S = ComponentState> {}
	interface ClassicComponentClass<P = {}> extends ComponentClass<P> {}

	/**
	 * We use an intersection type to infer multiple type parameters from
	 * a single argument, which is useful for many top-level API defs.
	 * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
	 */
	// TODO REMOVE
	// type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> = C & (new (props: P, context?: any) => T);

	//
	// Component Specs and Lifecycle
	// ----------------------------------------------------------------------

	type PropsWithChildren<P = unknown> = P & { children?: LestinNode | undefined };

	/**
	 * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
	 * or ComponentPropsWithoutRef when refs are not supported.
	 */
	type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = T extends JSXElementConstructor<infer P> ? P : T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : {};

	//
	// Event System
	// ----------------------------------------------------------------------
	// TODO: change any to unknown when moving to TS v3
	interface BaseSyntheticEvent<E = object, C = any, T = any> {
		nativeEvent: E;
		currentTarget: C;
		target: T;
		bubbles: boolean;
		cancelable: boolean;
		defaultPrevented: boolean;
		eventPhase: number;
		isTrusted: boolean;
		preventDefault(): void;
		isDefaultPrevented(): boolean;
		stopPropagation(): void;
		isPropagationStopped(): boolean;
		persist(): void;
		timeStamp: number;
		type: string;
	}

	/**
	 * currentTarget - a reference to the element on which the event listener is registered.
	 *
	 * target - a reference to the element from which the event was originally dispatched.
	 * This might be a child element to the element on which the event listener is registered.
	 * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
	 */
	interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

	interface ClipboardEvent<T = Element> extends SyntheticEvent<T, NativeClipboardEvent> {
		clipboardData: DataTransfer;
	}

	interface CompositionEvent<T = Element> extends SyntheticEvent<T, NativeCompositionEvent> {
		data: string;
	}

	interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
		dataTransfer: DataTransfer;
	}

	interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
		pointerId: number;
		pressure: number;
		tangentialPressure: number;
		tiltX: number;
		tiltY: number;
		twist: number;
		width: number;
		height: number;
		pointerType: "mouse" | "pen" | "touch";
		isPrimary: boolean;
	}

	interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {
		relatedTarget: (EventTarget & RelatedTarget) | null;
		target: EventTarget & Target;
	}

	interface FormEvent<T = Element> extends SyntheticEvent<T> {}

	interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
		target: EventTarget & T;
	}

	interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
		target: EventTarget & T;
	}

	interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
		altKey: boolean;
		/** @deprecated */
		charCode: number;
		ctrlKey: boolean;
		code: string;
		/**
		 * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
		 */
		getModifierState(key: string): boolean;
		/**
		 * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
		 */
		key: string;
		/** @deprecated */
		keyCode: number;
		locale: string;
		location: number;
		metaKey: boolean;
		repeat: boolean;
		shiftKey: boolean;
		/** @deprecated */
		which: number;
	}

	interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
		altKey: boolean;
		button: number;
		buttons: number;
		clientX: number;
		clientY: number;
		ctrlKey: boolean;
		/**
		 * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
		 */
		getModifierState(key: string): boolean;
		metaKey: boolean;
		movementX: number;
		movementY: number;
		pageX: number;
		pageY: number;
		relatedTarget: EventTarget | null;
		screenX: number;
		screenY: number;
		shiftKey: boolean;
	}

	interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
		altKey: boolean;
		changedTouches: TouchList;
		ctrlKey: boolean;
		/**
		 * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
		 */
		getModifierState(key: string): boolean;
		metaKey: boolean;
		shiftKey: boolean;
		targetTouches: TouchList;
		touches: TouchList;
	}

	interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {
		detail: number;
		view: AbstractView;
	}

	interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
		deltaMode: number;
		deltaX: number;
		deltaY: number;
		deltaZ: number;
	}

	interface AnimationEvent<T = Element> extends SyntheticEvent<T, NativeAnimationEvent> {
		animationName: string;
		elapsedTime: number;
		pseudoElement: string;
	}

	interface TransitionEvent<T = Element> extends SyntheticEvent<T, NativeTransitionEvent> {
		elapsedTime: number;
		propertyName: string;
		pseudoElement: string;
	}

	//
	// Event Handler Types
	// ----------------------------------------------------------------------

	type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

	type LestinEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;

	type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
	type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
	type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
	type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
	type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
	type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
	type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
	type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
	type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
	type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
	type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
	type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
	type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
	type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

	//
	// Props / DOM Attributes
	// ----------------------------------------------------------------------

	interface HTMLProps<T> extends AllHTMLAttributes<T>, Attributes<T> {}

	type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = Attributes<T> & E;

	interface SVGProps<T> extends SVGAttributes<T>, Attributes<T> {}

	interface DOMAttributes<T> {
		children?: LestinNode | undefined;
		innerHTML?: string | TrustedHTML | undefined;

		// Clipboard Events
		onCopy?: ClipboardEventHandler<T> | undefined;
		onCopyCapture?: ClipboardEventHandler<T> | undefined;
		onCut?: ClipboardEventHandler<T> | undefined;
		onCutCapture?: ClipboardEventHandler<T> | undefined;
		onPaste?: ClipboardEventHandler<T> | undefined;
		onPasteCapture?: ClipboardEventHandler<T> | undefined;

		// Composition Events
		onCompositionEnd?: CompositionEventHandler<T> | undefined;
		onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
		onCompositionStart?: CompositionEventHandler<T> | undefined;
		onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
		onCompositionUpdate?: CompositionEventHandler<T> | undefined;
		onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;

		// Focus Events
		onFocus?: FocusEventHandler<T> | undefined;
		onFocusCapture?: FocusEventHandler<T> | undefined;
		onBlur?: FocusEventHandler<T> | undefined;
		onBlurCapture?: FocusEventHandler<T> | undefined;

		// Form Events
		onChange?: FormEventHandler<T> | undefined;
		onChangeCapture?: FormEventHandler<T> | undefined;
		onBeforeInput?: FormEventHandler<T> | undefined;
		onBeforeInputCapture?: FormEventHandler<T> | undefined;
		onInput?: FormEventHandler<T> | undefined;
		onInputCapture?: FormEventHandler<T> | undefined;
		onReset?: FormEventHandler<T> | undefined;
		onResetCapture?: FormEventHandler<T> | undefined;
		onSubmit?: FormEventHandler<T> | undefined;
		onSubmitCapture?: FormEventHandler<T> | undefined;
		onInvalid?: FormEventHandler<T> | undefined;
		onInvalidCapture?: FormEventHandler<T> | undefined;

		// Image Events
		onLoad?: LestinEventHandler<T> | undefined;
		onLoadCapture?: LestinEventHandler<T> | undefined;
		onError?: LestinEventHandler<T> | undefined; // also a Media Event
		onErrorCapture?: LestinEventHandler<T> | undefined; // also a Media Event

		// Keyboard Events
		onKeyDown?: KeyboardEventHandler<T> | undefined;
		onKeyDownCapture?: KeyboardEventHandler<T> | undefined;
		/** @deprecated */
		onKeyPress?: KeyboardEventHandler<T> | undefined;
		/** @deprecated */
		onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
		onKeyUp?: KeyboardEventHandler<T> | undefined;
		onKeyUpCapture?: KeyboardEventHandler<T> | undefined;

		// Media Events
		onAbort?: LestinEventHandler<T> | undefined;
		onAbortCapture?: LestinEventHandler<T> | undefined;
		onCanPlay?: LestinEventHandler<T> | undefined;
		onCanPlayCapture?: LestinEventHandler<T> | undefined;
		onCanPlayThrough?: LestinEventHandler<T> | undefined;
		onCanPlayThroughCapture?: LestinEventHandler<T> | undefined;
		onDurationChange?: LestinEventHandler<T> | undefined;
		onDurationChangeCapture?: LestinEventHandler<T> | undefined;
		onEmptied?: LestinEventHandler<T> | undefined;
		onEmptiedCapture?: LestinEventHandler<T> | undefined;
		onEncrypted?: LestinEventHandler<T> | undefined;
		onEncryptedCapture?: LestinEventHandler<T> | undefined;
		onEnded?: LestinEventHandler<T> | undefined;
		onEndedCapture?: LestinEventHandler<T> | undefined;
		onLoadedData?: LestinEventHandler<T> | undefined;
		onLoadedDataCapture?: LestinEventHandler<T> | undefined;
		onLoadedMetadata?: LestinEventHandler<T> | undefined;
		onLoadedMetadataCapture?: LestinEventHandler<T> | undefined;
		onLoadStart?: LestinEventHandler<T> | undefined;
		onLoadStartCapture?: LestinEventHandler<T> | undefined;
		onPause?: LestinEventHandler<T> | undefined;
		onPauseCapture?: LestinEventHandler<T> | undefined;
		onPlay?: LestinEventHandler<T> | undefined;
		onPlayCapture?: LestinEventHandler<T> | undefined;
		onPlaying?: LestinEventHandler<T> | undefined;
		onPlayingCapture?: LestinEventHandler<T> | undefined;
		onProgress?: LestinEventHandler<T> | undefined;
		onProgressCapture?: LestinEventHandler<T> | undefined;
		onRateChange?: LestinEventHandler<T> | undefined;
		onRateChangeCapture?: LestinEventHandler<T> | undefined;
		onSeeked?: LestinEventHandler<T> | undefined;
		onSeekedCapture?: LestinEventHandler<T> | undefined;
		onSeeking?: LestinEventHandler<T> | undefined;
		onSeekingCapture?: LestinEventHandler<T> | undefined;
		onStalled?: LestinEventHandler<T> | undefined;
		onStalledCapture?: LestinEventHandler<T> | undefined;
		onSuspend?: LestinEventHandler<T> | undefined;
		onSuspendCapture?: LestinEventHandler<T> | undefined;
		onTimeUpdate?: LestinEventHandler<T> | undefined;
		onTimeUpdateCapture?: LestinEventHandler<T> | undefined;
		onVolumeChange?: LestinEventHandler<T> | undefined;
		onVolumeChangeCapture?: LestinEventHandler<T> | undefined;
		onWaiting?: LestinEventHandler<T> | undefined;
		onWaitingCapture?: LestinEventHandler<T> | undefined;

		// MouseEvents
		onAuxClick?: MouseEventHandler<T> | undefined;
		onAuxClickCapture?: MouseEventHandler<T> | undefined;
		onClick?: MouseEventHandler<T> | undefined;
		onClickCapture?: MouseEventHandler<T> | undefined;
		onContextMenu?: MouseEventHandler<T> | undefined;
		onContextMenuCapture?: MouseEventHandler<T> | undefined;
		onDoubleClick?: MouseEventHandler<T> | undefined;
		onDoubleClickCapture?: MouseEventHandler<T> | undefined;
		onDrag?: DragEventHandler<T> | undefined;
		onDragCapture?: DragEventHandler<T> | undefined;
		onDragEnd?: DragEventHandler<T> | undefined;
		onDragEndCapture?: DragEventHandler<T> | undefined;
		onDragEnter?: DragEventHandler<T> | undefined;
		onDragEnterCapture?: DragEventHandler<T> | undefined;
		onDragExit?: DragEventHandler<T> | undefined;
		onDragExitCapture?: DragEventHandler<T> | undefined;
		onDragLeave?: DragEventHandler<T> | undefined;
		onDragLeaveCapture?: DragEventHandler<T> | undefined;
		onDragOver?: DragEventHandler<T> | undefined;
		onDragOverCapture?: DragEventHandler<T> | undefined;
		onDragStart?: DragEventHandler<T> | undefined;
		onDragStartCapture?: DragEventHandler<T> | undefined;
		onDrop?: DragEventHandler<T> | undefined;
		onDropCapture?: DragEventHandler<T> | undefined;
		onMouseDown?: MouseEventHandler<T> | undefined;
		onMouseDownCapture?: MouseEventHandler<T> | undefined;
		onMouseEnter?: MouseEventHandler<T> | undefined;
		onMouseLeave?: MouseEventHandler<T> | undefined;
		onMouseMove?: MouseEventHandler<T> | undefined;
		onMouseMoveCapture?: MouseEventHandler<T> | undefined;
		onMouseOut?: MouseEventHandler<T> | undefined;
		onMouseOutCapture?: MouseEventHandler<T> | undefined;
		onMouseOver?: MouseEventHandler<T> | undefined;
		onMouseOverCapture?: MouseEventHandler<T> | undefined;
		onMouseUp?: MouseEventHandler<T> | undefined;
		onMouseUpCapture?: MouseEventHandler<T> | undefined;

		// Selection Events
		onSelect?: LestinEventHandler<T> | undefined;
		onSelectCapture?: LestinEventHandler<T> | undefined;

		// Touch Events
		onTouchCancel?: TouchEventHandler<T> | undefined;
		onTouchCancelCapture?: TouchEventHandler<T> | undefined;
		onTouchEnd?: TouchEventHandler<T> | undefined;
		onTouchEndCapture?: TouchEventHandler<T> | undefined;
		onTouchMove?: TouchEventHandler<T> | undefined;
		onTouchMoveCapture?: TouchEventHandler<T> | undefined;
		onTouchStart?: TouchEventHandler<T> | undefined;
		onTouchStartCapture?: TouchEventHandler<T> | undefined;

		// Pointer Events
		onPointerDown?: PointerEventHandler<T> | undefined;
		onPointerDownCapture?: PointerEventHandler<T> | undefined;
		onPointerMove?: PointerEventHandler<T> | undefined;
		onPointerMoveCapture?: PointerEventHandler<T> | undefined;
		onPointerUp?: PointerEventHandler<T> | undefined;
		onPointerUpCapture?: PointerEventHandler<T> | undefined;
		onPointerCancel?: PointerEventHandler<T> | undefined;
		onPointerCancelCapture?: PointerEventHandler<T> | undefined;
		onPointerEnter?: PointerEventHandler<T> | undefined;
		onPointerEnterCapture?: PointerEventHandler<T> | undefined;
		onPointerLeave?: PointerEventHandler<T> | undefined;
		onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
		onPointerOver?: PointerEventHandler<T> | undefined;
		onPointerOverCapture?: PointerEventHandler<T> | undefined;
		onPointerOut?: PointerEventHandler<T> | undefined;
		onPointerOutCapture?: PointerEventHandler<T> | undefined;
		onGotPointerCapture?: PointerEventHandler<T> | undefined;
		onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
		onLostPointerCapture?: PointerEventHandler<T> | undefined;
		onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;

		// UI Events
		onScroll?: UIEventHandler<T> | undefined;
		onScrollCapture?: UIEventHandler<T> | undefined;

		// Wheel Events
		onWheel?: WheelEventHandler<T> | undefined;
		onWheelCapture?: WheelEventHandler<T> | undefined;

		// Animation Events
		onAnimationStart?: AnimationEventHandler<T> | undefined;
		onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
		onAnimationEnd?: AnimationEventHandler<T> | undefined;
		onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
		onAnimationIteration?: AnimationEventHandler<T> | undefined;
		onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;

		// Transition Events
		onTransitionEnd?: TransitionEventHandler<T> | undefined;
		onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
	}

	export interface CSSProperties extends CSS.Properties<string | number> {
		/**
		 * The index signature was removed to enable closed typing for style
		 * using CSSType. You're able to use type assertion or module augmentation
		 * to add properties or an index signature of your own.
		 *
		 * For examples and more information, visit:
		 * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
		 */
	}

	// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
	interface AriaAttributes {
		/** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
		"aria-activedescendant"?: string | undefined;
		/** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
		"aria-atomic"?: Booleanish | undefined;
		/**
		 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
		 * presented if they are made.
		 */
		"aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
		/** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
		"aria-busy"?: Booleanish | undefined;
		/**
		 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
		 * @see aria-pressed @see aria-selected.
		 */
		"aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
		/**
		 * Defines the total number of columns in a table, grid, or treegrid.
		 * @see aria-colindex.
		 */
		"aria-colcount"?: number | undefined;
		/**
		 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
		 * @see aria-colcount @see aria-colspan.
		 */
		"aria-colindex"?: number | undefined;
		/**
		 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
		 * @see aria-colindex @see aria-rowspan.
		 */
		"aria-colspan"?: number | undefined;
		/**
		 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
		 * @see aria-owns.
		 */
		"aria-controls"?: string | undefined;
		/** Indicates the element that represents the current item within a container or set of related elements. */
		"aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined;
		/**
		 * Identifies the element (or elements) that describes the object.
		 * @see aria-labelledby
		 */
		"aria-describedby"?: string | undefined;
		/**
		 * Identifies the element that provides a detailed, extended description for the object.
		 * @see aria-describedby.
		 */
		"aria-details"?: string | undefined;
		/**
		 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
		 * @see aria-hidden @see aria-readonly.
		 */
		"aria-disabled"?: Booleanish | undefined;
		/**
		 * Indicates what functions can be performed when a dragged object is released on the drop target.
		 * @deprecated in ARIA 1.1
		 */
		"aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup" | undefined;
		/**
		 * Identifies the element that provides an error message for the object.
		 * @see aria-invalid @see aria-describedby.
		 */
		"aria-errormessage"?: string | undefined;
		/** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
		"aria-expanded"?: Booleanish | undefined;
		/**
		 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
		 * allows assistive technology to override the general default of reading in document source order.
		 */
		"aria-flowto"?: string | undefined;
		/**
		 * Indicates an element's "grabbed" state in a drag-and-drop operation.
		 * @deprecated in ARIA 1.1
		 */
		"aria-grabbed"?: Booleanish | undefined;
		/** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
		"aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined;
		/**
		 * Indicates whether the element is exposed to an accessibility API.
		 * @see aria-disabled.
		 */
		"aria-hidden"?: Booleanish | undefined;
		/**
		 * Indicates the entered value does not conform to the format expected by the application.
		 * @see aria-errormessage.
		 */
		"aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined;
		/** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
		"aria-keyshortcuts"?: string | undefined;
		/**
		 * Defines a string value that labels the current element.
		 * @see aria-labelledby.
		 */
		"aria-label"?: string | undefined;
		/**
		 * Identifies the element (or elements) that labels the current element.
		 * @see aria-describedby.
		 */
		"aria-labelledby"?: string | undefined;
		/** Defines the hierarchical level of an element within a structure. */
		"aria-level"?: number | undefined;
		/** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
		"aria-live"?: "off" | "assertive" | "polite" | undefined;
		/** Indicates whether an element is modal when displayed. */
		"aria-modal"?: Booleanish | undefined;
		/** Indicates whether a text box accepts multiple lines of input or only a single line. */
		"aria-multiline"?: Booleanish | undefined;
		/** Indicates that the user may select more than one item from the current selectable descendants. */
		"aria-multiselectable"?: Booleanish | undefined;
		/** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
		"aria-orientation"?: "horizontal" | "vertical" | undefined;
		/**
		 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
		 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
		 * @see aria-controls.
		 */
		"aria-owns"?: string | undefined;
		/**
		 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
		 * A hint could be a sample value or a brief description of the expected format.
		 */
		"aria-placeholder"?: string | undefined;
		/**
		 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
		 * @see aria-setsize.
		 */
		"aria-posinset"?: number | undefined;
		/**
		 * Indicates the current "pressed" state of toggle buttons.
		 * @see aria-checked @see aria-selected.
		 */
		"aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
		/**
		 * Indicates that the element is not editable, but is otherwise operable.
		 * @see aria-disabled.
		 */
		"aria-readonly"?: Booleanish | undefined;
		/**
		 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
		 * @see aria-atomic.
		 */
		"aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals" | undefined;
		/** Indicates that user input is required on the element before a form may be submitted. */
		"aria-required"?: Booleanish | undefined;
		/** Defines a human-readable, author-localized description for the role of an element. */
		"aria-roledescription"?: string | undefined;
		/**
		 * Defines the total number of rows in a table, grid, or treegrid.
		 * @see aria-rowindex.
		 */
		"aria-rowcount"?: number | undefined;
		/**
		 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
		 * @see aria-rowcount @see aria-rowspan.
		 */
		"aria-rowindex"?: number | undefined;
		/**
		 * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
		 * @see aria-rowindex @see aria-colspan.
		 */
		"aria-rowspan"?: number | undefined;
		/**
		 * Indicates the current "selected" state of various widgets.
		 * @see aria-checked @see aria-pressed.
		 */
		"aria-selected"?: Booleanish | undefined;
		/**
		 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
		 * @see aria-posinset.
		 */
		"aria-setsize"?: number | undefined;
		/** Indicates if items in a table or grid are sorted in ascending or descending order. */
		"aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
		/** Defines the maximum allowed value for a range widget. */
		"aria-valuemax"?: number | undefined;
		/** Defines the minimum allowed value for a range widget. */
		"aria-valuemin"?: number | undefined;
		/**
		 * Defines the current value for a range widget.
		 * @see aria-valuetext.
		 */
		"aria-valuenow"?: number | undefined;
		/** Defines the human readable text alternative of aria-valuenow for a range widget. */
		"aria-valuetext"?: string | undefined;
	}

	// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
	type AriaRole = "alert" | "alertdialog" | "application" | "article" | "banner" | "button" | "cell" | "checkbox" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "dialog" | "directory" | "document" | "feed" | "figure" | "form" | "grid" | "gridcell" | "group" | "heading" | "img" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem" | (string & {});

	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// Lestin-specific Attributes
		defaultChecked?: boolean | "defaultChecked" | undefined;
		defaultValue?: string | number | ReadonlyArray<string> | undefined;
		suppressContentEditableWarning?: boolean | "suppressContentEditableWarning" | undefined;
		suppressHydrationWarning?: boolean | "suppressHydrationWarning" | undefined;

		// Standard HTML Attributes
		accessKey?: string | undefined;
		class?: string | undefined;
		className?: string | undefined;
		contentEditable?: Booleanish | "inherit" | undefined;
		contextMenu?: string | undefined;
		dir?: string | undefined;
		draggable?: Booleanish | undefined;
		hidden?: boolean | "hidden" | undefined;
		id?: string | undefined;
		lang?: string | undefined;
		placeholder?: string | undefined;
		slot?: string | undefined;
		spellCheck?: Booleanish | undefined;
		style?: CSSProperties | undefined;
		tabIndex?: number | undefined;
		title?: string | undefined;
		translate?: "yes" | "no" | undefined;

		// Unknown
		radioGroup?: string | undefined; // <command>, <menuitem>

		// WAI-ARIA
		role?: AriaRole | undefined;

		// RDFa Attributes
		about?: string | undefined;
		datatype?: string | undefined;
		inlist?: any;
		prefix?: string | undefined;
		property?: string | undefined;
		resource?: string | undefined;
		typeof?: string | undefined;
		vocab?: string | undefined;

		// Non-standard Attributes
		autoCapitalize?: string | undefined;
		autoCorrect?: string | undefined;
		autoSave?: string | undefined;
		color?: string | undefined;
		itemProp?: string | undefined;
		itemScope?: boolean | "itemScope" | undefined;
		itemType?: string | undefined;
		itemID?: string | undefined;
		itemRef?: string | undefined;
		results?: number | undefined;
		security?: string | undefined;
		unselectable?: "on" | "off" | undefined;

		// Living Standard
		/**
		 * Hints at the type of data that might be entered by the user while editing the element or its contents
		 * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
		 */
		inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;
		/**
		 * Specify that a standard HTML element should behave like a defined custom built-in element
		 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
		 */
		is?: string | undefined;
	}

	interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
		// Standard HTML Attributes
		accept?: string | undefined;
		acceptCharset?: string | undefined;
		action?: string | undefined;
		allowFullScreen?: boolean | "allowFullScreen" | undefined;
		allowTransparency?: boolean | "allowTransparency" | undefined;
		alt?: string | undefined;
		as?: string | undefined;
		async?: boolean | "async" | undefined;
		autoComplete?: string | undefined;
		autoFocus?: boolean | "autoFocus" | undefined;
		autoPlay?: boolean | "autoPlay" | undefined;
		capture?: boolean | "user" | "environment" | undefined;
		cellPadding?: number | string | undefined;
		cellSpacing?: number | string | undefined;
		charSet?: string | undefined;
		challenge?: string | undefined;
		checked?: boolean | "checked" | undefined;
		cite?: string | undefined;
		classID?: string | undefined;
		cols?: number | undefined;
		colSpan?: number | undefined;
		content?: string | undefined;
		controls?: boolean | "controls" | undefined;
		coords?: string | undefined;
		crossOrigin?: string | undefined;
		data?: string | undefined;
		dateTime?: string | undefined;
		default?: boolean | "default" | undefined;
		defer?: boolean | "defer" | undefined;
		disabled?: boolean | "disabled" | undefined;
		download?: any;
		encType?: string | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | "formNoValidate" | undefined;
		formTarget?: string | undefined;
		frameBorder?: number | string | undefined;
		headers?: string | undefined;
		height?: number | string | undefined;
		high?: number | undefined;
		href?: string | undefined;
		hrefLang?: string | undefined;
		htmlFor?: string | undefined;
		httpEquiv?: string | undefined;
		integrity?: string | undefined;
		keyParams?: string | undefined;
		keyType?: string | undefined;
		kind?: string | undefined;
		label?: string | undefined;
		list?: string | undefined;
		loop?: boolean | "loop" | undefined;
		low?: number | undefined;
		manifest?: string | undefined;
		marginHeight?: number | undefined;
		marginWidth?: number | undefined;
		max?: number | string | undefined;
		maxLength?: number | undefined;
		media?: string | undefined;
		mediaGroup?: string | undefined;
		method?: string | undefined;
		min?: number | string | undefined;
		minLength?: number | undefined;
		multiple?: boolean | "multiple" | undefined;
		muted?: boolean | "muted" | undefined;
		name?: string | undefined;
		nonce?: string | undefined;
		noValidate?: boolean | "noValidate" | undefined;
		open?: boolean | "open" | undefined;
		optimum?: number | undefined;
		pattern?: string | undefined;
		placeholder?: string | undefined;
		playsInline?: boolean | "playsInline" | undefined;
		poster?: string | undefined;
		preload?: string | undefined;
		readOnly?: boolean | "readOnly" | undefined;
		rel?: string | undefined;
		required?: boolean | "required" | undefined;
		reversed?: boolean | "reversed" | undefined;
		rows?: number | undefined;
		rowSpan?: number | undefined;
		sandbox?: string | undefined;
		scope?: string | undefined;
		scoped?: boolean | "scoped" | undefined;
		scrolling?: string | undefined;
		seamless?: boolean | "seamless" | undefined;
		selected?: boolean | "selected" | undefined;
		shape?: string | undefined;
		size?: number | undefined;
		sizes?: string | undefined;
		span?: number | undefined;
		src?: string | undefined;
		srcDoc?: string | undefined;
		srcLang?: string | undefined;
		srcSet?: string | undefined;
		start?: number | undefined;
		step?: number | string | undefined;
		summary?: string | undefined;
		target?: string | undefined;
		type?: string | undefined;
		useMap?: string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		width?: number | string | undefined;
		wmode?: string | undefined;
		wrap?: string | undefined;
	}

	type HTMLAttributeReferrerPolicy = "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";

	type HTMLAttributeAnchorTarget = "_self" | "_blank" | "_parent" | "_top" | (string & {});

	interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
		download?: any;
		href?: string | undefined;
		hrefLang?: string | undefined;
		media?: string | undefined;
		ping?: string | undefined;
		rel?: string | undefined;
		target?: HTMLAttributeAnchorTarget | undefined;
		type?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
	}

	interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

	interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
		alt?: string | undefined;
		coords?: string | undefined;
		download?: any;
		href?: string | undefined;
		hrefLang?: string | undefined;
		media?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		rel?: string | undefined;
		shape?: string | undefined;
		target?: string | undefined;
	}

	interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
		href?: string | undefined;
		target?: string | undefined;
	}

	interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
	}

	interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
		autoFocus?: boolean | "autoFocus" | undefined;
		disabled?: boolean | "disabled" | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | "formNoValidate" | undefined;
		formTarget?: string | undefined;
		name?: string | undefined;
		type?: "submit" | "reset" | "button" | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		width?: number | string | undefined;
	}

	interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
		span?: number | undefined;
		width?: number | string | undefined;
	}

	interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
		span?: number | undefined;
	}

	interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
		open?: boolean | "open" | undefined;
		onToggle?: LestinEventHandler<T> | undefined;
	}

	interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
		dateTime?: string | undefined;
	}

	interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
		onCancel?: LestinEventHandler<T> | undefined;
		onClose?: LestinEventHandler<T> | undefined;
		open?: boolean | "open" | undefined;
	}

	interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		src?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;
	}

	interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | "disabled" | undefined;
		form?: string | undefined;
		name?: string | undefined;
	}

	interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
		acceptCharset?: string | undefined;
		action?: string | undefined;
		autoComplete?: string | undefined;
		encType?: string | undefined;
		method?: string | undefined;
		name?: string | undefined;
		noValidate?: boolean | "noValidate" | undefined;
		target?: string | undefined;
	}

	interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
		manifest?: string | undefined;
	}

	interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
		allow?: string | undefined;
		allowFullScreen?: boolean | "allowFullScreen" | undefined;
		allowTransparency?: boolean | "allowTransparency" | undefined;
		/** @deprecated */
		frameBorder?: number | string | undefined;
		height?: number | string | undefined;
		loading?: "eager" | "lazy" | undefined;
		/** @deprecated */
		marginHeight?: number | undefined;
		/** @deprecated */
		marginWidth?: number | undefined;
		name?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		sandbox?: string | undefined;
		/** @deprecated */
		scrolling?: string | undefined;
		seamless?: boolean | "seamless" | undefined;
		src?: string | undefined;
		srcDoc?: string | undefined;
		width?: number | string | undefined;
	}

	interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
		alt?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		decoding?: "async" | "auto" | "sync" | undefined;
		height?: number | string | undefined;
		loading?: "eager" | "lazy" | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		sizes?: string | undefined;
		src?: string | undefined;
		srcSet?: string | undefined;
		useMap?: string | undefined;
		width?: number | string | undefined;
	}

	interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
		dateTime?: string | undefined;
	}

	type HTMLInputTypeAttribute = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week" | (string & {});

	interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
		accept?: string | undefined;
		alt?: string | undefined;
		autoComplete?: string | undefined;
		autoFocus?: boolean | "autoFocus" | undefined;
		capture?: boolean | "user" | "environment" | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
		checked?: boolean | "checked" | undefined;
		crossOrigin?: string | undefined;
		disabled?: boolean | "disabled" | undefined;
		enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | "formNoValidate" | undefined;
		formTarget?: string | undefined;
		height?: number | string | undefined;
		list?: string | undefined;
		max?: number | string | undefined;
		maxLength?: number | undefined;
		min?: number | string | undefined;
		minLength?: number | undefined;
		multiple?: boolean | "multiple" | undefined;
		name?: string | undefined;
		pattern?: string | undefined;
		placeholder?: string | undefined;
		readOnly?: boolean | "readOnly" | undefined;
		required?: boolean | "required" | undefined;
		size?: number | undefined;
		src?: string | undefined;
		step?: number | string | undefined;
		type?: HTMLInputTypeAttribute | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		width?: number | string | undefined;

		onChange?: ChangeEventHandler<T> | undefined;
	}

	interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
		autoFocus?: boolean | "autoFocus" | undefined;
		challenge?: string | undefined;
		disabled?: boolean | "disabled" | undefined;
		form?: string | undefined;
		keyType?: string | undefined;
		keyParams?: string | undefined;
		name?: string | undefined;
	}

	interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		htmlFor?: string | undefined;
	}

	interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
		as?: string | undefined;
		crossOrigin?: string | undefined;
		href?: string | undefined;
		hrefLang?: string | undefined;
		integrity?: string | undefined;
		media?: string | undefined;
		imageSrcSet?: string | undefined;
		imageSizes?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		rel?: string | undefined;
		sizes?: string | undefined;
		type?: string | undefined;
		charSet?: string | undefined;
	}

	interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
	}

	interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
		type?: string | undefined;
	}

	interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
		autoPlay?: boolean | "autoPlay" | undefined;
		controls?: boolean | "controls" | undefined;
		controlsList?: string | undefined;
		crossOrigin?: string | undefined;
		loop?: boolean | "loop" | undefined;
		mediaGroup?: string | undefined;
		muted?: boolean | "muted" | undefined;
		playsInline?: boolean | "playsInline" | undefined;
		preload?: string | undefined;
		src?: string | undefined;
	}

	interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
		charSet?: string | undefined;
		content?: string | undefined;
		httpEquiv?: string | undefined;
		name?: string | undefined;
		media?: string | undefined;
	}

	interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		high?: number | undefined;
		low?: number | undefined;
		max?: number | string | undefined;
		min?: number | string | undefined;
		optimum?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
	}

	interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
		classID?: string | undefined;
		data?: string | undefined;
		form?: string | undefined;
		height?: number | string | undefined;
		name?: string | undefined;
		type?: string | undefined;
		useMap?: string | undefined;
		width?: number | string | undefined;
		wmode?: string | undefined;
	}

	interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
		reversed?: boolean | "reversed" | undefined;
		start?: number | undefined;
		type?: "1" | "a" | "A" | "i" | "I" | undefined;
	}

	interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | "disabled" | undefined;
		label?: string | undefined;
	}

	interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | "disabled" | undefined;
		label?: string | undefined;
		selected?: boolean | "selected" | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		htmlFor?: string | undefined;
		name?: string | undefined;
	}

	interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
		max?: number | string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
	}

	interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
		async?: boolean | "async" | undefined;
		/** @deprecated */
		charSet?: string | undefined;
		crossOrigin?: string | undefined;
		defer?: boolean | "defer" | undefined;
		integrity?: string | undefined;
		noModule?: boolean | "noModule" | undefined;
		nonce?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		src?: string | undefined;
		type?: string | undefined;
	}

	interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
		autoComplete?: string | undefined;
		autoFocus?: boolean | "autoFocus" | undefined;
		disabled?: boolean | "disabled" | undefined;
		form?: string | undefined;
		multiple?: boolean | "multiple" | undefined;
		name?: string | undefined;
		required?: boolean | "required" | undefined;
		size?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		onChange?: ChangeEventHandler<T> | undefined;
	}

	interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		media?: string | undefined;
		sizes?: string | undefined;
		src?: string | undefined;
		srcSet?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;
	}

	interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
		media?: string | undefined;
		nonce?: string | undefined;
		scoped?: boolean | "scoped" | undefined;
		type?: string | undefined;
	}

	interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
		align?: "left" | "center" | "right" | undefined;
		bgcolor?: string | undefined;
		border?: number | undefined;
		cellPadding?: number | string | undefined;
		cellSpacing?: number | string | undefined;
		frame?: boolean | "frame" | undefined;
		rules?: "none" | "groups" | "rows" | "columns" | "all" | undefined;
		summary?: string | undefined;
		width?: number | string | undefined;
	}

	interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
		autoComplete?: string | undefined;
		autoFocus?: boolean | "autoFocus" | undefined;
		cols?: number | undefined;
		dirName?: string | undefined;
		disabled?: boolean | "disabled" | undefined;
		form?: string | undefined;
		maxLength?: number | undefined;
		minLength?: number | undefined;
		name?: string | undefined;
		placeholder?: string | undefined;
		readOnly?: boolean | "readOnly" | undefined;
		required?: boolean | "required" | undefined;
		rows?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		wrap?: string | undefined;

		onChange?: ChangeEventHandler<T> | undefined;
	}

	interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
		align?: "left" | "center" | "right" | "justify" | "char" | undefined;
		colSpan?: number | undefined;
		headers?: string | undefined;
		rowSpan?: number | undefined;
		scope?: string | undefined;
		abbr?: string | undefined;
		height?: number | string | undefined;
		width?: number | string | undefined;
		valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
	}

	interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
		align?: "left" | "center" | "right" | "justify" | "char" | undefined;
		colSpan?: number | undefined;
		headers?: string | undefined;
		rowSpan?: number | undefined;
		scope?: string | undefined;
		abbr?: string | undefined;
	}

	interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
		dateTime?: string | undefined;
	}

	interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
		default?: boolean | "default" | undefined;
		kind?: string | undefined;
		label?: string | undefined;
		src?: string | undefined;
		srcLang?: string | undefined;
	}

	interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
		height?: number | string | undefined;
		playsInline?: boolean | "playsInline" | undefined;
		poster?: string | undefined;
		width?: number | string | undefined;
		disablePictureInPicture?: boolean | "disablePictureInPicture" | undefined;
		disableRemotePlayback?: boolean | "disableRemotePlayback" | undefined;
	}

	// this list is "complete" in that it contains every SVG attribute
	// that Lestin supports, but the types can be improved.
	// Full list here: https://facebook.github.io/react/docs/dom-elements.html
	//
	// The three broad type categories are (in order of restrictiveness):
	//   - "number | string"
	//   - "string"
	//   - union of string literals
	interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// Attributes which also defined in HTMLAttributes
		// See comment in SVGDOMPropertyConfig.js
		class?: string | undefined;
		className?: string | undefined;
		color?: string | undefined;
		height?: number | string | undefined;
		id?: string | undefined;
		lang?: string | undefined;
		max?: number | string | undefined;
		media?: string | undefined;
		method?: string | undefined;
		min?: number | string | undefined;
		name?: string | undefined;
		style?: CSSProperties | undefined;
		target?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;

		// Other HTML properties supported by SVG elements in browsers
		role?: AriaRole | undefined;
		tabIndex?: number | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;

		// SVG Specific attributes
		accentHeight?: number | string | undefined;
		accumulate?: "none" | "sum" | undefined;
		additive?: "replace" | "sum" | undefined;
		alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
		allowReorder?: "no" | "yes" | undefined;
		alphabetic?: number | string | undefined;
		amplitude?: number | string | undefined;
		arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
		ascent?: number | string | undefined;
		attributeName?: string | undefined;
		attributeType?: string | undefined;
		autoReverse?: Booleanish | undefined;
		azimuth?: number | string | undefined;
		baseFrequency?: number | string | undefined;
		baselineShift?: number | string | undefined;
		baseProfile?: number | string | undefined;
		bbox?: number | string | undefined;
		begin?: number | string | undefined;
		bias?: number | string | undefined;
		by?: number | string | undefined;
		calcMode?: number | string | undefined;
		capHeight?: number | string | undefined;
		clip?: number | string | undefined;
		clipPath?: string | undefined;
		clipPathUnits?: number | string | undefined;
		clipRule?: number | string | undefined;
		colorInterpolation?: number | string | undefined;
		colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
		colorProfile?: number | string | undefined;
		colorRendering?: number | string | undefined;
		contentScriptType?: number | string | undefined;
		contentStyleType?: number | string | undefined;
		cursor?: number | string | undefined;
		cx?: number | string | undefined;
		cy?: number | string | undefined;
		d?: string | undefined;
		decelerate?: number | string | undefined;
		descent?: number | string | undefined;
		diffuseConstant?: number | string | undefined;
		direction?: number | string | undefined;
		display?: number | string | undefined;
		divisor?: number | string | undefined;
		dominantBaseline?: number | string | undefined;
		dur?: number | string | undefined;
		dx?: number | string | undefined;
		dy?: number | string | undefined;
		edgeMode?: number | string | undefined;
		elevation?: number | string | undefined;
		enableBackground?: number | string | undefined;
		end?: number | string | undefined;
		exponent?: number | string | undefined;
		externalResourcesRequired?: Booleanish | undefined;
		fill?: string | undefined;
		fillOpacity?: number | string | undefined;
		fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
		filter?: string | undefined;
		filterRes?: number | string | undefined;
		filterUnits?: number | string | undefined;
		floodColor?: number | string | undefined;
		floodOpacity?: number | string | undefined;
		focusable?: Booleanish | "auto" | undefined;
		fontFamily?: string | undefined;
		fontSize?: number | string | undefined;
		fontSizeAdjust?: number | string | undefined;
		fontStretch?: number | string | undefined;
		fontStyle?: number | string | undefined;
		fontVariant?: number | string | undefined;
		fontWeight?: number | string | undefined;
		format?: number | string | undefined;
		fr?: number | string | undefined;
		from?: number | string | undefined;
		fx?: number | string | undefined;
		fy?: number | string | undefined;
		g1?: number | string | undefined;
		g2?: number | string | undefined;
		glyphName?: number | string | undefined;
		glyphOrientationHorizontal?: number | string | undefined;
		glyphOrientationVertical?: number | string | undefined;
		glyphRef?: number | string | undefined;
		gradientTransform?: string | undefined;
		gradientUnits?: string | undefined;
		hanging?: number | string | undefined;
		horizAdvX?: number | string | undefined;
		horizOriginX?: number | string | undefined;
		href?: string | undefined;
		ideographic?: number | string | undefined;
		imageRendering?: number | string | undefined;
		in2?: number | string | undefined;
		in?: string | undefined;
		intercept?: number | string | undefined;
		k1?: number | string | undefined;
		k2?: number | string | undefined;
		k3?: number | string | undefined;
		k4?: number | string | undefined;
		k?: number | string | undefined;
		kernelMatrix?: number | string | undefined;
		kernelUnitLength?: number | string | undefined;
		kerning?: number | string | undefined;
		keyPoints?: number | string | undefined;
		keySplines?: number | string | undefined;
		keyTimes?: number | string | undefined;
		lengthAdjust?: number | string | undefined;
		letterSpacing?: number | string | undefined;
		lightingColor?: number | string | undefined;
		limitingConeAngle?: number | string | undefined;
		local?: number | string | undefined;
		markerEnd?: string | undefined;
		markerHeight?: number | string | undefined;
		markerMid?: string | undefined;
		markerStart?: string | undefined;
		markerUnits?: number | string | undefined;
		markerWidth?: number | string | undefined;
		mask?: string | undefined;
		maskContentUnits?: number | string | undefined;
		maskUnits?: number | string | undefined;
		mathematical?: number | string | undefined;
		mode?: number | string | undefined;
		numOctaves?: number | string | undefined;
		offset?: number | string | undefined;
		opacity?: number | string | undefined;
		operator?: number | string | undefined;
		order?: number | string | undefined;
		orient?: number | string | undefined;
		orientation?: number | string | undefined;
		origin?: number | string | undefined;
		overflow?: number | string | undefined;
		overlinePosition?: number | string | undefined;
		overlineThickness?: number | string | undefined;
		paintOrder?: number | string | undefined;
		panose1?: number | string | undefined;
		path?: string | undefined;
		pathLength?: number | string | undefined;
		patternContentUnits?: string | undefined;
		patternTransform?: number | string | undefined;
		patternUnits?: string | undefined;
		pointerEvents?: number | string | undefined;
		points?: string | undefined;
		pointsAtX?: number | string | undefined;
		pointsAtY?: number | string | undefined;
		pointsAtZ?: number | string | undefined;
		preserveAlpha?: Booleanish | undefined;
		preserveAspectRatio?: string | undefined;
		primitiveUnits?: number | string | undefined;
		r?: number | string | undefined;
		radius?: number | string | undefined;
		refX?: number | string | undefined;
		refY?: number | string | undefined;
		renderingIntent?: number | string | undefined;
		repeatCount?: number | string | undefined;
		repeatDur?: number | string | undefined;
		requiredExtensions?: number | string | undefined;
		requiredFeatures?: number | string | undefined;
		restart?: number | string | undefined;
		result?: string | undefined;
		rotate?: number | string | undefined;
		rx?: number | string | undefined;
		ry?: number | string | undefined;
		scale?: number | string | undefined;
		seed?: number | string | undefined;
		shapeRendering?: number | string | undefined;
		slope?: number | string | undefined;
		spacing?: number | string | undefined;
		specularConstant?: number | string | undefined;
		specularExponent?: number | string | undefined;
		speed?: number | string | undefined;
		spreadMethod?: string | undefined;
		startOffset?: number | string | undefined;
		stdDeviation?: number | string | undefined;
		stemh?: number | string | undefined;
		stemv?: number | string | undefined;
		stitchTiles?: number | string | undefined;
		stopColor?: string | undefined;
		stopOpacity?: number | string | undefined;
		strikethroughPosition?: number | string | undefined;
		strikethroughThickness?: number | string | undefined;
		string?: number | string | undefined;
		stroke?: string | undefined;
		strokeDasharray?: string | number | undefined;
		strokeDashoffset?: string | number | undefined;
		strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
		strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
		strokeMiterlimit?: number | string | undefined;
		strokeOpacity?: number | string | undefined;
		strokeWidth?: number | string | undefined;
		surfaceScale?: number | string | undefined;
		systemLanguage?: number | string | undefined;
		tableValues?: number | string | undefined;
		targetX?: number | string | undefined;
		targetY?: number | string | undefined;
		textAnchor?: string | undefined;
		textDecoration?: number | string | undefined;
		textLength?: number | string | undefined;
		textRendering?: number | string | undefined;
		to?: number | string | undefined;
		transform?: string | undefined;
		u1?: number | string | undefined;
		u2?: number | string | undefined;
		underlinePosition?: number | string | undefined;
		underlineThickness?: number | string | undefined;
		unicode?: number | string | undefined;
		unicodeBidi?: number | string | undefined;
		unicodeRange?: number | string | undefined;
		unitsPerEm?: number | string | undefined;
		vAlphabetic?: number | string | undefined;
		values?: string | undefined;
		vectorEffect?: number | string | undefined;
		version?: string | undefined;
		vertAdvY?: number | string | undefined;
		vertOriginX?: number | string | undefined;
		vertOriginY?: number | string | undefined;
		vHanging?: number | string | undefined;
		vIdeographic?: number | string | undefined;
		viewBox?: string | undefined;
		viewTarget?: number | string | undefined;
		visibility?: number | string | undefined;
		vMathematical?: number | string | undefined;
		widths?: number | string | undefined;
		wordSpacing?: number | string | undefined;
		writingMode?: number | string | undefined;
		x1?: number | string | undefined;
		x2?: number | string | undefined;
		x?: number | string | undefined;
		xChannelSelector?: string | undefined;
		xHeight?: number | string | undefined;
		xlinkActuate?: string | undefined;
		xlinkArcrole?: string | undefined;
		xlinkHref?: string | undefined;
		xlinkRole?: string | undefined;
		xlinkShow?: string | undefined;
		xlinkTitle?: string | undefined;
		xlinkType?: string | undefined;
		xmlBase?: string | undefined;
		xmlLang?: string | undefined;
		xmlns?: string | undefined;
		xmlnsXlink?: string | undefined;
		xmlSpace?: string | undefined;
		y1?: number | string | undefined;
		y2?: number | string | undefined;
		y?: number | string | undefined;
		yChannelSelector?: string | undefined;
		z?: number | string | undefined;
		zoomAndPan?: string | undefined;
	}

	interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
		allowFullScreen?: boolean | "allowFullScreen" | undefined;
		allowpopups?: boolean | "allowpopups" | undefined;
		autoFocus?: boolean | "autoFocus" | undefined;
		autosize?: boolean | "autosize" | undefined;
		blinkfeatures?: string | undefined;
		disableblinkfeatures?: string | undefined;
		disableguestresize?: boolean | "disableguestresize" | undefined;
		disablewebsecurity?: boolean | "disablewebsecurity" | undefined;
		guestinstance?: string | undefined;
		httpreferrer?: string | undefined;
		nodeintegration?: boolean | "nodeintegration" | undefined;
		partition?: string | undefined;
		plugins?: boolean | "plugins" | undefined;
		preload?: string | undefined;
		src?: string | undefined;
		useragent?: string | undefined;
		webpreferences?: string | undefined;
	}

	//
	// Lestin.DOM
	// ----------------------------------------------------------------------

	interface LestinHTML {
		a: DetailedHTMLFactory<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
		abbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		address: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		area: DetailedHTMLFactory<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
		article: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		aside: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		audio: DetailedHTMLFactory<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
		b: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		base: DetailedHTMLFactory<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
		bdi: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		bdo: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		big: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		blockquote: DetailedHTMLFactory<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
		body: DetailedHTMLFactory<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
		br: DetailedHTMLFactory<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
		button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
		canvas: DetailedHTMLFactory<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
		caption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		cite: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		code: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		col: DetailedHTMLFactory<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
		colgroup: DetailedHTMLFactory<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
		data: DetailedHTMLFactory<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
		datalist: DetailedHTMLFactory<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
		dd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		del: DetailedHTMLFactory<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
		details: DetailedHTMLFactory<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
		dfn: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		dialog: DetailedHTMLFactory<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
		div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
		dl: DetailedHTMLFactory<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
		dt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		em: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		embed: DetailedHTMLFactory<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
		fieldset: DetailedHTMLFactory<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
		figcaption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		figure: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		footer: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		form: DetailedHTMLFactory<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
		h1: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h2: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h3: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h4: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h5: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h6: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		head: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLHeadElement>;
		header: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		hgroup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		hr: DetailedHTMLFactory<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
		html: DetailedHTMLFactory<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
		i: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		iframe: DetailedHTMLFactory<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
		img: DetailedHTMLFactory<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
		input: DetailedHTMLFactory<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
		ins: DetailedHTMLFactory<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
		kbd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		keygen: DetailedHTMLFactory<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
		label: DetailedHTMLFactory<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
		legend: DetailedHTMLFactory<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
		li: DetailedHTMLFactory<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
		link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
		main: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		map: DetailedHTMLFactory<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
		mark: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		menu: DetailedHTMLFactory<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
		menuitem: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		meta: DetailedHTMLFactory<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
		meter: DetailedHTMLFactory<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
		nav: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		noscript: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		object: DetailedHTMLFactory<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
		ol: DetailedHTMLFactory<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
		optgroup: DetailedHTMLFactory<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
		option: DetailedHTMLFactory<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
		output: DetailedHTMLFactory<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
		p: DetailedHTMLFactory<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
		param: DetailedHTMLFactory<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
		picture: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		pre: DetailedHTMLFactory<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
		progress: DetailedHTMLFactory<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
		q: DetailedHTMLFactory<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
		rp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		rt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		ruby: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		s: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		samp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		slot: DetailedHTMLFactory<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
		script: DetailedHTMLFactory<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
		section: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		select: DetailedHTMLFactory<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
		small: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		source: DetailedHTMLFactory<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
		span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
		strong: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		style: DetailedHTMLFactory<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
		sub: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		summary: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		sup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		table: DetailedHTMLFactory<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
		template: DetailedHTMLFactory<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
		tbody: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		td: DetailedHTMLFactory<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
		textarea: DetailedHTMLFactory<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
		tfoot: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		th: DetailedHTMLFactory<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
		thead: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		time: DetailedHTMLFactory<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
		title: DetailedHTMLFactory<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
		tr: DetailedHTMLFactory<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
		track: DetailedHTMLFactory<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
		u: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		ul: DetailedHTMLFactory<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
		var: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		video: DetailedHTMLFactory<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
		wbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		webview: DetailedHTMLFactory<WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;
	}

	interface LestinSVG {
		animate: SVGFactory;
		circle: SVGFactory;
		clipPath: SVGFactory;
		defs: SVGFactory;
		desc: SVGFactory;
		ellipse: SVGFactory;
		feBlend: SVGFactory;
		feColorMatrix: SVGFactory;
		feComponentTransfer: SVGFactory;
		feComposite: SVGFactory;
		feConvolveMatrix: SVGFactory;
		feDiffuseLighting: SVGFactory;
		feDisplacementMap: SVGFactory;
		feDistantLight: SVGFactory;
		feDropShadow: SVGFactory;
		feFlood: SVGFactory;
		feFuncA: SVGFactory;
		feFuncB: SVGFactory;
		feFuncG: SVGFactory;
		feFuncR: SVGFactory;
		feGaussianBlur: SVGFactory;
		feImage: SVGFactory;
		feMerge: SVGFactory;
		feMergeNode: SVGFactory;
		feMorphology: SVGFactory;
		feOffset: SVGFactory;
		fePointLight: SVGFactory;
		feSpecularLighting: SVGFactory;
		feSpotLight: SVGFactory;
		feTile: SVGFactory;
		feTurbulence: SVGFactory;
		filter: SVGFactory;
		foreignObject: SVGFactory;
		g: SVGFactory;
		image: SVGFactory;
		line: SVGFactory;
		linearGradient: SVGFactory;
		marker: SVGFactory;
		mask: SVGFactory;
		metadata: SVGFactory;
		path: SVGFactory;
		pattern: SVGFactory;
		polygon: SVGFactory;
		polyline: SVGFactory;
		radialGradient: SVGFactory;
		rect: SVGFactory;
		stop: SVGFactory;
		svg: SVGFactory;
		switch: SVGFactory;
		symbol: SVGFactory;
		text: SVGFactory;
		textPath: SVGFactory;
		tspan: SVGFactory;
		use: SVGFactory;
		view: SVGFactory;
	}

	interface LestinDOM extends LestinHTML, LestinSVG {}

	//
	// Lestin.PropTypes
	// ----------------------------------------------------------------------

	interface LestinPropTypes {
		any: typeof PropTypes.any;
		array: typeof PropTypes.array;
		bool: typeof PropTypes.bool;
		func: typeof PropTypes.func;
		number: typeof PropTypes.number;
		object: typeof PropTypes.object;
		string: typeof PropTypes.string;
		node: typeof PropTypes.node;
		element: typeof PropTypes.element;
		instanceOf: typeof PropTypes.instanceOf;
		oneOf: typeof PropTypes.oneOf;
		oneOfType: typeof PropTypes.oneOfType;
		arrayOf: typeof PropTypes.arrayOf;
		objectOf: typeof PropTypes.objectOf;
		shape: typeof PropTypes.shape;
		exact: typeof PropTypes.exact;
	}

	//
	// Lestin.Children
	// ----------------------------------------------------------------------

	/**
	 * @deprecated - Use `typeof Lestin.Children` instead.
	 */
	// Sync with type of `const Children`.
	interface LestinChildren {
		map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
		forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
		count(children: any): number;
		only<C>(children: C): C extends any[] ? never : C;
		toArray(children: LestinNode | LestinNode[]): Array<Exclude<LestinNode, boolean | null | undefined>>;
	}

	//
	// Browser Interfaces
	// https://github.com/nikeee/2048-typescript/blob/master/2048/js/touch.d.ts
	// ----------------------------------------------------------------------

	interface AbstractView {
		styleMedia: StyleMedia;
		document: Document;
	}

	interface Touch {
		identifier: number;
		target: EventTarget;
		screenX: number;
		screenY: number;
		clientX: number;
		clientY: number;
		pageX: number;
		pageY: number;
	}

	interface TouchList {
		[index: number]: Touch;
		length: number;
		item(index: number): Touch;
		identifiedTouch(identifier: number): Touch;
	}
}

declare global {
	namespace JSX {
		interface Element extends Lestin.LestinElement<any, any> {}
		interface ElementAttributesProperty {
			props: {};
		}
		interface ElementChildrenAttribute {
			children: {};
		}

		interface IntrinsicAttributes<T> extends Lestin.Attributes<T> {}

		interface IntrinsicElements {
			// HTML
			a: Lestin.DetailedHTMLProps<Lestin.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
			abbr: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			address: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			area: Lestin.DetailedHTMLProps<Lestin.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
			article: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			aside: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			audio: Lestin.DetailedHTMLProps<Lestin.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
			b: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			base: Lestin.DetailedHTMLProps<Lestin.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
			bdi: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			bdo: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			big: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			blockquote: Lestin.DetailedHTMLProps<Lestin.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
			body: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
			br: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
			button: Lestin.DetailedHTMLProps<Lestin.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
			canvas: Lestin.DetailedHTMLProps<Lestin.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
			caption: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			cite: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			code: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			col: Lestin.DetailedHTMLProps<Lestin.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
			colgroup: Lestin.DetailedHTMLProps<Lestin.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
			data: Lestin.DetailedHTMLProps<Lestin.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
			datalist: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
			dd: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			del: Lestin.DetailedHTMLProps<Lestin.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
			details: Lestin.DetailedHTMLProps<Lestin.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
			dfn: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			dialog: Lestin.DetailedHTMLProps<Lestin.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
			div: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
			dl: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
			dt: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			em: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			embed: Lestin.DetailedHTMLProps<Lestin.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
			fieldset: Lestin.DetailedHTMLProps<Lestin.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
			figcaption: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			figure: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			footer: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			form: Lestin.DetailedHTMLProps<Lestin.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
			h1: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			h2: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			h3: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			h4: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			h5: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			h6: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
			head: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
			header: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			hgroup: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			hr: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
			html: Lestin.DetailedHTMLProps<Lestin.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
			i: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			iframe: Lestin.DetailedHTMLProps<Lestin.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
			img: Lestin.DetailedHTMLProps<Lestin.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
			input: Lestin.DetailedHTMLProps<Lestin.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
			ins: Lestin.DetailedHTMLProps<Lestin.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
			kbd: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			keygen: Lestin.DetailedHTMLProps<Lestin.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
			label: Lestin.DetailedHTMLProps<Lestin.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
			legend: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
			li: Lestin.DetailedHTMLProps<Lestin.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
			link: Lestin.DetailedHTMLProps<Lestin.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
			main: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			map: Lestin.DetailedHTMLProps<Lestin.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
			mark: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			menu: Lestin.DetailedHTMLProps<Lestin.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
			menuitem: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			meta: Lestin.DetailedHTMLProps<Lestin.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
			meter: Lestin.DetailedHTMLProps<Lestin.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
			nav: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			noindex: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			noscript: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			object: Lestin.DetailedHTMLProps<Lestin.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
			ol: Lestin.DetailedHTMLProps<Lestin.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
			optgroup: Lestin.DetailedHTMLProps<Lestin.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
			option: Lestin.DetailedHTMLProps<Lestin.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
			output: Lestin.DetailedHTMLProps<Lestin.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
			p: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
			param: Lestin.DetailedHTMLProps<Lestin.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
			picture: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			pre: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
			progress: Lestin.DetailedHTMLProps<Lestin.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
			q: Lestin.DetailedHTMLProps<Lestin.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
			rp: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			rt: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			ruby: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			s: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			samp: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			slot: Lestin.DetailedHTMLProps<Lestin.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
			script: Lestin.DetailedHTMLProps<Lestin.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
			section: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			select: Lestin.DetailedHTMLProps<Lestin.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
			small: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			source: Lestin.DetailedHTMLProps<Lestin.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
			span: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
			strong: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			style: Lestin.DetailedHTMLProps<Lestin.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
			sub: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			summary: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			sup: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			table: Lestin.DetailedHTMLProps<Lestin.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
			template: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
			tbody: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
			td: Lestin.DetailedHTMLProps<Lestin.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
			textarea: Lestin.DetailedHTMLProps<Lestin.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
			tfoot: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
			th: Lestin.DetailedHTMLProps<Lestin.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
			thead: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
			time: Lestin.DetailedHTMLProps<Lestin.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
			title: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
			tr: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
			track: Lestin.DetailedHTMLProps<Lestin.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
			u: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			ul: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
			var: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			video: Lestin.DetailedHTMLProps<Lestin.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
			wbr: Lestin.DetailedHTMLProps<Lestin.HTMLAttributes<HTMLElement>, HTMLElement>;
			webview: Lestin.DetailedHTMLProps<Lestin.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

			// SVG
			svg: Lestin.SVGProps<SVGSVGElement>;

			animate: Lestin.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
			animateMotion: Lestin.SVGProps<SVGElement>;
			animateTransform: Lestin.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
			circle: Lestin.SVGProps<SVGCircleElement>;
			clipPath: Lestin.SVGProps<SVGClipPathElement>;
			defs: Lestin.SVGProps<SVGDefsElement>;
			desc: Lestin.SVGProps<SVGDescElement>;
			ellipse: Lestin.SVGProps<SVGEllipseElement>;
			feBlend: Lestin.SVGProps<SVGFEBlendElement>;
			feColorMatrix: Lestin.SVGProps<SVGFEColorMatrixElement>;
			feComponentTransfer: Lestin.SVGProps<SVGFEComponentTransferElement>;
			feComposite: Lestin.SVGProps<SVGFECompositeElement>;
			feConvolveMatrix: Lestin.SVGProps<SVGFEConvolveMatrixElement>;
			feDiffuseLighting: Lestin.SVGProps<SVGFEDiffuseLightingElement>;
			feDisplacementMap: Lestin.SVGProps<SVGFEDisplacementMapElement>;
			feDistantLight: Lestin.SVGProps<SVGFEDistantLightElement>;
			feDropShadow: Lestin.SVGProps<SVGFEDropShadowElement>;
			feFlood: Lestin.SVGProps<SVGFEFloodElement>;
			feFuncA: Lestin.SVGProps<SVGFEFuncAElement>;
			feFuncB: Lestin.SVGProps<SVGFEFuncBElement>;
			feFuncG: Lestin.SVGProps<SVGFEFuncGElement>;
			feFuncR: Lestin.SVGProps<SVGFEFuncRElement>;
			feGaussianBlur: Lestin.SVGProps<SVGFEGaussianBlurElement>;
			feImage: Lestin.SVGProps<SVGFEImageElement>;
			feMerge: Lestin.SVGProps<SVGFEMergeElement>;
			feMergeNode: Lestin.SVGProps<SVGFEMergeNodeElement>;
			feMorphology: Lestin.SVGProps<SVGFEMorphologyElement>;
			feOffset: Lestin.SVGProps<SVGFEOffsetElement>;
			fePointLight: Lestin.SVGProps<SVGFEPointLightElement>;
			feSpecularLighting: Lestin.SVGProps<SVGFESpecularLightingElement>;
			feSpotLight: Lestin.SVGProps<SVGFESpotLightElement>;
			feTile: Lestin.SVGProps<SVGFETileElement>;
			feTurbulence: Lestin.SVGProps<SVGFETurbulenceElement>;
			filter: Lestin.SVGProps<SVGFilterElement>;
			foreignObject: Lestin.SVGProps<SVGForeignObjectElement>;
			g: Lestin.SVGProps<SVGGElement>;
			image: Lestin.SVGProps<SVGImageElement>;
			line: Lestin.SVGProps<SVGLineElement>;
			linearGradient: Lestin.SVGProps<SVGLinearGradientElement>;
			marker: Lestin.SVGProps<SVGMarkerElement>;
			mask: Lestin.SVGProps<SVGMaskElement>;
			metadata: Lestin.SVGProps<SVGMetadataElement>;
			mpath: Lestin.SVGProps<SVGElement>;
			path: Lestin.SVGProps<SVGPathElement>;
			pattern: Lestin.SVGProps<SVGPatternElement>;
			polygon: Lestin.SVGProps<SVGPolygonElement>;
			polyline: Lestin.SVGProps<SVGPolylineElement>;
			radialGradient: Lestin.SVGProps<SVGRadialGradientElement>;
			rect: Lestin.SVGProps<SVGRectElement>;
			stop: Lestin.SVGProps<SVGStopElement>;
			switch: Lestin.SVGProps<SVGSwitchElement>;
			symbol: Lestin.SVGProps<SVGSymbolElement>;
			text: Lestin.SVGProps<SVGTextElement>;
			textPath: Lestin.SVGProps<SVGTextPathElement>;
			tspan: Lestin.SVGProps<SVGTSpanElement>;
			use: Lestin.SVGProps<SVGUseElement>;
			view: Lestin.SVGProps<SVGViewElement>;
		}
	}
}
