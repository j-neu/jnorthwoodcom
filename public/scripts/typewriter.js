(function () {
  const els = document.querySelectorAll('[data-typewriter]');
  if (!els.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  els.forEach((el) => {
    const full = el.dataset.typewriter || '';
    const section = el.closest('[data-typewriter-section]');
    const chars = full.split('');
    let acc = '';
    let i = 0;
    let last = Date.now();

    if (reduceMotion) {
      el.textContent = full;
      el.classList.add('is-ready');
      if (section) section.classList.add('is-typed');
      return;
    }

    el.textContent = '';
    requestAnimationFrame(() => el.classList.add('is-ready'));

    const frame = () => {
      if (Date.now() - last >= 100) {
        last = Date.now();
        if (i < chars.length) {
          acc += chars[i];
          i += 1;
          el.textContent = acc;
        }
      }
      if (i < chars.length) {
        requestAnimationFrame(frame);
      } else {
        if (section) section.classList.add('is-typed');
      }
    };
    requestAnimationFrame(frame);
  });
})();
