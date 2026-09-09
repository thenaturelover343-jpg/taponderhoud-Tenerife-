(function () {
  var root = "https://thenaturelover343-jpg.github.io/taponderhoud-Tenerife-/";
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");
  if (lang === "nl" || lang === "en") window.location.replace(root + lang + "/");

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var subject = "Solicitud desde la web";
      var body = [
        "Nombre: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Localidad: " + (data.get("location") || ""),
        "Mensaje: " + (data.get("message") || "")
      ].join("\n");
      window.location.href = "mailto:info@tapservicetenerife.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  var consent = localStorage.getItem("tap_cookie_ok");
  var banner = document.querySelector("[data-cookie-banner]");
  if (banner && consent !== "1") banner.hidden = false;
  var accept = document.querySelector("[data-cookie-accept]");
  if (accept) {
    accept.addEventListener("click", function () {
      localStorage.setItem("tap_cookie_ok", "1");
      if (banner) banner.hidden = true;
    });
  }
})();
