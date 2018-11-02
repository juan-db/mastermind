/**
 *	All the available colors for the pegs.
 */
var PegColorsEnum = Object.freeze(["red", "green", "blue", "orange", "yellow", "pink", "cyan", "purple"])

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

/* debug */
{
	winSequence = [PegColorsEnum[0], PegColorsEnum[1], PegColorsEnum[0], PegColorsEnum[1]];
	let guess = winSequence.slice();
	guess[0] = winSequence[1];
	guess[1] = winSequence[0];
	console.log("winSequence .: " + winSequence);
	console.log("guess .......: " + guess);
	console.log(correctColors(guess));
	console.log(correctPositions(guess));
}