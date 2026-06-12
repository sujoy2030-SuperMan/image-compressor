// =======================
// IMAGE COMPRESSOR
// =======================

if(document.getElementById("imageInput") &&
   document.getElementById("beforeImage") &&
   document.getElementById("afterImage")){

const imageInput = document.getElementById("imageInput");
const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");

const slider = document.querySelector("input[type=range]");
const qualityLabel = document.querySelector(".slider-area label");
const stats = document.querySelectorAll(".stat p");

let compressedBlob = null;
let currentImage = null;

slider?.addEventListener("input", () => {

    qualityLabel.textContent =
    "Compression Quality: " + slider.value + "%";

    if(currentImage){
        compressImage(currentImage);
    }

});

imageInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if(!file) return;

    currentImage = file;

    const reader = new FileReader();

    reader.onload = function(event){

        beforeImage.src = event.target.result;

        compressImage(file);

    };

    reader.readAsDataURL(file);

});

function compressImage(file){

    const quality = slider.value / 100;

    const img = new Image();

    img.onload = function(){

        const canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img,0,0);

        canvas.toBlob(blob => {

            compressedBlob = blob;

            afterImage.src =
            URL.createObjectURL(blob);

            stats[0].textContent =
            (file.size/1024).toFixed(2)+" KB";

            stats[1].textContent =
            (blob.size/1024).toFixed(2)+" KB";

            stats[2].textContent =
            (((file.size-blob.size)/file.size)*100)
            .toFixed(1)+"%";

        }, file.type || "image/jpeg", quality);

    };

    img.src = URL.createObjectURL(file);

}

document.querySelector(".download-btn")
?.addEventListener("click", () => {

    if(!compressedBlob) return;

    const a = document.createElement("a");

    a.href = URL.createObjectURL(compressedBlob);

    a.download = "compressed-image";

    a.click();

});

}

// =======================
// IMAGE RESIZER
// =======================

if(document.getElementById("resizeBtn")){

const imageInput =
document.getElementById("imageInput");

const previewImage =
document.getElementById("previewImage");

const widthInput =
document.getElementById("width");

const heightInput =
document.getElementById("height");

const resizeBtn =
document.getElementById("resizeBtn");

let currentFile = null;

imageInput.addEventListener("change", e => {

const file = e.target.files[0];

if(!file) return;

currentFile = file;

const reader = new FileReader();

reader.onload = function(event){

previewImage.src = event.target.result;

};

reader.readAsDataURL(file);

});

resizeBtn.addEventListener("click", () => {

if(!currentFile) return;

const width =
parseInt(widthInput.value);

const height =
parseInt(heightInput.value);

if(!width || !height) return;

const img = new Image();

img.onload = function(){

const canvas =
document.createElement("canvas");

canvas.width = width;
canvas.height = height;

canvas.getContext("2d")
.drawImage(img,0,0,width,height);

canvas.toBlob(blob => {

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"resized-image.png";

a.click();

});

};

img.src =
URL.createObjectURL(currentFile);

});

}

// =======================
// IMAGE CONVERTER
// =======================

if(document.getElementById("convertBtn")){

const imageInput =
document.getElementById("imageInput");

const previewImage =
document.getElementById("previewImage");

const formatSelect =
document.getElementById("formatSelect");

const convertBtn =
document.getElementById("convertBtn");

let currentFile = null;

imageInput.addEventListener("change", e => {

const file = e.target.files[0];

if(!file) return;

currentFile = file;

const reader = new FileReader();

reader.onload = function(event){

previewImage.src =
event.target.result;

};

reader.readAsDataURL(file);

});

convertBtn.addEventListener("click", () => {

if(!currentFile) return;

const img = new Image();

img.onload = function(){

const canvas =
document.createElement("canvas");

canvas.width = img.width;
canvas.height = img.height;

canvas.getContext("2d")
.drawImage(img,0,0);

canvas.toBlob(blob => {

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

let ext = "png";

if(formatSelect.value==="image/jpeg")
ext="jpg";

if(formatSelect.value==="image/webp")
ext="webp";

a.download =
"converted-image."+ext;

a.click();

}, formatSelect.value, 1);

};

img.src =
URL.createObjectURL(currentFile);

});

}
