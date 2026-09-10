const DATA_URL = 'data/site-data.json';

let cachedData = null;
let fetchPromise = null;

export async function loadData() {
    if (cachedData) return cachedData;
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
        try {
            const response = await fetch(DATA_URL, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            cachedData = await response.json();
            return cachedData;
        } catch (error) {
            console.warn('Failed to load external data, using fallback:', error);
            cachedData = getFallbackData();
            return cachedData;
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;
}

function getFallbackData() {
    return {
        nextMatch: {
            id: 'next-1',
            date: '2026-09-22',
            time: '16:00',
            opponent: 'Рубин Ялта',
            opponentCity: 'Ялта',
            venue: 'Стадион СОК им. 200-летия Севастополя',
            status: 'upcoming',
            score: '— : —',
            url: '/season/calendar.html'
        },
        news: [
            { id: 'n1', title: 'LEON - Вторая лига Б. 22-й тур. «Севастополь» – «Кызылташ» 2:1. МАТЧ-ЦЕНТР', excerpt: '5 сентября. 16:00. Севастополь. Стадион СОК им. 200-летия Севастополя. 720 зрителей.', date: '2026-09-05T20:26:00', category: 'Обзор матча', image: 'https://www.fcsevastopol.ru/files/news/8152-1.jpg', url: '/news/8152.html' },
            { id: 'n2', title: 'LEON - Вторая лига Б. 21-й тур. «Севастополь» – «Спартак-Нальчик» 1:0. МАТЧ-ЦЕНТР', excerpt: '29 августа. 16:00. Севастополь. Стадион СОК им. 200-летия Севастополя. 750 зрителей.', date: '2026-08-29T20:20:00', category: 'Обзор матча', image: 'https://www.fcsevastopol.ru/files/news/8145-1.jpg', url: '/news/8145.html' },
            { id: 'n3', title: 'Лига "Содружество". 15-я игровая неделя. «Авангард» – «Севастополь-2» 2:2', excerpt: 'Матч прошел в Мелитополе. Севастополь-2 дважды отыгрывал отставание.', date: '2026-09-06T17:55:00', category: 'Севастополь-2', image: 'https://www.fcsevastopol.ru/files/news/8153-1.jpg', url: '/news/8153.html' },
            { id: 'n4', title: 'Василий Смирнов назначен судьей матча «Севастополь» – «Кызылташ»', excerpt: 'Судейская бригада из Санкт-Петербурга проведет матч 22-го тура.', date: '2026-09-04T10:39:00', category: 'Новости клуба', image: 'https://www.fcsevastopol.ru/files/news/8150-1.jpg', url: '/news/8150.html' },
            { id: 'n5', title: 'Представляем соперника. «Кызылташ» (Бахчисарай)', excerpt: 'Информация о команде-сопернике перед матчем 22-го тура.', date: '2026-09-02T15:21:00', category: 'Анонс матча', image: 'https://www.fcsevastopol.ru/files/news/8148-1.jpg', url: '/news/8148.html' },
            { id: 'n6', title: 'LEON - Вторая лига Б. 22-й тур. «Севастополь» – «Кызылташ». Анонс матча', excerpt: 'Подробный обзор предстоящей встречи на стадионе СОК.', date: '2026-09-01T10:41:00', category: 'Анонс матча', image: 'https://www.fcsevastopol.ru/files/news/8147-1.jpg', url: '/news/8147.html' }
        ],
        standings: [
            { name: 'Севастополь', played: 21, won: 16, drawn: 2, lost: 3, goalsFor: 38, goalsAgainst: 17, points: 50 },
            { name: 'Шахтёр Донецк', played: 21, won: 14, drawn: 4, lost: 3, goalsFor: 42, goalsAgainst: 20, points: 46 },
            { name: 'Ростов-2', played: 21, won: 14, drawn: 4, lost: 3, goalsFor: 45, goalsAgainst: 16, points: 46 },
            { name: 'Рубин Ялта', played: 20, won: 9, drawn: 7, lost: 4, goalsFor: 29, goalsAgainst: 19, points: 34 },
            { name: 'Победа Хасавюрт', played: 20, won: 10, drawn: 3, lost: 7, goalsFor: 38, goalsAgainst: 27, points: 33 },
            { name: 'Кызылташ Бахчисарай', played: 21, won: 9, drawn: 4, lost: 8, goalsFor: 36, goalsAgainst: 30, points: 31 },
            { name: 'Нарт Черкесск', played: 20, won: 9, drawn: 3, lost: 8, goalsFor: 27, goalsAgainst: 19, points: 30 },
            { name: 'Спартак-Нальчик', played: 20, won: 7, drawn: 7, lost: 6, goalsFor: 27, goalsAgainst: 20, points: 28 },
            { name: 'Дружба Майкоп', played: 20, won: 7, drawn: 6, lost: 7, goalsFor: 23, goalsAgainst: 25, points: 27 },
            { name: 'Заря Луганск', played: 21, won: 6, drawn: 6, lost: 9, goalsFor: 24, goalsAgainst: 30, points: 24 },
            { name: 'Астрахань', played: 20, won: 5, drawn: 5, lost: 10, goalsFor: 22, goalsAgainst: 32, points: 20 },
            { name: 'Нефтяник Избербаш', played: 21, won: 6, drawn: 0, lost: 15, goalsFor: 19, goalsAgainst: 57, points: 18 },
            { name: 'Ангушт Назрань', played: 20, won: 4, drawn: 4, lost: 12, goalsFor: 9, goalsAgainst: 21, points: 16 },
            { name: 'Чайка-М', played: 21, won: 4, drawn: 2, lost: 15, goalsFor: 17, goalsAgainst: 43, points: 14 },
            { name: 'Динамо-2 Махачкала', played: 21, won: 3, drawn: 5, lost: 13, goalsFor: 19, goalsAgainst: 39, points: 14 }
        ],
        scorers: [
            { name: 'Дмитрий Иванов', position: 'Нападающий', goals: 11, photo: 'https://www.fcsevastopol.ru/files/player/4164-photo_team.jpg' },
            { name: 'Редван Османов', position: 'Нападающий', goals: 6, photo: 'https://www.fcsevastopol.ru/files/player/2454-photo_team.jpg' },
            { name: 'Вадим Зубавленко', position: 'Полузащитник', goals: 5, photo: 'https://www.fcsevastopol.ru/files/player/4471-photo_team.jpg' },
            { name: 'Максим Вертиев', position: 'Вратарь', goals: 0, photo: 'https://www.fcsevastopol.ru/files/player/4662-photo_team.jpg' },
            { name: 'Владислав Гевлич', position: 'Защитник', goals: 3, photo: 'https://www.fcsevastopol.ru/files/player/736-photo_team.jpg' },
            { name: 'Иван Петриков', position: 'Полузащитник', goals: 4, photo: '' }
        ],
        gallery: [
            { id: 'g1', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143015.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143015.jpg', alt: 'Матч Севастополь - Кызылташ', url: '/gallery/1831.html' },
            { id: 'g2', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143014.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143014.jpg', alt: 'Голы матча', url: '/gallery/1831.html' },
            { id: 'g3', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143013.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143013.jpg', alt: 'Игроки на поле', url: '/gallery/1831.html' },
            { id: 'g4', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143012.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143012.jpg', alt: 'Трибуны', url: '/gallery/1831.html' },
            { id: 'g5', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143011.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143011.jpg', alt: 'Тренерский штаб', url: '/gallery/1831.html' },
            { id: 'g6', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143010.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143010.jpg', alt: 'Фанаты', url: '/gallery/1831.html' },
            { id: 'g7', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143009.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143009.jpg', alt: 'Моменты матча', url: '/gallery/1831.html' },
            { id: 'g8', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143008.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143008.jpg', alt: 'Церемония', url: '/gallery/1831.html' },
            { id: 'g9', image: 'https://www.fcsevastopol.ru/files/gallery/1831/143007.jpg', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-143007.jpg', alt: 'Разминка', url: '/gallery/1831.html' }
        ],
        videos: [
            { id: 'v1', title: 'Голы / LEON - Вторая лига Б. 22-й тур. «Севастополь» – «Кызылташ»', date: '2026-09-05', thumb: 'https://www.fcsevastopol.ru/files/gallery/1831/sm-142974.jpg', url: '/gallery/1831.html' },
            { id: 'v2', title: 'Гол / 21-й тур. «Севастополь» – «Спартак-Нальчик»', date: '2026-08-29', thumb: 'https://www.fcsevastopol.ru/files/gallery/1828/sm-142875.jpg', url: '/gallery/1828.html' },
            { id: 'v3', title: 'Гол / 20-й тур. «Ангушт» – «Севастополь»', date: '2026-08-22', thumb: 'https://www.fcsevastopol.ru/files/gallery/1827/sm-142841.png', url: '/gallery/1827.html' },
            { id: 'v4', title: 'Обзор матча: «Севастополь» – «Астрахань» 3:4', date: '2026-08-15', thumb: 'https://www.fcsevastopol.ru/files/gallery/1825/sm-142700.jpg', url: '/gallery/1825.html' }
        ],
        partners: [
            { name: 'ВТБ', logo: 'https://www.fcsevastopol.ru/files/partners/46a352110accaf20a14035e4b76b2c86.jpg', url: 'https://www.vtb.ru' },
            { name: 'АТАН', logo: 'https://www.fcsevastopol.ru/files/partners/4b4161e302f614467fd3a083766a50a2.png', url: 'https://atan.ru/' },
            { name: 'Царь Хлеб', logo: 'https://www.fcsevastopol.ru/files/partners/6c0952576c8f51219fd2b1fb738f36de.png', url: 'https://tsarhleb.ru/' },
            { name: 'Ямато Деливери', logo: 'https://www.fcsevastopol.ru/files/partners/b95c3f694cb41e603d5dc2b68502bceb.png', url: 'https://yamato-delivery.ru/' },
            { name: 'ЛЕОН', logo: 'https://www.fcsevastopol.ru/files/partners/37cf504ba9188af78a2d61bb9f70e614.png', url: 'https://leon.ru/registration?bcode=LIGA2' },
            { name: 'AB InBev Efes', logo: 'https://www.fcsevastopol.ru/files/partners/4cbd148a6362358316e5a7607b62698d.png', url: 'https://abinbevefes.ru/' },
            { name: 'Bookmaker Ratings', logo: 'https://www.fcsevastopol.ru/files/partners/70a2fcece761220ca968333ba40a5394.png', url: 'https://bookmaker-ratings.ru/bookmakers-homepage/luchshie-bukmekerskie-kontory/' },
            { name: 'Legalbet', logo: 'https://www.fcsevastopol.ru/files/partners/88c3bcb4be8698ffc23f12ee7bb716a0.png', url: 'https://legalbet.ru/ratings/' },
            { name: '2ФНЛ', logo: 'https://www.fcsevastopol.ru/files/partners/e86a9d31f42b56173d10b6e6c15c14ee.png', url: 'https://2b.2fnl.com/' }
        ],
        birthdays: [
            { name: 'Евгений Прокопенко', role: 'Помощник главного тренера', date: '1988-09-13', photo: 'https://www.fcsevastopol.ru/files/coach/332-photo_1.jpg' },
            { name: 'Владислав Гевлич', role: 'Защитник', date: '1994-09-23', photo: 'https://www.fcsevastopol.ru/files/player/736-photo_team.jpg' },
            { name: 'Юрий Пластун', role: 'Специалист по ИКТ', date: '1961-09-24', photo: 'https://www.fcsevastopol.ru/files/coach/309-photo_1.jpg' }
        ]
    };
}