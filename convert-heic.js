/**
 * Скрипт конвертации HEIC в WebP
 * Использует heic-convert для декодирования HEIC и sharp для создания WebP
 */

const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');
const sharp = require('sharp');

const PORTFOLIO_DIR = path.join(__dirname, 'portfolio');
const WEBP_QUALITY = 85;

async function convertHeicToWebp(inputPath, outputPath) {
    try {
        console.log(`\n🔄 Обработка: ${path.basename(inputPath)}`);

        // Читаем HEIC файл
        const inputBuffer = await fs.promises.readFile(inputPath);

        // Конвертируем HEIC в JPEG буфер
        const jpegBuffer = await convert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1 // максимальное качество для промежуточного формата
        });

        // Конвертируем JPEG буфер в WebP
        await sharp(jpegBuffer)
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPath);

        // Статистика
        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

        console.log(`  ✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`     Размер: ${(inputStats.size / 1024).toFixed(0)} KB → ${(outputStats.size / 1024).toFixed(0)} KB (экономия ${savings}%)`);

        return true;
    } catch (err) {
        console.error(`  ❌ Ошибка при обработке ${path.basename(inputPath)}:`, err.message);
        return false;
    }
}

async function main() {
    console.log('═'.repeat(60));
    console.log('🚀 КОНВЕРТАЦИЯ HEIC → WebP');
    console.log('═'.repeat(60));

    // Находим все HEIC файлы в папке portfolio
    const files = fs.readdirSync(PORTFOLIO_DIR);
    const heicFiles = files.filter(f => /\.heic$/i.test(f));

    if (heicFiles.length === 0) {
        console.log('\n⚠️  HEIC файлы не найдены в папке portfolio/');
        return;
    }

    console.log(`\n📁 Найдено HEIC файлов: ${heicFiles.length}`);

    let successCount = 0;
    let failCount = 0;

    for (const file of heicFiles) {
        const inputPath = path.join(PORTFOLIO_DIR, file);
        const baseName = path.basename(file, path.extname(file));
        const outputPath = path.join(PORTFOLIO_DIR, `${baseName}.webp`);

        const success = await convertHeicToWebp(inputPath, outputPath);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 РЕЗУЛЬТАТЫ');
    console.log('═'.repeat(60));
    console.log(`✅ Успешно конвертировано: ${successCount}`);
    if (failCount > 0) {
        console.log(`❌ Ошибок: ${failCount}`);
    }
    console.log('');
}

main().catch(console.error);
