```js
// =======================
// IMAGE COMPRESSOR
// =======================

if (
    document.getElementById("imageInput") &&
    document.getElementById("beforeImage") &&
    document.getElementById("afterImage")
) {

    const imageInput = document.getElementById("imageInput");
    const beforeImage = document.getElementById("beforeImage");
    const afterImage = document.getElementById("afterImage");

    const uploadBox = document.querySelector(".upload-box");
    const slider = document.querySelector("input[type=range]");
    const qualityLabel = document.querySelector(".slider-area label");
    const stats = document.querySelectorAll(".stat p");

    let compressedBlob = null;
    let currentImage = null;

    // Upload from input
    imageInput.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file || !file.type.startsWith("image/")) return;

        handleImage(file);

    });

    // Drag & Drop
    ["dragenter", "dragover"].forEach(eventName => {

        uploadBox.addEventListener(eventName, (e) => {

            e.preventDefault();

            uploadBox.style.background =
                "rgba(59,130,246,.15)";

        });

    });

    ["dragleave", "drop"].forEach(eventName => {

        uploadBox.addEventListener(eventName, (e) => {

            e.preventDefault();

            uploadBox.style.background = "";

        });

    });

    uploadBox.addEventListener("drop", (e) => {

        const file = e.dataTransfer.files[0];

        if (!file || !file.type.startsWith("image/")) return;

        handleImage(file);

    });

    // Quality Slider
    slider.addEventListener("input", () => {

        qualityLabel.textContent =
            "Compression Quality: " + slider.value + "%";

        if (currentImage) {
            compressImage(currentImage);
        }

    });

    // Common Image Handler
    function handleImage(file) {

        currentImage = file;

        const reader = new FileReader();

        reader.onload = function (event) {

            beforeImage.src = event.target.result;

            compressImage(file);

        };

        reader.readAsDataURL(file);

    }

    // Compress Function
    function compressImage(file){

    // Slider 100 = বেশি compression
    // Slider 10 = কম compression

    const compressionLevel = slider.value;

    const quality =
    Math.max(0.05, (110 - compressionLevel) / 100);

    const img = new Image();

    img.onload = function(){

        const canvas =
        document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx =
        canvas.getContext("2d");

        ctx.drawImage(img,0,0);

        canvas.toBlob(blob => {

            compressedBlob = blob;

            afterImage.src =
            URL.createObjectURL(blob);

            const originalKB =
            (file.size/1024).toFixed(2);

            const compressedKB =
            (blob.size/1024).toFixed(2);

            const saved =
            (((file.size-blob.size)/file.size)*100)
            .toFixed(1);

            stats[0].textContent =
            originalKB + " KB";

            stats[1].textContent =
            compressedKB + " KB";

            stats[2].textContent =
            saved + "%";

        },
        "image/jpeg",
        quality);

    };

    img.src =
    URL.createObjectURL(file);

}
    // Download
    document.querySelector(".download-btn")
        ?.addEventListener("click", () => {

            if (!compressedBlob) {

                alert("Upload image first");

                return;

            }

            const a =
                document.createElement("a");

            a.href =
                URL.createObjectURL(compressedBlob);

            a.download =
                "compressed-image.jpg";

            a.click();

        });

}
```
