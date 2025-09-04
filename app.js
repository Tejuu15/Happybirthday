(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const music = document.getElementById('bgMusic');
  const soundToggle = document.getElementById('soundToggle');
  const sprinklesLayer = document.getElementById('sprinkles');

  // Intro overlay logic
  const intro = $('#intro');
  const openBtn = $('#openSurprise');
  const confettiLayer = $('#confettiLayer');
  if (intro && openBtn) {
    document.body.classList.add('intro-open');
    // Hide main content from assistive tech until open
    const main = document.querySelector('main');
    main && main.setAttribute('aria-hidden', 'true');
    openBtn.addEventListener('click', () => {
      // Confetti burst for celebration
      if (confettiLayer) burstConfetti(confettiLayer, 140);
      // Start music if available (autoplay allowed after user gesture)
      if (music) {
        music.volume = 0.7;
        music.play().then(() => {
          updateSoundUI(true);
        }).catch(() => {
          // autoplay failed (maybe muted); leave toggle visible
          updateSoundUI(false);
        });
      }
      // Start sprinkles animation
      startSprinkles();
      intro.classList.add('hidden');
      document.body.classList.remove('intro-open');
      main && main.setAttribute('aria-hidden', 'false');
      setTimeout(() => intro.remove(), 400);
    });
  }

  // Lightweight confetti using DOM particles and Web Animations API
  function burstConfetti(container, count) {
    const colors = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec', '#ff6ba8'];
    const frag = document.createDocumentFragment();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      const size = 6 + Math.random() * 6;
      el.style.position = 'fixed';
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.background = colors[i % colors.length];
      el.style.borderRadius = Math.random() > 0.6 ? '50%' : '2px';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.willChange = 'transform, opacity';
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - (2 + Math.random() * 2);
      const rot = (Math.random() * 360) + 'deg';
      el.animate([
        { transform: `translate(-50%, -50%) translate(0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(-50%, -50%) translate(${vx*16}px, ${vy*16}px) rotate(${rot})`, opacity: 0.95 },
        { transform: `translate(-50%, -50%) translate(${vx*40}px, ${(vy*40)+80}px) rotate(${rot})`, opacity: 0 }
      ], { duration: 1200 + Math.random()*600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      frag.appendChild(el);
      setTimeout(() => el.remove(), 2200);
    }
    container.appendChild(frag);
  }

  // Personalize name from query param (?name=YourName)
  const params = new URLSearchParams(location.search);
  const customName = (params.get('name') || params.get('n') || '').trim();
  if (customName) {
    const safe = customName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const nameEl = document.getElementById('name');
    if (nameEl) nameEl.textContent = safe;
    document.title = `Happy Birthday, ${safe} 🎉`;
  }

  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && (navigator.connection.saveData || /2g/.test(String(navigator.connection.effectiveType||'')));
  const lowPower = prefersReduce || saveData;

  // Sprinkles animation: floating colorful dots
  function startSprinkles() {
    if (!sprinklesLayer || lowPower) return;
    const colors = ['#ff9aa2','#ffb7b2','#ffdac1','#e2f0cb','#b5ead7','#c7ceea', '#ffd166', '#06d6a0', '#118ab2', '#ff6ba8'];
    let running = true;
    const particles = 38; // light
    const els = [];
    for (let i = 0; i < particles; i++) {
      const d = document.createElement('span');
      d.style.position = 'absolute';
      d.style.left = Math.random()*100 + '%';
      d.style.top = (Math.random()*100) + '%';
      const size = 4 + Math.random()*3;
      d.style.width = size + 'px';
      d.style.height = size + 'px';
      d.style.borderRadius = '50%';
      d.style.background = colors[i % colors.length];
      d.style.opacity = '0.85';
      d.style.filter = 'blur(0.2px)';
      sprinklesLayer.appendChild(d);
      els.push(d);
      float(d);
    }
    function float(el) {
      const dur = 6000 + Math.random()*5000;
      const dx = (Math.random() * 30 - 15);
      const dy = (-20 - Math.random()*30);
      const start = performance.now();
      const sx = el.offsetLeft;
      const sy = el.offsetTop;
      function step(now) {
        if (!running) return;
        const t = (now - start) / dur;
        const p = t - Math.floor(t);
        const x = sx + dx * p + Math.sin(p * Math.PI*2) * 4;
        const y = sy + dy * p;
        el.style.transform = `translate(${x - sx}px, ${y - sy}px)`;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false;
    });
  }

  // Sound toggle
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!music) return;
      if (music.paused) {
        music.play().then(() => updateSoundUI(true));
      } else {
        music.pause();
        updateSoundUI(false);
      }
    });
  }
  function updateSoundUI(isPlaying) {
    if (!soundToggle) return;
    soundToggle.setAttribute('aria-pressed', String(isPlaying));
    soundToggle.textContent = isPlaying ? '🔊' : '🔈';
    soundToggle.title = isPlaying ? 'Pause music' : 'Play music';
  }

  // --- Scroll-triggered animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  setTimeout(() => {
    $$('.animate-on-scroll').forEach(el => {
      animateObserver.observe(el);
    });
  }, 100);

  // --- Enhanced photo strip with improved interactions ---
  const film = $('#film');
  if (film) {
    let isDown = false, startX = 0, startScroll = 0;
    let vx = 0, lastX = 0, lastT = 0, momentumId = 0;

    const friction = 0.92; // enhanced momentum decay
    const minV = 0.05; // stop threshold

    // Add smooth scroll snap behavior
    let snapTimeout;
    function smoothSnapToCard() {
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        const cardWidth = film.querySelector('.card')?.offsetWidth || 300;
        const gap = 16;
        const scrollLeft = film.scrollLeft;
        const targetIndex = Math.round(scrollLeft / (cardWidth + gap));
        const targetScroll = targetIndex * (cardWidth + gap);
        
        film.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }, 100);
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        isDown = true;
        film.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startScroll = film.scrollLeft;
        lastX = e.clientX;
        lastT = performance.now();
        vx = 0;
        cancelAnimationFrame(momentumId);
        film.style.scrollSnapType = 'none'; // Disable snap during drag
      }
    }

    function onPointerMove(e) {
      if (!isDown) return;
      const dx = e.clientX - startX;
      film.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        vx = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = now;
      }
    }

    function onPointerUp(e) {
      if (!isDown) return;
      isDown = false;
      try { film.releasePointerCapture(e.pointerId); } catch(_){}
      
      // Re-enable snap
      film.style.scrollSnapType = 'x mandatory';
      
      // Enhanced momentum with better feel
      let v = vx * 20;
      const maxScroll = film.scrollWidth - film.clientWidth;
      
      function step() {
        film.scrollLeft = Math.min(maxScroll, Math.max(0, film.scrollLeft - v));
        v *= friction;
        if (Math.abs(v) > minV) {
          momentumId = requestAnimationFrame(step);
        } else {
          smoothSnapToCard();
        }
      }
      
      if (Math.abs(v) > minV) step();
      else smoothSnapToCard();
    }

    // Enhanced event listeners
    film.addEventListener('pointerdown', onPointerDown, { passive: true });
    film.addEventListener('pointermove', onPointerMove, { passive: true });
    film.addEventListener('pointerup', onPointerUp, { passive: true });
    film.addEventListener('pointercancel', onPointerUp, { passive: true });
    film.addEventListener('mouseleave', onPointerUp, { passive: true });

    // Enhanced keyboard support
    film.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        film.scrollBy({ left: -film.clientWidth * 0.9, behavior: 'smooth' });
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        film.scrollBy({ left: film.clientWidth * 0.9, behavior: 'smooth' });
      }
      if (e.key === 'Home') {
        e.preventDefault();
        film.scrollTo({ left: 0, behavior: 'smooth' });
      }
      if (e.key === 'End') {
        e.preventDefault();
        film.scrollTo({ left: film.scrollWidth, behavior: 'smooth' });
      }
    });

    // Touch-friendly scroll snap fallback
    film.addEventListener('scroll', smoothSnapToCard, { passive: true });
  }

  // Boost initial UX: focus the film on anchor click for keyboard
  const photosLink = document.querySelector('a[href="#photos"]');
  photosLink && photosLink.addEventListener('click', () => setTimeout(() => film && film.focus(), 300));
  
  // --- Lightbox: open images full-screen with blurred background of the same image ---
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('.lightbox__img');
  const lbBg = lightbox && lightbox.querySelector('.lightbox__overlay');
  const lbClose = lightbox && lightbox.querySelector('.lightbox__close');

  function openLightbox(src, alt, origin) {
    if (!lightbox || !lbImg || !lbBg) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbBg.style.backgroundImage = `url("${src}")`;
    lightbox.setAttribute('aria-hidden', 'false');
    // set transform origin for zoom-from-click effect
    const content = lightbox.querySelector('.lightbox__content');
    const originVal = origin || '50% 50%';
    if (content) content.style.transformOrigin = originVal;
    if (lbImg) lbImg.style.transformOrigin = originVal;
    // enable animated open
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // focus close for accessibility
    lbClose && lbClose.focus();
    // reset origin back to center after animation so further transforms are centered
    setTimeout(() => {
      if (content) content.style.transformOrigin = '';
      if (lbImg) lbImg.style.transformOrigin = '';
    }, 500);
  }

  function closeLightbox() {
    if (!lightbox) return;
    // start animated close
    lightbox.classList.remove('open');
    const content = lightbox.querySelector('.lightbox__content');
    let done = false;
    function finish() {
      if (done) return; done = true;
      lightbox.setAttribute('aria-hidden', 'true');
      lbImg && (lbImg.src = '');
      lbBg && (lbBg.style.backgroundImage = '');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    // Wait for transitionend on the content; fallback after 900ms
    const onEnd = (e) => {
      if (e.target === content) {
        finish();
        content.removeEventListener('transitionend', onEnd);
      }
    };
    if (content) {
      content.addEventListener('transitionend', onEnd);
    }
    setTimeout(finish, 900);
  }

  // Photo tap-to-open behavior disabled: images will not open the lightbox on click.
  // Reset any 'zoom-in' cursor styling so images act like normal content.
  const photoSelectors = ['.film .card img', '.portrait-card .portrait', '.card img'];
  photoSelectors.forEach(sel => {
    $$(sel).forEach(img => {
      img.style.cursor = '';
    });
  });

  // Close when clicking anywhere outside the content, or on the close button
  lightbox && lightbox.addEventListener('click', (e) => {
    const path = e.composedPath && e.composedPath();
    const clickedInside = path && path.some(el => el && el.classList && el.classList.contains && el.classList.contains('lightbox__content'));
    const clickedClose = path && path.some(el => el && el.classList && el.classList.contains && el.classList.contains('lightbox__close'));
    if (!clickedInside || clickedClose) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeLightbox();
  });
})();
