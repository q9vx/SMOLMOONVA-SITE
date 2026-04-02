const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.2 });

reveals.forEach(el => observer.observe(el));

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');

navToggle.addEventListener('click', () => {
  navUl.classList.toggle('active');
});
