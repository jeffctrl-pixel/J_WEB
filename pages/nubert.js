console.log("Nubert script loaded!");
console.log("<N>: Characters (for copy and paste): ▓▒░");
console.log("Test: ▓▓▓▓▓");
console.log("Test: ▒▒▒▒▒");
console.log("Test: ░░░░░");
const lines = document.querySelector("#lines");
const cornerWidget = document.querySelector("#corner-widget");
const cornerWidget2 = document.querySelector("#corner-widget2");
const cornerWidget3 = document.querySelector("#corner-widget3");
const overlays = new Set();
let lineNumber = 0;
const overlayChance = 0.08;
const overlayMargin = 24;
const centerMargin = 240;
const overlayTexts = ["NUBERT", "SHMUBERT", "CLUBERT", "FLUBERT", "GOOBERT", "LOOBERT"];
const sections = ["▓░░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░▒░░░░▓","▓▒░░░░░░░░░░░░░░░░░░░░░▓","▓░░░░░░░░░▒░░░░░░░░░░░░▓","▓░░░░░░░░░░▒░░░░░░░░░░░▓","▓░░░░░░░░░░░░░░░░░▒░░░░▓","▓░░░░░░░░░░░░░░░▒▒░░░░░▓","▓░░░░▒░░░░░░▒░░░░░░░░░░▓","▓░░░▒░░░░░░░▒░░░░░░▒░░░▓","▓░▒░░░░░░░░░░░░░░░░░░▒▒▓","▓░░░░░░▒░░░░░░░░░▒▒░░░░▓","▓░░▒░░░░░░░░░░░▒░░░░░░░▓","▓░▒░░▒░░░░░░░░░░░▒▒░░░░▓","▓░░░░░░▒░░▒░░░░░▒░░░▒░░▓"];
//,"▓░░░░░░░░░░░░░░░░░░░░░░▓"
const debug = false; //Has to be manually set through the code.
let wordsFound = 0;
let wordClicks = 0;

function addLines(amount) {
	for (let index = 0; index < amount; index += 1) {
		lineNumber += 1;
		const line = document.createElement("pre");
		line.textContent = sections[Math.floor(Math.random() * sections.length)];
		line.style.textAlign = "center";
		line.style.margin = "0";
		lines.append(line);

		if (Math.random() < overlayChance) {
			addRandomOverlay(line);
		}
	}
}

function addRandomOverlay(line) {
	const text = overlayTexts[Math.floor(Math.random() * overlayTexts.length)];
	const y = line.getBoundingClientRect().top + window.scrollY;
	const overlay = createOverlay(text, 0, y);
	positionRandomOverlay(overlay);
	wordsFound++;
	cornerWidget2.innerHTML = `Words found: ${wordsFound}.`;
}

function getHorizontalBands(overlay) {
	const maximumX = Math.max(
		overlayMargin,
		window.innerWidth - overlayMargin - overlay.offsetWidth
	);
	const centerStart = Math.max(
		overlayMargin,
		(window.innerWidth - centerMargin) / 2
	);
	const centerEnd = Math.min(
		maximumX,
		(window.innerWidth + centerMargin) / 2 - overlay.offsetWidth
	);

	return {
		left: [overlayMargin, Math.max(overlayMargin, centerStart - overlay.offsetWidth)],
		right: [Math.min(maximumX, centerEnd + overlay.offsetWidth), maximumX]
	};
}

function positionRandomOverlay(overlay) {
	const bands = getHorizontalBands(overlay);
	const band = Math.random() < 0.5 ? bands.left : bands.right;
	const x = band[0] + Math.random() * Math.max(0, band[1] - band[0]);
	overlay.style.left = `${x}px`;
}

function addLinesAtBottom() {
	const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

	if (nearBottom) {
		addLines(10);
	}
	cornerWidget.innerHTML = `Lines scrolled: ${lineNumber}.`;
}

function createOverlay(text, x, y) {
	const overlay = document.createElement("div");
	overlay.className = "overlay-text";
	overlay.textContent = text;
	overlay.dataset.clicks = "0";
	overlay.style.left = `${x}px`;
	overlay.style.top = `${y}px`;
	overlay.addEventListener("click", () => clickOverlay(overlay));
	document.body.append(overlay);
	overlays.add(overlay);
	return overlay;
}

function clickOverlay(overlay) {
	overlay.dataset.clicks = String(Number(overlay.dataset.clicks) + 1);
	if (debug) {
		console.log("Clicked overlay:", overlay);
	}
	wordClicks++;
	cornerWidget3.innerHTML = `Words collected: ${wordClicks}.`;
	destroyOverlay(overlay);
}

function destroyOverlay(overlay) {
	overlays.delete(overlay);
	overlay.remove();
}

function calibrateOverlays() {
	const y = window.scrollY + window.innerHeight / 2;
	const placements = [
		["left out", "left", "outer"],
		["left in", "left", "inner"],
		["right in", "right", "inner"],
		["right out", "right", "outer"]
	];

	for (const [text, side, edge] of placements) {
		const overlay = createOverlay(text, 0, y);
		const bands = getHorizontalBands(overlay);
		const band = bands[side];
		const x = edge === "outer" ? band[0] : band[1];
		overlay.style.left = `${x}px`;
	}
}

window.calibrateOverlays = calibrateOverlays;
if (debug) {
	calibrateOverlays();
}

addLines(40);
window.addEventListener("scroll", addLinesAtBottom);