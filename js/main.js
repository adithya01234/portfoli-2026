const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
});

const revealElements = document.querySelectorAll(".reveal");

const scrollReveal = () => {
  revealElements.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("load", scrollReveal);
window.addEventListener("scroll", scrollReveal);

const sections = document.querySelectorAll("section[id]");
const scrollActive = () => {
  const scrollY = window.pageYOffset;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute("id");
    const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add("active-link");
      } else {
        navLink.classList.remove("active-link");
      }
    }
  });
};
window.addEventListener("scroll", scrollActive);

// Dynamically load EmailJS script without modifying HTML
const emailJsScript = document.createElement("script");
emailJsScript.src =
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
document.head.appendChild(emailJsScript);

const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ensure EmailJS is loaded
    if (typeof emailjs === "undefined") {
      alert("EmailJS is still loading. Please try again in a few seconds.");
      return;
    }

    const btn = form.querySelector("button");
    const ogText = btn.innerHTML;
    btn.innerHTML = "Sending...";
    btn.disabled = true;

    // Collect form inputs (name, email, message)
    const inputs = form.querySelectorAll(".form-control");
    const templateParams = {
      name: inputs[0].value,
      email: inputs[1].value,
      message: inputs[2].value,
    };

    // ✅ Correct EmailJS credentials
    const serviceID = "service_9bzurhg";
    const templateID = "template_55wa1wp";
    const publicKey = "akgcx_LLyaghcqAe5";

    // Send email
    emailjs.send(serviceID, templateID, templateParams, publicKey).then(
      () => {
        btn.innerHTML = "Sent!";
        btn.style.background = "#00b894";
        form.reset();
        setTimeout(() => {
          btn.innerHTML = ogText;
          btn.style.background = "";
          btn.disabled = false;
        }, 3000);
      },
      (error) => {
        console.error("EmailJS Error:", error);
        alert(
          "Failed to send: " +
            (error.text || error.message || JSON.stringify(error)),
        );
        btn.innerHTML = "Error!";
        btn.style.background = "#ff7675";
        setTimeout(() => {
          btn.innerHTML = ogText;
          btn.style.background = "";
          btn.disabled = false;
        }, 3000);
      },
    );
  });
}
