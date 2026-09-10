// ===== UI-логика сайта ФК «Севастополь» =====

// ---------- Хелперы ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2);

// ---------- Бургер-меню ----------
const burger = $('#burger');
const nav = $('#nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
});
$$('.nav__link, .fan-cta').forEach(l => l.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.classList.remove('is-active');
}));

// ---------- Шапка: тень при скролле ----------
const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 24), { passive: true });

// ---------- Обратный отсчёт до матча ----------
(function countdown() {
  const el = $('#countdown');
  if (!el) return;
  const target = new Date(el.dataset.nextMatch).getTime();
  const pad = n => String(n).padStart(2, '0');
  const set = (id, v) => { const n = $(id); if (n) n.textContent = pad(v); };
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      set('#cd-days', 0); set('#cd-hours', 0); set('#cd-mins', 0); set('#cd-secs', 0);
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor(diff % 864e5 / 36e5);
    const m = Math.floor(diff % 36e5 / 6e4);
    const s = Math.floor(diff % 6e4 / 1e3);
    set('#cd-days', d); set('#cd-hours', h); set('#cd-mins', m); set('#cd-secs', s);
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------- Матчи ----------
(function renderMatches() {
  const up = $('#upcoming-list');
  if (up) up.innerHTML = UPCOMING.map(m => `
    <article class="match-card glass">
      <div class="match-card__meta">
        <span>${m.date} · ${m.time}</span>
        <span class="match-card__where ${m.homeGame ? 'home' : 'away'}">${m.homeGame ? 'Дома' : 'В гостях'}</span>
      </div>
      <div class="match-card__teams">
        <span class="${m.home === 'Севастополь' ? 'is-us' : ''}">${m.home}</span>
        <b class="match-card__vs">–</b>
        <span class="${m.away === 'Севастополь' ? 'is-us' : ''}">${m.away}</span>
      </div>
    </article>`).join('');

  const res = $('#results-list');
  if (res) res.innerHTML = RESULTS.map(r => {
    const us = r.home === 'Севастополь';
    const our = us ? r.hs : r.as;
    const their = us ? r.as : r.hs;
    const mark = our > their ? 'W' : our < their ? 'L' : 'D';
    return `
    <article class="result-card glass">
      <div class="result-card__badge result-card__badge--${mark}">${mark}</div>
      <div class="result-card__body">
        <div class="result-card__teams">
          <span class="${us ? 'is-us' : ''}">${r.home}</span>
          <b>${r.hs}:${r.as}</b>
          <span class="${!us ? 'is-us' : ''}">${r.away}</span>
        </div>
        <small>${r.date} · ${r.tour}</small>
      </div>
    </article>`;
  }).join('');
})();

// ---------- Турнирная таблица ----------
(function renderTable() {
  const body = $('#league-body');
  if (!body) return;
  body.innerHTML = STANDINGS.map((row, i) => {
    const place = i + 1;
    const cls = row.team === 'Севастополь' ? ' is-us' : '';
    const zone = place === 1 ? ' class="promo"' : '';
    return `<tr${cls}><td>${place}</td><td>${row.team}</td><td>${row.played}</td><td><b>${row.pts}</b></td></tr>`;
  }).join('');
})();

// ---------- Состав ----------
(function renderSquad() {
  const grid = $('#squad-grid');
  if (!grid) return;
  const draw = (filter = 'all') => {
    const list = PLAYERS.filter(p => filter === 'all' || p.pos === filter);
    grid.innerHTML = list.map(p => `
      <article class="player glass" data-pos="${p.pos}">
        <div class="player__num">${p.n}</div>
        <div class="player__avatar"><span>${initials(p.name)}</span></div>
        <h4 class="player__name">${p.name}</h4>
        <span class="player__pos">${POS_LABELS[p.pos]}</span>
      </article>`).join('');
    requestAnimationFrame(() => $$('.player', grid).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 30, 300)}ms`;
      el.classList.add('is-in');
    }));
  };
  draw();
  $$('#pos-filters .chip').forEach(btn => btn.addEventListener('click', () => {
    $$('#pos-filters .chip').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    draw(btn.dataset.pos);
  }));
})();

// ---------- Новости ----------
(function renderNews() {
  const grid = $('#news-grid');
  if (!grid) return;
  grid.innerHTML = NEWS.map((n, i) => `
    <article class="news-card glass reveal ${n.featured ? 'news-card--featured' : ''}" style="transition-delay:${i * 80}ms">
      <div class="news-card__top">
        <span class="news-card__tag">${n.tag}</span>
        <time>${n.date}</time>
      </div>
      <h4>${n.title}</h4>
      <p>${n.text}</p>
    </article>`).join('');
})();

// ---------- Счётчики в hero ----------
(function counters() {
  const nums = $$('.stat__num');
  const animate = (el) => {
    const target = +el.dataset.count;
    if (el.dataset.plain) { el.textContent = target; return; }
    const dur = 1200, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();

// ---------- Reveal-анимации при скролле ----------
(function reveals() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));
})();
