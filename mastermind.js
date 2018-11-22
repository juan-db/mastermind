// =============================================================================
// ===== VARIABLES =============================================================
// =============================================================================

/**
 *	All the available colors for the pegs.
 */
var PegColorsEnum = Object.freeze(["red", "blue", "orange", "yellow", "pink", "cyan", "purple"]);

/* game setting variables */
let sequenceLength = 4;
let allowedGuesses = 8;

/**
 * The player's previous guesses.
 * Array of arrays of peg colors.
 */
let guesses = [];

var currentGuess = [];

/**
 *	The final sequence to guess.
 */
var winSequence = []

var selectedColor;


// =============================================================================
// ===== GAME LOGIC ============================================================
// =============================================================================

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

function makeGuess() {
	let guess = currentGuess.slice();
	guesses.push(guess);
	currentGuess = [];
	let submitButton = document.querySelector("#submitButton");
	submitButton.disabled = true;

	let whitePinContainer = document.getElementById(`white-pin-container-guess-${guesses.length}`);
	let correctColorsCount = correctColors(guess);
	let correctColorsDisplay = createElement(document, "span", ["feedback-count-display"], "");
	let correctColorsCountElement = document.createTextNode(correctColorsCount);
	correctColorsDisplay.appendChild(correctColorsCountElement);
	whitePinContainer.appendChild(correctColorsDisplay);

	let blackPinContainer = document.getElementById(`black-pin-container-guess-${guesses.length}`);
	let correctPositionsCount = correctPositions(guess);
	let correctPositionsDisplay = createElement(document, "span", ["feedback-count-display"], "");
	let correctPositionsCountElement = document.createTextNode(correctPositionsCount);
	correctPositionsDisplay.appendChild(correctPositionsCountElement);
	blackPinContainer.appendChild(correctPositionsDisplay);
}


// =============================================================================
// ===== UTILITY FUNCTIONS =====================================================
// =============================================================================

/**
 * @param document	Document to use to create the element.
 * @param type		Type of element to create (e.g. div).
 * @param classes	Classes to add to the created element.
 * @param cssText	Additional css to apply to the element.
 *
 * @return The created element with all the options applied.
 */
function createElement(document, type, classes, cssText) {
	let element = document.createElement(type);
	for (currentClass of classes) {
		element.classList.add(currentClass);
	}
	if (cssText.trim().length > 0) {
		element.style.cssText += cssText;
	}
	return element;
}


// =============================================================================
// ===== PAGE SETUP ============================================================
// =============================================================================

/* populate game board */
function initializeBoard() {
	/* game board */
	let boardElement = document.getElementById("board");
	/* set board grid dimensions */
	boardElement.style.cssText += `grid-template-columns: repeat(${sequenceLength + 2}, 60px);`
								  + `grid-template-rows: repeat(${allowedGuesses + 3}, 60px);`;

	/* generate feedback pin containers */
	{
		let whitePinContainer = createElement(document, "div", ["feedback-pin-container"], "grid-row: 1; grid-column: 1;");
		let whitePin = createElement(document, "div", ["feedback-pin"], "background-color: white;");
		whitePinContainer.appendChild(whitePin);
		boardElement.appendChild(whitePinContainer);

		let blackPinContainer = createElement(document, "div", ["feedback-pin-container"], `grid-row: 1; grid-column: ${sequenceLength + 2};`);
		let blackPin = createElement(document, "div", ["feedback-pin"], "background-color: black;");
		blackPinContainer.appendChild(blackPin);
		boardElement.appendChild(blackPinContainer);
	}

	for (let y = 2; y <= allowedGuesses + 1; ++y) {
		let whitePinContainer = createElement(document, "div", ["feedback-pin-container"], `grid-row: ${y}; grid-column: 1;`);
		whitePinContainer.id = `white-pin-container-guess-${allowedGuesses - (y - 2)}`;
		boardElement.appendChild(whitePinContainer);

		let blackPinContainer = createElement(document, "div", ["feedback-pin-container"], `grid-row: ${y}; grid-column: ${sequenceLength + 2};`);
		blackPinContainer.id = `black-pin-container-guess-${allowedGuesses - (y - 2)}`;
		boardElement.appendChild(blackPinContainer);
	}

	/* generate guess pin containers */
	for (let y = 1; y <= 9; ++y) {
		for (let x = 2; x <= 5; ++x) {
			let element = createElement(document, "div", ["pin-container"], `grid-row: ${y}; grid-column: ${x};`);
			let pin = createElement(document, "div", ["pin"], "");
			pin.addEventListener("click", function() {
				if (guesses.length >= 9 - y) {
					this.style.backgroundColor = selectedColor;
					currentGuess[x - 2] = selectedColor;
					if (currentGuess.length === sequenceLength) {
						let submitButton = document.querySelector("#submitButton");
						submitButton.disabled = false;
					}
				}
			});
			element.appendChild(pin);
			boardElement.appendChild(element);
		}
	}

	/* generate palette */
	for (let x = 0; x < PegColorsEnum.length; ++x) {
		let element = createElement(document, "div", [], `grid-row: ${10 + (x / (sequenceLength + 2))}; grid-column: ${x % (sequenceLength + 2) + 1}; background-color: ${PegColorsEnum[x]};`);
		element.addEventListener("click", function() { selectedColor = element.style.backgroundColor; });
		boardElement.appendChild(element);
	}
}