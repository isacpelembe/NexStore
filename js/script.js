document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------ REGISTAR E LOGIN ------------------------ */
  const userBtn = document.querySelector(".btn-user");
  const popup = document.getElementById("popupAuth");
  const container = document.querySelector(".auth-container");
  const toggle = document.getElementById("toggleAuth");

  userBtn.addEventListener("click", () => {
    popup.classList.add("show");
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.classList.remove("show");
  });

  toggle.addEventListener("click", () => {
    container.classList.toggle("active");

    if (container.classList.contains("active")) {
      toggle.textContent = "Login";
      document.querySelector(".overlay-content h2").textContent = "Bem-vindo!";
      document.querySelector(".overlay-content p").textContent = "Já tens uma conta?";
    } else {
      toggle.textContent = "Registrar";
      document.querySelector(".overlay-content h2").textContent = "Bem-vindo!";
      document.querySelector(".overlay-content p").textContent = "Ainda não tens conta?";
    }
  });

  /* ------------------------ HAMBURGER E MENU MOBILE ------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  const dropdowns = document.querySelectorAll('.dropdown > span');

  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');       // abre/fecha o menu
    hamburger.classList.toggle('toggle');  // transforma em X
  });

  dropdowns.forEach(drop => {
    drop.addEventListener('click', e => {
      e.stopPropagation();
      drop.parentElement.classList.toggle('ativo');
    });
  });

  document.addEventListener('click', e => {
    dropdowns.forEach(d => {
      if (!d.parentElement.contains(e.target)) d.parentElement.classList.remove('ativo');
    });

    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('active');
      hamburger.classList.remove('toggle');
    }
  });

  /* ------------------------ AREA DO SLIDER ------------------------ */
  const slides = document.querySelectorAll(".slide");
  const slidesContainer = document.querySelector(".slides");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const dotsContainer = document.querySelector(".dots");

  let currentIndex = 0;
  let slideInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot-line");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot-line");

  function showSlide(index) {
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; showSlide(currentIndex); }
  function prevSlide() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; showSlide(currentIndex); }
  function goToSlide(index) { currentIndex = index; showSlide(currentIndex); resetInterval(); }

  nextBtn.addEventListener("click", () => { nextSlide(); resetInterval(); });
  prevBtn.addEventListener("click", () => { prevSlide(); resetInterval(); });

  function startInterval() {
    slideInterval = setInterval(() => {
      nextSlide();
      pulseDot(currentIndex);
    }, 5000);
  }
  function resetInterval() { clearInterval(slideInterval); startInterval(); }

  function pulseDot(index) {
    const dot = dots[index];
    dot.style.transform = "scale(1.5)";
    dot.style.transition = "0.3s ease";
    setTimeout(() => dot.style.transform = "scale(1)", 300);
  }

  showSlide(currentIndex);
  startInterval();

  /* ------------------------ FUNDO TECNOLOGICO ------------------------ */
  const canvas = document.getElementById("tech-lines");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const numParticles = 60;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function initParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }
  }
  initParticles();

  function animateTech() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#00bfff";
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,191,255,${1 - dist / 120})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateTech);
  }
  animateTech();
});