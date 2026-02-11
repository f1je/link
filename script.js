document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault();
    document.getElementById("success").textContent =
        "Application Sent! LINK Staff will contact you.";
});
