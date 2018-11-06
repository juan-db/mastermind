/**
 *	All the available colors for the pegs.
 */
var PegColorsEnum = Object.freeze(["red", "blue", "orange", "yellow", "pink", "cyan", "purple"])

/**
 *	The final sequence to guess.
 */
var winSequence = []

function generateRandomSequence(colors, sequenceLength) {
	let output = [];
	for (let i = 0; i < sequenceLength; ++i) {
		let randomColorIndex = Math.floor(Math.random() * PegColorsEnum.length);
		output.push(PegColorsEnum[randomColorIndex]);
	}
	return output;
}

function correctPositions(guess) {
	let correct = 0;
	for (let i = 0; i < guess.length && i < winSequence.length; ++i) {
		if (guess[i] === winSequence[i]) {
			++correct;
		}
	}
	return correct;
}

function correctColors(guess) {
	let winSequenceColors = winSequence.reduce(function(map, color) {
		if (map[color] === undefined) {
			map[color] = 1;
		} else {
			map[color] += 1;
		}
		return map;
	}, {});
	let guessColors = guess.reduce(function(map, color) {
		if (map[color] === undefined) {
			map[color] = 1;
		} else {
			map[color] += 1;
		}
		return map;
	}, {});
	let correct = 0;
	for (let key in winSequenceColors) {
		let timesInWinSeq = winSequenceColors[key];
		let timesInGuess = guessColors[key];
		if (timesInGuess !== undefined) {
			correct += Math.min(timesInWinSeq, timesInGuess);
		}
	}
	return correct - correctPositions(guess);
}

/* add columns and rows to the board */
let boardElement = document.getElementById("board");
for (let y = 1; y <= 9; ++y) {
	for (let x = 1; x <= 7; ++x) {
		let element = document.createElement("div");
		element.style.cssText = `grid-row: ${y}; grid-column: ${x}`;
		element.style.backgroundColor = (y % 2 === 0) ? ((x % 2 === 0) ? "gray" : "lightgray") : ((x % 2 === 0) ? "lightgray" : "gray");
		boardElement.appendChild(element);
	}
}

/* generate palette */
for (let x = 0; x < PegColorsEnum.length; ++x) {
	let element = document.createElement("div");
	element.style.cssText = `grid-row: 10; grid-column: ${x + 1}`;
	element.style.backgroundColor = PegColorsEnum[x];
	boardElement.appendChild(element);
}

winSequence = generateRandomSequence(PegColorsEnum, 5);

/* debug */
{
	let guess = winSequence.slice();
	guess[0] = winSequence[1];
	guess[1] = winSequence[0];
	console.log("winSequence .: " + winSequence);
	console.log("guess .......: " + guess);
	console.log(correctColors(guess));
	console.log(correctPositions(guess));
}