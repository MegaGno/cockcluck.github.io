// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Animated bar fills
  const bars = document.querySelectorAll('.bar-fill[data-value]');
  if ('IntersectionObserver' in window && bars.length){
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const el = entry.target;
          el.style.width = el.dataset.value + '%';
          barIO.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(el => { el.style.width = '0%'; barIO.observe(el); });
  } else {
    bars.forEach(el => { el.style.width = el.dataset.value + '%'; });
  }

  // Animated gauges (SVG ring, data-score 0-100)
  const gauges = document.querySelectorAll('.gauge[data-score]');
  gauges.forEach(g => {
    const score = parseFloat(g.dataset.score) || 0;
    const circle = g.querySelector('.gauge-fill');
    if (!circle) return;
    const r = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * r;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    const setOffset = () => {
      const offset = circumference - (score / 100) * circumference;
      circle.style.transition = 'stroke-dashoffset 1.1s ease';
      circle.style.strokeDashoffset = `${offset}`;
    };
    if ('IntersectionObserver' in window){
      const gIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){ setOffset(); gIO.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      gIO.observe(g);
    } else {
      setOffset();
    }
  });
});
