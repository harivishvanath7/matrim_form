document.getElementById("matrimonyForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let isValid = true;

    // Validation
    if (document.getElementById("name").value.trim() === "") {
        document.getElementById("nameError").style.display = "block";
        isValid = false;
    } else document.getElementById("nameError").style.display = "none";

    if (document.getElementById("phone").value.trim() === "") {
        document.getElementById("phoneError").style.display = "block";
        isValid = false;
    } else document.getElementById("phoneError").style.display = "none";

    if (document.getElementById("email").value.trim() === "") {
        document.getElementById("emailError").style.display = "block";
        isValid = false;
    } else document.getElementById("emailError").style.display = "none";

    if (!document.querySelector('input[name="role"]:checked')) {
        document.getElementById("roleError").style.display = "block";
        isValid = false;
    } else document.getElementById("roleError").style.display = "none";

    if (document.getElementById("image").files.length === 0) {
        document.getElementById("imageError").style.display = "block";
        isValid = false;
    } else document.getElementById("imageError").style.display = "none";

    if (!isValid) return;

    // Convert image
    const file = document.getElementById("image").files[0];
    const base64 = await toBase64(file);

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("role", document.querySelector('input[name="role"]:checked').value);
    formData.append("image", base64.replace(/^data:image\/\w+;base64,/, ""));

    // Hide form & show loading screen
document.getElementById("matrimonyForm").style.display = "none";
document.getElementById("loadingScreen").style.display = "block";

// Fake progress animation
let progress = 0;
let interval = setInterval(() => {
    if (progress < 95) {
        progress += 5;
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("progressText").innerText = progress + "%";
    }
}, 300);

    fetch("https://script.google.com/macros/s/AKfycbyKVFU9KV0IoK_k72yIrJTTqxRqH0U21YArN-G2embWyv3DY4d1FSJaEXynkZYcPUweYA/exec", {
        method: "POST",
        body: formData 
    })
    .then(res => res.text())
    .then(text => {
        clearInterval(interval);

        // Complete bar
        document.getElementById("progressBar").style.width = "100%";
        document.getElementById("progressText").innerText = "100%";

        setTimeout(() => {
            document.getElementById("loadingScreen").style.display = "none";
            document.getElementById("successScreen").style.display = "block";
        }, 500);

    })
    .catch(err => {
        alert("Error submitting form");
        console.error(err);
    });

});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}