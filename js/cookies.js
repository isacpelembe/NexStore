//----------------------- COOKIES ACEITAR -----------------------//
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("cookiePopup");
  const acceptBtn = document.getElementById("acceptCookies");

  if (localStorage.getItem("cookiesAccepted") === "true") {
    popup.style.display = "none";
  }

  acceptBtn.addEventListener("click", () => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(20px)";
    setTimeout(() => {
      popup.style.display = "none";
    }, 400);
    localStorage.setItem("cookiesAccepted", "true");
  });
});