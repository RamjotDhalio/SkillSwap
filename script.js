const API = "http://localhost:5000/api";

// ----------------------
// HELPER FUNCTIONS
// ----------------------

// Show alert message nicely
function showMessage(msg, isError = false) {
  alert(msg); // you can later replace with toast UI
}

// Get input value safely
function getValue(id) {
  return document.getElementById(id)?.value.trim();
}

// Redirect
function goTo(page) {
  window.location.href = page;
}

// ----------------------
// AUTH FUNCTIONS
// ----------------------

// SIGNUP
async function signup() {
  const username = getValue("user");
  const password = getValue("pass");

  if (!username || !password) {
    return showMessage("Please fill all fields", true);
  }

  try {
    const res = await fetch(API + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    showMessage("Signup successful 🎉");
    goTo("login.html");

  } catch (err) {
    showMessage(err.message, true);
  }
}

// LOGIN

   function login() {
  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();

  if (username === "Ramjot" && password === "Ramjotkaurdhalio") {
    localStorage.setItem("user", username);
    alert("Login Successful 🚀");
    window.location.href = "home.html";
  } else {
    alert("Invalid credentials ❌");
  }
}
// LOGOUT
function logout() {
  localStorage.removeItem("user");
  showMessage("Logged out");
  goTo("login.html");
}

// ----------------------
// SKILL FUNCTIONS
// ----------------------

// ADD SKILL
async function addSkill() {
  const title = getValue("title");
  const description = getValue("desc");
  const user = localStorage.getItem("user");

  if (!user) {
    showMessage("Please login first", true);
    return goTo("login.html");
  }

  if (!title || !description) {
    return showMessage("Fill all fields", true);
  }

  try {
    const res = await fetch(API + "/skills/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, title, description })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add skill");
    }

    showMessage("Skill added successfully 💡");

    // Clear inputs
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";

    loadSkills();

  } catch (err) {
    showMessage(err.message, true);
  }
}

// LOAD ALL SKILLS
async function loadSkills() {
  const skillsContainer = document.getElementById("skills");

  if (!skillsContainer) return;

  try {
    const res = await fetch(API + "/skills/all");
    const data = await res.json();

    if (!data.length) {
      skillsContainer.innerHTML = "<p>No skills posted yet 😔</p>";
      return;
    }

    skillsContainer.innerHTML = data.map(skill => `
      <div class="skill-card">
        <h3>${skill.title}</h3>
        <p>${skill.description}</p>
        <small>👤 ${skill.user}</small>
      </div>
    `).join("");

  } catch (err) {
    skillsContainer.innerHTML = "<p>Error loading skills</p>";
  }
}

// ----------------------
// AUTO LOAD ON PAGE
// ----------------------

window.onload = () => {
  const currentPage = window.location.pathname;

  // Protect dashboard (login required)
  if (currentPage.includes("dashboard")) {
    const user = localStorage.getItem("user");

    if (!user) {
      showMessage("Please login first", true);
      return goTo("login.html");
    }

    loadSkills();
  }
};

// Show username on home page
window.onload = () => {
  const user = localStorage.getItem("user");

  if (window.location.pathname.includes("home.html")) {
    if (!user) {
      alert("Please login first");
      window.location.href = "login.html";
    } else {
      document.getElementById("username").innerText = "👋 " + user;
      loadSkills();
    }
  }
};

// PROFILE PAGE LOGIC
if (window.location.pathname.includes("profile.html")) {
  const user = localStorage.getItem("user");

  document.getElementById("username").innerText = user;

  if (user === "Ramjot") {
    document.getElementById("role").innerHTML = "👑 Founder & CEO";
    document.getElementById("adminBtn").style.display = "block";
  } else {
    document.getElementById("role").innerText = "User";
  }
}

// ADMIN REDIRECT
function goToAdmin() {
  window.location.href = "admin.html";
}

// ADMIN PAGE
if (window.location.pathname.includes("admin.html")) {
  const user = localStorage.getItem("user");

  if (user !== "Ramjot") {
    alert("Access denied");
    window.location.href = "home.html";
  } else {
    loadSkills();
  }
}