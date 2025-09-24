// home.js — reveal สำหรับหน้า Landing + อัปเดตปี

document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const small = document.querySelector('.site-footer small');
  if (small) small.textContent = (small.textContent || '').replace(/\b(20\d{2}|19\d{2})\b/, String(new Date().getFullYear()));

  // reveal
  (() => {
    const forceReveal = document.documentElement.dataset.reveal === 'always';
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches && !forceReveal;

    const cards = Array.from(document.querySelectorAll('.landing-card'));
    // set stagger
    cards.forEach((el, i) => el.style.setProperty('--stagger', i));

    cards.forEach(el => el.classList.add('reveal'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      cards.forEach(el => el.classList.add('in-view'));
      return;
    }

    requestAnimationFrame(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

      cards.forEach(el => io.observe(el));
    });
  })();
});
