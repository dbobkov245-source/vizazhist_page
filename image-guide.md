# Руководство по оптимизации изображений

## Требования

- Node.js 18+ (https://nodejs.org)
- npm или yarn

## Установка зависимостей

```bash
cd /Volumes/SSD\ Storage/site_alina
npm install sharp
```

Или через yarn:
```bash
yarn add sharp
```

## Запуск конвертации

```bash
node convert-images.js
```

Скрипт выполнит:
1. **favicon.jpg** → `favicon-16.png`, `favicon-32.png`, `favicon-192.webp`, `apple-touch-icon.png`
2. **1/*.jpg** → `1/*.webp` (quality 85%)

## После конвертации

### 1. Добавьте favicon в `<head>` файла index.html:

```html
<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```

### 2. Обновите блок галереи в index.html:

Замените текущий блок `.gallery-3d-content` на:

```html
<div class="gallery-3d-content">
    <div class="gallery-3d-item"><img src="1/1.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/3.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/4.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/5.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/6.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/7.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/8.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/9.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/10.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/11.webp" alt="Образ" loading="lazy"></div>
    <div class="gallery-3d-item"><img src="1/12.webp" alt="Образ" loading="lazy"></div>
</div>
```

## Ожидаемый результат

- Экономия размера файлов: 30-60%
- Быстрая загрузка на мобильных устройствах
- Поддержка всех современных браузеров

## Устранение проблем

**Ошибка "Cannot find module 'sharp'":**
```bash
npm install sharp --save
```

**На Apple Silicon (M1/M2/M3):**
```bash
npm install --platform=darwin --arch=arm64 sharp
```

**Права доступа:**
```bash
chmod +x convert-images.js
```
