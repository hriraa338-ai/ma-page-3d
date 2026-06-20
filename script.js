// Color swatches
const swatches = document.querySelectorAll('.swatch');
const colorName = document.getElementById('color-name');

swatches.forEach((sw) => {
  sw.addEventListener('click', () => {
    swatches.forEach((s) => s.classList.remove('active'));
    sw.classList.add('active');
    colorName.textContent = sw.dataset.name;
    if (window.setCaseColor) window.setCaseColor(sw.dataset.color);
  });
});

// Background particles
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 70 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.8 + 0.4,
  dx: (Math.random() - 0.5) * 0.25,
  dy: (Math.random() - 0.5) * 0.25,
  hue: Math.random() > 0.5 ? '10,132,255' : '191,90,242',
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue}, 0.6)`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.card, .spec, .section-title').forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
