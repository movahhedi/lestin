/*function Counter({ title, variable }) {
	const Increment = () => {
		variable++;
		button.textContent = title + variable;
	};

	const button = <button onClick={Increment}></button> as HTMLButtonElement;
	Increment();

	return button;
}

document.body.appendChild(
	<div>
		<Counter title="Counter One: " variable={-1} />
		<Counter title="Counter Two: " variable={-1} />
	</div>,
);


<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>*/

/*let CounterOne = 0,
	CounterTwo = 0;

document.body.appendChild(
	<div>
		<button onClick={function () { this.textContent = "Counter One: " + ++CounterOne; }}>Counter One {CounterOne}</button>
		<button onClick={function () { this.textContent = "Counter Two: " + ++CounterTwo; }}>Counter Two {CounterTwo}</button>
	</div>
);*/

let count = 0;

document.body.appendChild(
	<button
		onClick={function () {
			this.textContent = "count is " + ++count;
		}}
	>
		count is {count}
	</button>,
);
