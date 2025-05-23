function drawImage() {
	if (!originalSrc) return;

	const brightness = document.getElementById("brightness").value;
	const contrast = document.getElementById("contrast").value;
	const grayscale = document.getElementById("grayscale").value;
	const tintColor = document.getElementById("tintColor").value;
	const tintStrength = document.getElementById("tintStrength").value;

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

	// Apply color tint overlay
	if (tintStrength > 0) {
		ctx.fillStyle = hexToRgba(tintColor, tintStrength / 100);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	ctx.filter = "none";
}
