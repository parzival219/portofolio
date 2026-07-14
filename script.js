/* ============================================================
   BAIMSUITE — script.js (Premium SaaS-Style Interactive Logic)
   Vanilla ES6+ · No dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. TYPING ANIMATION
     Hero subtitle cycles through roles with a typewriter effect
  ---------------------------------------------------------- */
  const initTypingAnimation = () => {
    const el = document.querySelector('.typed-text') 
            || document.querySelector('.hero-subtitle');
    if (!el) return;

    const roles = [
      'Full Stack Teams',
      'Unicorn Startups',
      'Enterprise Platforms',
      'Modern SaaS Products'
    ];

    let roleIndex   = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    const TYPE_SPEED   = 100;   // ms per character while typing
    const DELETE_SPEED = 50;    // ms per character while deleting
    const PAUSE_AFTER  = 2000;  // ms to hold completed word
    const PAUSE_BEFORE = 500;   // ms before typing next word

    const tick = () => {
      const current = roles[roleIndex];

      // Build visible substring
      el.textContent = current.substring(0, charIndex);

      let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

      if (!isDeleting && charIndex === current.length) {
        delay = PAUSE_AFTER;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = PAUSE_BEFORE;
      }

      charIndex += isDeleting ? -1 : 1;

      setTimeout(tick, delay);
    };

    tick();
  };


  /* ----------------------------------------------------------
     2. SCROLL REVEAL ANIMATIONS
     Intersection Observer adds .active to .reveal elements
  ---------------------------------------------------------- */
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px'
    });

    reveals.forEach(el => observer.observe(el));
  };


  /* ----------------------------------------------------------
     3. SMOOTH SCROLL NAVIGATION
  ---------------------------------------------------------- */
  const initSmoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const navbar   = document.querySelector('.navbar, nav');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('disabled-link')) return;
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (!target) return;

        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top
                  + window.pageYOffset
                  - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    if (!sections.length || !navLinks.length) return;

    const highlightNav = () => {
      const scrollY  = window.pageYOffset;
      const navH     = navbar ? navbar.offsetHeight : 0;

      sections.forEach(section => {
        const top    = section.offsetTop - navH - 100;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          const id = section.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  };


  /* ----------------------------------------------------------
     4. MOBILE NAVIGATION
     Toggle hamburger menu; close on link click
  ---------------------------------------------------------- */
  const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (!hamburger || !navLinksContainer) return;

    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.classList.add('nav-backdrop');
      document.body.appendChild(backdrop);
    }

    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      backdrop.classList.toggle('visible');
      document.body.style.overflow =
        navLinksContainer.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
      backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  };


  /* ----------------------------------------------------------
     5. NAVBAR SCROLL EFFECT
  ---------------------------------------------------------- */
  const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar, nav');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 50;

    const onScroll = () => {
      if (window.pageYOffset > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };


  /* ----------------------------------------------------------
     6. ANIMATED SKILL BARS
  ---------------------------------------------------------- */
  const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-bar-fill, .skill-progress');
    if (!bars.length) return;

    bars.forEach(bar => { bar.style.width = '0%'; });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.getAttribute('data-percentage')
                   || bar.getAttribute('data-width')
                   || bar.dataset.percentage
                   || '0';

          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(.25,.46,.45,.94)';
            bar.style.width = `${pct}%`;
            bar.classList.add('animate');
          });

          observer.unobserve(bar);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px'
    });

    bars.forEach(bar => observer.observe(bar));
  };


  /* ----------------------------------------------------------
     7. PARTICLE BACKGROUND
  ---------------------------------------------------------- */
  const initParticles = () => {
    const container = document.querySelector('.particles')
                   || document.querySelector('.hero');
    if (!container) return;

    let particleLayer = container.querySelector('.particles');
    if (!particleLayer) {
      particleLayer = document.createElement('div');
      particleLayer.classList.add('particles');
      Object.assign(particleLayer.style, {
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: '0'
      });
      container.style.position = container.style.position || 'relative';
      container.prepend(particleLayer);
    }

    const PARTICLE_COUNT = 30;

    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes particleFloat {
          0%   { transform: translateY(0)   translateX(0);    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120vh) translateX(30px); opacity: 0; }
        }
        @keyframes particleDrift {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(20px); }
        }
      `;
      document.head.appendChild(style);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement('span');

      const size     = Math.random() * 4 + 1;
      const left     = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay    = Math.random() * 15;
      const opacity  = Math.random() * 0.15 + 0.05;

      Object.assign(dot.style, {
        position: 'absolute',
        bottom: `-${size}px`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `rgba(37, 99, 235, ${opacity})`,
        animation: `particleFloat ${duration}s linear ${delay}s infinite,
                    particleDrift ${duration * 0.6}s ease-in-out ${delay}s infinite alternate`,
        pointerEvents: 'none'
      });

      particleLayer.appendChild(dot);
    }
  };


  /* ----------------------------------------------------------
     8. CONTACT FORM
     Basic validation + simulated submit → success notification
  ---------------------------------------------------------- */
  const initContactForm = () => {
    const form = document.querySelector('.contact-form, #contact-form, form');
    if (!form) return;

    const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    const nameInput    = form.querySelector('[name="name"], #name');
    const emailInput   = form.querySelector('[name="email"], #email');
    const messageInput = form.querySelector('[name="message"], #message, textarea');

    const validateField = (field, isValidFn) => {
      if (!field) return;
      field.addEventListener('input', () => {
        if (field.value.trim() === '') {
          field.classList.remove('valid-input', 'invalid-input');
        } else if (isValidFn(field.value.trim())) {
          field.classList.remove('invalid-input');
          field.classList.add('valid-input');
        } else {
          field.classList.remove('valid-input');
          field.classList.add('invalid-input');
        }
      });
    };

    validateField(nameInput, (val) => val.length >= 2);
    validateField(emailInput, isValidEmail);
    validateField(messageInput, (val) => val.length >= 10);

    let notification = document.querySelector('.form-notification, .notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.classList.add('form-notification');
      notification.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span>Message sent successfully!</span>`;
      document.body.appendChild(notification);
    }

    const showNotification = (message, isError = false) => {
      const span = notification.querySelector('span');
      const icon = notification.querySelector('i');
      if (span) span.textContent = message;
      
      if (icon) {
        if (isError) {
          icon.className = 'ph-fill ph-x-circle';
          icon.style.color = '#ef4444';
          notification.style.borderLeftColor = '#ef4444';
        } else {
          icon.className = 'ph-fill ph-check-circle';
          icon.style.color = 'var(--accent-primary)';
          notification.style.borderLeftColor = 'var(--accent-primary)';
        }
      }

      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 4000);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('[name="name"], #name');
      const email   = form.querySelector('[name="email"], #email');
      const message = form.querySelector('[name="message"], #message, textarea');

      if (name && !name.value.trim()) {
        showNotification('Please enter your name.', true);
        name.focus();
        return;
      }
      if (email && !isValidEmail(email.value.trim())) {
        showNotification('Please enter a valid email address.', true);
        email.focus();
        return;
      }
      if (message && !message.value.trim()) {
        showNotification('Please enter a message.', true);
        message.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"], .btn-submit');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
          showNotification('Message sent successfully! BaimSuite representative will respond shortly. 🚀');
        }, 1500);
      } else {
        form.reset();
        showNotification('Message sent successfully! 🚀');
      }
    });
  };


  /* ----------------------------------------------------------
     9. COUNTER ANIMATION
  ---------------------------------------------------------- */
  const initCounters = () => {
    const counters = document.querySelectorAll('.counter, .stat-number, [data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target   = parseInt(el.getAttribute('data-count') || el.textContent, 10);
      if (isNaN(target)) return;

      const duration = 2000;
      const start    = performance.now();

      el.textContent = '0';

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          const suffix = el.getAttribute('data-suffix') || '';
          if (suffix) el.textContent += suffix;
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px'
    });

    counters.forEach(el => observer.observe(el));
  };


  /* ----------------------------------------------------------
     10. BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  const initBackToTop = () => {
    let btn = document.querySelector('.back-to-top, #back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.classList.add('back-to-top');
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    const SHOW_THRESHOLD = 500;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > SHOW_THRESHOLD) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };


  /* ----------------------------------------------------------
     11. THEME SWITCHER (Dark/Light Mode)
  ---------------------------------------------------------- */
  const initThemeSwitcher = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggleBtn || !icon) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        icon.className = 'ph ph-sun';
      } else {
        icon.className = 'ph ph-moon';
      }
    };

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    });
  };


  /* ----------------------------------------------------------
     12. DYNAMIC DASHBOARD WORKLOAD SIMULATOR
     Fluctuates CPU, RAM, and SVG latency charts in real-time
  ---------------------------------------------------------- */
  const initDashboardSimulation = () => {
    const cpuUtil = document.getElementById('cpu-util');
    const cpuBar = document.getElementById('cpu-bar');
    const ramUtil = document.getElementById('ram-util');
    const ramBar = document.getElementById('ram-bar');
    const dbQueries = document.getElementById('db-queries');
    const liveLatency = document.getElementById('live-latency');
    const chartPolyline = document.getElementById('chart-line');
    const chartArea = document.getElementById('chart-area');

    if (!cpuUtil || !cpuBar || !ramUtil || !ramBar || !dbQueries || !liveLatency || !chartPolyline || !chartArea) return;

    // Latency points array (11 segments representing coordinate points)
    let chartPoints = [50, 40, 70, 30, 45, 80, 20, 60, 40, 30, 50];

    const updateDashboard = () => {
      // 1. CPU Fluctuations
      const cpu = (Math.random() * 35 + 8).toFixed(1);
      cpuUtil.textContent = `${cpu}%`;
      cpuBar.style.width = `${cpu}%`;

      // 2. RAM Fluctuations (Max 16GB allocation)
      const ramGB = (Math.random() * 2.1 + 3.8).toFixed(1);
      const ramPct = ((ramGB / 16) * 100).toFixed(1);
      ramUtil.textContent = `${ramGB} GB`;
      ramBar.style.width = `${ramPct}%`;

      // 3. Database Queries
      dbQueries.textContent = Math.floor(Math.random() * 8 + 4);

      // 4. Live API Latencies
      const latency = Math.floor(Math.random() * 12 + 28);
      liveLatency.textContent = `${latency} ms`;

      // 5. Shift SVG Chart Data coordinates left
      chartPoints.shift();
      // Calculate a vertical coordinate (SVG height = 100, so map lower latency to smaller Y value)
      const nextY = Math.max(10, Math.min(90, Math.floor(100 - (latency * 2))));
      chartPoints.push(nextY);

      // Formulate polyline string
      const pointsString = chartPoints.map((y, idx) => `${idx * 50},${y}`).join(' ');
      chartPolyline.setAttribute('points', pointsString);

      // Formulate filled path string
      const areaPathString = `M0,100 ` + chartPoints.map((y, idx) => `L${idx * 50},${y}`).join(' ') + ` L500,100 Z`;
      chartArea.setAttribute('d', areaPathString);
    };

    // Update stats every 2.5 seconds
    setInterval(updateDashboard, 2500);
    updateDashboard(); // Run once immediately
  };


  /* ----------------------------------------------------------
     13. REPOSITORY DATABASE TABLE — UX Edition
     · Debounced live search with result count feedback
     · Sortable columns (click header to sort asc/desc)
     · Functional pagination (5 rows per page)
     · Keyboard-navigable rows (Enter/Space opens link)
     · Smooth state transitions
     · Clear empty-search feedback vs. empty-state panel
  ---------------------------------------------------------- */
  const initRepositoryTable = () => {
    const tableBody     = document.getElementById('table-body');
    const searchInput   = document.getElementById('repo-search');
    const tableElement  = document.getElementById('repo-table');
    const skeletonEl    = document.getElementById('table-skeleton');
    const emptyEl       = document.getElementById('table-empty');
    const errorEl       = document.getElementById('table-error');
    const paginationInfo = document.getElementById('table-pagination-info');
    const btnPrev       = document.getElementById('btn-prev-page');
    const btnNext       = document.getElementById('btn-next-page');
    const btnDefault    = document.getElementById('btn-state-default');
    const btnLoading    = document.getElementById('btn-state-loading');
    const btnEmpty      = document.getElementById('btn-state-empty');
    const btnError      = document.getElementById('btn-state-error');

    if (!tableBody || !tableElement || !skeletonEl || !emptyEl || !errorEl) return;

    // ── Data ────────────────────────────────────────────────
    const repositories = [
      {
        name: 'divlearn-assessment-tool',
        tech: ['Python', 'BeautifulSoup', 'Requests'],
        stars: 0, commits: 1, status: 'Operational',
        link: 'https://github.com/parzival219/divlearn-assessment-tool'
      },
      {
        name: 'shopee-oms-prototype',
        tech: ['Next.js', 'React', 'Tailwind CSS'],
        stars: 0, commits: 1, status: 'Operational',
        link: 'https://shopee-oms-prototype.vercel.app/'
      },
      {
        name: 'SaaS RBAC CRM Dashboard',
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
        stars: 0, commits: 1, status: 'Operational',
        link: 'https://saas-rbac-dashboard.vercel.app/'
      }
    ];

    // ── State ────────────────────────────────────────────────
    const PAGE_SIZE = 5;
    let currentPage    = 1;
    let sortKey        = null;
    let sortDir        = 'asc';   // 'asc' | 'desc'
    let filteredData   = [...repositories];
    let debounceTimer  = null;

    // ── Helpers ──────────────────────────────────────────────
    const totalPages = () => Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

    const pageSlice = () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      return filteredData.slice(start, start + PAGE_SIZE);
    };

    // ── Sort ─────────────────────────────────────────────────
    const applySort = () => {
      if (!sortKey) return;
      filteredData.sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 :  1;
        if (av > bv) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
    };

    // ── Render table ─────────────────────────────────────────
    const renderTable = () => {
      tableBody.innerHTML = '';
      const slice = pageSlice();

      if (!filteredData.length) {
        // No results for the current search query
        const query = searchInput ? searchInput.value.trim() : '';
        emptyEl.querySelector('h4').textContent = 'No results found';
        emptyEl.querySelector('p').textContent  =
          query ? `No repository matches "${query}".` : 'No repository files match the current query filters.';
        showPanel('empty', /* keepActiveBtn= */ true);
        return;
      }

      tableElement.style.display = 'table';
      emptyEl.style.display   = 'none';
      errorEl.style.display   = 'none';
      skeletonEl.style.display = 'none';

      slice.forEach((repo, idx) => {
        const row = document.createElement('tr');
        row.className = 'animate-row';
        row.style.animationDelay = `${idx * 0.04}s`;
        // Make row keyboard-navigable
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'link');
        row.setAttribute('aria-label', `Open ${repo.name}`);
        row.style.cursor = 'pointer';

        const techBadges = repo.tech
          .map(t => `<span class="badge">${t}</span>`)
          .join('');

        row.innerHTML = `
          <td class="repo-name">${repo.name}</td>
          <td><div class="tech-stack">${techBadges}</div></td>
          <td class="col-meta" colspan="3">
            <div class="meta-row-mobile">
              <span class="num-cell">
                <i class="ph-fill ph-star" style="color:var(--accent-primary);font-size:0.75rem;"></i>
                ${repo.stars}
              </span>
              <span class="num-cell">
                <i class="ph ph-git-commit" style="color:var(--text-muted);font-size:0.75rem;"></i>
                ${repo.commits}
              </span>
              <span class="badge success">
                <span class="status-dot-live"></span>${repo.status}
              </span>
            </div>
          </td>
          <td class="col-action">
            <a href="${repo.link}" target="_blank" rel="noopener noreferrer"
               class="btn-row-action" title="Open ${repo.name}"
               onclick="event.stopPropagation()">
              <i class="ph ph-arrow-square-out"></i>
              <span>View</span>
            </a>
          </td>
        `;

        // Click / keyboard → open link
        const open = () => window.open(repo.link, '_blank', 'noopener,noreferrer');
        row.addEventListener('click', open);
        row.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });

        tableBody.appendChild(row);
      });

      updatePagination();
      updateSortIndicators();
    };

    // ── Pagination UI ────────────────────────────────────────
    const updatePagination = () => {
      const tp = totalPages();
      const start = filteredData.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
      const end   = Math.min(currentPage * PAGE_SIZE, filteredData.length);
      const total = repositories.length;

      if (paginationInfo) {
        paginationInfo.textContent =
          filteredData.length === total
            ? `${start}–${end} of ${total} repos`
            : `${start}–${end} of ${filteredData.length} (filtered from ${total})`;
      }

      // Rebuild page buttons
      const controls = document.querySelector('.pagination-controls');
      if (!controls) return;
      controls.innerHTML = '';

      const makePagBtn = (label, page, disabled, isActive) => {
        const btn = document.createElement('button');
        btn.className = `btn-pagination${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`;
        btn.textContent = label;
        btn.setAttribute('aria-label', `Page ${label}`);
        if (!disabled) btn.addEventListener('click', () => { currentPage = page; renderTable(); });
        controls.appendChild(btn);
      };

      // Prev
      const prevBtn = document.createElement('button');
      prevBtn.className = `btn-pagination${currentPage === 1 ? ' disabled' : ''}`;
      prevBtn.innerHTML = '<i class="ph ph-caret-left"></i>';
      prevBtn.setAttribute('aria-label', 'Previous page');
      if (currentPage > 1) prevBtn.addEventListener('click', () => { currentPage--; renderTable(); });
      controls.appendChild(prevBtn);

      // Page numbers
      for (let p = 1; p <= tp; p++) {
        makePagBtn(p, p, false, p === currentPage);
      }

      // Next
      const nextBtn = document.createElement('button');
      nextBtn.className = `btn-pagination${currentPage === tp ? ' disabled' : ''}`;
      nextBtn.innerHTML = '<i class="ph ph-caret-right"></i>';
      nextBtn.setAttribute('aria-label', 'Next page');
      if (currentPage < tp) nextBtn.addEventListener('click', () => { currentPage++; renderTable(); });
      controls.appendChild(nextBtn);
    };

    // ── Sort indicators on TH ────────────────────────────────
    const updateSortIndicators = () => {
      const ths = tableElement.querySelectorAll('thead th[data-sort]');
      ths.forEach(th => {
        const key = th.dataset.sort;
        th.setAttribute('aria-sort', 'none');
        const icon = th.querySelector('.sort-icon');
        if (icon) {
          icon.className = 'sort-icon ph ph-arrows-down-up';
          icon.style.opacity = '0.3';
        }
        if (key === sortKey) {
          th.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
          if (icon) {
            icon.className = `sort-icon ph ${sortDir === 'asc' ? 'ph-arrow-up' : 'ph-arrow-down'}`;
            icon.style.opacity = '1';
          }
        }
      });
    };

    // ── Sortable headers ─────────────────────────────────────
    const initSortableHeaders = () => {
      const headers = [
        { el: tableElement.querySelector('thead tr th:nth-child(1)'), key: 'name'    },
        { el: tableElement.querySelector('thead tr th:nth-child(3)'), key: 'stars'   },
        { el: tableElement.querySelector('thead tr th:nth-child(4)'), key: 'commits' },
      ];
      headers.forEach(({ el, key }) => {
        if (!el) return;
        el.dataset.sort = key;
        el.style.cursor = 'pointer';
        el.style.userSelect = 'none';
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'columnheader');

        // Append sort icon
        const icon = document.createElement('i');
        icon.className = 'sort-icon ph ph-arrows-down-up';
        icon.style.cssText = 'margin-left:6px;opacity:0.3;font-size:0.7rem;vertical-align:middle;transition:opacity 0.15s;';
        el.appendChild(icon);

        const doSort = () => {
          if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            sortKey = key;
            sortDir = 'asc';
          }
          currentPage = 1;
          applySort();
          renderTable();
        };

        el.addEventListener('click', doSort);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSort(); } });
      });
    };

    // ── Search with debounce ─────────────────────────────────
    const doFilter = () => {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filteredData = repositories.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.tech.some(t => t.toLowerCase().includes(q))
      );
      applySort();
      currentPage = 1;
      renderTable();
    };

    if (searchInput) {
      // Clear button
      const clearBtn = document.createElement('button');
      clearBtn.innerHTML = '<i class="ph ph-x"></i>';
      clearBtn.setAttribute('aria-label', 'Clear search');
      clearBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0;line-height:1;display:none;';
      searchInput.parentNode.insertBefore(clearBtn, searchInput.nextSibling);

      searchInput.addEventListener('input', () => {
        clearBtn.style.display = searchInput.value ? 'block' : 'none';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (currentState === 'default') doFilter();
        }, 220);
      });

      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        doFilter();
      });
    }

    // ── State panel switcher ─────────────────────────────────
    let currentState = 'default';

    const showPanel = (state, keepActiveBtn = false) => {
      currentState = state;

      tableElement.style.display  = 'none';
      skeletonEl.style.display    = 'none';
      emptyEl.style.display       = 'none';
      errorEl.style.display       = 'none';

      if (!keepActiveBtn) {
        [btnDefault, btnLoading, btnEmpty, btnError].forEach(b => b && b.classList.remove('active'));
      }

      if (state === 'default') {
        if (btnDefault) btnDefault.classList.add('active');
        doFilter();  // re-run filter which will show table or empty panel
      } else if (state === 'loading') {
        skeletonEl.style.display = 'block';
        if (btnLoading) btnLoading.classList.add('active');
      } else if (state === 'empty') {
        emptyEl.style.display = 'flex';
        if (!keepActiveBtn && btnEmpty) btnEmpty.classList.add('active');
      } else if (state === 'error') {
        errorEl.style.display = 'flex';
        if (btnError) btnError.classList.add('active');
      }
    };

    if (btnDefault) btnDefault.addEventListener('click', () => showPanel('default'));
    if (btnLoading) btnLoading.addEventListener('click', () => showPanel('loading'));
    if (btnEmpty)   btnEmpty.addEventListener('click',   () => showPanel('empty'));
    if (btnError)   btnError.addEventListener('click',   () => showPanel('error'));

    // ── Boot ─────────────────────────────────────────────────
    initSortableHeaders();
    showPanel('default');
  };


  /* ----------------------------------------------------------
     14. FAQ ACCORDION HANDLER
     Manages expanding accordion rows and handles caret rotations
  ---------------------------------------------------------- */
  const initFaqAccordions = () => {
    const rows = document.querySelectorAll('.faq-accordion-row');
    if (!rows.length) return;

    rows.forEach(row => {
      const header = row.querySelector('.accordion-header');
      const panel  = row.querySelector('.accordion-panel');
      if (!header || !panel) return;

      header.addEventListener('click', () => {
        const isActive = row.classList.contains('active');

        // Collapse all rows first (SaaS behavior)
        rows.forEach(r => {
          r.classList.remove('active');
          const p = r.querySelector('.accordion-panel');
          if (p) p.style.maxHeight = null;
        });

        if (!isActive) {
          row.classList.add('active');
          // Set maxHeight to scrollHeight to animate expand
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    });
  };


  /* ----------------------------------------------------------
     BOOT SEQUENCE — kick everything off
  ---------------------------------------------------------- */
  initTypingAnimation();
  initScrollReveal();
  initSmoothScroll();
  initMobileNav();
  initNavbarScroll();
  initSkillBars();
  initParticles();
  initContactForm();
  initCounters();
  initBackToTop();
  initThemeSwitcher();
  
  // BaimSuite SaaS Modules
  initDashboardSimulation();
  initRepositoryTable();
  initFaqAccordions();

  console.log('%c⚡ BaimSuite Premium SaaS Hub loaded', 'color:#6366f1; font-size:14px; font-weight:bold;');
});
