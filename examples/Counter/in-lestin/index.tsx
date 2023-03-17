function Counter({ title, variable }) {
	const Increment = () => {
		variable++;
		button.textContent = title + variable;
	};

	const button: HTMLSpanElement = <button onClick={Increment}></button>;
	Increment();

	return button;
}

let CounterOne = -1,
	CounterTwo = -1;

document.body.appendChild(
	<div>
		<Counter title="Counter One: " variable={CounterOne} />
		<Counter title="Counter Two: " variable={CounterTwo} />
	</div>,
);
