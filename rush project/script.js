// script.js — tabs + a11y + reveal (ไม่มีโหมด Landing)

document.addEventListener('DOMContentLoaded', () => {
  // ====== DOM refs ======
  const radios = Array.from(document.querySelectorAll('input[name="person"]')); // #p1, #p2
  const peopleSwitch = document.querySelector('.people-switch');
  const labelFor = id => document.querySelector(`.people-switch label[for="${id}"]`);
  const panels = { p1: document.getElementById('panel-p1'), p2: document.getElementById('panel-p2') };

  // ====== Utilities ======
  const selectPerson = (id, { focusLabel = false, updateHash = true, persist = true } = {}) => {
    const radio = document.getElementById(id);
    if (!radio) return;
    radio.checked = true;

    ['p1','p2'].forEach(k => {
      const lbl = labelFor(k);
      const selected = (k === id);
      if (lbl) {
        lbl.setAttribute('aria-selected', String(selected));
        lbl.setAttribute('tabindex', selected ? '0' : '-1');
      }
      if (panels[k]) panels[k].style.display = selected ? 'block' : 'none';
    });

    if (focusLabel) labelFor(id)?.focus();
    if (updateHash) history.replaceState(null, '', id === 'p1' ? '#panel-p1' : '#panel-p2');
    if (persist) { try { localStorage.setItem('activePerson', id); } catch {} }
  };

  const currentPersonId = () => (radios.find(r => r.checked)?.id || 'p1');

  // ====== Init: hash หรือ localStorage ======
  (() => {
    let initial = 'p1';
    if (location.hash === '#panel-p2') initial = 'p2';
    if (location.hash === '#panel-p1') initial = 'p1';
    if (!location.hash) {
      try {
        const saved = localStorage.getItem('activePerson');
        if (saved === 'p1' || saved === 'p2') initial = saved;
      } catch {}
    }
    selectPerson(initial, { focusLabel: false, updateHash: !location.hash, persist: true });
  })();

  // ====== คลิก label เพื่อสลับ ======
  ['p1', 'p2'].forEach(id => {
    labelFor(id)?.addEventListener('click', () =>
      selectPerson(id, { focusLabel: false, updateHash: true, persist: true })
    );
  });

  // ====== คีย์บอร์ดบนปุ่มสวิตช์ (role=tablist) ======
  if (peopleSwitch) {
    peopleSwitch.setAttribute('aria-orientation', 'horizontal');
    peopleSwitch.addEventListener('keydown', (e) => {
      const ids = ['p1', 'p2'];
      const idx = ids.indexOf(currentPersonId());
      let nextIdx = idx;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': nextIdx = (idx + 1) % ids.length; e.preventDefault(); break;
        case 'ArrowLeft':
        case 'ArrowUp':   nextIdx = (idx - 1 + ids.length) % ids.length; e.preventDefault(); break;
        case 'Home':      nextIdx = 0; e.preventDefault(); break;
        case 'End':       nextIdx = ids.length - 1; e.preventDefault(); break;
        default: return;
      }
      selectPerson(ids[nextIdx], { focusLabel: true, updateHash: true, persist: true });
    });
  }

  // ====== ลิงก์ target=_blank ให้ปลอดภัย ======
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    if (!rel.includes('noopener')) rel.push('noopener');
    if (!rel.includes('noreferrer')) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
  });

  // ====== aria + title ให้ progress ======
  document.querySelectorAll('progress').forEach(p => {
    const max = Number(p.getAttribute('max')) || 100;
    const val = Number(p.getAttribute('value')) || 0;
    const pct = Math.round((val / max) * 100);
    p.setAttribute('role', 'progressbar');
    p.setAttribute('aria-valuemin', '0');
    p.setAttribute('aria-valuemax', String(max));
    p.setAttribute('aria-valuenow', String(val));
    if (!p.title) p.title = `${pct}%`;
  });

  // ====== ปีในฟุตเตอร์ ======
  const small = document.querySelector('.site-footer small');
  if (small) small.textContent = (small.textContent || '').replace(/\b(20\d{2}|19\d{2})\b/, String(new Date().getFullYear()));

  // ====== hashchange ======
  window.addEventListener('hashchange', () => {
    if (location.hash === '#panel-p2') selectPerson('p2', { focusLabel: true, updateHash: false, persist: true });
    else if (location.hash === '#panel-p1') selectPerson('p1', { focusLabel: true, updateHash: false, persist: true });
  });

  // ====== Reveal on scroll ======
  (() => {
    const forceReveal = document.documentElement.dataset.reveal === 'always';
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches && !forceReveal;

    const groups = [
      { selector: '.hero', perContainer: false },
      { selector: '.cards .card', perContainer: true },
      { selector: '.projects .project', perContainer: true },
      { selector: '.steps li', perContainer: true }
    ];

    const setStagger = (nodeList) => {
      const map = new Map();
      nodeList.forEach(el => {
        const p = el.parentElement;
        if (!map.has(p)) map.set(p, []);
        map.get(p).push(el);
      });
      map.forEach((els) => els.forEach((el, i) => el.style.setProperty('--stagger', i)));
    };

    const elements = [];
    groups.forEach(g => {
      const found = Array.from(document.querySelectorAll(g.selector));
      elements.push(...found);
      if (g.perContainer) setStagger(found);
    });

    elements.forEach(el => el.classList.add('reveal'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('in-view'));
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

      elements.forEach(el => io.observe(el));
    });
  })();
});
