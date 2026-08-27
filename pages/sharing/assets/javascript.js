// Tab Switching Logic
function switchTab(tab) {
  const mathBtn = document.getElementById("tab-math");
  const codingBtn = document.getElementById("tab-coding");
  const mathPanel = document.getElementById("panel-math");
  const codingPanel = document.getElementById("panel-coding");

  if (tab === "math") {
    mathBtn.classList.add("active");
    mathBtn.setAttribute("aria-selected", "true");
    mathBtn.setAttribute("tabindex", "0");

    codingBtn.classList.remove("active");
    codingBtn.setAttribute("aria-selected", "false");
    codingBtn.setAttribute("tabindex", "-1");

    mathPanel.classList.remove("d-none");
    codingPanel.classList.add("d-none");
  } else {
    codingBtn.classList.add("active");
    codingBtn.setAttribute("aria-selected", "true");
    codingBtn.setAttribute("tabindex", "0");

    mathBtn.classList.remove("active");
    mathBtn.setAttribute("aria-selected", "false");
    mathBtn.setAttribute("tabindex", "-1");

    codingPanel.classList.remove("d-none");
    mathPanel.classList.add("d-none");
  }
}

// ==========================================================================
// Slide Deck Presentation Engine (PDF.js Canvas & Interactive Controls)
// ==========================================================================
const slidePlayer = {
  pdfDoc: null,
  pageNum: 1,
  pageRendering: false,
  pageNumPending: null,
  zoomScale: 2.0, // High DPI rendering for crisp typography
  canvas: null,
  ctx: null,
  container: null,

  init(pdfUrl, containerId) {
    if (typeof pdfjsLib === "undefined") {
      console.error("PDF.js library is not loaded.");
      return;
    }

    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = this.container.querySelector(".presentation-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    const loader = this.container.querySelector(".presentation-loader");
    if (loader) loader.style.display = "block";

    pdfjsLib
      .getDocument(pdfUrl)
      .promise.then((pdf) => {
        this.pdfDoc = pdf;
        if (loader) loader.style.display = "none";
        this.buildProgressTicks(pdf.numPages);
        this.renderPage(this.pageNum);
      })
      .catch((err) => {
        console.error("Error loading presentation PDF:", err);
        if (loader) {
          loader.innerHTML = `
            <div class="text-danger small p-3 bg-dark rounded">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> Failed to render PDF presentation.
              <div class="mt-2"><a href="${pdfUrl}" target="_blank" class="btn btn-outline-light btn-sm">Open File Directly</a></div>
            </div>
          `;
        }
      });

    // Keyboard listener for Left / Right arrow navigation
    window.addEventListener("keydown", (e) => {
      const codingPanel = document.getElementById("panel-coding");
      if (codingPanel && !codingPanel.classList.contains("d-none")) {
        if (e.key === "ArrowLeft") this.prevPage();
        else if (e.key === "ArrowRight") this.nextPage();
      }
    });
  },

  buildProgressTicks(total) {
    const track = this.container.querySelector(".presentation-progress-track");
    if (!track) return;
    track.innerHTML = "";
    for (let i = 1; i <= total; i++) {
      const tick = document.createElement("div");
      tick.className = "presentation-tick" + (i === 1 ? " active" : "");
      tick.title = `Slide ${i}`;
      tick.addEventListener("click", (e) => {
        e.stopPropagation();
        this.goToPage(i);
      });
      track.appendChild(tick);
    }
  },

  renderPage(num) {
    this.pageRendering = true;
    this.pdfDoc.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale: this.zoomScale });
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      });
    });

    this.updateControlsUI(num);
  },

  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  },

  prevPage() {
    if (!this.pdfDoc || this.pageNum <= 1) return;
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  },

  nextPage() {
    if (!this.pdfDoc || this.pageNum >= this.pdfDoc.numPages) return;
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  },

  goToPage(num) {
    if (!this.pdfDoc || num < 1 || num > this.pdfDoc.numPages) return;
    this.pageNum = num;
    this.queueRenderPage(this.pageNum);
  },

  updateControlsUI(num) {
    if (!this.container || !this.pdfDoc) return;
    const total = this.pdfDoc.numPages;

    const counter = this.container.querySelector(".presentation-counter");
    if (counter) counter.innerText = `${num} / ${total}`;

    const prevBtn = this.container.querySelector(".btn-prev-slide");
    if (prevBtn) prevBtn.disabled = num <= 1;

    const nextBtn = this.container.querySelector(".btn-next-slide");
    if (nextBtn) nextBtn.disabled = num >= total;

    // Highlight active and past progress ticks
    const ticks = this.container.querySelectorAll(".presentation-tick");
    ticks.forEach((tick, idx) => {
      const slideIndex = idx + 1;
      tick.classList.remove("active", "completed");
      if (slideIndex === num) {
        tick.classList.add("active");
      } else if (slideIndex < num) {
        tick.classList.add("completed");
      }
    });
  },

  toggleFullscreen() {
    const viewer = this.container.querySelector(".presentation-viewer-container");
    if (!viewer) return;

    if (!document.fullscreenElement) {
      if (viewer.requestFullscreen) viewer.requestFullscreen();
      else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();
      else if (viewer.msRequestFullscreen) viewer.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  },
};

// ==========================================================================
// Load and Render Coding Data (code.json)
// ==========================================================================
function loadCodingData() {
  const codingPanelRow = document.querySelector("#panel-coding .row");
  if (!codingPanelRow) return;

  fetch("assets/code.json?t=" + new Date().getTime())
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load code.json: " + response.statusText);
      }
      return response.json();
    })
    .then((items) => {
      if (!Array.isArray(items) || items.length === 0) {
        codingPanelRow.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-code-slash display-4 text-muted"></i>
            <p class="mt-3 text-secondary">No coding resources available yet.</p>
          </div>
        `;
        return;
      }

      let html = "";
      let pdfItem = null;

      items.forEach((item, index) => {
        if (item.pdfUrl && !pdfItem) {
          pdfItem = item;
          // Render the Presentation Section inside a unified outer section border
          html += `
            <div class="col-12 mb-5">
              <div class="presentation-section-wrapper">
                <!-- Presentation Header: Badges, Title & Subtitle -->
                <div class="presentation-header mb-3">
                  <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-semibold">
                      <i class="bi bi-code-slash me-1"></i> ${item.category ? item.category.toUpperCase() : "CODE"}
                    </span>
                    <span class="badge bg-light text-secondary border rounded-pill px-3 py-1">
                      <i class="bi bi-file-earmark-slides text-danger me-1"></i> Interactive Presentation
                    </span>
                    <span class="badge bg-light text-secondary border rounded-pill px-3 py-1">
                      <i class="bi bi-calendar-event text-primary me-1"></i> Weekend Training
                    </span>
                  </div>
                  
                  <!-- Main Title -->
                  <h2 class="fw-bold text-dark mb-1 h3">${item.title}</h2>
                  
                  <!-- Subtitle -->
                  <p class="text-secondary fs-6 mb-0 fw-medium">
                    <i class="bi bi-info-circle me-1 text-primary"></i> ${item.subtitle}
                  </p>
                </div>
                
                <!-- Interactive Slide Deck Viewer Card -->
                <div class="presentation-card mb-3" id="presentation-deck">
                  <div class="presentation-viewer-container">
                    <!-- Loading Indicator -->
                    <div class="presentation-loader">
                      <div class="spinner-border text-light mb-2" role="status" style="width: 2.2rem; height: 2.2rem;">
                        <span class="visually-hidden">Loading slides...</span>
                      </div>
                      <div class="small fw-semibold text-white-50">Loading Presentation...</div>
                    </div>

                    <!-- Slide Canvas -->
                    <canvas class="presentation-canvas"></canvas>

                    <!-- Click Navigation Zones -->
                    <div class="presentation-click-zone left" onclick="slidePlayer.prevPage()" title="Previous slide"></div>
                    <div class="presentation-click-zone right" onclick="slidePlayer.nextPage()" title="Next slide"></div>

                    <!-- Bottom Controls Overlay Bar -->
                    <div class="presentation-overlay-bar">
                      <!-- Segmented Progress Bar -->
                      <div class="presentation-progress-track"></div>

                      <!-- Controls Row -->
                      <div class="presentation-controls-row">
                        <!-- Left: Nav buttons and slide counter -->
                        <div class="d-flex align-items-center">
                          <button type="button" class="presentation-btn btn-prev-slide" onclick="slidePlayer.prevPage()" title="Previous Slide">
                            <i class="bi bi-chevron-left"></i>
                          </button>
                          <span class="presentation-counter">1 / --</span>
                          <button type="button" class="presentation-btn btn-next-slide" onclick="slidePlayer.nextPage()" title="Next Slide">
                            <i class="bi bi-chevron-right"></i>
                          </button>
                        </div>

                        <!-- Right: Action buttons -->
                        <div class="d-flex align-items-center gap-2">
                          <a href="${item.pdfUrl}" target="_blank" class="presentation-btn" title="Open Fullscreen in New Tab">
                            <i class="bi bi-zoom-in"></i>
                          </a>
                          <a href="${item.pdfUrl}" download="Basic_Python_Course.pdf" class="presentation-btn" title="Download PDF Presentation">
                            <i class="bi bi-three-dots"></i>
                          </a>
                          <button type="button" class="presentation-btn" onclick="slidePlayer.toggleFullscreen()" title="Toggle Fullscreen">
                            <i class="bi bi-arrows-fullscreen"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- About This Course Details Card -->
                <div class="presentation-details-card bg-white p-4 rounded-4 border shadow-sm">
                  <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                    <div>
                      <h5 class="fw-bold text-dark mb-2">About This Course</h5>
                      <p class="text-secondary mb-3 lh-base">${item.description || "Course slides and learning resources for the training session."}</p>
                      
                      <!-- Tags -->
                      <div class="d-flex flex-wrap gap-2">
                        ${(item.tags || []).map((tag) => `<span class="badge-tag"><i class="bi bi-tag me-1 text-primary"></i>${tag}</span>`).join("")}
                      </div>
                    </div>
                    <div class="d-flex gap-2 flex-shrink-0">
                      <a href="${item.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center">
                        <i class="bi bi-box-arrow-up-right me-1"></i> Open Tab
                      </a>
                      <a href="${item.pdfUrl}" download="Basic_Python_Course.pdf" class="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center">
                        <i class="bi bi-download me-1"></i> Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          // Standard resource card
          html += `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="sharing-card">
                <div class="p-4 d-flex flex-column h-100">
                  <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-semibold mb-2 align-self-start">
                    ${item.category || "Code"}
                  </span>
                  <h5 class="fw-bold text-dark mb-2">${item.title}</h5>
                  <p class="text-secondary small mb-3">${item.subtitle || ""}</p>
                </div>
              </div>
            </div>
          `;
        }
      });

      codingPanelRow.innerHTML = html;

      // Initialize slide deck player if PDF exists
      if (pdfItem) {
        slidePlayer.init(pdfItem.pdfUrl, "presentation-deck");
      }
    })
    .catch((err) => {
      console.error("Error loading code resources:", err);
      codingPanelRow.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-danger">Failed to load coding resources.</p>
        </div>
      `;
    });
}

// ==========================================================================
// Load and Render Math Data (math.json)
// ==========================================================================
function loadMathData() {
  const mathPanelRow = document.querySelector("#panel-math .row");
  if (!mathPanelRow) return;

  fetch("assets/math.json?t=" + new Date().getTime())
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load math.json");
      }
      return response.json();
    })
    .then((items) => {
      if (!Array.isArray(items) || items.length === 0) {
        mathPanelRow.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="p-5 bg-white rounded-4 border shadow-sm mx-auto" style="max-width: 550px;">
              <i class="bi bi-calculator display-4 text-primary opacity-50 mb-3 d-block"></i>
              <h5 class="fw-bold text-dark mb-2">Math Resources Coming Soon</h5>
              <p class="text-secondary small mb-0">Things that i have explored and shared the basic of things in Stats, ML, DL, and learning guides are currently being organized and will be published here soon.</p>
            </div>
          </div>
        `;
        return;
      }

      mathPanelRow.innerHTML = items
        .map((item) => {
          return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="sharing-card">
                <div class="p-4 d-flex flex-column h-100">
                  <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1 fw-semibold mb-2 align-self-start">
                    ${item.category || "Math"}
                  </span>
                  <h5 class="fw-bold text-dark mb-2">${item.title}</h5>
                  <p class="text-secondary small mb-3">${item.subtitle || ""}</p>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    })
    .catch((err) => {
      console.error("Error loading math resources:", err);
    });
}

// Load Navbar Component
fetch("../components/nav.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return response.text();
  })
  .then((data) => {
    const placeholder = document.getElementById("navbar-placeholder");
    if (placeholder) {
      placeholder.innerHTML = data;

      // Execute inner scripts inside nav.html
      const scripts = placeholder.querySelectorAll("script");
      scripts.forEach((script) => {
        const executionScript = document.createElement("script");
        executionScript.textContent = script.textContent;
        document.body.appendChild(executionScript).parentNode.removeChild(executionScript);
      });
    }
  })
  .catch((error) => {
    console.error("Error loading navbar:", error);
  });

// Load Footer Component
fetch("../components/footer.html")
  .then((response) => response.text())
  .then((data) => {
    const placeholder = document.getElementById("footer-placeholder");
    if (placeholder) {
      placeholder.innerHTML = data;
    }
  })
  .catch((error) => {
    console.error("Error loading footer:", error);
  });

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCodingData();
  loadMathData();
});
