// Dummy user database (emails + SHA256 hashed passwords)
const users = [
  {
    email: "admin@nswdg",
    hash: "e7cf3ef4f17c3999a94f2c6f612e8a888e5e56eeedfc8c9855e7f3a1a7e690dd" // "trident1"
  },
  {
    email: "curtis@nswdg",
    hash: "0e3f97d99b4cb145ad6b3426ec3d39c871f76d0401ee1d061d76a4bfa46b971e" // "pilotsecure"
  }
];

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const hash = CryptoJS.SHA256(password).toString();
  const user = users.find(u => u.email === email && u.hash === hash);

  if (user) {
    localStorage.setItem("nswdg_user", email);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-msg").innerText = "ACCESS DENIED";
  }
}

// Utility for protected pages:
function requireLogin() {
  if (!localStorage.getItem("nswdg_user")) {
    window.location.href = "login.html";
  }
}
