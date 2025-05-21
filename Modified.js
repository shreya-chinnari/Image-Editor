// DOM elements
const uploadInput = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const controls = ["brightness", "contrast", "grayscale"];

let image = new Image();
let originalSrc = "";

// Load Image
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

// Draw image on canvas when loaded
image.onload = () => {
	canvas.width = image.width;
	canvas.height = image.height;
	applyCanvasFilters();
};

// Listen for changes in all filter sliders
controls.forEach((id) => {
	document.getElementById(id).addEventListener("input", applyCanvasFilters);
});

// Apply filters and draw on canvas
function applyCanvasFilters() {
	if (!originalSrc) return;

	const brightness = document.getElementById("brightness").value;
	const contrast = document.getElementById("contrast").value;
	const grayscale = document.getElementById("grayscale").value;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
	ctx.drawImage(image, 0, 0);
	ctx.filter = "none"; // Reset filter to avoid stacking
}

// Download edited image
function downloadImage() {
	const link = document.createElement("a");
	link.download = "edited-image.png";
	link.href = canvas.toDataURL("image/png");
	link.click();
}
