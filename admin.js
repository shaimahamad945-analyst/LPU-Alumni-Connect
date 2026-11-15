(function () {
  "use strict";

  const SESSION_KEY = "lpu_admin_session";

  function getAdminSession() {
    try {
      return JSON.parse(
        localStorage.getItem(SESSION_KEY) ||
        sessionStorage.getItem(SESSION_KEY) ||
        "null"
      );
    } catch (error) {
      return null;
    }
  }

  const session = getAdminSession();

  if (!session || session.role !== "admin") {
    window.location.replace("login.html");
    return;
  }

  document.getElementById("adminName").textContent =
    session.name || "Administrator";

  document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  if (typeof DB !== "undefined") {
    const counts = DB.usage().counts;

    document.getElementById("usersCount").textContent =
      counts.users || 0;

    document.getElementById("requestsCount").textContent =
      counts.requests || 0;

    document.getElementById("eventsCount").textContent =
      counts.eventRegs || 0;

    document.getElementById("referralsCount").textContent =
      counts.referrals || 0;
  }

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    window.location.replace("login.html");
  });

})();