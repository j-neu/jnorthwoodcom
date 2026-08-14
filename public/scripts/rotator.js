(function () {
  const els = document.querySelectorAll('[data-rotator]');
  if (!els.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  els.forEach((el) => {
    let words = [];
    try {
      words = JSON.parse(el.dataset.words || '[]');
    } catch (e) {
      words = [];
    }
    if (!words.length) return;

    const wordEl = el.querySelector('.rotator-word');
    if (!wordEl) return;

    let i = 0;
    const apply = (idx) => {
      wordEl.style.color = words[idx].color || '';
      wordEl.textContent = words[idx].word;
    };
    apply(0);

    const stabilizeHeight = () => {
      let max = 0;
      const first = wordEl.textContent;
      words.forEach((w) => {
        wordEl.textContent = w.word;
        max = Math.max(max, el.offsetHeight);
      });
      wordEl.textContent = first;
      el.style.minHeight = max + 'px';
    };
    if (reduceMotion) return;
    stabilizeHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(stabilizeHeight);
    }
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(stabilizeHeight, 100);
    });

    let last = Date.now();
    const frame = () => {
      if (Date.now() - last >= 3000) {
        last = Date.now();
        wordEl.classList.add('rotator-word--fade');
        setTimeout(() => {
          i = (i + 1) % words.length;
          apply(i);
          wordEl.classList.remove('rotator-word--fade');
        }, 750);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
})();
