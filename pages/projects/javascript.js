/**
 * STAR Template JavaScript (pages/projects/javascript.js)
 * Dynamically loads navbar, footer, STAR components, and project data from dataProject.json
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

        // Highlight "Projects" in navbar
        navbar.querySelectorAll('.nav-link').forEach((link) => {
          const text = link.textContent.trim().toLowerCase();
          const href = (link.getAttribute('href') || '').toLowerCase();
          if (text === 'projects' || href.includes('project')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
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

  // 4. Load Project Data & STAR Components
  loadStarProjectData();
});

/**
 * Loads project details from dataProject.json and injects the STAR component templates
 */
async function loadStarProjectData() {
  try {
    const res = await fetch('dataProject.json?t=' + new Date().getTime());
    if (!res.ok) throw new Error('Failed to fetch dataProject.json');
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      console.warn('No projects found in dataProject.json');
      return;
    }

    // Determine target project from URL query parameter (e.g. ?id=3 or ?id=mct) or filename
    const urlParams = new URLSearchParams(window.location.search);
    let targetId = urlParams.get('id');

    if (!targetId) {
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath.includes('mct')) {
        targetId = '3';
      } else if (currentPath.includes('chatbot')) {
        targetId = '2';
      }
    }

    let project = projects[0];
    if (targetId) {
      const matched = projects.find((p) => String(p.id) === targetId || p.slug === targetId);
      if (matched) project = matched;
    }

    // Populate Page Header
    const titleEl = document.getElementById('blog-title');
    const subtitleEl = document.getElementById('blog-sub-title');

    if (titleEl && project.title) {
      titleEl.textContent = project.title;
      document.title = `${project.title} - Sreynich Nang`;
    }

    if (subtitleEl) {
      subtitleEl.textContent = project.subtitle || project.description || '';
    }

    // Populate CTA Download Banner
    const ctaWrapper = document.getElementById('blog-cta-wrapper');
    const ctaLink = document.getElementById('cta-link');
    const ctaPrompt = document.getElementById('cta-prompt');
    const ctaBtnText = document.getElementById('cta-btn-text');

    if (ctaWrapper && project.appUrl) {
      ctaWrapper.classList.remove('d-none');
      if (ctaLink) ctaLink.href = project.appUrl;
      if (ctaPrompt && project.appPrompt) ctaPrompt.textContent = project.appPrompt;
      if (ctaBtnText && project.appCta) ctaBtnText.textContent = project.appCta;
    } else if (ctaWrapper) {
      ctaWrapper.classList.add('d-none');
    }

    // Populate Image Gallery Showcase
    const galleryWrapper = document.getElementById('blog-gallery-wrapper');
    const galleryGrid = document.getElementById('blog-gallery-grid');

    if (galleryWrapper && galleryGrid && Array.isArray(project.images) && project.images.length > 0) {
      galleryWrapper.classList.remove('d-none');
      galleryGrid.innerHTML = project.images
        .map(
          (img) => `
          <div class="col-md-4 col-sm-6 col-12">
            <div class="gallery-card">
              <div class="gallery-img-wrapper">
                <img src="${img.url}" alt="${img.title || project.title}" loading="lazy" />
              </div>
              <div class="gallery-caption-wrapper">
                <h6 class="gallery-item-title">${img.title || ''}</h6>
                <p class="gallery-item-caption">${img.caption || ''}</p>
              </div>
            </div>
          </div>
        `
        )
        .join('');
    } else if (galleryWrapper) {
      galleryWrapper.classList.add('d-none');
    }

    // STAR Section definitions & their component file paths
    const starSections = [
      { key: 'situation', file: 'components/situation.html', data: project.situation },
      { key: 'task', file: 'components/task.html', data: project.task },
      { key: 'action', file: 'components/action.html', data: project.action },
      { key: 'result', file: 'components/result.html', data: project.result },
    ];

    // Load each component HTML and populate section data
    await Promise.all(
      starSections.map(async (sec) => {
        const container = document.getElementById(sec.key);
        if (!container) return;

        try {
          const compRes = await fetch(sec.file + '?t=' + new Date().getTime());
          if (!compRes.ok) throw new Error(`Failed to load ${sec.file}`);
          const compHtml = await compRes.text();
          container.innerHTML = compHtml;

          // Populate component data
          if (sec.data) {
            populateSectionContent(sec.key, sec.data);
          }
        } catch (err) {
          console.error(`Error loading component [${sec.file}]:`, err);
        }
      })
    );

    // Initialize ScrollSpy navigation after components are rendered
    initStarScrollSpy();
  } catch (error) {
    console.error('Error in loadStarProjectData:', error);
  }
}

/**
 * Injects title, subtitle, and list points into a loaded STAR component
 */
function populateSectionContent(sectionKey, data) {
  const titleEl = document.getElementById(`${sectionKey}-title`);
  const subtitleEl = document.getElementById(`${sectionKey}-subtitle`);
  const bodyEl = document.getElementById(`${sectionKey}-body`);

  if (titleEl && data.title) {
    titleEl.textContent = data.title;
  }

  if (subtitleEl) {
    if (data.subtitle) {
      subtitleEl.textContent = data.subtitle;
    } else {
      subtitleEl.style.display = 'none';
    }
  }

  if (bodyEl) {
    let bodyHtml = '';

    const textContent = data.paragraph || data.description;
    const hasPoints = Array.isArray(data.points) && data.points.length > 0;

    if (textContent) {
      bodyHtml += `<p class="star-section-text ${hasPoints ? 'mb-3' : 'mb-0'}">${textContent}</p>`;
    } else if (Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
      bodyHtml += data.paragraphs
        .map((p, idx) => `<p class="star-section-text ${idx < data.paragraphs.length - 1 ? 'mb-3' : (hasPoints ? 'mb-3' : 'mb-0')}">${p}</p>`)
        .join('');
    }

    if (hasPoints) {
      bodyHtml += `
        <ul class="star-bullet-list mb-0 ps-3">
          ${data.points
            .map(
              (point) => `
            <li class="star-bullet-item mb-2">${point}</li>
          `
            )
            .join('')}
        </ul>
      `;
    }

    bodyEl.innerHTML = bodyHtml;
  }
}

/**
 * Initializes STAR Sidebar Navigation ScrollSpy and smooth scrolling
 */
function initStarScrollSpy() {
  const markers = document.querySelectorAll('.star-nav-marker');
  const sections = document.querySelectorAll('.star-section');

  if (!markers.length || !sections.length) return;

  function updateActiveMarker() {
    const scrollPos = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 1. If reached or near the bottom of the page, always activate the last marker (04 Result)
    if (scrollPos + windowHeight >= docHeight - 120) {
      markers.forEach((m, idx) => {
        m.classList.toggle('active', idx === markers.length - 1);
      });
      return;
    }

    // 2. Identify the active section based on scroll offset position
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    // Fallback if before first section
    if (!currentId && sections[0] && scrollPos < sections[0].offsetTop - 140) {
      currentId = sections[0].getAttribute('id');
    }

    if (currentId) {
      markers.forEach((m) => {
        const target = m.getAttribute('data-target') || m.getAttribute('href').replace('#', '');
        m.classList.toggle('active', target === currentId);
      });
    }
  }

  // Handle marker clicks with smooth offset scroll
  markers.forEach((marker) => {
    marker.onclick = (e) => {
      e.preventDefault();
      const targetId = marker.getAttribute('data-target') || marker.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        markers.forEach((m) => m.classList.remove('active'));
        marker.classList.add('active');

        const navOffset = 95;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };
  });

  window.addEventListener('scroll', updateActiveMarker, { passive: true });
  updateActiveMarker();
}
