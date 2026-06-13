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
    
    // মেমোরি লিক বন্ধ করার জন্য Object URL ট্র্যাক করার ভেরিয়েবল
    let beforeImageUrl = null;
    let afterImageUrl = null;

    // Upload from input
    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;
        handleImage(file);
    });

    // Drag & Drop UI feedback
    ["dragenter", "dragover"].forEach(eventName => {
        uploadBox.addEventListener(eventName, (e) => {
            e.preventDefault();
            uploadBox.style.background = "rgba(59,130,246,.15)";
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
        qualityLabel.textContent = "Compression Quality: " + slider.value + "%";
        if (currentImage) {
            compressImage(currentImage);
        }
    });

    // Common Image Handler
    function handleImage(file) {
        currentImage = file;

        // পুরোনো Object URL মেমোরি থেকে রিলিজ করা (FileReader এর বদলে Object URL ব্যবহার করা ভালো)
        if (beforeImageUrl) URL.revokeObjectURL(beforeImageUrl);
        
        beforeImageUrl = URL.createObjectURL(file);
        beforeImage.src = beforeImageUrl;

        compressImage(file);
    }

    // Compress Function
    function compressImage(file) {
        // Slider 100 = বেশি compression (কম কোয়ালিটি)
        // Slider 10 = কম compression (বেশি কোয়ালিটি)
        const compressionLevel = slider.value;
        
        // কোয়ালিটি লজিক (0.01 থেকে 1.0 এর মধ্যে রাখা হয়েছে যেন ক্র্যাশ না করে)
        const quality = Math.max(0.01, Math.min(1.0, (110 - compressionLevel) / 100));

        const img = new Image();
        const originalImgUrl = URL.createObjectURL(file);

        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return;
                
                compressedBlob = blob;

                // পুরোনো সংকুচিত ছবির URL মেমোরি থেকে ডিলিট করা
                if (afterImageUrl) URL.revokeObjectURL(afterImageUrl);

                afterImageUrl = URL.createObjectURL(blob);
                afterImage.src = afterImageUrl;

                // সাইজ হিসাব করা
                const originalKB = (file.size / 1024).toFixed(2);
                const compressedKB = (blob.size / 1024).toFixed(2);
                const saved = (((file.size - blob.size) / file.size) * 100).toFixed(1);

                // UI আপডেট (যদি স্ট্যাটস এলিমেন্টগুলো ঠিকঠাক থাকে)
                if (stats.length >= 3) {
                    stats[0].textContent = originalKB + " KB";
                    stats[1].textContent = compressedKB + " KB";
                    // মাইনাস সেভিং (যদি সাইজ বেড়ে যায়) হ্যান্ডেল করা
                    stats[2].textContent = (saved < 0 ? 0 : saved) + "%";
                }
                
                // সাময়িক তৈরি করা ইমেজ URL মেমোরি থেকে মুছে দেওয়া
                URL.revokeObjectURL(originalImgUrl);
            }, "image/jpeg", quality);
        };

        img.src = originalImgUrl;
    }

    // Download
    document.querySelector(".download-btn")?.addEventListener("click", () => {
        if (!compressedBlob) {
            alert("Upload image first");
            return;
        }

        const a = document.createElement("a");
        const downloadUrl = URL.createObjectURL(compressedBlob);
        
        a.href = downloadUrl;
        a.download = "compressed-image.jpg";
        a.click();

        // ডাউনলোডের পর এই সাময়িক URL টিও মুছে ফেলা ভালো
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    });
}
