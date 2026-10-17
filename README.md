# Akvaryum Canlı Kayıt Ekranı

Akvaryumdaki canlıların (balık, karides, yengeç, bitki...) kaydını tutan Vue 3 + TypeScript uygulaması.
Ekle, listele, güncelle ve sil işlemleri var. Kayıtlar Netlify'da ortak olarak, yerelde LocalStorage'da tutulur.

## Çalıştırma

```
npm install
npm run dev
```

## Yapı

- `src/pages` ana sayfa
- `src/components` form ve tablo
- `src/interfaces` veri tipleri
- `src/composables/useCreatures.ts` kayıt işlemleri (API, yoksa LocalStorage)
- `src/utils/cropSquare.ts` yüklenen resmi kare kırpıp küçültür
- `netlify/functions/creatures.mts` ortak liste (Netlify Blobs)
- `public/images` canlı resimleri (`masallah.jpg`, `vantuz.jpg`, `nekoi.jpg`), `public/default.jpg` varsayılan resim

## Yayın

Netlify: build komutu `npm run build`, klasör `dist`.
