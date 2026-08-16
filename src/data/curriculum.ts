import { 
  LessonSection, 
  CountryLanguageOption, 
  ProfessionOption, 
  ProficiencyOption, 
  SentencePuzzle,
  WordMatchPair 
} from '../types';

export const COUNTRY_LANGUAGES: CountryLanguageOption[] = [
  {
    code: 'en',
    country: 'AQSH / Buyuk Britaniya',
    languageName: 'Ingliz tili (English)',
    nativeName: 'English',
    flag: '🇺🇸',
    popularPhrase: 'Hello, let’s achieve your goals!',
    popularPhraseUz: "Salom, maqsadlaringizga birga yetamiz!",
    voiceLang: 'en-US',
    azureVoiceName: 'en-US-JennyNeural',
  },
  {
    code: 'ru',
    country: 'Rossiya / MDH',
    languageName: 'Rus tili (Russian)',
    nativeName: 'Русский язык',
    flag: '🇷🇺',
    popularPhrase: 'Здравствуйте, добро пожаловать!',
    popularPhraseUz: "Salom, xush kelibsiz!",
    voiceLang: 'ru-RU',
    azureVoiceName: 'ru-RU-SvetlanaNeural',
  },
  {
    code: 'ko',
    country: 'Janubiy Koreya',
    languageName: 'Koreys tili (Korean)',
    nativeName: '한국어',
    flag: '🇰🇷',
    popularPhrase: '안녕하세요! 함께 배워요.',
    popularPhraseUz: "Salom! Birgalikda o'rganamiz.",
    voiceLang: 'ko-KR',
    azureVoiceName: 'ko-KR-SunHiNeural',
  },
  {
    code: 'uz',
    country: "O'zbekiston",
    languageName: "O'zbek tili (Uzbek)",
    nativeName: "O'zbekcha",
    flag: '🇺🇿',
    popularPhrase: "Assalomu alaykum! Xush kelibsiz.",
    popularPhraseUz: "Assalomu alaykum! Xush kelibsiz.",
    voiceLang: 'uz-UZ',
    azureVoiceName: 'uz-UZ-MadinaNeural',
  },
  {
    code: 'ja',
    country: 'Yaponiya',
    languageName: 'Yapon tili (Japanese)',
    nativeName: '日本語',
    flag: '🇯🇵',
    popularPhrase: 'こんにちは！楽しく日本語を学びましょう。',
    popularPhraseUz: "Salom! Yapon tilini qiziqarli o'rganamiz.",
    voiceLang: 'ja-JP',
    azureVoiceName: 'ja-JP-NanamiNeural',
  },
  {
    code: 'es',
    country: 'Ispaniya / Lotin Amerikasi',
    languageName: 'Ispan tili (Spanish)',
    nativeName: 'Español',
    flag: '🇪🇸',
    popularPhrase: '¡Hola! Bienvenidos a TilTop.',
    popularPhraseUz: "Salom! TilTopga xush kelibsiz.",
    voiceLang: 'es-ES',
    azureVoiceName: 'es-ES-ElviraNeural',
  },
  {
    code: 'de',
    country: 'Germaniya / Avstriya',
    languageName: 'Nemis tili (German)',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    popularPhrase: 'Guten Tag! Lassen Sie uns Deutsch lernen.',
    popularPhraseUz: "Xayrli kun! Nemis tilini o'rganamiz.",
    voiceLang: 'de-DE',
    azureVoiceName: 'de-DE-KatjaNeural',
  },
  {
    code: 'fr',
    country: 'Fransiya',
    languageName: 'Fransuz tili (French)',
    nativeName: 'Français',
    flag: '🇫🇷',
    popularPhrase: 'Bonjour et bienvenue sur TilTop!',
    popularPhraseUz: "Salom va TilTopga xush kelibsiz!",
    voiceLang: 'fr-FR',
    azureVoiceName: 'fr-FR-DeniseNeural',
  },
  {
    code: 'tr',
    country: 'Turkiya',
    languageName: 'Turk tili (Turkish)',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    popularPhrase: 'Merhaba! Birlikte Türkçe öğrenelim.',
    popularPhraseUz: "Salom! Birgalikda turk tilini o'rganamiz.",
    voiceLang: 'tr-TR',
    azureVoiceName: 'tr-TR-EmelNeural',
  },
  {
    code: 'ar',
    country: 'Birlashgan Arab Amirliklari / Saudiya',
    languageName: 'Arab tili (Arabic)',
    nativeName: 'العربية',
    flag: '🇦🇪',
    popularPhrase: 'مرحباً بكم في منصة تيل توب!',
    popularPhraseUz: "TilTop platformasiga xush kelibsiz!",
    voiceLang: 'ar-SA',
    azureVoiceName: 'ar-SA-ZariyahNeural',
  },
  {
    code: 'it',
    country: 'Italiya',
    languageName: 'Italyan tili (Italian)',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    popularPhrase: 'Ciao! Impariamo l’italiano insieme.',
    popularPhraseUz: "Salom! Italyan tilini birga o'rganamiz.",
    voiceLang: 'it-IT',
    azureVoiceName: 'it-IT-ElsaNeural',
  },
  {
    code: 'zh',
    country: 'Xitoy',
    languageName: 'Xitoy tili (Chinese)',
    nativeName: '中文',
    flag: '🇨🇳',
    popularPhrase: '你好！欢迎来到TilTop。',
    popularPhraseUz: "Salom! TilTopga xush kelibsiz.",
    voiceLang: 'zh-CN',
    azureVoiceName: 'zh-CN-XiaoxiaoNeural',
  },
];

export const PROFESSION_OPTIONS: ProfessionOption[] = [
  {
    id: 'student',
    title: 'Talaba / O‘quvchi',
    titleUz: 'Talaba (Student)',
    icon: 'GraduationCap',
    description: 'Imtihonlar, stipendiyalar, talabalar hayoti va xorijda ta’lim uchun.',
    bonusContext: 'Fokus: Akademik muloqot, taqdimotlar va talabalar almashinuv dasturlari.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'it_specialist',
    title: 'IT Mutaxassis / Dasturchi',
    titleUz: 'IT Mutaxassis (Tech & Dev)',
    icon: 'Code2',
    description: 'Texnik intervyu, jamoaviy stand-up majlislar va kod muhokamasi.',
    bonusContext: 'Fokus: IT terminologiyasi, sprint rejalari va xalqaro startap suhbatlari.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'tourist',
    title: 'Sayyoh / Sayohat Ishqibozi',
    titleUz: 'Sayyoh (Tourist & Travel)',
    icon: 'Plane',
    description: 'Aeroport, mehmonxona, shahar navigatsiyasi va bozor savdolashuvi.',
    bonusContext: 'Fokus: Qulay xarid, yo‘l so‘rash va diqqatga sazovor joylarda muloqot.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'businessperson',
    title: 'Tadbirkor / Biznes Egasi',
    titleUz: 'Tadbirkor (Business & Sales)',
    icon: 'Briefcase',
    description: 'Muzokaralar, shartnomalar, moliyaviy hisobotlar va hamkorlik.',
    bonusContext: 'Fokus: Rasmiy biznes muloqoti, savdo va investitsiya taqdimotlari.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'medical_worker',
    title: 'Tibbiyot Xodimi / Shifokor',
    titleUz: 'Tibbiyot (Doctor & Nurse)',
    icon: 'Stethoscope',
    description: 'Bemorlar bilan suhbat, dorixonalar va tibbiy atamalar.',
    bonusContext: 'Fokus: Simptomlar, retseptlar va shoshilinch yordam ko‘rsatish.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'marketer',
    title: 'Marketolog / SMM Mutaxassis',
    titleUz: 'Marketolog & Kreator',
    icon: 'Megaphone',
    description: 'Brend strategiyalari, ijtimoiy tarmoqlar va auditoriya tahlili.',
    bonusContext: 'Fokus: Kreativ kampaniyalar, trendlar va reklama yuritish.',
    colorClass: 'bg-accent-500',
  },
  {
    id: 'general',
    title: 'Kundalik Hayot / Umumiy',
    titleUz: 'Umumiy O‘rganuvchi',
    icon: 'Sparkles',
    description: 'Kino, xobbi, do‘stlar bilan choyxona va oilaviy bayramlar.',
    bonusContext: 'Fokus: Erkin muloqot, do‘stona samimiy suhbatlar va madaniyat.',
    colorClass: 'bg-accent-500',
  },
];

export const PROFICIENCY_OPTIONS: ProficiencyOption[] = [
  {
    id: 'beginner',
    title: 'Boshlang‘ich (Beginner)',
    titleUz: 'Boshlang‘ich daraja',
    levelCode: 'A1 - A2',
    description: 'Oddiy iboralar, tanishuv, savol-javoblar va sekin talaffuz.',
    colorClass: 'bg-accent-50 text-accent-700 border-accent-200',
  },
  {
    id: 'intermediate',
    title: 'O‘rta (Intermediate)',
    titleUz: 'O‘rta daraja',
    levelCode: 'B1 - B2',
    description: 'Erkin suhbat, fikr bildirish, ish va sayohatdagi dialoglar.',
    colorClass: 'bg-accent-50 text-accent-700 border-accent-200',
  },
  {
    id: 'advanced',
    title: 'Yuqori (Advanced)',
    titleUz: 'Yuqori daraja',
    levelCode: 'C1 - C2',
    description: 'Murakkab mavzular, idiomalar, texnik tahlil va notiqlik.',
    colorClass: 'bg-accent-50 text-accent-700 border-accent-200',
  },
];

export const OFFICIAL_SECTIONS: LessonSection[] = [
  {
    section_id: 1,
    title: "Tanishuv va Salomlashish",
    title_en: "Greetings & Introductions",
    category: "Muloqot Asoslari",
    difficulty: "Boshlang'ich",
    duration: "10 daqiqa",
    xp_reward: 100,
    scenario_context: "Yangi do'stlar davrasida yoki rasmiy uchrashuvda o'zingizni tanishtirish, kasbingiz va kelib chiqishingiz haqida xushmuomala so'zlashish.",
    ai_role: "Yangi tanishgan xushchaqchaq hamkasb / suhbatdosh",
    user_role: "O'zini tanishtirayotgan mutaxassis / o'rganuvchi",
    icon_name: "HandMetal",
    vocabulary: [
      { 
        phrase: "Hello! Nice to meet you. What is your name?", 
        translation: "Salom! Tanishganimdan xursandman. Ismingiz nima?", 
        pronunciation: "Hel-lo! Nays tu mit yu. Vot iz yor neym?",
        professionNote: "Har qanday rasmiy va norasmiy suhbatni boshlashda asosiy jumla."
      },
      { 
        phrase: "I am a software engineer / professional from Uzbekistan.", 
        translation: "Men O'zbekistonlik dasturchi / mutaxassisman.", 
        pronunciation: "Ay em e soft-ver en-ji-nir / pro-fesh-e-nl from Uz-be-kis-ton.",
        professionNote: "Kasb va mamlakatni erkin aytish shakli."
      },
      { 
        phrase: "How have you been lately? Everything is going great!", 
        translation: "Oxirgi paytlarda ishlaringiz qanday? Hammasi a'lo darajada!", 
        pronunciation: "Hav hev yu bin leyt-li? Ev-ri-thing iz go-ing greyt!"
      },
      { 
        phrase: "Where are you currently based?", 
        translation: "Hozirda qayerda istiqomat qilasiz?", 
        pronunciation: "Ver ar yu kar-rent-li beyst?"
      },
      { 
        phrase: "Thank you for the warm welcome!", 
        translation: "Samimiy qabul uchun katta rahmat!", 
        pronunciation: "Thenk yu for the vorm vel-kam!"
      }
    ],
    dialogue_starter: "Hello there! Welcome to our international circle. My name is Alex. Could you tell me a little about yourself?",
    mini_quiz: [
      {
        question: "'Nice to meet you' iborasi o'zbek tilida qanday ifodalanadi?",
        options: ["Xayr, salomat bo'ling", "Tanishganimdan juda xursandman", "Qayerdansiz?", "Iltimos, yordam bering"],
        correct_answer: 1,
        explanation: "'Nice to meet you' yangi inson bilan uchrashganda mehmondo'stlik va samimiyat belgisidir."
      },
      {
        question: "O'z kasbini aytishda qaysi grammatik tuzilma ishlatiladi?",
        options: ["I have a student", "I am a [Profession]", "I do engineer", "I stay doctor"],
        correct_answer: 1,
        explanation: "'I am a...' (Men ... man) shaxsiy kasb va rolni to'g'ri ifodalash formulasidir."
      }
    ]
  },
  {
    section_id: 2,
    title: "Chorsu Bozorida Savdolashish",
    title_en: "Bargaining at the Market",
    category: "Xarid va Madaniyat",
    difficulty: "Boshlang'ich",
    duration: "15 daqiqa",
    xp_reward: 120,
    scenario_context: "Tarixiy Chorsu bozorida yangi uzilgan shirin qovun, mayiz va quritilgan mevalar xarid qilish hamda sotuvchi bilan samimiy savdolashish.",
    ai_role: "Chorsu bozoridagi samimiy va chaqqon meva-savdogari (Sobir aka)",
    user_role: "Bozorga tashrif buyurgan xaridor",
    icon_name: "ShoppingBag",
    vocabulary: [
      { phrase: "How much is a kilo of these fresh melons?", translation: "Bu yangi qovunning kilosi qancha turadi?", pronunciation: "Hav mach iz e ki-lo ov dhiz fresh me-lonz?" },
      { phrase: "Could you give me a small discount if I take two?", translation: "Agar ikkita olsam, ozgina chegirma qilib bera olasizmi?", pronunciation: "Kud yu giv mi e smol dis-kavnt if ay teyk tu?" },
      { phrase: "Can I please taste a small slice first?", translation: "Avval kichik bo'lagini tatib ko'rsam bo'ladimi?", pronunciation: "Ken ay pliz teyst e smol slays ferst?" },
      { phrase: "Please pack two kilos of sweet raisins and walnuts.", translation: "Iltimos, ikki kilo shirin mayiz va yong'oq solib bering.", pronunciation: "Pliz pek tu ki-loz ov svit rey-zinz end vol-nats." },
      { phrase: "Do you accept contactless card payment?", translation: "Kontaktsiz karta orqali to'lovni qabul qilasizmi?", pronunciation: "Du yu ek-sept kon-tekt-lis kard pey-ment?" }
    ],
    dialogue_starter: "Assalomu alaykum, aziz mehmon! Bizda eng saralangan Chust yong'oqlari va shirin qovunlar bor. Totib ko'rasizmi?",
    mini_quiz: [
      {
        question: "Bozorda narxni pasaytirishni so'rash uchun qaysi ibora eng munosib?",
        options: ["Could you give a discount?", "Bring me the bill immediately", "I don't like it", "Where is the airport?"],
        correct_answer: 0,
        explanation: "'Could you give a discount?' xushmuomalalik bilan narxni kelishish jumlasi hisoblanadi."
      },
      {
        question: "'Can I taste it?' iborasining ma'nosi nima?",
        options: ["Buni tekinga olsam bo'ladimi?", "Totib ko'rsam bo'ladimi?", "Tortib bering", "Qaytim bering"],
        correct_answer: 1,
        explanation: "'Taste' so'zi ta'mini tatib ko'rish ma'nosini anglatadi."
      }
    ]
  },
  {
    section_id: 3,
    title: "Aeroportda va Pasport Nazorati",
    title_en: "Airport & Passport Control",
    category: "Sayohat va Transport",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 130,
    scenario_context: "Xalqaro aeroportga qo'nganingizdan so'ng pasport nazorati xodimi savollariga javob berish, viza va safar maqsadini tushuntirish.",
    ai_role: "Aeroport pasport nazorati katta inspektori",
    user_role: "Xalqaro konferensiya / sayohatga kelgan mutaxassis",
    icon_name: "Plane",
    vocabulary: [
      { phrase: "Here is my passport and boarding pass.", translation: "Mana mening pasportim va samolyotga chiqish talonim.", pronunciation: "Xir iz may pas-port end bor-ding pas." },
      { phrase: "I am here for a business conference and tourism for 10 days.", translation: "Men bu yerda biznes konferensiya va sayohat maqsadida 10 kun bo'laman.", pronunciation: "Ay em xir for e biz-nes kon-fe-rens end tu-rizm for ten deyz." },
      { phrase: "I have booked a hotel in the city center.", translation: "Shahar markazidagi mehmonxonadan xona band qilganman.", pronunciation: "Ay hev bukd e ho-tel in the si-ti sen-ter." },
      { phrase: "Which carousel can I collect my oversized luggage from?", translation: "Katta hajmli yuklarimni qaysi lentadan olsam bo'ladi?", pronunciation: "Vich ke-ru-sel ken ay kol-lekt may o-ver-sayzd lag-gij from?" }
    ],
    dialogue_starter: "Good day! Welcome. Please hand over your passport and declaration. What is the primary purpose of your visit?",
    mini_quiz: [
      {
        question: "'Purpose of visit' so'zining o'zbekcha tarjimasi nima?",
        options: ["Sayohat xarajati", "Tashrif maqsadi", "Yashash manzili", "Parvoz davomiyligi"],
        correct_answer: 1,
        explanation: "'Purpose of visit' — safar maqsadi demakdir."
      }
    ]
  },
  {
    section_id: 4,
    title: "Taksiga Buyurtma Berish",
    title_en: "Ordering a Taxi",
    category: "Shahar Hayoti",
    difficulty: "Boshlang'ich",
    duration: "10 daqiqa",
    xp_reward: 110,
    scenario_context: "Shahar markazida taksiga o'tirib manzilni tushuntirish, xaritadagi eng qisqa yo'lni ko'rsatish va to'lov usulini aniqlash.",
    ai_role: "Shaharni yaxshi biladigan xushmuomala taksi haydovchisi",
    user_role: "Uchrashuvga shoshilayotgan yo'lovchi",
    icon_name: "Car",
    vocabulary: [
      { phrase: "Please take me to the Central IT Park.", translation: "Meni Markaziy IT Parkka olib boring, iltimos.", pronunciation: "Pliz teyk mi tu the Sen-tral Ay-Ti Park." },
      { phrase: "How long will the ride take with the current traffic?", translation: "Hozirgi tirbandlikda yo'l qancha vaqt oladi?", pronunciation: "Hav long vil the rayd teyk vidh the kar-rent tref-fik?" },
      { phrase: "You can stop right by the main entrance.", translation: "Asosiy kirish eshigi yonida to'xtatsangiz bo'ladi.", pronunciation: "Yu ken stop rayt bay the meyn en-trans." },
      { phrase: "Keep the change, thank you very much!", translation: "Qaytimi kerak emas, katta rahmat!", pronunciation: "Kip the cheynj, thenk yu ve-ri mach!" }
    ],
    dialogue_starter: "Salom, xush kelibsiz! Qayerga yo'l oldik? Xaritadagi marshrut bo'yicha ketamizmi?",
    mini_quiz: [
      {
        question: "'Keep the change' iborasi qanday ma'noni bildiradi?",
        options: ["Qaytimni bering", "Qaytimi qolsin / kerak emas", "Tezroq haydang", "To'xtating"],
        correct_answer: 1,
        explanation: "'Keep the change' haydovchiga qaytimni minnatdorchilik sifatida qoldirishda ishlatiladi."
      }
    ]
  },
  {
    section_id: 5,
    title: "Mehmonxonaga Joylashish",
    title_en: "Hotel Check-in",
    category: "Sayohat va Turizm",
    difficulty: "Boshlang'ich",
    duration: "15 daqiqa",
    xp_reward: 125,
    scenario_context: "Zamonaviy mehmonxonaga kelib ro'yxatdan o'tish (check-in), Wi-Fi paroli, sport zali va nonushta soatlarini so'rash.",
    ai_role: "Mehmonxona bosh ma'muri (Receptionist)",
    user_role: "Oldindan xona band qilgan sayyoh / xizmat safari vakili",
    icon_name: "Building",
    vocabulary: [
      { phrase: "I have a reservation under the name John Smith.", translation: "Men John Smith nomiga xona band qilganman.", pronunciation: "Ay hev e re-zer-vey-shn an-der the neym Jon Smith." },
      { phrase: "What time is breakfast served in the morning?", translation: "Ertalab nonushta soat nechada beriladi?", pronunciation: "Vot taym iz brek-fast servd in the mor-ning?" },
      { phrase: "Could I have the high-speed Wi-Fi password?", translation: "Yuqori tezlikdagi Wi-Fi parolini bera olasizmi?", pronunciation: "Kud ay hev the hay-spid Vay-Fay pas-vord?" },
      { phrase: "Is there a quiet workspace or gym on the premises?", translation: "Bino ichida sokin ish maydoni yoki sport zali bormi?", pronunciation: "Iz dher e kvayet vork-speys or jim on the pre-mi-siz?" }
    ],
    dialogue_starter: "Good evening and welcome! Do you have an existing room reservation with us today?",
    mini_quiz: [
      {
        question: "Mehmonxonaga kelganda ro'yxatdan o'tish jarayoni nima deb ataladi?",
        options: ["Check-out", "Check-in", "Room-service", "Boarding"],
        correct_answer: 1,
        explanation: "'Check-in' mehmonxonaga kirib joylashish jarayonini bildiradi."
      }
    ]
  },
  {
    section_id: 6,
    title: "Restoranda Ovqat Buyurtma Qilish",
    title_en: "Ordering at a Restaurant",
    category: "Oshxona va Taomlar",
    difficulty: "Boshlang'ich",
    duration: "15 daqiqa",
    xp_reward: 130,
    scenario_context: "Mashhur restoranda stol band qilish, milliy va yevropacha taomlar tarkibini so'rash hamda to'lov chekini so'rash.",
    ai_role: "Restoranning oliy toifali ofitsianti",
    user_role: "Mazali kechki ovqat tanlayotgan mijoz",
    icon_name: "Utensils",
    vocabulary: [
      { phrase: "Could we please see the menu and chef specials?", translation: "Menyu va bosh oshpazning maxsus taomlarini ko'rsatsangiz?", pronunciation: "Kud vi pliz si the me-nyu end shef spe-shalz?" },
      { phrase: "What do you recommend for a traditional dinner?", translation: "An'anaviy kechki ovqat uchun nimani tavsiya qilasiz?", pronunciation: "Vot du yu re-ko-mend for e tra-di-shn-al din-ner?" },
      { phrase: "Is this dish vegetarian / gluten-free?", translation: "Bu taom vegetarianmi / glyutensizmi?", pronunciation: "Iz dhis dish ve-je-te-ri-an / glu-ten fri?" },
      { phrase: "Could we have the bill split between two cards?", translation: "Hisobni ikkita kartaga bo'lib bera olasizmi?", pronunciation: "Kud vi hev the bil split bi-twin tu kardz?" }
    ],
    dialogue_starter: "Welcome! A table for two by the terrace is ready. May I start you off with something refreshing to drink?",
    mini_quiz: [
      {
        question: "'Chef specials' iborasi nimani anglatadi?",
        options: ["Arzon taomlar", "Bosh oshpazning maxsus tavsiyasi", "Ichimliklar", "Bolalar menyusi"],
        correct_answer: 1,
        explanation: "'Chef specials' restorandagi eng mashhur va oshpaz tomonidan tayyorlangan maxsus taomlardir."
      }
    ]
  },
  {
    section_id: 7,
    title: "Ko'chada Yo'l So'rash",
    title_en: "Asking for Directions",
    category: "Shahar Navigatsiyasi",
    difficulty: "Boshlang'ich",
    duration: "12 daqiqa",
    xp_reward: 115,
    scenario_context: "Noma'lum shaharda eng yaqin metro bekati, texnologiya markazi yoki tarixiy maydonni topish uchun yo'lovchilardan yo'l so'rash.",
    ai_role: "Shaharni yaxshi biladigan xushmuomala yo'lovchi",
    user_role: "Xaritadan foydalanayotgan sayyoh",
    icon_name: "Compass",
    vocabulary: [
      { phrase: "Excuse me, could you point me towards the central station?", translation: "Kechirasiz, markaziy vokzal qaysi tomonda ekanini ko'rsata olasizmi?", pronunciation: "Eks-kyuz mi, kud yu poynt mi to-vardz the sen-tral stey-shn?" },
      { phrase: "Go straight ahead for two blocks, then turn left.", translation: "Ikki chorraha to'g'riga yuring, so'ng chapga buriling.", pronunciation: "Go streyt e-hed for tu bloks, dhen tern left." },
      { phrase: "Is it within walking distance from here?", translation: "Bu yerdan piyoda borish mumkin bo'lgan masofadami?", pronunciation: "Iz it vidh-in vol-king dis-tans from xir?" },
      { phrase: "You won’t miss the large glass building on the corner.", translation: "Burchakdagi katta shisha binoni darhol payqaysiz.", pronunciation: "Yu vont mis the larj glas bil-ding on the kor-ner." }
    ],
    dialogue_starter: "Hello! You seem to be checking the map. Are you looking for a specific landmark?",
    mini_quiz: [
      {
        question: "'Within walking distance' iborasining ma'nosi nima?",
        options: ["Faqat taksida boriladi", "Piyoda yetib olsa bo'ladigan masofada", "Juda uzoqda", "Yopiq hudud"],
        correct_answer: 1,
        explanation: "'Walking distance' piyoda yurish uchun qulay yaqinlikni bildiradi."
      }
    ]
  },
  {
    section_id: 8,
    title: "Shifokor Qabulida va Dorixonada",
    title_en: "Doctor's Visit & Pharmacy",
    category: "Salomatlik",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 140,
    scenario_context: "O'zingizni noxush his qilganingizda alomatlarni aniq tushuntirish, qon bosimi yoki dori vositalari bo'yicha shifokor bilan maslahatlashish.",
    ai_role: "Xalqaro klinika shifokori (Dr. Emily)",
    user_role: "Tibbiy yordam so'ragan bemor",
    icon_name: "Stethoscope",
    vocabulary: [
      { phrase: "I have had a persistent headache and mild fever since yesterday.", translation: "Kechadan beri tinimsiz bosh og'rig'i va yengil isitma bezovta qilyapti.", pronunciation: "Ay hev hed e per-sis-tent hed-eyk end mayld fi-ver sins yes-ter-dey." },
      { phrase: "Are you currently allergic to any medication?", translation: "Biror doriga allergiyangiz bormi?", pronunciation: "Ar yu kar-rent-li al-ler-jik tu e-ni me-di-key-shn?" },
      { phrase: "Take one capsule twice daily after meals.", translation: "Ovqatdan keyin kuniga ikki marta bir kapsuladan iching.", pronunciation: "Teyk van kap-syul tvays dey-li af-ter milz." },
      { phrase: "Do I need a doctor's prescription for this painkiller?", translation: "Bu og'riq qoldiruvchi dori uchun shifokor retsepti kerakmi?", pronunciation: "Du ay nid e dok-torz pris-krip-shn for dhis peyn-kil-ler?" }
    ],
    dialogue_starter: "Hello, please have a seat. Tell me what symptoms you are experiencing today.",
    mini_quiz: [
      {
        question: "'Prescription' so'zining tibbiy ma'nosi nima?",
        options: ["Kasalxona to'lovi", "Shifokor retsepti", "Tana harorati", "Operatsiya"],
        correct_answer: 1,
        explanation: "'Prescription' shifokor tomonidan dorilarni berish uchun yozilgan rasmiy retseptdir."
      }
    ]
  },
  {
    section_id: 9,
    title: "Zamonaviy IT Intervyu",
    title_en: "Modern IT Job Interview",
    category: "Kasb va Texnologiya",
    difficulty: "Yuqori",
    duration: "20 daqiqa",
    xp_reward: 160,
    scenario_context: "Xalqaro IT kompaniyasida Frontend/Full-Stack muhandislik lavozimiga texnik intervyu topshirish, arxitektura va loyihalarni himoya qilish.",
    ai_role: "Global IT kompaniyasi CTO'si (Lead Interviewer)",
    user_role: "Senior dasturchi lavozimiga nomzod",
    icon_name: "Code2",
    vocabulary: [
      { phrase: "I have extensive experience building scalable micro-frontends with React.", translation: "React bilan kengayuvchan mikro-frontend tizimlarini yaratishda katta tajribam bor.", pronunciation: "Ay hev eks-ten-siv eks-pi-ri-ens bil-ding skey-le-bl mayk-ro fron-tendz vidh Ri-ekt." },
      { phrase: "How do you manage state and optimize bundle performance?", translation: "Holatni qanday boshqarasiz va yuklanish tezligini qanday optimallashtirasiz?", pronunciation: "Hav du yu me-nij steyt end op-ti-mayz ban-dl per-for-mans?" },
      { phrase: "We reduced API response latency by 40% through Redis caching.", translation: "Biz Redis keshlash orqali API kechikishini 40% ga qisqartirdik.", pronunciation: "Vi ri-dyusd Ey-Pi-Ay ris-pons ley-tn-si bay for-ti per-sent thru Re-dis ke-shing." },
      { phrase: "I thrive in cross-functional agile teams and CI/CD environments.", translation: "Men kross-funksional agile jamoalar va CI/CD muhitida juda samarali ishlayman.", pronunciation: "Ay thrayv in kros-fank-shn-al e-jayl timz end Si-Ay-Si-Di en-vay-ron-ments." }
    ],
    dialogue_starter: "Welcome to your technical interview! We loved your portfolio. Could you walk us through the architectural challenges of your most complex system?",
    mini_quiz: [
      {
        question: "'Scalable' so'zining IT sohasidagi aniq ma'nosi nima?",
        options: ["Kichik hajmli", "Yuklama oshganda kengaya oladigan (Scalable)", "Eski texnologiya", "Xavfsiz bo'lmagan"],
        correct_answer: 1,
        explanation: "'Scalable' tizim foydalanuvchilar soni oshganda ham barqaror ishlay olish qobiliyatini anglatadi."
      }
    ]
  },
  {
    section_id: 10,
    title: "Do'kondan Kiyim-kechak Sotib Olish",
    title_en: "Shopping for Clothes",
    category: "Xarid va Moda",
    difficulty: "Boshlang'ich",
    duration: "12 daqiqa",
    xp_reward: 115,
    scenario_context: "Brend do'konida kiyim tanlash, kiyib ko'rish xonasini (fitting room) so'rash, rang va o'lchamlarni taqqoslash.",
    ai_role: "Zamonaviy do'kon stilist-maslahatchisi",
    user_role: "Yangi kiyim xarid qilayotgan mijoz",
    icon_name: "Shirt",
    vocabulary: [
      { phrase: "Do you have this elegant blazer in medium size?", translation: "Ushbu ko'rkam pidjakning 'M' o'lchami bormi?", pronunciation: "Du yu hev dhis e-le-gant bley-zer in mi-di-um sayz?" },
      { phrase: "Where are the fitting rooms located?", translation: "Kiyib ko'rish xonalari qayerda joylashgan?", pronunciation: "Ver ar the fit-ting rumz lo-key-ted?" },
      { phrase: "This fabric feels very premium and breathable.", translation: "Bu mato juda sifatli va havo o'tkazuvchan ekan.", pronunciation: "Dhis feb-rik filz ve-ri pri-mi-um end bri-dhe-bl." },
      { phrase: "Does this come with a return policy or warranty?", translation: "Buning qaytarish qoidalari yoki kafolati bormi?", pronunciation: "Daz dhis kam vidh e ri-tern po-li-si or vor-ran-ti?" }
    ],
    dialogue_starter: "Hello! That jacket is part of our brand new autumn collection. Would you like to try it on in the fitting room?",
    mini_quiz: [
      {
        question: "'Fitting room' so'zining to'g'ri o'zbekcha tarjimasi:",
        options: ["Kassa stoli", "Kiyib ko'rish xonasi", "Omborxona", "Poyabzal bo'limi"],
        correct_answer: 1,
        explanation: "'Fitting room' kiyimning qanday yarashishini tekshirish uchun mo'ljallangan xonadir."
      }
    ]
  },
  {
    section_id: 11,
    title: "Jamoat Transportida",
    title_en: "Public Transport",
    category: "Shahar Hayoti",
    difficulty: "Boshlang'ich",
    duration: "10 daqiqa",
    xp_reward: 105,
    scenario_context: "Metro yoki avtobusda transport kartasidan foydalanish, oraliq bekatlarni surishtirish va manzilga to'g'ri yetib olish.",
    ai_role: "Jamoat transporti yo'lovchisi / nazoratchi",
    user_role: "Shahar ichida harakatlanayotgan yo'lovchi",
    icon_name: "Bus",
    vocabulary: [
      { phrase: "Does this express route pass through the university campus?", translation: "Bu ekspress yo'nalish universitet hududidan o'tadimi?", pronunciation: "Daz dhis eks-pres ravt pas thru the yu-ni-ver-si-ti kem-pas?" },
      { phrase: "Which station should I transfer for the green line?", translation: "Yashil yo'nalishga o'tish uchun qaysi bekatda tushishim kerak?", pronunciation: "Vich stey-shn shud ay trans-fer for the grin layn?" },
      { phrase: "Can I top up my transport card at the automated terminal?", translation: "Transport kartamni avtomatlashtirilgan terminalda to'ldirsam bo'ladimi?", pronunciation: "Ken ay top ap may trans-port kard et the o-to-mey-ted ter-mi-nal?" },
      { phrase: "Excuse me, are you stepping off at the upcoming stop?", translation: "Kechirasiz, keyingi bekatda tushasizmi?", pronunciation: "Eks-kyuz mi, ar yu step-ping of et the ap-ka-ming stop?" }
    ],
    dialogue_starter: "Pardon me! If you are heading towards the central tech hub, this train is the quickest direct route.",
    mini_quiz: [
      {
        question: "'Transfer to another line' nimani bildiradi?",
        options: ["Boshqa yo'nalishga o'tish", "Chipta sotib olish", "Oxirgi bekat", "Taksi chaqirish"],
        correct_answer: 0,
        explanation: "'Transfer' metro yoki avtobus yo'nalishlarini almashtirishni anglatadi."
      }
    ]
  },
  {
    section_id: 12,
    title: "Kafeda Qahva Buyurtma Qilish",
    title_en: "Ordering Coffee at a Cafe",
    category: "Kafe va Qahva",
    difficulty: "Boshlang'ich",
    duration: "10 daqiqa",
    xp_reward: 110,
    scenario_context: "Shinam kafeda baristadan kapuchino, qovurilgan donli qahva va bodom suti bilan tayyorlashni so'rash hamda ish uchun qulay joy tanlash.",
    ai_role: "Mahoratli barista (Barista Sam)",
    user_role: "Qahva va qulay ish joyi qidirayotgan mijoz",
    icon_name: "Coffee",
    vocabulary: [
      { phrase: "Could I have a large oat milk latte with extra espresso shot?", translation: "Qo'shimcha espresso va suli suti bilan katta latte qilib bera olasizmi?", pronunciation: "Kud ay hev e larj ovt milk lat-te vidh eks-tra es-pres-so shot?" },
      { phrase: "Is that for dine-in or takeaway?", translation: "Shu yerda ichasizmi yoki o'zingiz bilan olib ketasizmi?", pronunciation: "Iz dhet for dayn-in or teyk-e-vey?" },
      { phrase: "Do you have power outlets near the window tables?", translation: "Deraza yonidagi stollar yaqinida elektr rozetkalari bormi?", pronunciation: "Du yu hev pav-er avt-lets nir the vin-dov teyb-lz?" },
      { phrase: "Please prepare it with no added syrup.", translation: "Qo'shimcha shakarsiz / sirop qo'shmasdan tayyorlang, iltimos.", pronunciation: "Pliz pri-per it vidh nov ed-ded si-rap." }
    ],
    dialogue_starter: "Good morning! Welcome to the Roastery. What delightful coffee drink can I craft for you today?",
    mini_quiz: [
      {
        question: "'Dine-in or Takeaway' savoliga eng to'g'ri tushuntirish:",
        options: ["Sovuqmi yoki issiqmi?", "Shu yerda ichasizmi yoki olib ketasizmi?", "Kattami yoki kichikmi?", "Shirinmi yoki achchiqmi?"],
        correct_answer: 1,
        explanation: "'Dine-in' joyida o'tirish, 'Takeaway' olib ketishni bildiradi."
      }
    ]
  },
  {
    section_id: 13,
    title: "Favqulodda Vaziyatlar va Yordam",
    title_en: "Emergency & Help",
    category: "Xavfsizlik",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 145,
    scenario_context: "Hujjat yo'qolganda, tez tibbiy yordam yoki politsiya kerak bo'lganda favqulodda xizmatlar bilan tezkor va aniq muloqot qilish.",
    ai_role: "Favqulodda qutqaruv xizmati dispetcheri (Emergency 911/112)",
    user_role: "Shoshilinch yordam so'ragan fuqaro",
    icon_name: "ShieldAlert",
    vocabulary: [
      { phrase: "Please dispatch assistance immediately, there is an emergency.", translation: "Iltimos, zudlik bilan yordam yuboring, favqulodda holat yuz berdi.", pronunciation: "Pliz dis-pech as-sis-tens im-mi-di-et-li, dher iz en i-mer-jen-si." },
      { phrase: "I lost my backpack containing my international passport and laptop.", translation: "Ichida xalqaro pasportim va noutbukim bo'lgan ryukzakimni yo'qotib qo'ydim.", pronunciation: "Ay lost may bek-pek kon-tey-ning may in-ter-ne-shn-al pas-port end lep-top." },
      { phrase: "Where is the nearest embassy or police precinct?", translation: "Eng yaqin elchixona yoki politsiya bo'limi qayerda?", pronunciation: "Ver iz the nir-est em-bas-si or po-lis pri-sinkt?" },
      { phrase: "Stay calm, help is on the way to your GPS coordinates.", translation: "Xotirjam bo'ling, yordam guruhi sizning GPS manzilingizga yo'l oldi.", pronunciation: "Stey kam, help iz on the vey tu yor Ji-Pi-Es ko-or-di-neyts." }
    ],
    dialogue_starter: "Emergency Dispatch. Please state your exact location and the nature of your emergency calmly.",
    mini_quiz: [
      {
        question: "'Stay calm, help is on the way' iborasining ma'nosi nima?",
        options: ["Xavf tugadi", "Xotirjam bo'ling, yordam yo'lda", "Hujjatlaringizni bering", "Kutish shart emas"],
        correct_answer: 1,
        explanation: "Bu jumla favqulodda xizmat xodimi tomonidan tinchlantirish va yordam kelayotganini bildirishda aytiladi."
      }
    ]
  },
  {
    section_id: 14,
    title: "Ob-havo Haqida Gurunlashish",
    title_en: "Talking about Weather",
    category: "Kundalik Muloqot",
    difficulty: "Boshlang'ich",
    duration: "10 daqiqa",
    xp_reward: 100,
    scenario_context: "Xalqaro do'stlar yoki hamkasblar bilan bugungi quyoshli, yomg'irli ob-havo va dam olish kunlaridagi rejalarni muhokama qilish.",
    ai_role: "Suhbatdosh xushchaqchaq hamkasb (Anvar)",
    user_role: "Small talk qurayotgan suhbatdosh",
    icon_name: "CloudSun",
    vocabulary: [
      { phrase: "The weather forecast predicts clear blue skies throughout the weekend.", translation: "Ob-havo ma'lumoti dam olish kunlarida musaffo ochiq osmonni bashorat qilmoqda.", pronunciation: "The vedh-er for-kast pri-dikts klir blu skayz thru-avt the vik-end." },
      { phrase: "It looks like heavy rain, don’t forget to grab an umbrella.", translation: "Kuchli yomg'ir yog'adiganga o'xshaydi, soyabon olishni unutmang.", pronunciation: "It luks layk he-vi reyn, dont for-get tu greb en am-brel-la." },
      { phrase: "I really enjoy crisp autumn mornings with fresh breeze.", translation: "Salqin shabbodali kuzgi tonglarni juda yoqtiraman.", pronunciation: "Ay ri-al-li en-joy krisp o-tam mor-ningz vidh fresh briz." },
      { phrase: "How hot does it typically get during summer in your hometown?", translation: "Yoz faslida sizning shahringizda odatda havo qanchalik issiq bo'ladi?", pronunciation: "Hav hot daz it ti-pi-kal-li get dyu-ring sam-mer in yor hovm-tavn?" }
    ],
    dialogue_starter: "What splendid sunny weather we are having today! Are you planning any outdoor activities this weekend?",
    mini_quiz: [
      {
        question: "'Weather forecast' iborasining ma'nosi:",
        options: ["Ob-havo ma'lumoti / bashorati", "Fasl almashinuvi", "Yomg'irli kun", "Termometr"],
        correct_answer: 0,
        explanation: "'Weather forecast' kelgusi kunlardagi ob-havo ma'lumotini bildiradi."
      }
    ]
  },
  {
    section_id: 15,
    title: "Bank va Valyuta Ayirboshlash",
    title_en: "Bank & Currency Exchange",
    category: "Moliya va Bank",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 135,
    scenario_context: "Bank filialida valyuta ayirboshlash kursi bilan tanishish, xalqaro to'lov kartalarini ochish va xavfsiz o'tkazmalarni amalga oshirish.",
    ai_role: "Bank xalqaro operatsiyalar maslahatchisi",
    user_role: "Valyuta operatsiyalarini bajarayotgan mijoz",
    icon_name: "Landmark",
    vocabulary: [
      { phrase: "What is today’s exchange rate for US Dollars to local currency?", translation: "Bugungi AQSH dollarining mahalliy valyutaga ayirboshlash kursi qanday?", pronunciation: "Vot iz tu-deyz eks-cheynj reyt for Yu-Es Dol-larz tu lo-kal kar-ren-si?" },
      { phrase: "I would like to open a multi-currency debit account.", translation: "Men ko'p valyutali debet hisob raqamini ochmoqchiman.", pronunciation: "Ay vud layk tu o-pn e mul-ti kar-ren-si de-bit ak-kavnt." },
      { phrase: "Are there any international transaction or withdrawal fees?", translation: "Xalqaro operatsiyalar yoki naqd pul yechishda komissiya to'lovlari bormi?", pronunciation: "Ar dher e-ni in-ter-ne-shn-al trenz-ek-shn or vidh-dro-val fiz?" },
      { phrase: "Please sign the electronic receipt to confirm the transfer.", translation: "O'tkazmani tasdiqlash uchun elektron kvitansiyaga imzo cheking.", pronunciation: "Pliz sayn the i-lek-tro-nik ri-sit tu kon-ferm the trans-fer." }
    ],
    dialogue_starter: "Good afternoon! Welcome to the Global Premier Bank. How may I assist your financial transactions today?",
    mini_quiz: [
      {
        question: "'Multi-currency account' atamasi nimani bildiradi?",
        options: ["Faqat naqd pul hisobi", "Bir nechta valyutada ishlaydigan hisob raqami", "Kredit qarzi", "Yopiq depozit"],
        correct_answer: 1,
        explanation: "'Multi-currency account' bir nechta xalqaro valyutalarni birgalikda saqlash imkonini beradi."
      }
    ]
  },
  {
    section_id: 16,
    title: "Do'stlar Bilan Kino Muhokamasi",
    title_en: "Discussing Movies with Friends",
    category: "San'at va Ko'ngilochar",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 125,
    scenario_context: "Kinoteatrdan yangi chiqqan ilmiy-fantastik yoki drama filmni tomosha qilib, aktyorlik mahorati va syujet burilishlarini qizg'in tahlil qilish.",
    ai_role: "Kino va san'at muxlisi bo'lgan do'st (Sardor)",
    user_role: "Film taassurotlarini o'rtoqlashayotgan kinoman",
    icon_name: "Film",
    vocabulary: [
      { phrase: "The cinematography and visual effects were absolutely breathtaking.", translation: "Kinematografiya va vizual effektlar haqiqatan ham hayratlanarli darajada ajoyib edi.", pronunciation: "The si-ne-ma-tog-ra-fi end vi-ju-al ef-fekts ver eb-so-lyut-li brez-tey-king." },
      { phrase: "I did not expect that mind-blowing plot twist at the climax!", translation: "Filmni eng yuqori nuqtasidagi kutilmagan syujet burilishini aslo kutmagan edim!", pronunciation: "Ay did not eks-pekt dhet maynd-blov-ing plot tvist et the klay-meks!" },
      { phrase: "The lead actor delivered an Oscar-worthy performance.", translation: "Bosh rol ijrochisi Oskarga munosib mahorat ko'rsatdi.", pronunciation: "The lid ek-ter de-li-verd en Os-kar ver-dhi per-for-mans." },
      { phrase: "What movie genres are on your must-watch list next?", translation: "Keyingi tomosha ro'yxatingizda qaysi film janrlari bor?", pronunciation: "Vot mu-vi jan-rez ar on yor mast-voch list nekst?" }
    ],
    dialogue_starter: "Hey! That final scene gave me absolute chills. What were your honest thoughts on the director’s ending?",
    mini_quiz: [
      {
        question: "'Plot twist' iborasining to'g'ri ma'nosi:",
        options: ["Kutilmagan syujet burilishi", "Oddiy zerikarli yakun", "Film davomiyligi", "Chipta narxi"],
        correct_answer: 0,
        explanation: "'Plot twist' voqealar rivojining kutilmaganda boshqa tomonga o'zgarishidir."
      }
    ]
  },
  {
    section_id: 17,
    title: "Xobbi va Qiziqishlar",
    title_en: "Hobbies & Interests",
    category: "Shaxsiy Hayot",
    difficulty: "Boshlang'ich",
    duration: "12 daqiqa",
    xp_reward: 110,
    scenario_context: "Bo'sh vaqtlarda shug'ullanadigan qiziqishlar — tog' sayri, fotografiya, kitob mutolaasi, musiqa asboblari va kreativ ijod haqida suhbat.",
    ai_role: "Ijodkor va qiziqishlari boy suhbatdosh (Laylo)",
    user_role: "O'z sevimli mashg'ulotlari haqida so'zlayotgan inson",
    icon_name: "Palette",
    vocabulary: [
      { phrase: "In my spare time, I am passionate about landscape photography and hiking.", translation: "Bo'sh vaqtimda manzarali fotosuratlar olish va tog' sayriga juda qiziqaman.", pronunciation: "In may sper taym, ay em pesh-o-net e-bavt lend-skeyp fo-tog-ra-fi end hay-king." },
      { phrase: "Playing acoustic guitar helps me unwind after a demanding workday.", translation: "Akustik gitara chalish og'ir ish kunidan so'ng dam olishimga yordam beradi.", pronunciation: "Pley-ing e-kus-tik gi-tar helps mi an-vaynd af-ter e de-man-ding vork-dey." },
      { phrase: "Have you ever tried landscape oil painting or pottery?", translation: "Hech moybo'yoq bilan rasm chizish yoki kulolchilikni sinab ko'rganmisiz?", pronunciation: "Hev yu e-ver trayd lend-skeyp oyl peyn-ting or pot-te-ri?" },
      { phrase: "Exploring new hobbies broadens your creativity significantly.", translation: "Yangi qiziqishlarni kashf etish inson ijodkorligini sezilarli darajada kengaytiradi.", pronunciation: "Eks-plo-ring nyu hob-biz brod-nz yor kri-ey-ti-vi-ti sig-ni-fi-kant-li." }
    ],
    dialogue_starter: "Hello! It is so refreshing to chat about creative pursuits. What hobby brings you the greatest joy?",
    mini_quiz: [
      {
        question: "'Unwind after work' jumlasi qanday tushuniladi?",
        options: ["Ishdan so'ng dam olish / charchoqni chiqarish", "Qo'shimcha ish qilish", "Erta turish", "Uchrashuv belgilash"],
        correct_answer: 0,
        explanation: "'Unwind' ruhiy va jismoniy dam olish hamda sokinlikka erishish demakdir."
      }
    ]
  },
  {
    section_id: 18,
    title: "Oilaviy An'analar va Bayramlar",
    title_en: "Family & Holidays",
    category: "Madaniyat va Qadriyatlar",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 130,
    scenario_context: "Navro'z, Hayit va Yangi yil kabi milliy bayramlarda an'anaviy dasturxon bezatish, mehmondo'stlik va iliq tilaklar bildirish.",
    ai_role: "Mehmondo'st xonadon egasi (Gulnora opa)",
    user_role: "Bayram dasturxoniga taklif etilgan hurmatli mehmon",
    icon_name: "Sparkles",
    vocabulary: [
      { phrase: "Wishing you and your beloved family happiness, prosperity, and peace!", translation: "Sizga va sevimli oilangizga baxt, to'kinlik va tinchlik-xotirjamlik tilayman!", pronunciation: "Vish-ing yu end yor bi-la-ved fe-mi-li hep-pi-nes, pros-pe-ri-ti, end pis!" },
      { phrase: "Preparing traditional holiday dishes brings generations together.", translation: "An'anaviy bayramona taomlarni birgalikda tayyorlash barcha avlodlarni birlashtiradi.", pronunciation: "Pri-per-ing tra-di-shn-al ho-li-dey dish-ez brings je-ne-rey-shnz tu-gedh-er." },
      { phrase: "Thank you for the warm hospitality and this magnificent feast.", translation: "Iliq mehmondo'stlik va ushbu ajoyib bayramona dasturxon uchun minnatdorman.", pronunciation: "Thenk yu for the vorm hos-pi-te-li-ti end dhis meg-ni-fi-sent fist." },
      { phrase: "What unique traditions do you celebrate in the springtime?", translation: "Bahor faslida qanday o'ziga xos milliy an'analarni nishonlaysiz?", pronunciation: "Vot yu-nik tra-di-shnz du yu se-le-breyt in the spring-taym?" }
    ],
    dialogue_starter: "Assalomu alaykum! Xonadonimizga xush kelibsiz. Navro'z bayrami muborak bo'lsin! Keling, to'rga o'ting.",
    mini_quiz: [
      {
        question: "'Warm hospitality' iborasining to'g'ri o'zbekcha ifodasi:",
        options: ["Sovuq munosabat", "Iliq va samimiy mehmondo'stlik", "Qimmat taom", "Kech qolish"],
        correct_answer: 1,
        explanation: "'Warm hospitality' mehmonga ko'rsatiladigan samimiy ehtirom va g'amxo'rlikdir."
      }
    ]
  },
  {
    section_id: 19,
    title: "Sport va Sog'lom Turmush",
    title_en: "Sports & Fitness",
    category: "Sport va Salomatlik",
    difficulty: "Boshlang'ich",
    duration: "12 daqiqa",
    xp_reward: 115,
    scenario_context: "Sport zalida professional trenyor bilan individual mashg'ulot rejasini tuzish, to'g'ri ovqatlanish va natijalarni kuzatish.",
    ai_role: "Sport zali bosh murabbiyi (Coach Alex)",
    user_role: "Sog'lom turmush tarzini boshlayotgan sportchi",
    icon_name: "Activity",
    vocabulary: [
      { phrase: "Consistency in morning workouts builds exceptional stamina.", translation: "Ertalabki mashg'ulotlardagi muntazamlik ajoyib chidamlilikni shakllantiradi.", pronunciation: "Kon-sis-ten-si in mor-ning vork-avts bildz ek-sep-shn-al ste-mi-na." },
      { phrase: "Make sure to properly hydrate and warm up before lifting weights.", translation: "Og'ir toshlarni ko'tarishdan oldin yetarlicha suv iching va yaxshilab qizib oling.", pronunciation: "Meyk shur tu pro-per-li hay-dreyt end vorm ap bi-for lif-ting veyts." },
      { phrase: "We will balance cardiovascular endurance with strength training.", translation: "Biz yurak-qon tomir chidamliligini kuch mashqlari bilan muvozanatda olib boramiz.", pronunciation: "Vi vil ba-lans kar-di-o-vas-kyu-lar en-dyu-rans vidh strength trey-ning." },
      { phrase: "Track your daily nutritional protein intake diligently.", translation: "Kunlik oqsilli to'g'ri ovqatlanish me'yoringizni muntazam nazorat qiling.", pronunciation: "Trek yor dey-li nyu-tri-shn-al pro-tin in-teyk di-li-jent-li." }
    ],
    dialogue_starter: "Welcome to the training arena! Tell me about your primary fitness aspirations for the next three months.",
    mini_quiz: [
      {
        question: "'Warm up before workout' mashqlardan oldin nimani qilishni talab qiladi?",
        options: ["Uxlab olish", "Tana va mushaklarni qizdirish (Warm up)", "Ko'p ovqat yeyish", "Mashqni tugatish"],
        correct_answer: 1,
        explanation: "'Warm up' jarohatlarning oldini olish uchun mushaklarni tayyorlashdir."
      }
    ]
  },
  {
    section_id: 20,
    title: "Ish Joyida Kundalik Muloqot",
    title_en: "Daily Workplace Chat",
    category: "Biznes va Ish",
    difficulty: "O'rta",
    duration: "15 daqiqa",
    xp_reward: 135,
    scenario_context: "Xalqaro kompaniya ofisida hamkasblar bilan loyiha statusi, haftalik sprint rejalari va deadline muddatlarini kelishish.",
    ai_role: "Loyiha rahbari / Team Lead (Kamola)",
    user_role: "Jamoa yetakchi mutaxassisi",
    icon_name: "Briefcase",
    vocabulary: [
      { phrase: "Let’s synchronize our sprint backlog during today’s stand-up.", translation: "Bugungi qisqa stand-up yig'ilishida haftalik vazifalar ro'yxatini sinxronlashtiraylik.", pronunciation: "Lets sin-kro-nayz av-er sprint bek-log dyu-ring tu-deyz stend-ap." },
      { phrase: "We delivered all milestone deliverables ahead of the target deadline.", translation: "Biz barcha asosiy bosqich natijalarini belgilangan muddatdan oldin topshirdik.", pronunciation: "Vi de-li-verd ol mayl-stovn de-li-ve-ra-blz e-hed ov the tar-get ded-layn." },
      { phrase: "Could you share the analytical presentation slides with the stakeholders?", translation: "Tahliliy taqdimot slaydlarini manfaatdor tomonlarga ulasha olasizmi?", pronunciation: "Kud yu sher the e-ne-li-ti-kal pre-zen-tey-shn slaydz vidh the steyk-hovl-derz?" },
      { phrase: "Constructive collaboration is essential for project success.", translation: "Konstruktiv hamkorlik loyiha muvaffaqiyatining asosiy poydevoridir.", pronunciation: "Kon-strak-tiv kol-la-bo-rey-shn iz es-sen-shl for pro-jekt sak-ses." }
    ],
    dialogue_starter: "Good morning team! Let’s quickly review our strategic deliverables and address any potential roadblocks.",
    mini_quiz: [
      {
        question: "'Deliverables ahead of deadline' nimani anglatadi?",
        options: ["Kech qolgan vazifalar", "Vazifalarni muddatidan oldin muvaffaqiyatli topshirish", "Bekor qilingan loyiha", "Tanaffus"],
        correct_answer: 1,
        explanation: "Belgilangan deadline muddatidan avval natijalarni muvaffaqiyatli yetkazish demakdir."
      }
    ]
  }
];

// Interactive Sentence Builder Puzzle Templates
export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  {
    id: 'p1',
    targetSentence: "I am learning English for my professional career.",
    translation: "Men o'z kasbiy faoliyatim uchun ingliz tilini o'rganyapman.",
    words: ["I", "am", "learning", "English", "for", "my", "professional", "career."],
    hint: "Boshida 'I am learning...' bilan boshlang."
  },
  {
    id: 'p2',
    targetSentence: "Could you give me a small discount at Chorsu market?",
    translation: "Chorsu bozorida menga ozgina chegirma bera olasizmi?",
    words: ["Could", "you", "give", "me", "a", "small", "discount", "at", "Chorsu", "market?"],
    hint: "'Could you give me...' shaklidagi muloyim so'rov."
  },
  {
    id: 'p3',
    targetSentence: "We build scalable software applications with modern tools.",
    translation: "Biz zamonaviy vositalar bilan kengayuvchan dasturlar quramiz.",
    words: ["We", "build", "scalable", "software", "applications", "with", "modern", "tools."],
    hint: "'We build...' — Dasturchi jamoasining faoliyati."
  },
  {
    id: 'p4',
    targetSentence: "The flight arrives at the international terminal on time.",
    translation: "Parvoz xalqaro terminalga o'z vaqtida yetib keladi.",
    words: ["The", "flight", "arrives", "at", "the", "international", "terminal", "on", "time."],
    hint: "Aeroport mavzusidagi gap."
  },
  {
    id: 'p5',
    targetSentence: "One large cappuccino with oat milk to go please.",
    translation: "Olib ketish uchun suli suti bilan bitta katta kapuchino, iltimos.",
    words: ["One", "large", "cappuccino", "with", "oat", "milk", "to", "go", "please."],
    hint: "Kafedagi mashhur buyurtma jumlasi."
  }
];

// Pre-seeded Word Match Pairs
export const WORD_MATCH_PAIRS: WordMatchPair[] = [
  { id: 'w1', phrase: "Greetings", translation: "Salomlashish", pronunciation: "Gri-tingz" },
  { id: 'w2', phrase: "Bargain", translation: "Savdolashish", pronunciation: "Bar-geyn" },
  { id: 'w3', phrase: "Passport Control", translation: "Pasport Nazorati", pronunciation: "Pas-port Kon-trol" },
  { id: 'w4', phrase: "Reservation", translation: "Band qilish", pronunciation: "Re-zer-vey-shn" },
  { id: 'w5', phrase: "Menu", translation: "Taomlar ro'yxati", pronunciation: "Me-nyu" },
  { id: 'w6', phrase: "Interview", translation: "Ish suhbati", pronunciation: "In-ter-vyu" },
  { id: 'w7', phrase: "Emergency", translation: "Favqulodda holat", pronunciation: "I-mer-jen-si" },
  { id: 'w8', phrase: "Weather", translation: "Ob-havo", pronunciation: "Vedh-er" },
  { id: 'w9', phrase: "Exchange Rate", translation: "Valyuta kursi", pronunciation: "Eks-cheynj Reyt" },
  { id: 'w10', phrase: "Hospitality", translation: "Mehmondo'stlik", pronunciation: "Hos-pi-te-li-ti" },
];
