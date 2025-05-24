let isDraggingText = false;
let textX = 50,
	textY = 50;
let addedText = "";
let textColor = "#000000";
let fontSize = 24;

// Add event listeners for text input
document.getElementById("addText").addEventListener("input", (e) => {
	addedText = e.target.value;
	drawImage();
});

document.getElementById("fontSize").addEventListener("input", (e) => {
	fontSize = parseInt(e.target.value, 10);
	drawImage();
});

document.getElementById("fontColor").addEventListener("input", (e) => {
	textColor = e.target.value;
	drawImage();
});

// Allow dragging the text
canvas.addEventListener("mousedown", function (e) {
	const mouseX = e.offsetX;
	const mouseY = e.offsetY;

	const textWidth = ctx.measureText(addedText).width;
	const textHeight = fontSize;

	if (
		mouseX >= textX &&
		mouseX <= textX + textWidth &&
		mouseY >= textY - textHeight &&
		mouseY <= textY
	) {
		isDraggingText = true;
	}
});

canvas.addEventListener("mouseup", () => {
	isDraggingText = false;
});

canvas.addEventListener("mousemove", function (e) {
	if (!isDraggingText) return;
	textX = e.offsetX;
	textY = e.offsetY;
	drawImage();
});

// Update drawImage function to include text rendering
function drawImage() {
	if (!originalSrc) return;

	const brightness = document.getElementById("brightness").value;
	const contrast = document.getElementById("contrast").value;
	const grayscale = document.getElementById("grayscale").value;
	const tintColor = document.getElementById("tintColor")?.value || "#000000";
	const tintStrength = document.getElementById("tintStrength")?.value || 0;

	canvas.width = image.width * scale;
	canvas.height = image.height * scale;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((rotation * Math.PI) / 180);
	ctx.scale(flipped ? -scale : scale, scale);

	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
	ctx.drawImage(image, -image.width / 2, -image.height / 2);
	ctx.restore();

	// Apply tint
	if (tintStrength > 0) {
		ctx.fillStyle = hexToRgba(tintColor, tintStrength / 100);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	// Draw text if exists
	if (addedText) {
		ctx.font = `${fontSize}px Arial`;
		ctx.fillStyle = textColor;
		ctx.fillText(addedText, textX, textY);
	}

	ctx.filter = "none";
}
