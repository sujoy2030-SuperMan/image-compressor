// =======================
// FIXED IMAGE COMPRESSOR
// =======================

if (document.getElementById("imageInput")) {
    const imageInput = document.getElementById("imageInput");
    const beforeImage = document.getElementById("beforeImage");
    const afterImage = document.getElementById("afterImage");
    const slider = document.querySelector("input[type=range]");
    const qualityLabel = document.querySelector(".slider-area label");
    const stats = document.querySelectorAll(".stat p");

    let currentImageFile = null;
    let compressedBlob = null;
    let timeout = null;

    // স্লাইডার পরিবর্তন করলে
    slider.addEventListener("input", () => {
        qualityLabel.textContent = "Compression Quality: " + slider.value + "%";
        
        // Debouncing: স্লাইডার থামালে কম্প্রেস শুরু হবে
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (currentImageFile) compressImage(currentImageFile);
        }, 100); 
    });

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            currentImageFile = file;
            beforeImage.src = URL.createObjectURL(file);
            compressImage(file);
        }
    });

    function compressImage(file) {
        // লজিক: স্লাইডার ১০০ মানে হাই কোয়ালিটি (কম কম্প্রেশন), ১০ মানে লো কোয়ালিটি (বেশি কম্প্রেশন)
        const quality = slider.value / 100; 

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return;
                
                compressedBlob = blob;
                
                // পুরোনো URL মুছে নতুনটি দেওয়া
                if (afterImage.src.startsWith('blob:')) {
                    URL.revokeObjectURL(afterImage.src);
                }
                afterImage.src = URL.createObjectURL(blob);

                // স্ট্যাটাস আপডেট
                updateStats(file.size, blob.size);
                
                URL.revokeObjectURL(img.src);
            }, "image/jpeg", quality);
        };
    }

    function updateStats(originalSize, compressedSize) {
        const originalKB = (originalSize / 1024).toFixed(2);
        const compressedKB = (compressedSize / 1024).toFixed(2);
        const savedPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

        stats[0].textContent = originalKB + " KB";
        stats[1].textContent = compressedKB + " KB";
        stats[2].textContent = (savedPercent < 0 ? 0 : savedPercent) + "%";
    }

    // ডাউনলোড বাটন
    document.querySelector(".download-btn")?.addEventListener("click", () => {
        if (!compressedBlob) return alert("Please upload an image first!");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(compressedBlob);
        link.download = "compressed_image.jpg";
        link.click();
    });
}
