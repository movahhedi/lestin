function Clock() {
	const clock: HTMLSpanElement = <span></span>;

	const SetClockTime = () => {
		clock.textContent = new Date().toLocaleTimeString();
	};
	SetClockTime();
	setInterval(SetClockTime, 1000);

	return clock;
}

document.body.appendChild(<Clock />);
