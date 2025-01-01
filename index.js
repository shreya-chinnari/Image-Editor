// Variable Declarations
const fileInput = document.querySelector(".file-input"),
	filterOptions = document.querySelectorAll(".filter button"),
	filterName = document.querySelector(".filter-info .name"),
	filterValue = document.querySelector(".filter-info .value"),
	filterSlider = document.querySelector(".slider input"),
	rotateOptions = document.querySelectorAll(".rotate button"),
	previewImg = document.querySelector(".preview-img img"),
	chooseImgBtn = document.querySelector(".choose-img"),
	saveImgBtn = document.querySelector(".save-img"),
	resetFilterBtn = document.querySelector(".reset-filter");

let brightness = 100,
	saturation = 100,
	inversion = 0,
	grayscale = 0;

let rotate = 0,
	flipHorizontal = 1,
	flipVertical = 1;

const applyFilters = () => {
	previewImg.style.filter = `
      brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)
   `;
	previewImg.style.transform = `
      rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})
   `;
};

// loading the image selected by the user
const loadImage = () => {
	let file = fileInput.files[0];
	if (!file) return;
	previewImg.src = URL.createObjectURL(file);
	previewImg.addEventListener("load", () => {
		resetFilterBtn.click();
		document.querySelector(".container").classList.remove("disable");
	});
};

// modifications when new filter-button is clicked
filterOptions.forEach((Option) => {
	Option.addEventListener("click", () => {
		document.querySelector(".filter .active").classList.remove("active");
		Option.classList.add("active");
		filterName.innerText = Option.innerText;

		if (Option.id === "brightness") {
			filterSlider.max = "200";
			filterSlider.value = brightness;
			filterValue.innerText = `${brightness}%`;
		} else if (Option.id === "saturation") {
			filterSlider.max = "200";
			filterSlider.value = saturation;
			filterValue.innerText = `${saturation}%`;
		} else if (Option.id === "inversion") {
			filterSlider.max = "100";
			filterSlider.value = inversion;
			filterValue.innerText = `${inversion}%`;
		} else {
			filterSlider.max = "100";
			filterSlider.value = grayscale;
			filterValue.innerText = `${grayscale}%`;
		}
	});
});

// update filter value
const updateFilter = () => {
	filterValue.innerText = `${filterSlider.value}%`;
	const selectedFilter = document.querySelector(".filter .active");

	if (selectedFilter.id === "brightness") {
		brightness = filterSlider.value;
	} else if (selectedFilter.id === "saturation") {
		saturation = filterSlider.value;
	} else if (selectedFilter.id === "inversion") {
		inversion = filterSlider.value;
	} else {
		grayscale = filterSlider.value;
	}
	applyFilters();
};

// rotate & flip options
rotateOptions.forEach((option) => {
	option.addEventListener("click", () => {
		if (option.id === "left") {
			rotate -= 90;
		} else if (option.id === "right") {
			rotate += 90;
		} else if (option.id === "horizontal") {
			flipHorizontal = flipHorizontal === 1 ? -1 : 1;
		} else if (option.id === "vertical") {
			flipVertical = flipVertical === 1 ? -1 : 1;
		}
		applyFilters();
	});
});

const resetFilter = () => {
	brightness = 100;
	saturation = 100;
	inversion = 0;
	grayscale = 0;

	rotate = 0;
	flipHorizontal = 1;
	flipVertical = 1;

	filterOptions[0].click(); // so the brightness option get selected by default

	applyFilters();
};

// creating canvas element to save images
const saveImage = () => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	// Calculate the new dimensions to accommodate rotation
	const angleInRadians = (rotate * Math.PI) / 180;
	const absCos = Math.abs(Math.cos(angleInRadians));
	const absSin = Math.abs(Math.sin(angleInRadians));
	const newWidth =
		previewImg.naturalWidth * absCos + previewImg.naturalHeight * absSin;
	const newHeight =
		previewImg.naturalWidth * absSin + previewImg.naturalHeight * absCos;

	canvas.width = newWidth;
	canvas.height = newHeight;

	ctx.filter = `
      brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)
   `;

	ctx.translate(newWidth / 2, newHeight / 2);

	if (rotate !== 0) {
		ctx.rotate(angleInRadians);
	}

	ctx.scale(flipHorizontal, flipVertical);

	ctx.drawImage(
		previewImg,
		-previewImg.naturalWidth / 2,
		-previewImg.naturalHeight / 2,
		previewImg.naturalWidth,
		previewImg.naturalHeight
	);

	const link = document.createElement("a");
	link.download = "image.jpg";
	link.href = canvas.toDataURL();
	link.click();
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
saveImgBtn.addEventListener("click", saveImage);
