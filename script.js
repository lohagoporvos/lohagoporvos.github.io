(() => {
  'use strict';

  const PHONE = '5491130801404';
  const IMG_BASE = 'imag/';

  /* ===== SECURITY: sanitize ===== */
  function sanitize(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function waLink(msg) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  }

  const WA_SVG = `<svg class="btn__icon" viewBox="0 0 448 512"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;

  /* ===== WA BUTTONS ===== */
  function bindWa() {
    document.querySelectorAll('[data-wa]').forEach(el => {
      if (el._waBound) return;
      el._waBound = true;
      el.addEventListener('click', e => {
        e.preventDefault();
        window.open(waLink(el.dataset.wa), '_blank', 'noopener,noreferrer');
      });
    });
  }

  /* ===== MOBILE NAV ===== */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ===== HEADER SHADOW ===== */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', scrollY > 20);
  }, { passive: true });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== HERO PARTICLES ===== */
  function initParticles() {
    const box = document.getElementById('particles');
    if (!box) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      box.appendChild(p);
    }
  }

  /* ===== CAROUSEL ===== */
  function createCarousel(images, name) {
    const wrap = document.createElement('div');
    wrap.className = 'carousel';
    if (!images || images.length === 0) {
      wrap.classList.add('carousel--empty');
      wrap.innerHTML = '<span>Foto próximamente</span>';
      return wrap;
    }
    const track = document.createElement('div');
    track.className = 'carousel__track';
    let cur = 0;
    images.forEach(src => {
      const slide = document.createElement('div');
      slide.className = 'carousel__slide';
      const img = document.createElement('img');
      img.src = IMG_BASE + src;
      img.alt = name;
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(images.map(s => IMG_BASE + s), images.indexOf(src)));
      slide.appendChild(img);
      track.appendChild(slide);
    });
    wrap.appendChild(track);
    if (images.length > 1) {
      const prev = document.createElement('button');
      prev.className = 'carousel__btn carousel__btn--prev';
      prev.innerHTML = '&#8249;'; prev.setAttribute('aria-label', 'Anterior');
      const next = document.createElement('button');
      next.className = 'carousel__btn carousel__btn--next';
      next.innerHTML = '&#8250;'; next.setAttribute('aria-label', 'Siguiente');
      const dots = document.createElement('div');
      dots.className = 'carousel__dots';
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
      });
      function goTo(i) {
        cur = i;
        track.style.transform = `translateX(-${cur * 100}%)`;
        dots.querySelectorAll('.carousel__dot').forEach((d, idx) => d.classList.toggle('active', idx === cur));
      }
      prev.addEventListener('click', () => goTo(cur <= 0 ? images.length - 1 : cur - 1));
      next.addEventListener('click', () => goTo(cur >= images.length - 1 ? 0 : cur + 1));
      // Touch swipe
      let startX = 0;
      wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      wrap.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? (cur >= images.length - 1 ? 0 : cur + 1) : (cur <= 0 ? images.length - 1 : cur - 1));
      }, { passive: true });
      wrap.appendChild(prev); wrap.appendChild(next); wrap.appendChild(dots);
    }
    return wrap;
  }

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCounter = document.getElementById('lightbox-counter');
  let lbImages = [], lbIdx = 0;

  function openLightbox(imgs, idx) {
    lbImages = imgs; lbIdx = idx; showLb();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function showLb() {
    lbImg.src = lbImages[lbIdx];
    lbCounter.textContent = `${lbIdx + 1} / ${lbImages.length}`;
  }
  function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('lightbox-close').addEventListener('click', closeLb);
  document.getElementById('lightbox-prev').addEventListener('click', () => { lbIdx = lbIdx <= 0 ? lbImages.length - 1 : lbIdx - 1; showLb(); });
  document.getElementById('lightbox-next').addEventListener('click', () => { lbIdx = lbIdx >= lbImages.length - 1 ? 0 : lbIdx + 1; showLb(); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { lbIdx = lbIdx <= 0 ? lbImages.length - 1 : lbIdx - 1; showLb(); }
    if (e.key === 'ArrowRight') { lbIdx = lbIdx >= lbImages.length - 1 ? 0 : lbIdx + 1; showLb(); }
  });

  /* ===== PROFILE IMAGE FROM JSON ===== */
  function loadProfile(perfil) {
    if (!perfil || !perfil.imagen) return;
    const wrap = document.getElementById('about-img-wrap');
    if (!wrap) return;
    const img = document.createElement('img');
    img.src = IMG_BASE + perfil.imagen;
    img.alt = 'Graciela';
    img.className = 'about__img';
    img.style.cssText = 'width:100%;height:auto;display:block;border-radius:inherit;position:relative;z-index:1';
    img.onerror = () => { img.remove(); };
    img.onload = () => {
      const ph = wrap.querySelector('.about__img-placeholder');
      if (ph) ph.style.display = 'none';
    };
    wrap.appendChild(img);
  }

  /* ===== RENDER MENU ===== */
  function renderMenu(cats) {
    const container = document.getElementById('menu-container');
    cats.forEach(cat => {
      const sec = document.createElement('div');
      sec.className = 'menu__category';
      sec.innerHTML = `
        <div class="menu__category-header">
          <span class="menu__category-icon">${sanitize(cat.icono)}</span>
          <div>
            <h3 class="menu__category-title">${sanitize(cat.nombre)}</h3>
            <p class="menu__category-desc">${sanitize(cat.descripcion)}</p>
          </div>
        </div>`;
      const grid = document.createElement('div');
      grid.className = 'menu__grid reveal-stagger';

      cat.productos.forEach(prod => {
        const card = document.createElement('article');
        card.className = 'menu__card reveal reveal--up';
        card.appendChild(createCarousel(prod.imagenes, prod.nombre));
        const body = document.createElement('div');
        body.className = 'menu__card-body';
        const waMsg = prod.mensaje_wa || `Hola! Quiero pedir ${prod.nombre}`;
        body.innerHTML = `
          <h4 class="menu__card-title">${sanitize(prod.nombre)}</h4>
          <p class="menu__card-desc">${sanitize(prod.descripcion)}</p>
          ${prod.imagenes && prod.imagenes.length > 0
            ? `<a href="#" class="btn btn--sm btn--whatsapp" data-wa="${sanitize(waMsg)}">${WA_SVG} Pedir</a>`
            : `<span class="menu__card-soon">Próximamente</span>`}`;
        card.appendChild(body);
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      container.appendChild(sec);
    });
  }

  /* ===== RENDER GALLERY ===== */
  function renderGallery(images) {
    const container = document.getElementById('gallery-container');
    container.classList.add('reveal-stagger');
    const full = images.map(s => IMG_BASE + s);
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = IMG_BASE + src; img.alt = 'Producto casero';
      img.className = 'gallery__img reveal reveal--scale';
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(full, i));
      container.appendChild(img);
    });
  }

  /* ===== SCROLL REVEAL ===== */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));

    // Manually animate about section
    const aboutImg = document.querySelector('.about__img-wrap');
    const aboutTxt = document.querySelector('.about__text');
    [aboutImg, aboutTxt].forEach((el, i) => {
      if (!el) return;
      el.classList.add('reveal', i === 0 ? 'reveal--left' : 'reveal--right');
      obs.observe(el);
    });
    const contactCard = document.querySelector('.contact__card');
    if (contactCard) { contactCard.classList.add('reveal', 'reveal--up'); obs.observe(contactCard); }
  }

  /* ===== CURSOR SPARKLE TRAIL — chispitas de brillo (desktop only) ===== */
  function initCursorSparkles() {
    if (window.matchMedia('(hover: none)').matches) return;
    let lastX = 0, lastY = 0, frame = 0;
    const colors = [
      '#C9A8E8', '#A67BC5', '#8B5DAF',
      '#DBC8F0', '#E8D8F5', '#D4A8FF'
    ];
    const types = ['star', 'star', 'star', 'diamond', 'diamond', 'dot'];

    document.addEventListener('mousemove', e => {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      lastX = e.clientX; lastY = e.clientY;
      frame++;
      if (frame % 3 !== 0 && dist < 6) return;
      // Limit active sparkles for performance
      if (document.querySelectorAll('.cursor-sparkle').length > 35) return;

      const type = types[Math.floor(Math.random() * types.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const offsetX = (Math.random() - .5) * 18;
      const offsetY = (Math.random() - .5) * 18;
      const dur = (.4 + Math.random() * .4).toFixed(2);

      const spark = document.createElement('div');
      spark.className = 'cursor-sparkle cursor-sparkle--' + type;

      if (type === 'star') {
        const armLen = 6 + Math.random() * 10;
        const thick = 1.5 + Math.random() * 1.5;
        spark.style.cssText = `
          left:${e.clientX + offsetX}px;top:${e.clientY + offsetY}px;
          width:${armLen}px;height:${armLen}px;
          --spark-color:${color};--spark-w:${thick}px;--spark-h:${armLen}px;
          --spark-dur:${dur}s;
        `;
      } else if (type === 'diamond') {
        const size = 3 + Math.random() * 5;
        spark.style.cssText = `
          left:${e.clientX + offsetX}px;top:${e.clientY + offsetY}px;
          width:${size}px;height:${size}px;
          --spark-color:${color};--spark-dur:${dur}s;
        `;
      } else {
        const size = 2 + Math.random() * 3;
        spark.style.cssText = `
          left:${e.clientX + offsetX}px;top:${e.clientY + offsetY}px;
          width:${size}px;height:${size}px;
          --spark-color:${color};--spark-dur:${dur}s;
        `;
      }

      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove());
    });
  }

  /* ===== SPARKLES ON HEARTBEAT LOGOS ===== */
  function initLogoSparkles() {
    const colors = ['#C9A8E8','#A67BC5','#8B5DAF','#DBC8F0','#E8D8F5','#D4A8FF'];
    const types = ['star','star','diamond','dot'];

    function emitBurst(el) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, rect.height) / 2;
      const count = 6 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (.4 + Math.random() * .8);
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const dur = (.4 + Math.random() * .5).toFixed(2);
        const spark = document.createElement('div');
        spark.className = 'cursor-sparkle cursor-sparkle--' + type;
        if (type === 'star') {
          const arm = 6 + Math.random() * 12;
          const thick = 1.5 + Math.random() * 2;
          spark.style.cssText = `left:${x}px;top:${y}px;width:${arm}px;height:${arm}px;--spark-color:${color};--spark-w:${thick}px;--spark-h:${arm}px;--spark-dur:${dur}s;`;
        } else if (type === 'diamond') {
          const sz = 3 + Math.random() * 6;
          spark.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;--spark-color:${color};--spark-dur:${dur}s;`;
        } else {
          const sz = 2 + Math.random() * 4;
          spark.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;--spark-color:${color};--spark-dur:${dur}s;`;
        }
        document.body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove());
      }
    }

    // Emit sparkles synced with heartbeat peaks (at 14% and 42% of 1.4s = ~196ms and ~588ms)
    function startBursts(selector) {
      const el = document.querySelector(selector);
      if (!el) return null;
      function cycle() {
        setTimeout(() => emitBurst(el), 196);
        setTimeout(() => emitBurst(el), 588);
      }
      cycle();
      return setInterval(cycle, 1400);
    }

    // Preloader logo sparkles
    const preId = startBursts('.preloader__logo');
    // Hero logo sparkles
    const heroId = startBursts('.hero__logo');

    // Stop preloader sparkles when preloader is removed
    if (preId) {
      const obs = new MutationObserver(() => {
        if (!document.querySelector('.preloader__logo')) { clearInterval(preId); obs.disconnect(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ===== LOAD DATA ===== */
  async function init() {
    try {
      const res = await fetch('imagenes.json');
      if (!res.ok) throw new Error('JSON error');
      const data = await res.json();
      loadProfile(data.perfil);
      renderMenu(data.categorias);
      renderGallery(data.galeria.imagenes);
      bindWa();
      initReveal();
    } catch (err) {
      console.error(err);
      document.getElementById('menu-container').innerHTML = '<p style="text-align:center;color:#5C4A78;padding:40px">Error cargando el menú. Recargá la página.</p>';
    }
  }

  /* ===== PRELOADER ===== */
  function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    pre.classList.add('hidden');
    pre.addEventListener('transitionend', () => pre.remove(), { once: true });
  }

  bindWa();
  initParticles();
  initCursorSparkles();
  initLogoSparkles();
  init();

  // Hide preloader after content loads (min 2.2s for the bar animation)
  const preloaderMin = new Promise(r => setTimeout(r, 2400));
  const pageLoad = new Promise(r => {
    if (document.readyState === 'complete') r();
    else window.addEventListener('load', r, { once: true });
  });
  Promise.all([preloaderMin, pageLoad]).then(hidePreloader);
})();
