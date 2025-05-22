const uploadInput = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const controls = ["brightness", "contrast", "grayscale"];

let image = new Image();
let originalSrc = "";
let rotation = 0;
let flipped = false;
let scale = 1;

uploadInput.addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (event) {
		originalSrc = event.target.result;
		image.src = originalSrc;
	};
	reader.readAsDataURL(file);
});

image.onload = () => {
	resetTransforms();
	drawImage();
};

controls.forEach((id) => {
	document.getElementById(id).addEventListener("input", drawImage);
});

function drawImage() {
	if (!originalSrc) return;

	const brightness = document.getElementById("brightness").value;
	const contrast = document.getElementById("contrast").value;
	const grayscale = document.getElementById("grayscale").value;

	canvas.width = image.width * scale;
	canvas.height = image.height * scale;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	// Transformations
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((rotation * Math.PI) / 180);
	ctx.scale(flipped ? -scale : scale, scale);
	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;

	ctx.drawImage(image, -image.width / 2, -image.height / 2);

	ctx.restore();
	ctx.filter = "none";
}

function rotateImage() {
	rotation = (rotation + 90) % 360;
	drawImage();
}

function flipImage() {
	flipped = !flipped;
	drawImage();
}

function resetFilters() {
	document.getElementById("brightness").value = 100;
	document.getElementById("contrast").value = 100;
	document.getElementById("grayscale").value = 0;
	resetTransforms();
	drawImage();
}

function zoomIn() {
	scale += 0.1;
	drawImage();
}

function zoomOut() {
	scale = Math.max(0.1, scale - 0.1);
	drawImage();
}

function resetTransforms() {
	rotation = 0;
	flipped = false;
	scale = 1;
}

function downloadImage() {
	const link = document.createElement("a");
	link.download = "edited-image.png";
	link.href = canvas.toDataURL("image/png");
	link.click();
}
