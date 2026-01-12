# CLAUDE.md — История изменений проекта

## Описание проекта
Landing page для визажиста-стилиста Алины (г. Россошь).

## Структура файлов
- `index.html` — основная разметка
- `styles.css` — стили с CSS-переменными в `:root`
- `script.js` — логика (Hero Zoom, 3D Gallery, Mobile Menu, Canvas Animation)
- `convert-images.js` — скрипт конвертации изображений в WebP
- `image-guide.md` — инструкция по конвертации

## Священный код (НЕ ИЗМЕНЯТЬ)
**script.js: функция `renderLoop()` в модуле 3D Gallery**
- Математика после строки `scrollPos -= CONFIG.speed`
- Расчёты: `wrappedX`, `distFromCenter`, `scale`, `rotateY`, `opacity`, `zIndex`
- Матричные трансформации в `item.style.transform`

**styles.css: значения CSS-переменных в `:root`**
- Можно использовать переменные, нельзя менять их значения

---

## Выполненные изменения

### 2024-01 — Сессия 1

#### 1. Конвертация изображений в WebP
- Создан `convert-images.js` — Node.js скрипт с использованием sharp
- Создан `image-guide.md` — инструкция по запуску
- Конвертированы favicon и 11 изображений галереи (экономия 9-42%)
- Добавлены favicon-ссылки в `<head>`:
  - `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`
- Галерея обновлена на `.webp` формат
- Добавлены новые изображения: 5, 11, 12

#### 2. Секция «Боли» (Pains)
- Добавлены иконки `.pains__icon` с градиентом
- Добавлена анимация появления `.fade-up` при скролле
- Добавлен IntersectionObserver для анимации

#### 3. Telegram-ссылки
- Добавлена ссылка в Header (иконка рядом с CTA)
- Добавлена ссылка в Mobile Menu
- Добавлена ссылка в Footer с иконкой
- Username: @aalevtinkaa

#### 4. Адаптивный Footer
- `.footer__links` — колонка на мобильных, строка на десктопе
- Адрес обёрнут в ссылку на Яндекс.Карты

#### 5. Hero Zoom — синхронизация с прокруткой
- `hero-wrapper` height: 250vh (оптимальный диапазон)
- Зум завершается на 90% прокрутки
- Fadeout портрета: 90%–100% (синхронизирован с концом секции)
- Линейный прогресс для точной синхронизации со скроллом

#### 6. Удалённые элементы
- Кнопка «Записаться» из Hero-секции
- Пауза галереи при наведении курсора (не понравилось)

#### 7. SEO-оптимизация
- **Title**: «Визажист в Россоши — макияж и обучение | Алина»
- **Description**: «Визажист-стилист в Россоши. Макияж для свадьбы, фотосессий и мероприятий + обучение визажу с нуля. Запись в WhatsApp и Telegram.»
- **Meta-теги**: keywords, author, robots, Open Graph, Twitter Cards
- **sitemap.xml**: карта сайта для поисковиков
- **robots.txt**: правила индексации
- **Schema.org**: структурированные данные
  - BeautySalon — информация о салоне/мастере
  - Service — услуги с ценами
  - Course — курс обучения

**⚠️ ВАЖНО**: Замените `YOUR-DOMAIN.ru` на реальный домен в файлах:
- `index.html` (Schema.org, Open Graph)
- `sitemap.xml`
- `robots.txt`

---

## Интеграции
- **WhatsApp**: +7 939 775-34-03
- **Telegram**: @aalevtinkaa
- **Instagram**: @aalevtinkaa
- **Яндекс.Карты**: Россошь, ул. Малиновского, 25а

---

## Технические заметки

### Hero Zoom логика (script.js)
```javascript
// Ключевые параметры:
- rawProgress: 0–1 (линейный прогресс скролла)
- zoomProgress: rawProgress / 0.9 (зум завершается на 90%)
- fadeout: начинается на 90%, заканчивается на 100%
```

### 3D Gallery (script.js)
```javascript
// CONFIG:
- speed: 0.8 (пикселей за кадр)
- cardWidth: 460px (desktop), 75vw (mobile)
- gap: 60px (desktop), 20px (mobile)
- rotationMax: 50 (градусов)
- scaleMin: 0.5 (масштаб на краях)
```

---

## TODO / Отложено
- [ ] Step 2: Parallax Curtain Effect — требует более сложного подхода, пока отложено
