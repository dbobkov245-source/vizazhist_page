/**
 * Скрипт конвертации изображений для проекта
 * Конвертирует .jpg/.png в .webp для оптимизации
 *
 * Установка: npm install sharp
 * Запуск: node convert-images.js
 */

const fs = require('fs');
const path = require('path');

// Проверка наличия sharp
let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    console.error('\n❌ Модуль sharp не установлен!');
    console.error('Установите его командой:\n');
    console.error('  npm install sharp\n');
    console.error('Или используйте:\n');
    console.error('  yarn add sharp\n');
    process.exit(1);
}

const PROJECT_DIR = __dirname;
const GALLERY_DIR = path.join(PROJECT_DIR, '1');
const OUTPUT_DIR = path.join(PROJECT_DIR, '1');

// Настройки качества
const WEBP_QUALITY = 85;

// Результаты
const results = {
    success: [],
    failed: []
};

/**
 * Конвертация favicon.jpg -> favicon.ico (32x32) и favicon.webp (192x192)
 */
async function convertFavicon() {
    const faviconSrc = path.join(PROJECT_DIR, 'favicon.jpg');

    if (!fs.existsSync(faviconSrc)) {
        console.log('⚠️  favicon.jpg не найден, пропускаем...');
        return;
    }

    console.log('\n🎨 Обработка favicon.jpg...');

    try {
        // ICO формат (32x32) - используем PNG как промежуточный формат
        // sharp не создаёт .ico напрямую, создаём PNG для использования как favicon
        await sharp(faviconSrc)
            .resize(32, 32, { fit: 'cover' })
            .png()
            .toFile(path.join(PROJECT_DIR, 'favicon-32.png'));
        results.success.push('favicon-32.png (32x32)');

        // Также создаём версию 16x16
        await sharp(faviconSrc)
            .resize(16, 16, { fit: 'cover' })
            .png()
            .toFile(path.join(PROJECT_DIR, 'favicon-16.png'));
        results.success.push('favicon-16.png (16x16)');

        // WebP для современных браузеров (192x192 - для PWA)
        await sharp(faviconSrc)
            .resize(192, 192, { fit: 'cover' })
            .webp({ quality: 90 })
            .toFile(path.join(PROJECT_DIR, 'favicon-192.webp'));
        results.success.push('favicon-192.webp (192x192)');

        // Apple Touch Icon (180x180)
        await sharp(faviconSrc)
            .resize(180, 180, { fit: 'cover' })
            .png()
            .toFile(path.join(PROJECT_DIR, 'apple-touch-icon.png'));
        results.success.push('apple-touch-icon.png (180x180)');

        console.log('✅ Favicon обработан успешно!');
    } catch (err) {
        console.error('❌ Ошибка при обработке favicon:', err.message);
        results.failed.push('favicon.jpg');
    }
}

/**
 * Конвертация изображений из папки portfolio/ в .webp
 */
async function convertPortfolioImages() {
    const PORTFOLIO_DIR = path.join(PROJECT_DIR, 'portfolio');

    if (!fs.existsSync(PORTFOLIO_DIR)) {
        console.log('⚠️  Папка portfolio/ не найдена, пропускаем...');
        return;
    }

    console.log('\n🖼️  Обработка изображений портфолио (папка portfolio/)...');

    const files = fs.readdirSync(PORTFOLIO_DIR);
    // Added HEIC to regex
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|heic)$/i.test(f));

    if (imageFiles.length === 0) {
        console.log('⚠️  Изображения .jpg/.png/.heic в папке portfolio/ не найдены');
        return;
    }

    console.log(`📁 Найдено изображений: ${imageFiles.length}\n`);

    for (const file of imageFiles) {
        const inputPath = path.join(PORTFOLIO_DIR, file);
        const baseName = path.basename(file, path.extname(file));
        const outputPath = path.join(PORTFOLIO_DIR, `${baseName}.webp`);

        // Skip if webp already exists and is newer? 
        // For now, just overwrite or process.

        try {
            await sharp(inputPath)
                .webp({ quality: WEBP_QUALITY })
                .toFile(outputPath);

            const inputStats = fs.statSync(inputPath);
            const outputStats = fs.statSync(outputPath);
            const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`  ✅ ${file} → ${baseName}.webp (экономия ${savings}%)`);
            results.success.push(`portfolio/${baseName}.webp`);
        } catch (err) {
            console.error(`  ❌ Ошибка: ${file} - ${err.message}`);
            results.failed.push(`portfolio/${file}`);
        }
    }
}

/**
 * Главная функция
 */
async function main() {
    console.log('═'.repeat(50));
    console.log('🚀 КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ В WEBP');
    console.log('═'.repeat(50));

    await convertFavicon();
    // await convertGalleryImages(); // Old gallery dir was '1', new is 'portfolio' presumably or both.
    // The user said "added photos to portfolio folder", so let's process that.
    await convertPortfolioImages();

    // Итоговый отчёт
    console.log('\n' + '═'.repeat(50));
    console.log('📊 РЕЗУЛЬТАТЫ');
    console.log('═'.repeat(50));
    console.log(`\n✅ Успешно создано файлов: ${results.success.length}`);
    results.success.forEach(f => console.log(`   • ${f}`));

    if (results.failed.length > 0) {
        console.log(`\n❌ Не удалось обработать: ${results.failed.length}`);
        results.failed.forEach(f => console.log(`   • ${f}`));
    }

    console.log('\n📝 Следующие шаги:');
    console.log('   1. Добавьте favicon в <head> (см. image-guide.md)');
    console.log('   2. Обновите пути к изображениям в HTML на .webp');
    console.log('   3. Удалите оригинальные .jpg/.png если не нужны\n');
}

main().catch(console.error);
