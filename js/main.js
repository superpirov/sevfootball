import { loadData } from './data-loader.js';

const STORAGE_KEY = 'fcsevastopol-theme';
const THEME_ATTR = 'data-theme';

function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeToggle(theme);
}

function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'dark');
    }
}

function initTheme() {
    const theme = getInitialTheme();
    applyTheme(theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute(THEME_ATTR) === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');
    const dropdownBtns = document.querySelectorAll('.header__dropdown-btn');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('is-open');
            document.body.style.overflow = expanded ? '' : 'hidden';
        });

        menu.querySelectorAll('.header__link:not(.header__dropdown-btn)').forEach(link => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!burger.contains(e.target) && !menu.contains(e.target)) {
                burger.setAttribute('aria-expanded', 'false');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);
            const parent = btn.closest('.has-dropdown');
            if (parent) parent.setAttribute('aria-expanded', !expanded);
        });
    });
}

function updateTime() {
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        const now = new Date();
        const options = { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        timeEl.textContent = now.toLocaleTimeString('ru-RU', options) + ' МСК';
    }
}

async function loadAndRender() {
    try {
        const data = await loadData();
        renderNextMatch(data.nextMatch);
        renderNews(data.news);
        renderStandings(data.standings);
        renderScorers(data.scorers);
        renderGallery(data.gallery);
        renderVideos(data.videos);
        renderPartners(data.partners);
        renderBirthdays(data.birthdays);
    } catch (error) {
        console.error('Failed to load data:', error);
        renderFallbacks();
    }
}

function renderNextMatch(match) {
    const scoreEl = document.getElementById('nextMatchScore');
    const dateEl = document.getElementById('nextMatchDateTime');
    const opponentEl = document.getElementById('nextMatchOpponent');
    const opponentCityEl = document.getElementById('nextMatchOpponentCity');
    const venueEl = document.getElementById('nextMatchVenue');
    const statusEl = document.querySelector('#nextMatchCard .match-card__status');
    const linkEl = document.querySelector('#nextMatchCard .match-card__link');

    if (match) {
        if (scoreEl) scoreEl.textContent = match.score || '— : —';
        if (dateEl) dateEl.textContent = formatMatchDate(match.date, match.time);
        if (opponentEl) opponentEl.textContent = match.opponent;
        if (opponentCityEl) opponentCityEl.textContent = match.opponentCity;
        if (venueEl) venueEl.textContent = match.venue;
        if (statusEl) {
            statusEl.textContent = getMatchStatusLabel(match.status);
            statusEl.className = `match-card__status match-card__status--${match.status}`;
        }
        if (linkEl) linkEl.href = match.url || '#';
    }
}

function getMatchStatusLabel(status) {
    const labels = { upcoming: 'Предстоит', live: 'В прямом эфире', finished: 'Завершен' };
    return labels[status] || 'Предстоит';
}

function formatMatchDate(dateStr, timeStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let result = date.toLocaleDateString('ru-RU', options);
    if (timeStr) result += `, ${timeStr}`;
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function renderNews(news) {
    const grid = document.getElementById('newsGrid');
    if (!grid || !news?.length) return;

    grid.innerHTML = news.slice(0, 6).map(item => `
        <article class="news-card" role="listitem">
            <div class="news-card__image">
                ${item.image ? `<img src="${item.image}" alt="" loading="lazy">` : '<div class="placeholder"></div>'}
            </div>
            <div class="news-card__content">
                <div class="news-card__meta">
                    ${item.category ? `<span class="news-card__category">${item.category}</span>` : ''}
                    <time datetime="${item.date}">${formatNewsDate(item.date)}</time>
                </div>
                <h3 class="news-card__title"><a href="${item.url}">${item.title}</a></h3>
                <p class="news-card__excerpt">${item.excerpt}</p>
            </div>
        </article>
    `).join('');
}

function formatNewsDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderStandings(standings) {
    const tbody = document.getElementById('standingsBody');
    if (!tbody || !standings?.length) return;

    tbody.innerHTML = standings.map((team, index) => {
        const pos = index + 1;
        let rowClass = '';
        if (pos === 1) rowClass = 'champion';
        else if (pos >= standings.length - 1) rowClass = 'relegation';

        return `
            <tr class="${rowClass}">
                <td class="standings__col--pos">${pos}</td>
                <td class="standings__col--team">
                    <div class="standings-team">
                        <div class="standings-team__crest" aria-hidden="true"></div>
                        <span class="standings-team__name">${team.name}</span>
                    </div>
                </td>
                <td class="standings__col--played">${team.played}</td>
                <td class="standings__col--record">${team.won}/${team.drawn}/${team.lost}</td>
                <td class="standings__col--goals">${team.goalsFor}-${team.goalsAgainst}</td>
                <td class="standings__col--pts">${team.points}</td>
            </tr>
        `;
    }).join('');
}

function renderScorers(scorers) {
    const grid = document.getElementById('scorersGrid');
    if (!grid || !scorers?.length) return;

    grid.innerHTML = scorers.slice(0, 6).map((scorer, index) => `
        <article class="scorer-card" role="listitem" style="--rank: ${index + 1};">
            <span class="scorer-card__rank">${index + 1}</span>
            ${scorer.photo ? `<img src="${scorer.photo}" alt="" class="scorer-card__photo" loading="lazy">` : '<div class="scorer-card__photo" style="display:flex;align-items:center;justify-content:center;font-size:2rem;">⚽</div>'}
            <h4 class="scorer-card__name">${scorer.name}</h4>
            <p class="scorer-card__position">${scorer.position}</p>
            <span class="scorer-card__goals">${scorer.goals} гол${scorer.goals === 1 ? '' : scorer.goals < 5 ? 'а' : 'ов'}</span>
        </article>
    `).join('');
}

function renderGallery(items) {
    const grid = document.getElementById('galleryGrid');
    if (!grid || !items?.length) return;

    grid.innerHTML = items.slice(0, 9).map(item => `
        <figure class="gallery-item" role="listitem">
            <a href="${item.url || item.image}" target="_blank" rel="noopener">
                <img src="${item.thumb || item.image}" alt="${item.alt || 'Фото'}" loading="lazy">
            </a>
        </figure>
    `).join('');
}

function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid || !videos?.length) return;

    grid.innerHTML = videos.slice(0, 4).map(video => `
        <article class="video-card" role="listitem">
            <div class="video-card__thumb">
                ${video.thumb ? `<img src="${video.thumb}" alt="" loading="lazy">` : '<div class="placeholder"></div>'}
                <div class="video-card__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div class="video-card__content">
                <h4 class="video-card__title"><a href="${video.url}">${video.title}</a></h4>
                <p class="video-card__meta">${formatNewsDate(video.date)}</p>
            </div>
        </article>
    `).join('');
}

function renderPartners(partners) {
    const grid = document.getElementById('partnersGrid');
    if (!grid || !partners?.length) return;

    grid.innerHTML = partners.map(partner => `
        <a href="${partner.url}" target="_blank" rel="noopener" class="partner-link" role="listitem" aria-label="${partner.name}">
            ${partner.logo ? `<img src="${partner.logo}" alt="${partner.name}" class="partner-logo" loading="lazy">` : `<span>${partner.name}</span>`}
        </a>
    `).join('');
}

function renderBirthdays(birthdays) {
    const grid = document.getElementById('birthdaysGrid');
    if (!grid || !birthdays?.length) return;

    grid.innerHTML = birthdays.slice(0, 6).map(person => `
        <article class="birthday-card" role="listitem">
            ${person.photo ? `<img src="${person.photo}" alt="" class="birthday-card__photo" loading="lazy">` : '<div class="birthday-card__photo" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;">👤</div>'}
            <h4 class="birthday-card__name">${person.name}</h4>
            <p class="birthday-card__role">${person.role}</p>
            <span class="birthday-card__date">${formatBirthday(person.date)}</span>
        </article>
    `).join('');
}

function formatBirthday(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function renderFallbacks() {
    const placeholders = {
        'newsGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Новости загружаются...</p>',
        'standingsBody': '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--color-text-muted);">Таблица загружается...</td></tr>',
        'scorersGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Бомбардиры загружаются...</p>',
        'galleryGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Фото загружаются...</p>',
        'videoGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Видео загружаются...</p>',
        'partnersGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Партнеры загружаются...</p>',
        'birthdaysGrid': '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Дни рождения загружаются...</p>'
    };

    Object.entries(placeholders).forEach(([id, html]) => {
        const el = document.getElementById(id);
        if (el && !el.innerHTML.trim()) el.innerHTML = html;
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section > .container > *').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.documentElement.style.cssText += `
        .is-visible { opacity: 1 !important; transform: translateY(0) !important; }
    `;
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });
}

function registerSW() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    updateTime();
    setInterval(updateTime, 1000);
    loadAndRender();
    initScrollAnimations();
    initSmoothScroll();
    registerSW();
});

export { applyTheme, getInitialTheme };