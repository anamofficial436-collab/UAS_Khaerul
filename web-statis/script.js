// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById('nav-mobile');
  menu.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('nav-mobile').classList.remove('open');
}

// Skill bar animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') || bar.style.width;
      });
    }
  });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
  // Store target widths then reset to 0 for animation
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.setAttribute('data-width', bar.style.width);
    bar.style.width = '0';
  });

  const skillSection = document.querySelector('.skill-bars');
  if (skillSection) observer.observe(skillSection);

  // Smooth active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));
});
