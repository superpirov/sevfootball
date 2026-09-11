const DATA_URL = './data/site-data.json';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadData() {
  try {
    const r = await fetch(DATA_URL, { cache: 'no-store' });
    if (!r.ok) throw 0;
    return await r.json();
  } catch { return null; }
}

/* theme — dark by default */
function initTheme() {
  const root = document.documentElement, fab = $('#themeFab');
  const saved = localStorage.getItem('fcs-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  fab.textContent = saved === 'dark' ? '☾' : '☀';
  fab.setAttribute('aria-pressed', saved === 'dark');
  fab.onclick = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('fcs-theme', next);
    fab.textContent = next === 'dark' ? '☾' : '☀';
  };
}

function initMenu() {
  const b = $('.burger'), m = $('#mainMenu');
  b.onclick = () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); };
  $$('#mainMenu a').forEach(a => a.onclick = () => m.classList.remove('open'));
}

function initClock() {
  const el = $('#clock'); if (!el) return;
  const f = () => { try { el.textContent = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' }) + ' МСК · Москва'; } catch { } };
  f(); setInterval(f, 30000);
}

function initCountdown(dateISO) {
  const t = new Date(dateISO).getTime();
  const D = $('#cdD'), H = $('#cdH'), M = $('#cdM'), S = $('#cdS'), L = $('#countdownLabel');
  const tick = () => {
    let d = t - Date.now();
    if (d <= 0) { if (L) L.textContent = 'Матч уже начался — поддержи команду на СОК!'; d = 0; }
    const dd = Math.floor(d / 864e5), hh = Math.floor(d / 36e5) % 24, mm = Math.floor(d / 6e4) % 60, ss = Math.floor(d / 1e3) % 60;
    if (D) D.textContent = String(dd).padStart(2, '0');
    if (H) H.textContent = String(hh).padStart(2, '0');
    if (M) M.textContent = String(mm).padStart(2, '0');
    if (S) S.textContent = String(ss).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
}

const fdate = iso => { try { return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return ''; } };
const fshort = iso => { try { return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }); } catch { return ''; } };

function renderTicker(items = []) {
  const w = $('#tickerInner'); if (!w || !items.length) return;
  w.innerHTML = [...items, ...items].map(t => `<span>${esc(t)}</span>`).join('');
}

function renderHeroStats(stats = []) {
  const w = $('#heroStats'); if (!w) return;
  w.innerHTML = stats.map(s => `<div class="hstat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
}

function renderLastGoals(goals = []) {
  const w = $('#lastGoals'); if (!w) return;
  w.innerHTML = goals.map(g => `<div>⚽ ${g.minute}′ — <b>${esc(g.player)}</b></div>`).join('');
}

let CAL = [];
function renderCal(filter = 'all') {
  const w = $('#calGrid'); if (!w) return;
  const list = CAL.filter(m => filter === 'all' || m.status === filter);
  w.innerHTML = list.map(m => {
    const score = m.status === 'finished' ? `<b>${m.hs}:${m.as}</b>` : '<b>–:–</b>';
    const when = m.status === 'finished' ? fdate(m.date) : `${fshort(m.date)}${m.time ? ' · ' + m.time : ''}`;
    return `<article class="cal cal--${m.status}">
      <div class="cal__top"><span>${esc(m.tour)}${m.note ? ' · ' + esc(m.note) : ''}</span><span class="st st--${m.status}">${m.status === 'finished' ? 'Сыгран' : 'Скоро'}</span></div>
      <p class="cal__match">${esc(m.home)} ${score} ${esc(m.away)}</p>
      <p class="cal__meta">${when}</p>
      <a class="cal__link" href="${esc(m.url)}" target="_blank" rel="noopener">${m.status === 'finished' ? 'Отчёт →' : 'Билеты / детали →'}</a>
    </article>`;
  }).join('') || '<p class="hint">Нет матчей.</p>';
}

function renderNews(news = []) {
  const w = $('#newsGrid'); if (!w) return;
  w.innerHTML = news.map((n, i) => `<article class="ncard${i === 0 ? ' ncard--top' : ''} reveal">
    <div class="ncard__img"><img src="${esc(n.image)}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'"></div>
    <div class="ncard__body"><div class="ncard__meta"><span class="cat">${esc(n.category)}</span><time>${fdate(n.date)}</time></div>
    <h3><a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p></div>
  </article>`).join('');
}

function renderTable(rows = []) {
  const w = $('#standingsBody'); if (!w) return;
  w.innerHTML = rows.map((t, i) => `<tr class="${t.me ? 'me' : ''}">
    <td>${i + 1}</td><td><b>${esc(t.name)}</b> <span style="color:var(--dim);font-size:.78rem">${esc(t.city || '')}</span></td>
    <td>${t.played}</td><td>${t.won}/${t.drawn}/${t.lost}</td><td>${t.goalsFor}–${t.goalsAgainst}</td><td><b>${t.points}</b></td>
    <td>${(t.form || []).map(x => `<i class="f f--${x.toLowerCase()}">${x}</i>`).join('')}</td></tr>`).join('');
}

function renderScorers(list = []) {
  const w = $('#scorersList'); if (!w) return;
  w.innerHTML = list.map((s, i) => `<div class="scorer"><span class="scorer__rank">${i + 1}</span>
    <img src="${esc(s.photo)}" alt="" loading="lazy" onerror="this.style.display='none'">
    <div><b>№${s.number} · ${esc(s.name)}</b><small>${esc(s.position)}${s.assists ? ' · ' + s.assists + ' голевых' : ''}</small></div>
    <span class="scorer__g">${s.goals} ⚽</span></div>`).join('');
}

let SQUAD = [];
function renderSquad(f = 'all') {
  const w = $('#squadGrid'); if (!w) return;
  w.innerHTML = SQUAD.filter(p => f === 'all' || p.group === f).map(p =>
    `<article class="player reveal"><div class="player__ph"><span class="player__num">${p.number}</span>
    <img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div>
    <div class="player__body"><b>${esc(p.name)}</b><small>${esc(p.pos)}</small></div></article>`).join('');
  observeReveals();
}

function renderTimeline(items = []) {
  const w = $('#timeline'); if (!w) return;
  w.innerHTML = items.map(t => `<li><span class="yr">${esc(t.year)}</span><b>${esc(t.title)}</b><p>${esc(t.text)}</p></li>`).join('');
}

function renderStadium(s) {
  const w = $('#stadSpecs'); if (!w || !s) return;
  w.innerHTML = [['Вместимость', s.capacity], ['Поле', s.pitch], ['Освещение', s.light], ['Адрес', s.address], ['Телефон', s.phone], ['Дерби', 'Рубин Ялта · 22.09']]
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
}

function renderTickets(list = []) {
  const w = $('#ticketCards'); if (!w) return;
  w.innerHTML = list.map(t => `<div class="ticket${t.hit ? ' ticket--hit' : ''}">${t.hit ? '<span class="ticket__hit">ХИТ</span>' : ''}
    <b>${esc(t.name)}</b><span class="ticket__price">${esc(t.price)}</span><p>${esc(t.text)}</p></div>`).join('');
}

function renderMedia(d) {
  const ph = $('#photoPanel'), vd = $('#videoPanel'); if (!ph || !vd) return;
  ph.innerHTML = (d.gallery || []).map(g => `<a class="shot" href="${esc(g.url)}" target="_blank" rel="noopener"><img src="${esc(g.thumb || g.image)}" alt="${esc(g.alt || '')}" loading="lazy"><span>${esc(g.alt || 'Фото')}</span></a>`).join('');
  vd.innerHTML = (d.videos || []).map(v => `<a class="vid" href="${esc(v.url)}" target="_blank" rel="noopener"><span class="vid__play">▶</span><img src="${esc(v.thumb)}" alt="" loading="lazy"><div><b>${esc(v.title)}</b><small>${fdate(v.date)} · Rutube</small></div></a>`).join('');
}

function renderPartners(list = []) {
  const w = $('#partnersRow'); if (!w) return;
  w.innerHTML = list.map(p => `<a class="partner" href="${esc(p.url)}" target="_blank" rel="noopener"><img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy"><span><b>${esc(p.name)}</b><br><small>${esc(p.tier || '')}</small></span></a>`).join('');
}

function renderContacts(c) {
  const w = $('#contactList'); if (!w || !c) return;
  w.innerHTML = [['Организация', esc(c.org)], ['Адрес', esc(c.address)], ['Телефон', esc(c.phone)],
    ['E-mail', `<a href="mailto:${c.email}">${c.email}</a>`], ['Пресс-атташе', `<a href="mailto:${c.press}">${c.press}</a>`],
    ['Билеты', `<a href="${c.tickets}" target="_blank" rel="noopener">Kassa24 →</a>`]]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function observeReveals() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), { threshold: .08 });
  $$('.reveal:not(.vis)').forEach(el => io.observe(el));
}

function initFilters() {
  $$('[data-cal]').forEach(b => b.onclick = () => { $$('[data-cal]').forEach(x => { x.classList.remove('chip--active'); x.setAttribute('aria-selected', 'false'); }); b.classList.add('chip--active'); b.setAttribute('aria-selected', 'true'); renderCal(b.dataset.cal); });
  $$('[data-pos]').forEach(b => b.onclick = () => { $$('[data-pos]').forEach(x => { x.classList.remove('chip--active'); x.setAttribute('aria-selected', 'false'); }); b.classList.add('chip--active'); b.setAttribute('aria-selected', 'true'); renderSquad(b.dataset.pos); });
  $$('[data-media]').forEach(b => b.onclick = () => {
    $$('[data-media]').forEach(x => { x.classList.remove('chip--active'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('chip--active'); b.setAttribute('aria-selected', 'true');
    const v = b.dataset.media === 'video';
    $('#photoPanel').hidden = v; $('#videoPanel').hidden = !v;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme(); initMenu(); initClock(); initFilters();
  $('#toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  $('#nlForm').addEventListener('submit', e => { e.preventDefault(); $('#nlMsg').textContent = 'Готово! Первый дайджест придёт после дерби 22.09. ⚽'; e.target.reset(); });

  const d = await loadData();
  if (!d) { $('#newsGrid').innerHTML = '<p class="hint">Не удалось загрузить data/site-data.json — проверьте GitHub Pages.</p>'; return; }

  renderTicker(d.ticker); renderHeroStats(d.stats); renderLastGoals(d.lastMatch?.goals);
  CAL = d.calendar || []; renderCal();
  renderNews(d.news); renderTable(d.standings); renderScorers(d.scorers);
  if (d.coach) { $('#coachName').textContent = d.coach.name; $('#coachNote').textContent = d.coach.note; }
  SQUAD = d.squad || []; renderSquad();
  renderTimeline(d.timeline); renderStadium(d.stadium); renderTickets(d.tickets);
  renderMedia(d); renderPartners(d.partners); renderContacts(d.contacts);
  initCountdown(d.nextMatch?.date ? d.nextMatch.date + 'T' + (d.nextMatch.time || '16:00') + ':00+03:00' : '2026-09-22T16:00:00+03:00');
  observeReveals();
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => { }));
});
