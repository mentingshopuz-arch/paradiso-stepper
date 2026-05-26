document.addEventListener('DOMContentLoaded', function() {
  // Language switcher
  const langButtons = document.querySelectorAll('[data-lang-btn]');
  function setLang(lang) {
    document.documentElement.lang = lang;
    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.langBtn === lang));
    document.querySelectorAll('[data-uz][data-ru]').forEach(el => {
      el.innerHTML = el.dataset[lang];
    });
  }
  langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.langBtn)));
  setLang('uz');

  // Facebook Pixel tracking proxy (Assuming fbq is loaded externally)
  function payload() {
    return {
      content_name: 'Corsa Stepper Pro',
      content_ids: ['stepper-pro'],
      content_type: 'product',
      value: 490000,
      currency: 'UZS'
    };
  }

  if (window.fbq) {
    fbq('track', 'ViewContent', payload());
  }
  
  document.querySelectorAll('.btn-uzum').forEach(btn => btn.addEventListener('click', (e) => {
    if (window.fbq) fbq('track', 'InitiateCheckout', payload());
    var url = btn.getAttribute('href');
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("Instagram") > -1 || ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1) && /android/i.test(ua)) {
      e.preventDefault();
      var intentUrl = "intent://" + url.replace(/^https?:\/\//, '') + "#Intent;scheme=https;package=uz.uzum.app;end";
      window.location.href = intentUrl;
    }
  }));
  
  document.querySelectorAll('.social-pill').forEach(link => link.addEventListener('click', () => {
    if (window.fbq) fbq('track', 'Contact');
  }, { passive: true }));

  // Gallery Modal
  const galleryButtons = [...document.querySelectorAll('[data-popup-img]')];
  const galleryModal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = galleryModal ? galleryModal.querySelector('.modal-close') : null;
  const prevImage = document.getElementById('prevImage');
  const nextImage = document.getElementById('nextImage');
  let currentIndex = 0;

  function openGallery(i) {
    currentIndex = i;
    modalImage.src = galleryButtons[currentIndex].dataset.popupImg;
    galleryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    galleryModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function changeImage(step) {
    currentIndex = (currentIndex + step + galleryButtons.length) % galleryButtons.length;
    modalImage.src = galleryButtons[currentIndex].dataset.popupImg;
  }

  galleryButtons.forEach((btn, i) => btn.addEventListener('click', () => openGallery(i)));
  
  if (modalClose) modalClose.addEventListener('click', closeGallery);
  
  if (galleryModal) galleryModal.addEventListener('click', e => {
    if (e.target === galleryModal) closeGallery();
  });
  
  if (prevImage) prevImage.addEventListener('click', () => changeImage(-1));
  if (nextImage) nextImage.addEventListener('click', () => changeImage(1));

  // Sticky CTA and Mini Video
  const stickyCta = document.getElementById('stickyCta');
  const stickyMiniVideo = document.getElementById('stickyMiniVideo');
  const stickyMiniVideoEl = document.getElementById('stickyMiniVideoEl');
  const stickyMiniVideoOpen = document.getElementById('stickyMiniVideoOpen');
  const stickyMiniVideoClose = document.getElementById('stickyMiniVideoClose');
  const showcase = document.querySelector('.showcase');
  let openedFromStickyMiniVideo = false;

  function hideStickyMiniVideoForever() {
    if (!stickyMiniVideo) return;
    stickyMiniVideo.classList.remove('show');
    stickyMiniVideo.classList.add('hidden-forever');
    if (stickyMiniVideoEl) stickyMiniVideoEl.pause();
  }

  function updateSticky() {
    if (!showcase) return;
    const show = showcase.getBoundingClientRect().bottom <= Math.max(0, window.innerHeight * .02);
    if (stickyCta) stickyCta.classList.toggle('show', show);
    if (stickyMiniVideo && !stickyMiniVideo.classList.contains('hidden-forever')) {
      stickyMiniVideo.classList.toggle('show', show);
      if (show && stickyMiniVideoEl) {
        stickyMiniVideoEl.play().catch(() => {});
      }
    }
  }

  window.addEventListener('scroll', updateSticky, { passive: true });
  window.addEventListener('resize', updateSticky, { passive: true });
  window.addEventListener('orientationchange', updateSticky, { passive: true });
  updateSticky();

  // Video Modal
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const videoClose = videoModal ? videoModal.querySelector('.video-close') : null;
  const openVideoInline = document.getElementById('openVideoInline');
  const inlineVideo = document.getElementById('inlineVideo');

  function openVideoModal(fromSticky = false) {
    openedFromStickyMiniVideo = !!fromSticky;
    if (!videoModal || !modalVideo) return;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    try {
      if (inlineVideo && inlineVideo.currentTime) modalVideo.currentTime = inlineVideo.currentTime;
    } catch (_) {}
    modalVideo.play().catch(() => {});
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideo) return;
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
    modalVideo.pause();
    if (openedFromStickyMiniVideo) {
      hideStickyMiniVideoForever();
      openedFromStickyMiniVideo = false;
    }
  }

  if (openVideoInline) openVideoInline.addEventListener('click', () => openVideoModal(false));
  if (stickyMiniVideoOpen) stickyMiniVideoOpen.addEventListener('click', () => openVideoModal(true));
  if (stickyMiniVideoClose) stickyMiniVideoClose.addEventListener('click', e => {
    e.stopPropagation();
    hideStickyMiniVideoForever();
  });
  if (videoClose) videoClose.addEventListener('click', closeVideoModal);
  if (videoModal) videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeVideoModal();
  });

  if (inlineVideo) {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) inlineVideo.play().catch(() => {});
        else inlineVideo.pause();
      });
    }, { threshold: .35, rootMargin: '120px 0px' }) : null;
    
    if (io) io.observe(inlineVideo);
  }
});
