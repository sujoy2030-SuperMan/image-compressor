// ==========================================
// IMAGE COMPRESSOR (REVERSE LOGIC FIXED)
// ==========================================

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
        // UI-তে দেখাবে আপনি কত পারসেন্ট কম্প্রেস করতে চাচ্ছেন
        qualityLabel.textContent = "Compression Quality: " + slider.value + "%";
        
        // Debouncing: স্লাইডার টানার সময় যেন ব্রাউজার আটকে না যায়
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
        const sliderValue = parseInt(slider.value);

        // REVERSE LOGIC: 
        // স্লাইডার ১০০ হলে কোয়ালিটি হবে সর্বনিম্ন (0.05) -> বেশি কম্প্রেস
        // স্লাইডার ১০ হলে কোয়ালিটি হবে সর্বোচ্চ (1.0) -> কম কম্প্রেস
        const quality = Math.max(0.05, (110 - sliderValue) / 100); 

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
                
                // পুরোনো মেমোরি ক্লিয়ার করা
                if (afterImage.src.startsWith('blob:')) {
                    URL.revokeObjectURL(afterImage.src);
                }
                afterImage.src = URL.createObjectURL(blob);

                // সাইজ স্ট্যাটাস আপডেট
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
        // যদি কোয়ালিটি একদম ফুল থাকে, তবে সেভিং মাইনাস না দেখিয়ে ০% দেখাবে
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
