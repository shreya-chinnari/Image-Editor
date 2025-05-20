const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let image = new Image();
let originalImage = null;

upload.addEventListener("change", () => {
	const file = upload.files[0];
	const reader = new FileReader();

	reader.onload = function (e) {
		image.onload = () => {
			canvas.width = image.width;
			canvas.height = image.height;
			ctx.drawImage(image, 0, 0);
			originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
		};
		image.src = e.target.result;
	};
	reader.readAsDataURL(file);
});

function applyFilters() {
	if (!originalImage) return;
	const brightness = document.getElementById("brightness").value;
	const contrast = document.getElementById("contrast").value;
	const grayscale = document.getElementById("grayscale").value;

	ctx.putImageData(originalImage, 0, 0);
	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
	ctx.drawImage(image, 0, 0);
}

document.getElementById("brightness").oninput =
	document.getElementById("contrast").oninput =
	document.getElementById("grayscale").oninput =
		applyFilters;

function downloadImage() {
	const link = document.createElement("a");
	link.download = "edited-image.png";
	link.href = canvas.toDataURL();
	link.click();
}
