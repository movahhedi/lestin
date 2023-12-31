function Counter({ title, variable }) {
	const Increment = () => {
		variable++;
		button.textContent = title + variable;
	};

	const button: HTMLSpanElement = <button onClick={Increment}></button>;
	Increment();

	return button;
}

document.body.appendChild(
	<div>
		<Counter title="Counter One: " variable={-1} />
		<Counter title="Counter Two: " variable={-1} />
	</div>,
);
