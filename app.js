(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const music = document.getElementById('bgMusic');
  const soundToggle = document.getElementById('soundToggle');
  // Sprinkles removed

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
  // Sprinkles removed
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

  // Sprinkles feature removed

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

  // Scroll-triggered animations removed

  // --- Photo strip: simple horizontal slide (no momentum/smooth observer) ---
  const film = $('#film');
  if (film) {
    // Basic pointer drag to slide horizontally; native snap does the rest
    let isDown = false, startX = 0, startScroll = 0;

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        isDown = true;
        film.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startScroll = film.scrollLeft;
        film.style.scrollSnapType = 'none';
      }
    }
    function onPointerMove(e) {
      if (!isDown) return;
      const dx = e.clientX - startX;
      film.scrollLeft = startScroll - dx;
    }
    function onPointerUp(e) {
      if (!isDown) return;
      isDown = false;
      try { film.releasePointerCapture(e.pointerId); } catch(_){}
      film.style.scrollSnapType = 'x mandatory';
      // Snap to nearest card instantly (no smooth animation)
      const cardWidth = film.querySelector('.card')?.offsetWidth || 300;
      const gap = 16;
      const targetIndex = Math.round(film.scrollLeft / (cardWidth + gap));
      const targetScroll = targetIndex * (cardWidth + gap);
      film.scrollLeft = targetScroll;
    }

    film.addEventListener('pointerdown', onPointerDown, { passive: true });
    film.addEventListener('pointermove', onPointerMove, { passive: true });
    film.addEventListener('pointerup', onPointerUp, { passive: true });
    film.addEventListener('pointercancel', onPointerUp, { passive: true });
    film.addEventListener('mouseleave', onPointerUp, { passive: true });

    // Keyboard support, immediate slide without smooth animations
    film.addEventListener('keydown', (e) => {
      const cardWidth = film.querySelector('.card')?.offsetWidth || 300;
      const step = cardWidth + 16;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        film.scrollLeft -= step;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        film.scrollLeft += step;
      }
      if (e.key === 'Home') {
        e.preventDefault();
        film.scrollLeft = 0;
      }
      if (e.key === 'End') {
        e.preventDefault();
        film.scrollLeft = film.scrollWidth;
      }
    });
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
