# TilTop — AI Language Learning Engine

Sun'iy intellektga asoslangan til o'rganish platformasi. Grammatika jadvallari
o'rniga **real hayotiy vaziyatlar** o'rgatiladi, va butun kurs har bir
foydalanuvchining tili, kasbi va darajasiga qarab AI tomonidan qaytadan
yoziladi.

> Talaba bilan shifokor bitta darsni ochsa ham, ichidagi lug'at va dialog
> boshqacha bo'ladi.

---

## Nima muammoni yechadi

Odam yillab til o'rganadi, yuzlab so'z yodlaydi — keyin chet elda taksi
chaqira olmaydi. Sabab: mavjud ilovalar hammaga bir xil, kontekstdan uzilgan
dars beradi. TilTop darslikni emas, **vaziyatni** o'rgatadi.

## Asosiy imkoniyatlar

| Imkoniyat | Tafsilot |
|---|---|
| **20 ta hayotiy ssenariy** | Aeroport, bozor, shifokor qabuli, IT intervyu, bank, favqulodda vaziyat va boshqalar |
| **Shaxsiylashtirish** | Til + kasb (8 profil) + daraja (A1–C2) bo'yicha kurs AI tomonidan moslashtiriladi |
| **Kaskadli AI dvigatel** | Gemini → Mistral → OpenAI. Bittasi ishlamasa, keyingisiga avtomatik o'tadi |
| **Azure Neural TTS** | 12 til uchun tabiiy ovozli talaffuz namunasi |
| **Talaffuz baholash** | Mikrofon orqali gapirasiz, AI 0–100 ball va o'zbekcha maslahat beradi |
| **4 ta interaktiv o'yin** | Tezkor so'z moslashtirish, ovozli takrorlash, gap qurish, AI bilan rolli dialog |
| **Gamifikatsiya** | XP, kunlik streak, 5 daraja, 6 yutuq nishoni — server'da saqlanadi |
| **AI interfeys tarjimoni** | Yangi til qo'shilsa, AI butun sayt interfeysini o'sha tilga o'giradi |
| **JSON Engine Explorer** | Dars generatsiyasining xom JSON chiqishi — o'qituvchilar o'z darsini yasashi uchun |

## Texnologiyalar

**Frontend:** React 19 · TypeScript · Tailwind CSS 4 · Vite 6 · Framer Motion
**Backend:** Node.js · Express · TypeScript
**AI:** Google Gemini (asosiy) · Mistral AI · OpenAI (zaxira)
**Ovoz:** Azure Neural TTS (chiqish) · Web Speech API (kirish)
**Auth:** scrypt parol hash + HMAC-imzolangan sessiya tokeni (30 kun), tashqi kutubxonasiz

---

## Ishga tushirish

**Talab:** Node.js 20+

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Muhit o'zgaruvchilarini sozlash
cp .env.example .env
# .env faylini ochib, kalitlaringizni kiriting

# 3. Ishga tushirish
npm run dev
```

Ilova `http://localhost:3000` da ochiladi.

### Muhit o'zgaruvchilari

| O'zgaruvchi | Majburiymi | Nima uchun |
|---|---|---|
| `GEMINI_API_KEY` | Ha | Asosiy AI dvigatel — [olish](https://aistudio.google.com/apikey) |
| `AUTH_SECRET` | Ha | Sessiya tokenlarini imzolaydi (pastda generatsiya buyrug'i) |
| `AZURE_SPEECH_KEY` | Yo'q | Neural ovoz. Bo'lmasa brauzer TTS'iga tushadi |
| `AZURE_SPEECH_REGION` | Yo'q | Masalan `eastus` |
| `MISTRAL_API_KEY` | Yo'q | 1-zaxira LLM |
| `OPENAI_API_KEY` | Yo'q | 2-zaxira LLM |

`AUTH_SECRET` generatsiya qilish:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ `AUTH_SECRET` o'rnatilmasa, server har qayta ishga tushganda tasodifiy
> kalit yaratadi va barcha sessiyalar bekor bo'ladi.

### Production build

```bash
npm run build   # frontend (vite) + backend (esbuild)
npm start       # dist/server.cjs ni ishga tushiradi
```

---

## Vercel'ga deploy qilish

Loyiha Vercel'da ishlashga tayyor. Vercel Express'ni ildizdagi `server.ts`
faylining default eksporti orqali o'zi taniydi va uni bitta funksiyaga
aylantiradi. Klient build'i `public/` ga chiqadi — Vercel statik fayllarni
aynan o'sha yerdan CDN orqali beradi, qolgan barcha so'rovlar Express'ga
boradi.

Bitta muhim jihat bor. **Vercel'da fayl tizimiga yozib bo'lmaydi**, shuning
uchun `data/users.json` u yerda saqlanmaydi. Aynan shu JSON hujjat Vercel Blob
ichida saqlanadi — tuzilishi bir xil, faqat joyi boshqa.

**1. Blob store yarating**

Vercel loyihangizda: `Storage` → `Create Database` → `Blob` → access **Private**
→ loyihaga ulang. Vercel `BLOB_STORE_ID` va OIDC ma'lumotlarini o'zi qo'shadi.

> Private tanlash majburiy: store ichida parol hash'lari yotadi.

**2. Muhit o'zgaruvchilarini qo'shing**

`Settings` → `Environment Variables`:

| O'zgaruvchi | Qiymat |
|---|---|
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` natijasi |
| `GEMINI_API_KEY` | Gemini kalitingiz |
| `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` | ixtiyoriy |
| `MISTRAL_API_KEY` / `OPENAI_API_KEY` | ixtiyoriy |

**3. Deploy qiling.** Boshqa sozlash kerak emas.

### Nimalar boshqacha ishlaydi

| | Lokalda | Vercel'da |
|---|---|---|
| Hisoblar qayerda | `data/users.json` | Blob ichidagi `tiltop/users.json` |
| Server | doimiy Express (`:3000`) | so'rov bo'yicha serverless funksiya |
| Statik fayllar | Express beradi (`public/`) | Vercel CDN beradi (`public/**`) |
| Login urinishlari hisoblagichi | jarayon xotirasida | har bir instance'da alohida |

Oxirgi qatorga e'tibor bering: brute-force himoyasi xotirada saqlangani uchun
serverless'da u zaifroq ishlaydi. Parol hash'lash va token tekshiruvi esa
o'zgarishsiz qoladi.

---

## Loyiha tuzilishi

```
├── server.ts                  Express server + Vercel kirish nuqtasi (default export)
├── auth.ts                    scrypt + HMAC autentifikatsiya, JSON saqlash
├── vercel.json                Vercel build buyrug'i
├── public/                    Vite build natijasi (git'ga kirmaydi)
├── src/
│   ├── App.tsx                Asosiy dashboard va marshrutlash
│   ├── types.ts               Umumiy TypeScript tiplari
│   ├── data/
│   │   ├── curriculum.ts      20 ta bazaviy ssenariy, kasb/daraja profillari
│   │   └── curriculumAdapters.ts  AI moslashtirish va kesh qatlami
│   ├── components/            UI komponentlari (dars laboratoriyasi, o'yinlar, statistika)
│   └── utils/
│       ├── i18n.tsx           Interfeys tarjimasi + AI tarjimon
│       ├── speech.ts          Web Speech API o'ramlari
│       └── auth.tsx           Klient tomonidagi auth konteksti
└── data/                      Foydalanuvchi bazasi (git'ga kirmaydi)
```

## API endpointlari

| Endpoint | Vazifasi |
|---|---|
| `POST /api/auth/register` · `login` | Ro'yxatdan o'tish / kirish |
| `GET /api/auth/me` · `PUT /api/auth/state` | Profil va progressni sinxronlash |
| `POST /api/raw-json-engine` | Dars kontentini generatsiya qilish |
| `POST /api/roleplay-chat` | Ssenariy bo'yicha AI dialog |
| `POST /api/generate-game-puzzle` | O'yin jumboqlarini generatsiya qilish |
| `POST /api/shadowing-eval` | Talaffuzni baholash |
| `POST /api/translate-ui` | Interfeysni istalgan tilga tarjima qilish |
| `POST /api/translate-curriculum-sections` | Darslarni maqsad tiliga moslashtirish |
| `POST /api/azure-tts` | Matndan tabiiy ovoz generatsiyasi |
| `GET /api/health` | Faol AI dvigatellar holati |

---

## Xavfsizlik

- Parollar `scrypt` bilan, har bir foydalanuvchi uchun alohida salt bilan hash qilinadi
- Sessiya tokenlari HMAC bilan imzolanadi, muddati 30 kun
- Barcha AI kalitlari **faqat serverda** ishlatiladi — brauzerga hech qachon chiqmaydi
- `.env` va `data/` papkasi `.gitignore` da

## Kimlar uchun

Chet elga chiqayotgan mehnat migrantlari, sayyohlar va talabalar ·
xalqaro kompaniyaga intilayotgan mutaxassislar · maktab va universitet
o'quvchilari · o'z darsini yasamoqchi bo'lgan til o'qituvchilari.

## Yo'l xaritasi

- [ ] Mobil ilova (iOS / Android)
- [ ] Offline rejim
- [ ] Real vaqtda jonli ovozli suhbat
- [ ] Do'stlar reytingi va haftalik turnirlar
- [ ] Xatolar tarixiga asoslangan adaptiv dars rejasi
- [ ] Korporativ panel (B2B)
