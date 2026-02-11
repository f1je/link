
document.getElementById("tryoutForm").addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("successMsg").textContent = 
        "Application submitted! We will contact you on Roblox.";
});
