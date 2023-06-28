// const Condition = (i) => (typeof i !== "number" && !i) || (i?.length);
const Condition = (i) => ((Boolean(i) && !(Array.isArray(i) && !i.length)) || i === 0);

const ShouldBeTrue = [0, 1, -1, "0", "-1", "a", " ", "\n", document.createElement("div"), {}, [1]];

const ShouldBeFalse = [null, undefined, false, "", NaN, []];

console.log("%cShould Be True", "font-size: 20px;");
ShouldBeTrue.forEach((i) => {
	if (Condition(i)) {
		console.log("%cCorrect", "color: green;", i);
	} else {
		console.log("%cWRONG", "color: red;", i);
	}
});

console.log("%cShould Be False", "font-size: 20px;");
ShouldBeFalse.forEach((i) => {
	if (Condition(i)) {
		console.log("%cWRONG", "color: red;", i);
	} else {
		console.log("%cCorrect", "color: green;", i);
	}
});
