import { h, render, Component } from "preact";

class Clock extends Component {
	timer = null;
	state = { time: Date.now() };

	// Called whenever our component is created
	componentDidMount() {
		// update time every second
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	// Called just before our component will be destroyed
	componentWillUnmount() {
		// stop when not renderable
		clearInterval(this.timer);
	}

	render() {
		let time = new Date(this.state.time).toLocaleTimeString();
		return <span>{time}</span>;
	}
}

render(<Clock />, document.getElementById("app"));
