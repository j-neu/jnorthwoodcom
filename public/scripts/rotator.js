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

    if (reduceMotion) return;

    let last = Date.now();
    const frame = () => {
      if (Date.now() - last >= 1000) {
        last = Date.now();
        wordEl.classList.add('rotator-word--fade');
        setTimeout(() => {
          i = (i + 1) % words.length;
          apply(i);
          wordEl.classList.remove('rotator-word--fade');
        }, 250);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
})();
