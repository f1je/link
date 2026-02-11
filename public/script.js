document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    rank: document.getElementById("rank").value,
    age: document.getElementById("age").value,
    discordUser: document.getElementById("discordUser").value,
    discordId: document.getElementById("discordId").value,
  };

  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    document.getElementById("success").textContent =
      "Application submitted successfully.";
  } else {
    document.getElementById("success").textContent =
      result.error || "Error occurred.";
  }
});
