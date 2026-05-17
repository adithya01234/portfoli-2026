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

// =============================================
// THEME TOGGLE LOGIC
// =============================================
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference, if any. Default to dark mode.
const currentTheme = localStorage.getItem('theme') || 'dark';
body.classList.toggle('light-theme', currentTheme === 'light');

// Toggle theme on button click
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

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

// =============================================
// SKILLS SECTION — Scroll-triggered animations
// (Replays every time the section enters the viewport)
// =============================================
const skillsSection = document.getElementById("skills");

if (skillsSection) {
  const animateSkills = () => {
    skillsSection.classList.add("skills-animated");

    const bars = skillsSection.querySelectorAll(
      ".skill-progress[data-width]",
    );
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute("data-width") + "%";
      }, 300 + index * 120);
    });
  };

  const resetSkills = () => {
    skillsSection.classList.remove("skills-animated");

    const bars = skillsSection.querySelectorAll(
      ".skill-progress[data-width]",
    );
    bars.forEach((bar) => {
      bar.style.width = "0";
    });
  };

  // Delay observer setup so it doesn't fire during initial page load
  setTimeout(() => {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
          } else {
            resetSkills();
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    skillsObserver.observe(skillsSection);
  }, 1000);
}

// =============================================
// HERO TYPING EFFECT
// =============================================
const typedTextEl = document.getElementById("typed-text");

if (typedTextEl) {
  const roles = [
    "Fullstack Java Developer",
    "Backend Engineer",
    "Spring Boot Developer",
    "Problem Solver",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of word
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  // Start typing after a short delay
  setTimeout(typeEffect, 500);
}

// =============================================
// STATS COUNTER — Count up on scroll
// =============================================
const statsSection = document.getElementById("stats");

if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counters = statsSection.querySelectorAll(".stat-number");

          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 30);
            let current = 0;

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };

            updateCounter();
          });

          statsObserver.unobserve(statsSection);
        }
      });
    },
    {
      threshold: 0.3,
    },
  );

  statsObserver.observe(statsSection);
}

// =============================================
// CERTIFICATIONS MARQUEE — Auto + Manual Scroll
// =============================================
const marquee = document.getElementById("cert-marquee");
const prevBtn = document.getElementById("cert-prev-btn");
const nextBtn = document.getElementById("cert-next-btn");

if (marquee) {
  const strip = marquee.querySelector(".credential-strip");
  let isPaused = false;
  let scrollAmount = 1;

  const autoScroll = () => {
    if (!isPaused) {
      marquee.scrollLeft += scrollAmount;
      // Loop when we've scrolled halfway (since items are duplicated)
      if (marquee.scrollLeft >= strip.scrollWidth / 2) {
        marquee.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  };

  // Pause auto-scroll when hovering over the marquee
  marquee.addEventListener("mouseenter", () => (isPaused = true));
  marquee.addEventListener("mouseleave", () => (isPaused = false));

  // Pause when hovering over the buttons too
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("mouseenter", () => (isPaused = true));
    prevBtn.addEventListener("mouseleave", () => (isPaused = false));
    nextBtn.addEventListener("mouseenter", () => (isPaused = true));
    nextBtn.addEventListener("mouseleave", () => (isPaused = false));

    prevBtn.addEventListener("click", () => {
      marquee.scrollBy({ left: -350, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      marquee.scrollBy({ left: 350, behavior: "smooth" });
    });
  }

  // Start the animation loop
  autoScroll();
}

// =============================================
// GUIDED TOUR (Intro.js)
// =============================================
window.addEventListener("load", () => {
  if (typeof introJs !== 'undefined') {
    // Start tour with slight delay so page loads fully
    setTimeout(() => {
      const tour = introJs().setOptions({
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        doneLabel: 'Got it',
        skipLabel: 'Skip'
      });

      tour.onbeforechange(function(targetElement) {
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        if(targetElement) {
          targetElement.classList.add('tour-highlight');
        }
      }).oncomplete(() => {
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        // Fire confetti!
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff1744', '#ff8a65', '#45f3ff', '#6c5ce7']
          });
        }
      }).onexit(() => {
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      });

      tour.start();
    }, 1500);
  }
});
