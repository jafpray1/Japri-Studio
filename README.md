# Japri Studio

AI Image Creator (studio.japri.web.id, di-deploy di Vercel).

## Cara kerja login & koin

- Login memakai **akun Japri** (sama dengan Japri Konten, `konten.japri.web.id`).
- Browser **tidak pernah** memegang API key Gemini. Semua panggilan Gemini lewat
  `https://konten.japri.web.id/api/js/gemini/...`; server menambahkan key platform dan
  memotong koin dari dompet Japri (koin gratis harian dulu, lalu saldo beli).
  Koin dikembalikan otomatis kalau generate gagal.
- Top-up koin di halaman `/wallet` Japri Konten (Midtrans).
- Backend: `levd-dev/dashboard/routes/japri_studio_routes.py`.

## Development

1. `npm install`
2. Opsional: salin `.env.example` ke `.env.local` dan ubah `VITE_JAPRI_API_URL`.
   Origin dev (mis. `http://localhost:3000`) harus ditambahkan ke `JAPRI_STUDIO_ORIGINS` di server.
3. `npm run dev`

**Jangan** menaruh `GEMINI_API_KEY` di env Vite/Vercel — semua yang dibaca Vite ikut ke bundle publik.
