/**
 * STAR Template JavaScript (pages/projects/javascript.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Navbar Component
  const navbar = document.getElementById('navbar-placeholder');
  if (navbar) {
    fetch('../components/nav.html')
      .then((res) => res.text())
      .then((html) => {
        navbar.innerHTML = html;
        document.querySelectorAll('#navbar-placeholder a').forEach((link) => {
          const href = link.getAttribute('href');
          if (href) {
            if (href.startsWith('#')) link.setAttribute('href', '../../index.html' + href);
            else if (href.startsWith('pages/')) link.setAttribute('href', '../' + href.replace('pages/', ''));
            else if (href === 'index.html') link.setAttribute('href', '../../index.html');
          }
        });
      })
      .catch((err) => console.warn('Nav load warning:', err));
  }

  // 2. Load Footer Component
  const footer = document.getElementById('footer-placeholder');
  if (footer) {
    fetch('../components/footer.html')
      .then((res) => res.text())
      .then((html) => (footer.innerHTML = html))
      .catch((err) => console.warn('Footer load warning:', err));
  }

  // 3. Scroll Reading Progress Bar
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = height > 0 ? (winScroll / height) * 100 + '%' : '0%';
    });
  }

  // 4. STAR Navigation ScrollSpy & Smooth Scroll
  const markers = document.querySelectorAll('.star-nav-marker');
  const sections = document.querySelectorAll('.star-section');

  markers.forEach((marker) => {
    marker.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = marker.getAttribute('data-target') || marker.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (sections.length && markers.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            markers.forEach((m) => {
              const target = m.getAttribute('data-target') || m.getAttribute('href').replace('#', '');
              m.classList.toggle('active', target === id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
});
