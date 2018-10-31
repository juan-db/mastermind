var PegColorsEnum = Object.freeze(["red", "green", "blue", "orange", "yellow", "pink", "cyan", "purple"])

function generateRandomSequence(colors, sequenceLength) {
	let output = [];
	for (let i = 0; i < sequenceLength; ++i) {
		let randomColorIndex = Math.floor(Math.random() * PegColorsEnum.length);
		output.push(PegColorsEnum[randomColorIndex]);
	}
	return output;
}