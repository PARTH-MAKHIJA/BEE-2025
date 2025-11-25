// =============================
// CONFIG
// =============================
const API_BASE = "http://localhost:3000/api";

// Helper: clean UI
function show(el, msg) {
  document.getElementById(el).textContent =
    typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
}

// =============================
// REGISTER
// =============================
document.getElementById("regBtn").onclick = async () => {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  let role = document.getElementById("regRole").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !role || !password)
    return show("regResult", "❌ All fields required");

  role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  if (!["Student", "Warden", "Admin"].includes(role))
    return show("regResult", "❌ Role must be Student / Warden / Admin");

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, password })
    });

    const data = await res.json();
    console.log("Register Response:", data, res.status);
    if (!res.ok) return show("regResult", `❌ ${data.message || "Error"}`);
    show("regResult", `✅ Registered: ${data.data.name}`);

  } catch (err) {
    console.error(err);
    show("regResult", "❌ Network error");
  }
};

// =============================
// LOGIN
// =============================
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password)
    return show("loginResult", "❌ Email & Password required");

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Login Response:", data, res.status);
    if (!res.ok) return show("loginResult", `❌ ${data.message || "Error"}`);

    show("loginResult", `✅ Login successful: ${email}`);

    if (data.token) localStorage.setItem("token", data.token);

  } catch (err) {
    console.error(err);
    show("loginResult", "❌ Network error");
  }
};
document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // ADD ROOM
  // =============================
  document.getElementById("addRoomBtn").onclick = async () => {
    const name = document.getElementById("roomName").value.trim();
    const capacity = Number(document.getElementById("roomCapacity").value);

    if (!name || !capacity)
      return show("roomResult", "❌ All fields required");

    try {
      const token = localStorage.getItem("token");
      if (!token) return show("roomResult", "❌ Login first");

      const res = await fetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, capacity })
      });

      const data = await res.json();
      if (!res.ok) return show("roomResult", `❌ ${data.message || "Error"}`);

      show("roomResult", data);
    } catch (err) {
      show("roomResult", `❌ Network error: ${err.message}`);
    }
  };
});

// =============================
// WEBSOCKET
// =============================
(function initWS() {
  try {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      show("wsNotifications", "🟢 WebSocket Connected ✅\n");
      console.log("WS Connected");
    };

    ws.onmessage = (msg) => {
      const old = document.getElementById("wsNotifications").textContent;
      const line = `🔔 ${msg.data}\n`;
      show("wsNotifications", old + line);
      console.log("WS Message:", msg.data);
    };

    ws.onerror = (err) => {
      show("wsNotifications", "🔴 WebSocket Error");
      console.error("WS Error:", err);
    };
  } catch (err) {
    show("wsNotifications", "❌ WS FAILED: " + err.message);
    console.error("WS Exception:", err);
  }
})();
