(function () {
  const AUTH_KEY = "reboot.auth.user";

  function getAuthUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveAuthUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  function clearAuthUser() {
    localStorage.removeItem(AUTH_KEY);
  }

  function requireAuth() {
    if (!getAuthUser()) {
      window.location.replace("./signin.html");
    }
  }

  function redirectIfAuthed() {
    if (getAuthUser()) {
      window.location.replace("./projects.html");
    }
  }

  function initSignin() {
    redirectIfAuthed();
    const form = document.getElementById("signin-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const name = document.getElementById("name").value.trim();
      if (!email || !name) return;
      saveAuthUser({ email, name, createdAt: Date.now() });
      window.location.replace("./projects.html");
    });
  }

  function initProjects() {
    requireAuth();
    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) {
      signoutBtn.addEventListener("click", () => {
        clearAuthUser();
        window.location.replace("./signin.html");
      });
    }
  }

  // Public API for simple redirect in index.html
  window.RebootAuth = {
    getAuthUser,
    saveAuthUser,
    clearAuthUser,
  };

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");
    if (page === "signin") initSignin();
    if (page === "projects") initProjects();
  });
})();


