(function () {
  "use strict";

  /* =========================================================
     ANNO CORRENTE NEL FOOTER
     ========================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     HEADER: sfondo al momento dello scroll
     ========================================================= */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* =========================================================
     MENU MOBILE (hamburger)
     ========================================================= */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Chiudi il menu quando si clicca un link
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    // Chiudi il menu con il tasto Esc
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMobileNav();
        hamburger.focus();
      }
    });
  }

  /* =========================================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            // piccolo scaglionamento per elementi nello stesso gruppo
            var delay = (index % 4) * 60;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // fallback: mostra tutto subito
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* =========================================================
     FORM DI PRENOTAZIONE (demo frontend, nessun invio reale)
     ========================================================= */
  var form = document.getElementById("booking-form");
  var confirmEl = document.getElementById("form-confirm");

  if (form) {
    var todayISO = new Date().toISOString().split("T")[0];
    var dataInput = document.getElementById("data");
    if (dataInput) dataInput.setAttribute("min", todayISO);

    function setError(fieldId, message) {
      var errorEl = document.getElementById("err-" + fieldId);
      var input = document.getElementById(fieldId);
      if (errorEl) errorEl.textContent = message || "";
      if (input) {
        var row = input.closest(".form-row");
        if (row) row.classList.toggle("has-error", Boolean(message));
      }
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
      return /^[+\d][\d\s()-]{6,}$/.test(value.trim());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      confirmEl.textContent = "";
      confirmEl.classList.remove("is-visible");

      var nome = document.getElementById("nome");
      var email = document.getElementById("email");
      var telefono = document.getElementById("telefono");
      var data = document.getElementById("data");
      var persone = document.getElementById("persone");

      var valid = true;

      if (!nome.value.trim()) {
        setError("nome", "Inserisci il tuo nome e cognome.");
        valid = false;
      } else {
        setError("nome", "");
      }

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        setError("email", "Inserisci un indirizzo email valido.");
        valid = false;
      } else {
        setError("email", "");
      }

      if (!telefono.value.trim() || !isValidPhone(telefono.value.trim())) {
        setError("telefono", "Inserisci un numero di telefono valido.");
        valid = false;
      } else {
        setError("telefono", "");
      }

      if (!data.value) {
        setError("data", "Seleziona una data.");
        valid = false;
      } else {
        setError("data", "");
      }

      if (!persone.value) {
        setError("persone", "Seleziona il numero di persone.");
        valid = false;
      } else {
        setError("persone", "");
      }

      if (!valid) {
        var firstError = form.querySelector(".has-error input, .has-error select");
        if (firstError) firstError.focus();
        return;
      }

      // Simulazione invio (nessun dato viene realmente trasmesso)
      var submitBtn = form.querySelector("button[type='submit']");
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Invio in corso...";

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;

        var nomeVal = nome.value.trim().split(" ")[0];
        confirmEl.textContent =
          "Grazie, " + nomeVal + "! La tua richiesta per " + persone.value +
          " il " + data.value + " è stata registrata (demo — nessun dato è stato realmente inviato).";
        confirmEl.classList.add("is-visible");

        form.reset();
      }, 700);
    });
  }
})();
