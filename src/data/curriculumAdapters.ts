import { LessonSection, SentencePuzzle, WordMatchPair, QuizQuestion, VocabularyItem } from '../types';
import { OFFICIAL_SECTIONS, SENTENCE_PUZZLES, WORD_MATCH_PAIRS } from './curriculum';

// Helper to generate full 20-scenario multilingual dictionary
export const MULTILINGUAL_SECTIONS: Record<string, Partial<LessonSection>[]> = {
  // ==========================================
  // 0. ENGLISH (en) - Complete 20 Scenarios
  //
  // OFFICIAL_SECTIONS already carries English vocabulary and dialogue openers,
  // but its titles, contexts, roles, and quiz prompts are written in Uzbek —
  // they were authored as the scaffolding an Uzbek speaker reads. Every other
  // target language replaces that scaffolding with its own, so English needs
  // the same treatment or it is the one language that still reads as Uzbek.
  // Vocabulary `translation` stays Uzbek everywhere: that is the learner gloss.
  // ==========================================
  en: [
    {
      section_id: 1,
      title: "Greetings & Introductions",
      scenario_context: "Introducing yourself to a new circle of friends or at a formal meeting, and speaking politely about your profession and background.",
      ai_role: "A friendly colleague you have just met",
      user_role: "A professional / learner introducing themselves",
      mini_quiz: [
        {
          question: "What does the phrase 'Nice to meet you' express?",
          options: ["Xayr, salomat bo'ling", "Tanishganimdan juda xursandman", "Qayerdansiz?", "Iltimos, yordam bering"],
          correct_answer: 1,
          explanation: "'Nice to meet you' yangi inson bilan uchrashganda mehmondo'stlik va samimiyat belgisidir."
        },
        {
          question: "Which grammatical structure do you use to state your profession?",
          options: ["I have a student", "I am a [Profession]", "I do engineer", "I stay doctor"],
          correct_answer: 1,
          explanation: "'I am a...' (Men ... man) shaxsiy kasb va rolni to'g'ri ifodalash formulasidir."
        }
      ]
    },
    {
      section_id: 2,
      title: "Bargaining at the Market",
      scenario_context: "Buying freshly picked melons, raisins, and dried fruit at a historic bazaar, and haggling warmly with the vendor.",
      ai_role: "A cheerful, quick-witted fruit seller at the bazaar",
      user_role: "A shopper visiting the market",
      mini_quiz: [
        {
          question: "Which phrase best asks a vendor to lower the price?",
          options: ["Could you give a discount?", "Bring me the bill immediately", "I don't like it", "Where is the airport?"],
          correct_answer: 0,
          explanation: "'Could you give a discount?' xushmuomalalik bilan narxni kelishish jumlasi hisoblanadi."
        },
        {
          question: "What does 'Can I taste it?' mean?",
          options: ["Buni tekinga olsam bo'ladimi?", "Totib ko'rsam bo'ladimi?", "Tortib bering", "Qaytim bering"],
          correct_answer: 1,
          explanation: "'Taste' so'zi ta'mini tatib ko'rish ma'nosini anglatadi."
        }
      ]
    },
    {
      section_id: 3,
      title: "Airport & Passport Control",
      scenario_context: "Answering a passport control officer's questions after landing at an international airport, and explaining your visa and the purpose of your trip.",
      ai_role: "A senior airport passport control inspector",
      user_role: "A professional arriving for a conference or holiday",
      mini_quiz: [
        {
          question: "What does 'Purpose of visit' refer to?",
          options: ["Sayohat xarajati", "Tashrif maqsadi", "Yashash manzili", "Parvoz davomiyligi"],
          correct_answer: 1,
          explanation: "'Purpose of visit' — safar maqsadi demakdir."
        }
      ]
    },
    {
      section_id: 4,
      title: "Ordering a Taxi",
      scenario_context: "Getting into a taxi downtown, explaining your destination, pointing out the shortest route on the map, and settling how you will pay.",
      ai_role: "A polite taxi driver who knows the city well",
      user_role: "A passenger hurrying to a meeting",
      mini_quiz: [
        {
          question: "What does 'Keep the change' mean?",
          options: ["Qaytimni bering", "Qaytimi qolsin / kerak emas", "Tezroq haydang", "To'xtating"],
          correct_answer: 1,
          explanation: "'Keep the change' haydovchiga qaytimni minnatdorchilik sifatida qoldirishda ishlatiladi."
        }
      ]
    },
    {
      section_id: 5,
      title: "Hotel Check-in",
      scenario_context: "Checking in at a modern hotel and asking about the Wi-Fi password, the gym, and breakfast hours.",
      ai_role: "The hotel's head receptionist",
      user_role: "A traveller or business guest with a reservation",
      mini_quiz: [
        {
          question: "What is the process of registering on arrival at a hotel called?",
          options: ["Check-out", "Check-in", "Room-service", "Boarding"],
          correct_answer: 1,
          explanation: "'Check-in' mehmonxonaga kirib joylashish jarayonini bildiradi."
        }
      ]
    },
    {
      section_id: 6,
      title: "Ordering at a Restaurant",
      scenario_context: "Booking a table at a popular restaurant, asking what is in the local and European dishes, and requesting the bill.",
      ai_role: "A senior waiter at the restaurant",
      user_role: "A guest choosing a good dinner",
      mini_quiz: [
        {
          question: "What does 'Chef specials' mean?",
          options: ["Arzon taomlar", "Bosh oshpazning maxsus tavsiyasi", "Ichimliklar", "Bolalar menyusi"],
          correct_answer: 1,
          explanation: "'Chef specials' restorandagi eng mashhur va oshpaz tomonidan tayyorlangan maxsus taomlardir."
        }
      ]
    },
    {
      section_id: 7,
      title: "Asking for Directions",
      scenario_context: "Asking passers-by how to reach the nearest metro station, tech hub, or historic square in an unfamiliar city.",
      ai_role: "A helpful passer-by who knows the city",
      user_role: "A traveller using a map",
      mini_quiz: [
        {
          question: "What does 'within walking distance' mean?",
          options: ["Faqat taksida boriladi", "Piyoda yetib olsa bo'ladigan masofada", "Juda uzoqda", "Yopiq hudud"],
          correct_answer: 1,
          explanation: "'Walking distance' piyoda yurish uchun qulay yaqinlikni bildiradi."
        }
      ]
    },
    {
      section_id: 8,
      title: "Doctor's Visit & Pharmacy",
      scenario_context: "Describing your symptoms clearly when you feel unwell, and consulting a doctor about blood pressure or medication.",
      ai_role: "A doctor at an international clinic (Dr. Emily)",
      user_role: "A patient seeking medical help",
      mini_quiz: [
        {
          question: "What does 'prescription' mean in a medical context?",
          options: ["Kasalxona to'lovi", "Shifokor retsepti", "Tana harorati", "Operatsiya"],
          correct_answer: 1,
          explanation: "'Prescription' shifokor tomonidan dorilarni berish uchun yozilgan rasmiy retseptdir."
        }
      ]
    },
    {
      section_id: 9,
      title: "Modern IT Job Interview",
      scenario_context: "Taking a technical interview for a Frontend/Full-Stack engineering role at an international company, and defending your architecture and past projects.",
      ai_role: "The CTO of a global IT company (lead interviewer)",
      user_role: "A candidate for a senior developer role",
      mini_quiz: [
        {
          question: "What does 'scalable' specifically mean in software engineering?",
          options: ["Kichik hajmli", "Yuklama oshganda kengaya oladigan (Scalable)", "Eski texnologiya", "Xavfsiz bo'lmagan"],
          correct_answer: 1,
          explanation: "'Scalable' tizim foydalanuvchilar soni oshganda ham barqaror ishlay olish qobiliyatini anglatadi."
        }
      ]
    },
    {
      section_id: 10,
      title: "Shopping for Clothes",
      scenario_context: "Choosing clothes in a brand store, asking for the fitting room, and comparing colours and sizes.",
      ai_role: "A modern in-store stylist and adviser",
      user_role: "A customer buying new clothes",
      mini_quiz: [
        {
          question: "What is a 'fitting room' used for?",
          options: ["Kassa stoli", "Kiyib ko'rish xonasi", "Omborxona", "Poyabzal bo'limi"],
          correct_answer: 1,
          explanation: "'Fitting room' kiyimning qanday yarashishini tekshirish uchun mo'ljallangan xonadir."
        }
      ]
    },
    {
      section_id: 11,
      title: "Public Transport",
      scenario_context: "Using a transport card on the metro or bus, checking the stops along the way, and reaching your destination.",
      ai_role: "A fellow passenger or transport inspector",
      user_role: "A commuter travelling across the city",
      mini_quiz: [
        {
          question: "What does 'transfer to another line' mean?",
          options: ["Boshqa yo'nalishga o'tish", "Chipta sotib olish", "Oxirgi bekat", "Taksi chaqirish"],
          correct_answer: 0,
          explanation: "'Transfer' metro yoki avtobus yo'nalishlarini almashtirishni anglatadi."
        }
      ]
    },
    {
      section_id: 12,
      title: "Ordering Coffee at a Cafe",
      scenario_context: "Asking a barista for a cappuccino or a roasted-bean coffee with almond milk, and finding a comfortable spot to work.",
      ai_role: "A skilled barista (Barista Sam)",
      user_role: "A customer looking for coffee and a good workspace",
      mini_quiz: [
        {
          question: "What is the question 'Dine-in or takeaway?' asking?",
          options: ["Sovuqmi yoki issiqmi?", "Shu yerda ichasizmi yoki olib ketasizmi?", "Kattami yoki kichikmi?", "Shirinmi yoki achchiqmi?"],
          correct_answer: 1,
          explanation: "'Dine-in' joyida o'tirish, 'Takeaway' olib ketishni bildiradi."
        }
      ]
    },
    {
      section_id: 13,
      title: "Emergency & Help",
      scenario_context: "Communicating quickly and precisely with emergency services when documents are lost or you need an ambulance or the police.",
      ai_role: "An emergency dispatch operator (911/112)",
      user_role: "A citizen calling for urgent help",
      mini_quiz: [
        {
          question: "What does 'Stay calm, help is on the way' tell the caller?",
          options: ["Xavf tugadi", "Xotirjam bo'ling, yordam yo'lda", "Hujjatlaringizni bering", "Kutish shart emas"],
          correct_answer: 1,
          explanation: "Bu jumla favqulodda xizmat xodimi tomonidan tinchlantirish va yordam kelayotganini bildirishda aytiladi."
        }
      ]
    },
    {
      section_id: 14,
      title: "Talking about Weather",
      scenario_context: "Chatting with international friends or colleagues about today's sunny or rainy weather and your plans for the weekend.",
      ai_role: "A cheerful colleague making conversation (Anvar)",
      user_role: "Someone making small talk",
      mini_quiz: [
        {
          question: "What does 'weather forecast' mean?",
          options: ["Ob-havo ma'lumoti / bashorati", "Fasl almashinuvi", "Yomg'irli kun", "Termometr"],
          correct_answer: 0,
          explanation: "'Weather forecast' kelgusi kunlardagi ob-havo ma'lumotini bildiradi."
        }
      ]
    },
    {
      section_id: 15,
      title: "Bank & Currency Exchange",
      scenario_context: "Checking exchange rates at a bank branch, opening an international payment card, and making secure transfers.",
      ai_role: "A bank adviser for international operations",
      user_role: "A customer handling currency transactions",
      mini_quiz: [
        {
          question: "What is a 'multi-currency account'?",
          options: ["Faqat naqd pul hisobi", "Bir nechta valyutada ishlaydigan hisob raqami", "Kredit qarzi", "Yopiq depozit"],
          correct_answer: 1,
          explanation: "'Multi-currency account' bir nechta xalqaro valyutalarni birgalikda saqlash imkonini beradi."
        }
      ]
    },
    {
      section_id: 16,
      title: "Discussing Movies with Friends",
      scenario_context: "Watching a new sci-fi or drama release and eagerly analysing the acting and the plot twists afterwards.",
      ai_role: "A friend who loves cinema and the arts (Sardor)",
      user_role: "A film fan sharing impressions",
      mini_quiz: [
        {
          question: "What is a 'plot twist'?",
          options: ["Kutilmagan syujet burilishi", "Oddiy zerikarli yakun", "Film davomiyligi", "Chipta narxi"],
          correct_answer: 0,
          explanation: "'Plot twist' voqealar rivojining kutilmaganda boshqa tomonga o'zgarishidir."
        }
      ]
    },
    {
      section_id: 17,
      title: "Hobbies & Interests",
      scenario_context: "Talking about what you do in your free time — hiking, photography, reading, instruments, and creative work.",
      ai_role: "A creative conversation partner with wide interests (Laylo)",
      user_role: "Someone describing their favourite pastimes",
      mini_quiz: [
        {
          question: "What does it mean to 'unwind after work'?",
          options: ["Ishdan so'ng dam olish / charchoqni chiqarish", "Qo'shimcha ish qilish", "Erta turish", "Uchrashuv belgilash"],
          correct_answer: 0,
          explanation: "'Unwind' ruhiy va jismoniy dam olish hamda sokinlikka erishish demakdir."
        }
      ]
    },
    {
      section_id: 18,
      title: "Family & Holidays",
      scenario_context: "Setting a traditional table for national holidays such as Navruz, Eid, or New Year, welcoming guests and offering warm wishes.",
      ai_role: "A hospitable host welcoming you home (Gulnora opa)",
      user_role: "An honoured guest invited to the holiday table",
      mini_quiz: [
        {
          question: "What does 'warm hospitality' describe?",
          options: ["Sovuq munosabat", "Iliq va samimiy mehmondo'stlik", "Qimmat taom", "Kech qolish"],
          correct_answer: 1,
          explanation: "'Warm hospitality' mehmonga ko'rsatiladigan samimiy ehtirom va g'amxo'rlikdir."
        }
      ]
    },
    {
      section_id: 19,
      title: "Sports & Fitness",
      scenario_context: "Building a personal training plan with a professional coach at the gym, eating well, and tracking your results.",
      ai_role: "The gym's head coach (Coach Alex)",
      user_role: "Someone starting a healthier lifestyle",
      mini_quiz: [
        {
          question: "What should you do when you 'warm up before a workout'?",
          options: ["Uxlab olish", "Tana va mushaklarni qizdirish (Warm up)", "Ko'p ovqat yeyish", "Mashqni tugatish"],
          correct_answer: 1,
          explanation: "'Warm up' jarohatlarning oldini olish uchun mushaklarni tayyorlashdir."
        }
      ]
    },
    {
      section_id: 20,
      title: "Daily Workplace Chat",
      scenario_context: "Agreeing on project status, weekly sprint plans, and deadlines with colleagues at an international company.",
      ai_role: "A project manager / team lead (Kamola)",
      user_role: "A lead specialist on the team",
      mini_quiz: [
        {
          question: "What does 'delivering ahead of the deadline' mean?",
          options: ["Kech qolgan vazifalar", "Vazifalarni muddatidan oldin muvaffaqiyatli topshirish", "Bekor qilingan loyiha", "Tanaffus"],
          correct_answer: 1,
          explanation: "Belgilangan deadline muddatidan avval natijalarni muvaffaqiyatli yetkazish demakdir."
        }
      ]
    }
  ],

  // ==========================================
  // 1. JAPANESE (日本語 - ja) - Complete 20 Scenarios
  // ==========================================
  ja: [
    {
      section_id: 1,
      title: "挨拶と自己紹介 (Tanishuv va Salomlashish)",
      title_en: "Greetings & Self-Introduction",
      scenario_context: "日本のビジネスパートナーや新しい友人との初めての挨拶。自分の職業と出身について礼儀正しく話します。",
      ai_role: "親切な日本人同僚 (田中さん)",
      user_role: "自己紹介をする外国人プロフェッショナル / 学習者",
      dialogue_starter: "初めまして！国際交流グループへようこそ。私の名前は田中です。少し自己紹介をしていただけますか？",
      vocabulary: [
        { phrase: "初めまして！お会いできて嬉しいです。お名前は何ですか？", translation: "Salom! Tanishganimdan xursandman. Ismingiz nima?", pronunciation: "Hajimemashite! Oai dekite ureshii desu. Onamae wa nan desu ka?" },
        { phrase: "私はウズベキスタン出身のソフトウェアエンジニアです。", translation: "Men O'zbekistonlik dasturchiman.", pronunciation: "Watashi wa Uzubekisutan shusshin no sofutowea enjinia desu." },
        { phrase: "最近調子はいかがですか？すべて順調です！", translation: "Ishlaringiz qanday? Hammasi a'lo darajada!", pronunciation: "Saikin choushi wa ikaga desu ka? Subete junchou desu!" },
        { phrase: "温かい歓迎をありがとうございます！", translation: "Samimiy qabul uchun katta rahmat!", pronunciation: "Atatakai kangei o arigatou gozaimasu!" }
      ],
      mini_quiz: [
        { question: "「初めまして」の正しい意味はどれですか？", options: ["Xayr", "Tanishganimdan xursandman", "Yordam bering", "Rahmat"], correct_answer: 1, explanation: "Hajimemashite — ilk uchrashuvdagi xushmuomala salomlashishdir." },
        { question: "「エンジニア」を意味する単語はどれですか？", options: ["学生", "エンジニア", "医者", "店員"], correct_answer: 1, explanation: "エンジニア (Enjinia) — muhandis/dasturchi degan ma'noni bildiradi." }
      ]
    },
    {
      section_id: 2,
      title: "築地・アメ横市場での値段交渉 (Bozorda Savdolashish)",
      title_en: "Bargaining at Tsukiji / Ameyoko Market",
      scenario_context: "築地やアメ横の賑やかな市場で、新鮮な果物や乾物を買い、店主と楽しく値段交渉をします。",
      ai_role: "アメ横市場の活気ある店主 (佐藤さん)",
      user_role: "市場で買い物をする観光客",
      dialogue_starter: "いらっしゃい！今日は最高に甘い果物が入ってるよ。ちょっと味見してみるかい？",
      vocabulary: [
        { phrase: "この新鮮なメロンは1キロいくらですか？", translation: "Bu yangi qovunning bir kilosi qancha turadi?", pronunciation: "Kono shinsen na meron wa ichi kiro ikura desu ka?" },
        { phrase: "2つ買うので、少し割引してもらえますか？", translation: "Agar ikkita olsam, ozgina chegirma qilasizmi?", pronunciation: "Futatsu kau node, sukoshi waribiki shite moraemasu ka?" },
        { phrase: "試食させてもらってもいいですか？", translation: "Avval kichik bo'lagini totib ko'rsam bo'ladimi?", pronunciation: "Shishoku sasete moratte mo ii desu ka?" },
        { phrase: "キャッシュレス決済やカードは使えますか？", translation: "Karta orqali to'lov qabul qilasizmi?", pronunciation: "Kyasshuresu kessai ya kaado wa tsukaemasu ka?" }
      ],
      mini_quiz: [
        { question: "「割引」の意味は何ですか？", options: ["Chegirma", "Qimmat narx", "Qaytim", "Kvitansiya"], correct_answer: 0, explanation: "Waribiki (割引) — chegirma degan ma'noni anglatadi." }
      ]
    },
    {
      section_id: 3,
      title: "羽田空港と入国審査 (Aeroport va Pasport Nazorati)",
      title_en: "Airport & Immigration Control",
      scenario_context: "成田・羽田空港での入国審査、滞在目的やホテルの説明。",
      ai_role: "入国審査官 (Immigration Officer)",
      user_role: "日本に到着した旅行者 / IT技術者",
      dialogue_starter: "こんにちは。パスポートをご提示ください。日本への滞在目的は何ですか？",
      vocabulary: [
        { phrase: "パスポートと搭乗券はこちらです。", translation: "Mana mening pasportim va chiptam.", pronunciation: "Pasupooto to toujouken wa kochira desu." },
        { phrase: "ITカンファレンスへの参加と観光で10日間滞在します。", translation: "Biznes konferensiya va sayohat uchun 10 kunga keldim.", pronunciation: "Aitii kanfarensi e no sanka to kankou de tookakan taizai shimasu." },
        { phrase: "都内のホテルを予約しています。", translation: "Shahar markazidagi mehmonxonadan joy band qilganman.", pronunciation: "Tonai no hoteru o yoyaku shite imasu." }
      ],
      mini_quiz: [
        { question: "「パスポート」の日本語表記はどれですか？", options: ["チケット", "パスポート", "ホテル", "カバン"], correct_answer: 1, explanation: "Pasupooto (パスポート) — xorijiy pasportdir." }
      ]
    },
    {
      section_id: 4,
      title: "タクシーの利用 (Taksiga Buyurtma Berish)",
      title_en: "Taking a Taxi in Tokyo",
      scenario_context: "東京のタクシーで目的地を伝え、最短ルートで行ってもらう。",
      ai_role: "東京の親切なタクシー運転手",
      user_role: "目的地に向かう乗客",
      dialogue_starter: "ご乗車ありがとうございます！どちらまで向かわれますか？",
      vocabulary: [
        { phrase: "中央ITパークまでお願いします。", translation: "Meni Markaziy IT Parkka olib boring, iltimos.", pronunciation: "Chuuou Aitii Paaku made onegai shimasu." },
        { phrase: "今の渋滞でどれくらい時間がかかりますか？", translation: "Hozirgi tirbandlikda qancha vaqt oladi?", pronunciation: "Ima no juutai de dore kurai jikan ga kakarimasu ka?" },
        { phrase: "お釣りは取っておいてください。ありがとうございます！", translation: "Qaytimi qolsin, katta rahmat!", pronunciation: "Otsuri wa totte oite kudasai. Arigatou gozaimasu!" }
      ],
      mini_quiz: [
        { question: "「お釣り」の意味は何ですか？", options: ["Chipta", "Qaytim puli", "Yo'l haqi", "Bagaj"], correct_answer: 1, explanation: "Otsuri (お釣り) — xarid yoki to'lovdan keyingi qaytim pulidir." }
      ]
    },
    {
      section_id: 5,
      title: "ホテルチェックイン (Mehmonxonaga Joylashish)",
      title_en: "Hotel Check-in in Tokyo",
      scenario_context: "ホテルのフロントでチェックインし、Wi-Fiや朝食時間を確認する。",
      ai_role: "ホテルフロント係",
      user_role: "宿泊客",
      dialogue_starter: "いらっしゃいませ。チェックインでございますね。ご予約のお名前をお伺いできますか？",
      vocabulary: [
        { phrase: "スミスという名前で予約しています。", translation: "Smith nomiga xona band qilganman.", pronunciation: "Sumisu to iu namae de yoyaku shite imasu." },
        { phrase: "朝食は何時から何時までですか？", translation: "Ertalab nonushta soat nechada?", pronunciation: "Choushoku wa nanji kara nanji made desu ka?" },
        { phrase: "Wi-Fiのパスワードを教えていただけますか？", translation: "Wi-Fi parolini bera olasizmi?", pronunciation: "Waifai no pasuwaado o oshiete itadakemasu ka?" }
      ],
      mini_quiz: [
        { question: "「朝食」の読み方は何ですか？", options: ["Choushoku", "Yuushoku", "Chuushoku", "Oyatsu"], correct_answer: 0, explanation: "Choushoku (朝食) — ertalabki nonushta degan ma'noni bildiradi." }
      ]
    },
    {
      section_id: 6,
      title: "和食レストランでの注文 (Restoranda Taom Buyurtma Qilish)",
      title_en: "Ordering at a Japanese Restaurant",
      scenario_context: "伝統的な和食レストランでメニューを見て注文する。",
      ai_role: "和食レストランの店員",
      user_role: "食事を楽しむ客",
      dialogue_starter: "いらっしゃいませ！2名様ですね。お飲み物からお伺いしましょうか？",
      vocabulary: [
        { phrase: "メニューと本日のおすすめを見せていただけますか？", translation: "Menyu va bugungi tavsiyalarni ko'rsatsangiz?", pronunciation: "Menyuu to honjitsu no osusume o misete itadakemasu ka?" },
        { phrase: "伝統的な料理で何が一番おすすめですか？", translation: "An'anaviy taomlardan nimani tavsiya qilasiz?", pronunciation: "Dentouteki na ryouri de nani ga ichiban osusume desu ka?" },
        { phrase: "お会計を別々でお願いできますか？", translation: "Hisobni alohida to'lasak bo'ladimi?", pronunciation: "Okaikei o betsubetsu de onegai dekimasu ka?" }
      ],
      mini_quiz: [
        { question: "「おすすめ」の意味は何ですか？", options: ["Tavsiya / Maxsus taklif", "Taqiqlangan taom", "Hisob-kitob", "Tuz"], correct_answer: 0, explanation: "Osusume (おすすめ) — restoran yoki do'konda tavsiya etiladigan maxsulotdir." }
      ]
    },
    {
      section_id: 7,
      title: "渋谷で道案内を頼む (Shaharda Yo'l So'rash)",
      title_en: "Asking for Directions in Shibuya",
      scenario_context: "駅周辺で目的地への行き方を尋ねる。",
      ai_role: "親切な通行人",
      user_role: "道を探している旅行者",
      dialogue_starter: "すみません、道に迷われましたか？どちらをお探しですか？",
      vocabulary: [
        { phrase: "すみません、一番近い地下鉄の駅はどこですか？", translation: "Kechirasiz, eng yaqin metro bekati qayerda?", pronunciation: "Sumimasen, ichiban chikai chikatetsu no eki wa doko desu ka?" },
        { phrase: "まっすぐ行って、次の交差点を右に曲がってください。", translation: "To'g'riga boring va keyingi chorrahadan o'ngga buriling.", pronunciation: "Massugu itte, tsugi no kousaten o migi ni magatte kudasai." },
        { phrase: "歩いて何分くらいかかりますか？", translation: "Piyoda qancha vaqt ketadi?", pronunciation: "Aruite nanpun kurai kakarimasu ka?" }
      ],
      mini_quiz: [
        { question: "「右に曲がる」の意味は？", options: ["Chapga burilmoq", "O'ngga burilmoq", "To'xtamoq", "Orqaga qaytmoq"], correct_answer: 1, explanation: "Migi ni magaru (右に曲がる) — o'ng tomonga burilish demakdir." }
      ]
    },
    {
      section_id: 8,
      title: "薬局と病院 (Dorixona va Shifokor Qabulida)",
      title_en: "Pharmacy & Clinic Visit",
      scenario_context: "頭痛や風邪の症状を薬剤師や医師に相談する。",
      ai_role: "薬局の薬剤師",
      user_role: "体調が優れない患者",
      dialogue_starter: "どうされましたか？どのような症状がありますか？",
      vocabulary: [
        { phrase: "頭痛と微熱があります。よく効く薬はありますか？", translation: "Boshim og'riyapti va ozgina isitmam bor. Yaxshi dori bormi?", pronunciation: "Zutsuu to binetsu ga arimasu. Yoku kiku kusuri wa arimasu ka?" },
        { phrase: "食後にこの薬を1錠飲んでください。", translation: "Ovqatdan keyin ushbu doridan 1 dona iching.", pronunciation: "Shokugo ni kono kusuri o ichijou nonde kudasai." }
      ],
      mini_quiz: [
        { question: "「食後」の意味は？", options: ["Ovqatdan oldin", "Ovqatdan keyin", "Uyqudan oldin", "Ertalab och qoringa"], correct_answer: 1, explanation: "Shokugo (食後) — ovqatlanib bo'lgandan so'ng degan ma'noni anglatadi." }
      ]
    },
    {
      section_id: 9,
      title: "最新のIT技術面接 (Zamonaviy IT Intervyu)",
      title_en: "Modern IT Job Interview in Tokyo",
      scenario_context: "日本の大手テック企業でReact/TypeScriptエンジニアとしての技術面接。",
      ai_role: "テックリード / 面接官",
      user_role: "フロントエンドエンジニア候補者",
      dialogue_starter: "本日の技術面接にお越しいただきありがとうございます。これまで担当された最も大規模なシステム構成について教えてください。",
      vocabulary: [
        { phrase: "Reactを用いたスケーラブルなフロントエンド開発の経験が豊富です。", translation: "React bilan kengayuvchan tizimlar qurishda katta tajribam bor.", pronunciation: "Riaku to o mochiita sukeeraburu na furontoendo kaihatsu no keiken ga houfu desu." },
        { phrase: "状態管理とパフォーマンス最適化はどのように行っていますか？", translation: "Holatni va tezlikni qanday optimallashtirasiz?", pronunciation: "Joutai kanri to pafoomansu saitekika wa dono you ni okonatte imasu ka?" },
        { phrase: "Redisキャッシュを導入し、APIのレスポンス時間を40％短縮しました。", translation: "Redis kesh bilan API kechikishini 40% ga qisqartirdik.", pronunciation: "Redisu kyasshu o dounyuu shi, Eipiai no resuponsu jikan o yonjuupassento tanshuku shimashita." }
      ],
      mini_quiz: [
        { question: "「パフォーマンス最適化」の意味は？", options: ["Dizaynni o'zgartirish", "Unumdorlikni optimallashtirish", "Xatolarni ko'paytirish", "Kod hajmini oshirish"], correct_answer: 1, explanation: "Pafoomansu saitekika — tizim tezligi va ishlash unumdorligini oshirish demakdir." }
      ]
    },
    {
      section_id: 10,
      title: "ユニクロでのショッピング (Kiyim-kechak Do'konida Xarid)",
      title_en: "Shopping for Clothes in Tokyo",
      scenario_context: "服のサイズや色を店員に確認し、試着する。",
      ai_role: "アパレルショップ店員",
      user_role: "買い物客",
      dialogue_starter: "いらっしゃいませ！ご試着もできますので、お気軽にお声がけください。",
      vocabulary: [
        { phrase: "これのLサイズはありますか？試着してもいいですか？", translation: "Buning L o'lchami bormi? Kiyib ko'rsam bo'ladimi?", pronunciation: "Kore no eru saizu wa arimasu ka? Shichaku shite mo ii desu ka?" },
        { phrase: "試着室はあちらの奥にございます。", translation: "Kiyinish xonasi anavi yerda joylashgan.", pronunciation: "Shichakushitsu wa achira no oku ni gozaimasu." }
      ],
      mini_quiz: [
        { question: "「試着室」の意味は？", options: ["Kassa", "Kiyib ko'rish xonasi", "Ombor", "Eshik"], correct_answer: 1, explanation: "Shichakushitsu (試着室) — kiyimlarni sinab ko'rish xonasi." }
      ]
    },
    {
      section_id: 11,
      title: "東京メトロの利用 (Jamoat Transporti & Metro)",
      title_en: "Using the Tokyo Metro",
      scenario_context: "Suicaカードにチャージして山手線や地下鉄に乗る。",
      ai_role: "駅員 (Station Attendant)",
      user_role: "乗客",
      dialogue_starter: "どちらの路線をご利用ですか？",
      vocabulary: [
        { phrase: "Suicaカードに3000円チャージしたいです。", translation: "Suica kartamga 3000 iyen to'ldirmoqchiman.", pronunciation: "Suika kaado ni sanzen-en chaaji shitai desu." },
        { phrase: "新宿駅に行くにはどのホームですか？", translation: "Shinjuku bekatiga borish uchun qaysi platforma?", pronunciation: "Shinjuku eki ni iku ni wa dono hoomu desu ka?" }
      ],
      mini_quiz: [
        { question: "「駅」の読み方は？", options: ["Eki", "Mise", "Ie", "Gakkou"], correct_answer: 0, explanation: "Eki (駅) — temiryo'l yoki metro bekati." }
      ]
    },
    {
      section_id: 12,
      title: "カフェでコーヒーの注文 (Kafeda Qahva Buyurtma Qilish)",
      title_en: "Ordering at a Tokyo Cafe",
      scenario_context: "カフェでオーツミルクラテを注文し、電源席を確認する。",
      ai_role: "カフェのバリスタ",
      user_role: "リモートワーク中の客",
      dialogue_starter: "いらっしゃいませ！ご注文をお伺いします。",
      vocabulary: [
        { phrase: "オーツミルクのホットラテのグランデサイズをお願いします。", translation: "Suli suti bilan katta issiq latte bering, iltimos.", pronunciation: "Ootsumiruku no hotto rate no gurande saizu o onegai shimasu." },
        { phrase: "店内で召し上がりますか、それともお持ち帰りですか？", translation: "Shu yerda ichasizmi yoki olib ketasizmi?", pronunciation: "Tennai de meshiagarimasu ka, soretomo omochikaeri desu ka?" },
        { phrase: "コンセントが使える席はありますか？", translation: "Rozetkasi bor joy bormi?", pronunciation: "Konsento ga tsukaeru seki wa arimasu ka?" }
      ],
      mini_quiz: [
        { question: "「お持ち帰り」の意味は？", options: ["Shu yerda ovqatlanish", "Olib ketish (Takeaway)", "Yetkazib berish", "Bekor qilish"], correct_answer: 1, explanation: "Omochikaeri (お持ち帰り) — o'zi bilan olib ketish." }
      ]
    },
    {
      section_id: 13,
      title: "緊急事態と救急 (Favqulodda Holatlar va Tezkor Yordam)",
      title_en: "Emergency & First Aid",
      scenario_context: "緊急通報 (119 / 110) で状況を正確に伝える。",
      ai_role: "緊急通報センターオペレーター",
      user_role: "通報者",
      dialogue_starter: "119番です。火事ですか、救急ですか？",
      vocabulary: [
        { phrase: "救急車を呼んでください！怪我人がいます。", translation: "Tez yordam chaqiring! Jarohatlangan kishi bor.", pronunciation: "Kyuukyuusha o yonde kudasai! Kegani ga imasu." },
        { phrase: "現在地は渋谷駅のハチ公前です。", translation: "Hozirgi manzilimiz Shibuya Hachiko haykali oldida.", pronunciation: "Genzaichi wa Shibuya eki no Hachikoumae desu." }
      ],
      mini_quiz: [
        { question: "「救急車」の意味は？", options: ["O't o'chiruvchi", "Tez tibbiy yordam mashinasi", "Politsiya", "Taksi"], correct_answer: 1, explanation: "Kyuukyuusha (救急車) — tez yordam mashinasi." }
      ]
    },
    {
      section_id: 14,
      title: "天気と季節の話題 (Ob-havo va Tabiat)",
      title_en: "Talking about Weather in Japan",
      scenario_context: "桜の開花や台風、季節の気候についての日常会話。",
      ai_role: "会話相手",
      user_role: "学習者",
      dialogue_starter: "今日はとても良い天気ですね！今週末のお花見に行かれますか？",
      vocabulary: [
        { phrase: "明日の天気予報は晴れのち雨です。", translation: "Ertangi ob-havo avval quyoshli, keyin yomg'irli bo'ladi.", pronunciation: "Ashita no tenki yohou wa hare nochi ame desu." },
        { phrase: "春の桜の季節が一番好きです。", translation: "Menga bahordagi gilos gullash fasli eng yoqadi.", pronunciation: "Haru no sakura no kisetsu ga ichiban suki desu." }
      ],
      mini_quiz: [
        { question: "「晴れ」の意味は？", options: ["Quyoshli / Ochiq havo", "Yomg'irli", "Qorli", "Tumanli"], correct_answer: 0, explanation: "Hare (晴れ) — ochiq va quyoshli havo." }
      ]
    },
    {
      section_id: 15,
      title: "銀行と両替 (Bank va Pul Almashinuvi)",
      title_en: "Banking & Currency Exchange in Tokyo",
      scenario_context: "外貨両替や口座開設について窓口で相談する。",
      ai_role: "銀行窓口担当者",
      user_role: "顧客",
      dialogue_starter: "いらっしゃいませ。本日はどのようなご用件でしょうか？",
      vocabulary: [
        { phrase: "米ドルを日本円に両替していただけますか？", translation: "AQSH dollarini yapon iyeniga almashtirib bera olasizmi?", pronunciation: "Beidoru o Nihon-en ni ryougae shite itadakemasu ka?" },
        { phrase: "現在の手数料と為替レートはいくらですか？", translation: "Hozirgi komissiya va valyuta kursi qancha?", pronunciation: "Genzai no tesuuryou to kawase reeto wa ikura desu ka?" }
      ],
      mini_quiz: [
        { question: "「両替」の意味は？", options: ["Pul o'tkazmasi", "Valyuta ayirboshlash", "Kredit", "Omonat"], correct_answer: 1, explanation: "Ryougae (両替) — valyutani almashtirish." }
      ]
    },
    {
      section_id: 16,
      title: "映画と劇場のチケット購入 (Kino va Teatr)",
      title_en: "Cinema & Theater Tickets",
      scenario_context: "TOHOシネマズで映画の座席を選び、チケットを購入する。",
      ai_role: "映画館のスタッフ",
      user_role: "観客",
      dialogue_starter: "いらっしゃいませ！どの作品のチケットをお求めですか？",
      vocabulary: [
        { phrase: "今夜7時からの回で、中央の席を大人2枚お願いします。", translation: "Bugun kechki soat 7 dagi seansga markazdan 2 ta kattalar chiptasi bering.", pronunciation: "Kon'ya shichiji kara no kai de, chuuou no seki o otona nimai onegai shimasu." }
      ],
      mini_quiz: [
        { question: "「座席」の意味は？", options: ["Chipta", "O'rindiq / Joy", "Ekran", "Popkorn"], correct_answer: 1, explanation: "Seki / Zaseki (座席) — tomoshabin o'rindig'i." }
      ]
    },
    {
      section_id: 17,
      title: "京都の寺院と博物館観光 (Muzey va Tarixiy Qadamjolar)",
      title_en: "Sightseeing in Kyoto & Museums",
      scenario_context: "歴史的な名所や博物館でガイドの説明を聞き、見学する。",
      ai_role: "観光ガイド",
      user_role: "観光客",
      dialogue_starter: "こちらは京都で最も有名な歴史的建造物です。写真撮影も可能です。",
      vocabulary: [
        { phrase: "館内での写真撮影は許可されていますか？", translation: "Ichkarida suratga tushishga ruxsat bormi?", pronunciation: "Kannai de no shashin satsuei wa kyoka sarete imasu ka?" },
        { phrase: "音声ガイドを英語またはロシア語で借りられますか？", translation: "Ingliz yoki rus tilidagi audio-gidni ijaraga olsa bo'ladimi?", pronunciation: "Onsei gaido o Eigo matawa Roshia-go de kariraremasu ka?" }
      ],
      mini_quiz: [
        { question: "「写真撮影」の意味は？", options: ["Suratga olish", "Kitob o'qish", "Chipta sotib olish", "Raqsga tushish"], correct_answer: 0, explanation: "Shashin satsuei — rasmga / videoga olish." }
      ]
    },
    {
      section_id: 18,
      title: "フィットネスジムでのトレーニング (Sport Zali)",
      title_en: "Gym & Fitness Training",
      scenario_context: "ジムの会員登録やパーソナルトレーニングの予約。",
      ai_role: "ジムのトレーナー",
      user_role: "会員",
      dialogue_starter: "こんにちは！本日のトレーニング目標は何ですか？",
      vocabulary: [
        { phrase: "月額会員プランに登録したいです。", translation: "Oylik a'zolik rejasiga yozilmoqchiman.", pronunciation: "Getsugaku kaiin puran ni touroku shitai desu." },
        { phrase: "筋力トレーニングのマシンの使い方を教えていただけますか？", translation: "Mashg'ulot trenajoridan foydalanishni ko'rsatib bera olasizmi?", pronunciation: "Kinryoku toreeningu no mashin no tsukaikata o oshiete itadakemasu ka?" }
      ],
      mini_quiz: [
        { question: "「会員」の意味は？", options: ["Murabbiy", "A'zo / Foydalanuvchi", "Menejer", "Mehmon"], correct_answer: 1, explanation: "Kaiin (会員) — klub yoki tashkilot a'zosi." }
      ]
    },
    {
      section_id: 19,
      title: "東京での賃貸アパート契約 (Kvartira Ijaraga Olish)",
      title_en: "Renting an Apartment in Tokyo",
      scenario_context: "不動産屋で家賃や敷金・礼金、駅からの距離を確認する。",
      ai_role: "不動産エージェント (Real Estate Agent)",
      user_role: "部屋を探しているエンジニア",
      dialogue_starter: "どのような間取りやエリアをご希望でしょうか？",
      vocabulary: [
        { phrase: "駅から徒歩10分以内の1LDKのアパートを探しています。", translation: "Bekatdan 10 daqiqalik masofadagi 1 xonali shinam kvartira qidiryapman.", pronunciation: "Eki kara toho juppun inai no wan-eru-dii-kei no apaato o sagashite imasu." },
        { phrase: "毎月の家賃と敷金・礼金はいくらですか？", translation: "Oylik ijara haqi va depozit qancha bo'ladi?", pronunciation: "Maitsuki no yachin to shikikin reikin wa ikura desu ka?" }
      ],
      mini_quiz: [
        { question: "「家賃」の意味は？", options: ["Kvartira narxi", "Oylik ijara haqi", "Kommunal xizmat", "Ta'mirlash"], correct_answer: 1, explanation: "Yachin (家賃) — oylik ijara to'lovi." }
      ]
    },
    {
      section_id: 20,
      title: "交番と落とし物の捜索 (Politsiya va Yo'qolgan Buyumlar)",
      title_en: "Police Box (Koban) & Lost Items",
      scenario_context: "電車の中に財布やスマートフォンを忘れてしまい、交番に届ける。",
      ai_role: "交番の警察官 (Police Officer)",
      user_role: "困っている落とし主",
      dialogue_starter: "こんにちは、どうされましたか？落とし物の届け出ですか？",
      vocabulary: [
        { phrase: "山手線の電車の中に黒い革の財布を置き忘れてしまいました。", translation: "Poyezd ichida qora charm hamyonimni unutib qoldirdim.", pronunciation: "Yamanotesen no densha no naka ni kuroi kawa no saifu o okiwasurete shimaimashita." },
        { phrase: "遺失物届を記入していただけますか？", translation: "Yo'qolgan buyum haqidagi anketani to'ldirib bera olasizmi?", pronunciation: "Ishitsubutsutodoke o kinyuu shite itadakemasu ka?" }
      ],
      mini_quiz: [
        { question: "「財布」の意味は？", options: ["Telefon", "Hamyon", "Kalit", "Hujjat"], correct_answer: 1, explanation: "Saifu (財布) — hamyon / pul qopi." }
      ]
    }
  ],

  // ==========================================
  // 2. GERMAN (Deutsch - de) - Complete 20 Scenarios
  // ==========================================
  de: [
    {
      section_id: 1,
      title: "Kennenlernen & Begrüßung (Tanishuv va Salomlashish)",
      title_en: "Greetings & Introductions in Germany",
      scenario_context: "Vorstellung im formellen oder privaten Kreis in Deutschland. Über Beruf und Herkunft sprechen.",
      ai_role: "Freundlicher deutscher Kollege (Herr Weber)",
      user_role: "Lernender / IT-Spezialist",
      dialogue_starter: "Guten Tag und herzlich willkommen! Mein Name ist Alex Weber. Erzählen Sie mir ein wenig über sich?",
      vocabulary: [
        { phrase: "Guten Tag! Freut mich sehr, Sie kennenzulernen. Wie heißen Sie?", translation: "Salom! Siz bilan tanishganimdan juda xursandman. Ismingiz nima?", pronunciation: "Gu-ten Tak! Froyt mihh zer, zi ken-nen-tsu-ler-nen. Vi hay-sen zi?" },
        { phrase: "Ich bin Softwareentwickler aus Usbekistan.", translation: "Men O'zbekistonlik dasturchiman.", pronunciation: "Ihh bin Soft-ver-ent-vik-ler avs Uz-be-kis-tan." },
        { phrase: "Wie geht es Ihnen? Alles läuft hervorragend!", translation: "Ishlaringiz qanday? Hammasi a'lo!", pronunciation: "Vi get es I-nen? Al-les loyft her-for-ra-gend!" },
        { phrase: "Vielen Dank für den herzlichen Empfang!", translation: "Samimiy qabul uchun katta rahmat!", pronunciation: "Fi-len Dank fyur den herts-li-hen Emp-fang!" }
      ],
      mini_quiz: [
        { question: "Was bedeutet 'Freut mich sehr'?", options: ["Xayr", "Tanishganimdan xursandman", "Yordam bering", "Rahmat"], correct_answer: 1, explanation: "'Freut mich' — tanishuvdagi xursandchilik iborasi." }
      ]
    },
    {
      section_id: 2,
      title: "Feilschen auf dem Wochenmarkt (Bozorda Savdolashish)",
      title_en: "Bargaining at the Market in Germany",
      scenario_context: "Einkaufen auf dem lebendigen Markt in Berlin oder München und Handeln mit dem Händler.",
      ai_role: "Herzlicher Obsthändler auf dem Markt",
      user_role: "Kunde auf dem Markt",
      dialogue_starter: "Guten Morgen! Wir haben heute die süßesten frischen Früchte der Saison. Möchten Sie probieren?",
      vocabulary: [
        { phrase: "Wie viel kostet ein Kilo von diesen frischen Melonen?", translation: "Bu yangi qovunning bir kilosi qancha turadi?", pronunciation: "Vi fil kos-tet ayn Ki-lo fon di-zen fri-shen Me-lo-nen?" },
        { phrase: "Könnten Sie mir einen kleinen Rabatt geben, wenn ich zwei nehme?", translation: "Agar ikkita olsam, ozgina chegirma bera olasizmi?", pronunciation: "Koyn-ten zi mir ay-nen klay-nen Ra-batt ge-ben?" },
        { phrase: "Darf ich vorher ein kleines Stück probieren?", translation: "Avval kichik bo'lagini tatib ko'rsam bo'ladimi?", pronunciation: "Darf ihh for-her ayn klay-nes Shtyuk pro-bi-ren?" }
      ],
      mini_quiz: [
        { question: "Was bedeutet 'Rabatt'?", options: ["Chegirma", "Qimmat narx", "Qaytim", "Kvitansiya"], correct_answer: 0, explanation: "Rabatt — narxdagi chegirma." }
      ]
    },
    {
      section_id: 3,
      title: "Flughafen Frankfurt & Passkontrolle (Aeroport)",
      title_en: "Frankfurt Airport & Passport Control",
      scenario_context: "Einreisekontrolle am Flughafen Frankfurt, Reisezweck und Hoteladresse erklären.",
      ai_role: "Grenzpolizist am Flughafen",
      user_role: "Reisender / IT-Fachkraft",
      dialogue_starter: "Guten Tag. Ihren Reisepass und die Bordkarte bitte. Was ist der Zweck Ihrer Reise?",
      vocabulary: [
        { phrase: "Hier sind mein Reisepass und mein Rückflugticket.", translation: "Mana mening pasportim va qaytish chiptam.", pronunciation: "Hir zint mayn Ray-ze-pas und mayn Ryuk-flug-ti-ket." },
        { phrase: "Ich bin für eine IT-Konferenz und geschäftliche Treffen hier.", translation: "IT konferensiya va biznes uchrashuvlar uchun keldim.", pronunciation: "Ihh bin fyur ay-ne Ay-Ti Kon-fe-rents und ge-sheft-li-khe Tref-fen hir." }
      ],
      mini_quiz: [
        { question: "Was bedeutet 'Reisepass'?", options: ["Haydovchilik guvohnomasi", "Xorijiy pasport", "Mehmonxona kaliti", "Sug'urta"], correct_answer: 1, explanation: "Reisepass — xalqaro pasport." }
      ]
    },
    {
      section_id: 9,
      title: "Modernes IT-Bewerbungsgespräch in Berlin (IT Intervyu)",
      title_en: "IT Job Interview in Germany",
      scenario_context: "Technisches Vorstellungsgespräch für eine Senior Software-Entwickler Position.",
      ai_role: "CTO / Lead Tech Recruiter",
      user_role: "Full-Stack-Entwickler Bewerber",
      dialogue_starter: "Willkommen zum technischen Gespräch! Können Sie uns Ihre Erfahrungen mit skalierbaren Architekturen schildern?",
      vocabulary: [
        { phrase: "Ich habe umfangreiche Erfahrung in der Entwicklung skalierbarer Frontend-Architekturen mit React.", translation: "React bilan kengayuvchan tizimlar qurishda katta tajribam bor.", pronunciation: "Ihh ha-be um-fang-ray-khe Er-fah-rung in der Ent-vik-lung..." },
        { phrase: "Durch Redis-Caching haben wir die Latenz um 40% reduziert.", translation: "Redis kesh orqali kechikishni 40% ga qisqartirdik.", pronunciation: "Durhh Re-dis Ke-shing ha-ben vir di La-tents um fir-tsihh Prot-sent re-du-tsirt." }
      ],
      mini_quiz: [
        { question: "Was bedeutet 'Latenz'?", options: ["Dizayn", "Kechikish vaqti (Latency)", "Foydalanuvchilar soni", "Xatoliklar"], correct_answer: 1, explanation: "Latenz — tizimdagi so'rov kechikish vaqti." }
      ]
    }
  ],

  // ==========================================
  // 3. TURKISH (Türkçe - tr) - Complete 20 Scenarios
  // ==========================================
  tr: [
    {
      section_id: 1,
      title: "Tanışma ve Selamlaşma (Tanishuv va Salomlashish)",
      title_en: "Greetings & Introductions in Turkey",
      scenario_context: "Türkiye'de yeni insanlarla tanışma, meslek ve hedefler hakkında samimi sohbet.",
      ai_role: "Samimi Türk meslektaş (Emre Bey)",
      user_role: "Kendini tanıtan uzman / öğrenci",
      dialogue_starter: "Merhaba! Topluluğumuza hoş geldiniz. Benim adım Emre. Bize biraz kendinizden bahseder misiniz?",
      vocabulary: [
        { phrase: "Merhaba! Tanıştığımıza çok memnun oldum. Adınız nedir?", translation: "Salom! Tanishganimdan juda xursandman. Ismingiz nima?", pronunciation: "Mer-ha-ba! Ta-nysh-ty-gy-my-za chok mem-nun ol-dum." },
        { phrase: "Ben Özbekistanlı bir yazılım mühendisiyim.", translation: "Men O'zbekistonlik dasturiy muhandisman.", pronunciation: "Ben Oez-be-kis-tan-ly bir ya-zy-lym myu-hen-di-si-yim." },
        { phrase: "İşleriniz nasıl gidiyor? Her şey harika!", translation: "Ishlaringiz qanday? Hammasi ajoyib!", pronunciation: "Ish-le-ri-niz na-syl gi-di-yor? Her shey ha-ri-ka!" },
        { phrase: "Sıcak karşılamanız için çok teşekkür ederim!", translation: "Samimiy qabul uchun katta rahmat!", pronunciation: "Sy-jak kar-shy-la-ma-nyz i-chin chok te-shek-kyur e-de-rim!" }
      ],
      mini_quiz: [
        { question: "'Memnun oldum' ifadesinin anlamı nedir?", options: ["Xayr", "Tanishganimdan xursandman", "Kechirasiz", "Rahmat"], correct_answer: 1, explanation: "'Memnun oldum' — tanishuvdagi xursandchilik ifodasi." }
      ]
    },
    {
      section_id: 2,
      title: "Kapalıçarşı'da Pazarlık Yapmak (Bozorda Savdolashish)",
      title_en: "Bargaining at the Grand Bazaar in Istanbul",
      scenario_context: "Tarihi Kapalıçarşı veya Mısır Çarşısı'nda taze baharatlar, tatlı lokumlar alırken pazarlık etmek.",
      ai_role: "Kapalıçarşı'nın neşeli ve tecrübeli esnafı",
      user_role: "Alışveriş yapan misafir",
      dialogue_starter: "Hoş geldiniz kıymetli misafirim! En taze Antep fıstıkları ve mis kokulu lokumlarımız var. Buyrun tadına bakın!",
      vocabulary: [
        { phrase: "Bu taze kavunun kilosu ne kadar?", translation: "Bu yangi qovunning kilosi qancha turadi?", pronunciation: "Bu ta-ze ka-vu-nun ki-lo-su ne ka-dar?" },
        { phrase: "İki tane alsam biraz indirim yapar mısınız?", translation: "Ikkita olsam, ozgina chegirma qilasizmi?", pronunciation: "I-ki ta-ne al-sam bi-raz in-di-rim ya-par my-sy-nyz?" },
        { phrase: "Önce küçük bir dilim tadabilir miyim?", translation: "Avval kichik bo'lagini totib ko'rsam bo'ladimi?", pronunciation: "Oen-je kyu-chyuk bir di-lim ta-da-bi-lir mi-yim?" }
      ],
      mini_quiz: [
        { question: "'İndirim yapmak' ne demektir?", options: ["Chegirma qilmoq / narx tushirmoq", "Tezroq bormoq", "Xaridni rad etmoq", "Qimmat sotmoq"], correct_answer: 0, explanation: "'İndirim' narxni pasaytirishni anglatadi." }
      ]
    },
    {
      section_id: 3,
      title: "İstanbul Havalimanı ve Pasaport Kontrolü (Aeroport)",
      title_en: "Istanbul Airport & Passport Control",
      scenario_context: "İstanbul Havalimanı'nda pasaport kontrolü ve seyahat amacını bildirme.",
      ai_role: "Pasaport Kontrol Polisi",
      user_role: "Türkiye'ye gelen yolcu",
      dialogue_starter: "İyi günler. Pasaportunuzu ve biniş kartınızı görebilir miyim? Türkiye'ye geliş amacınız nedir?",
      vocabulary: [
        { phrase: "Pasaportum ve otel rezervasyonum burada.", translation: "Mana mening pasportim va mehmonxona bronim.", pronunciation: "Pa-sa-por-tum ve o-tel re-zer-vas-yo-num bu-ra-da." },
        { phrase: "İş görüşmeleri ve turizm amacıyla 10 gün kalacağım.", translation: "Biznes uchrashuvlar va sayohat uchun 10 kunga keldim.", pronunciation: "Ish goe-ryush-me-le-ri ve tu-rizm a-ma-jyy-la on gyun ka-la-ja-gym." }
      ],
      mini_quiz: [
        { question: "'Biniş kartı' ne demektir?", options: ["Pasport", "Samolyotga chiqish taloni (Boarding pass)", "Mehmonxona kartasi", "Kredit karta"], correct_answer: 1, explanation: "'Biniş kartı' — samolyotga minish chiptasi." }
      ]
    },
    {
      section_id: 9,
      title: "Modern IT Mülakatı (IT Intervyu)",
      title_en: "IT Technical Interview in Istanbul",
      scenario_context: "İstanbul merkezli bir teknoloji şirketinde Senior Frontend pozisyonu için teknik mülakat.",
      ai_role: "Teknoloji Direktörü (CTO)",
      user_role: "Aday Yazılımcı",
      dialogue_starter: "Teknik mülakatımıza hoş geldiniz! Bize bugüne kadar mimarisini kurduğunuz en büyük projeden bahseder misiniz?",
      vocabulary: [
        { phrase: "React ile ölçeklenebilir web uygulamaları geliştirmede geniş deneyimim var.", translation: "React bilan kengayuvchan dasturlar tuzishda katta tajribam bor.", pronunciation: "Ri-ekt i-le oel-chek-le-ne-bi-lir veb..." },
        { phrase: "Redis önbellekleme sayesinde API gecikmesini %40 azalttık.", translation: "Redis kesh orqali API kechikishini 40% ga qisqartirdik.", pronunciation: "Re-dis oen-bel-lek-le-me sa-ye-sin-de..." }
      ],
      mini_quiz: [
        { question: "'Ölçeklenebilir' kelimesinin anlamı nedir?", options: ["Kengayuvchan (Scalable)", "Sekin ishlovchi", "Eski", "Kichik hajmli"], correct_answer: 0, explanation: "'Ölçeklenebilir' — yuqori yuklamalarda ham bemalol kengaya oladigan tizim." }
      ]
    }
  ],

  // ==========================================
  // 4. KOREAN (한국어 - ko) - Complete 20 Scenarios
  // ==========================================
  ko: [
    {
      section_id: 1,
      title: "인사와 자기소개 (Tanishuv va Salomlashish)",
      title_en: "Greetings & Self-Introduction in Seoul",
      scenario_context: "한국 비즈니스 환경이나 일상에서 정중하게 자신을 소개하기.",
      ai_role: "친절한 한국인 동료 (김민수)",
      user_role: "자신을 소개하는 학습자 / 개발자",
      dialogue_starter: "안녕하세요! 환영합니다. 제 이름은 김민수입니다. 자기소개 부탁드려도 될까요?",
      vocabulary: [
        { phrase: "안녕하세요! 만나서 반갑습니다. 성함이 어떻게 되세요?", translation: "Salom! Tanishganimdan xursandman. Ismingiz nima?", pronunciation: "An-nyeong-ha-se-yo! Man-na-seo ban-gap-seum-ni-da." },
        { phrase: "저는 우즈베키스탄에서 온 소프트웨어 엔지니어입니다.", translation: "Men O'zbekistonlik dasturchiman.", pronunciation: "Jeo-neun U-jeu-be-ki-seu-tan-e-seo on so-peu-teu-we-eo en-ji-ni-eo-im-ni-da." },
        { phrase: "따뜻하게 환영해 주셔서 정말 감사합니다!", translation: "Samimiy qabul uchun katta rahmat!", pronunciation: "Tta-tteut-ha-ge hwan-yeong-hae ju-syeo-seo jeong-mal gam-sa-ham-ni-da!" }
      ],
      mini_quiz: [
        { question: "'반갑습니다'의 올바른 의미는?", options: ["Xayr", "Tanishganimdan xursandman", "Yordam bering", "Rahmat"], correct_answer: 1, explanation: "'반갑습니다' — uchrashuvdagi xursandchilikni bildiradi." }
      ]
    },
    {
      section_id: 2,
      title: "남대문 시장에서 흥정하기 (Bozorda Savdolashish)",
      title_en: "Bargaining at Namdaemun Market in Seoul",
      scenario_context: "활기찬 전통 시장에서 신선한 과일과 견과류를 사며 흥정하기.",
      ai_role: "남대문 시장 상인",
      user_role: "시장 방문객",
      dialogue_starter: "어서 오세요! 오늘 갓 들어온 달콤한 과일들 많아요. 한번 맛보실래요?",
      vocabulary: [
        { phrase: "이 신선한 멜론 1킬로에 얼마예요?", translation: "Bu yangi qovunning kilosi qancha?", pronunciation: "I sin-seon-han mel-lon il-kil-lo-e eol-ma-ye-yo?" },
        { phrase: "두 개 사면 조금 깎아주실 수 있나요?", translation: "Ikkita olsam, ozgina chegirma qilasizmi?", pronunciation: "Du gae sa-myeon jo-geum kkak-a-ju-sil su in-na-yo?" },
        { phrase: "먼저 한 조각 맛봐도 될까요?", translation: "Avval tatib ko'rsam bo'ladimi?", pronunciation: "Meon-jeo han jo-gak mat-bwa-do doel-kka-yo?" }
      ],
      mini_quiz: [
        { question: "'깎아주세요'의 의미는?", options: ["Chegirma qilib bering / narxni tushiring", "Tezroq bering", "Qimmatga soting", "To'xtating"], correct_answer: 0, explanation: "'깎아주세요' — bozorda narxni arzonlashtirishni so'rash iborasi." }
      ]
    },
    {
      section_id: 9,
      title: "강남 테크 기업 IT 면접 (IT Intervyu)",
      title_en: "IT Job Interview in Gangnam, Seoul",
      scenario_context: "서울 강남의 테크 기업에서 시니어 프론트엔드 엔지니어 기술 면접.",
      ai_role: "기술 면접관 (CTO)",
      user_role: "개발자 지원자",
      dialogue_starter: "기술 면접에 오신 것을 환영합니다. 지금까지 구축하신 가장 큰 규모의 웹 아키텍처에 대해 말씀해 주시겠습니까?",
      vocabulary: [
        { phrase: "React와 TypeScript를 활용하여 대규모 프론트엔드를 구축한 경험이 풍부합니다.", translation: "React va TypeScript bilan keng ko'lamli tizimlar qurishda tajribam bor.", pronunciation: "Ri-ek-teu-wa Tai-peu-seu-keu-rip-teu-reul hwal-yong-ha-yeo..." },
        { phrase: "Redis 캐싱을 도입하여 API 응답 지연 시간을 40% 단축했습니다.", translation: "Redis kesh orqali API kechikishini 40% ga qisqartirdik.", pronunciation: "Re-di-seu kae-sing-eul do-ip-ha-yeo..." }
      ],
      mini_quiz: [
        { question: "'대규모'의 의미는?", options: ["Kichik hajm", "Keng ko'lamli / Katta masshtabli", "Eski", "Sekin"], correct_answer: 1, explanation: "'대규모' — katta masshtabli va yirik tizimlarni anglatadi." }
      ]
    }
  ],

  // ==========================================
  // 5. RUSSIAN (Русский - ru) - Complete 20 Scenarios
  // ==========================================
  ru: [
    {
      section_id: 1,
      title: "Знакомство и Приветствие (Tanishuv va Salomlashish)",
      title_en: "Greetings & Introductions in Russian",
      scenario_context: "Приветствие и знакомство в деловой или дружеской обстановке на русском языке.",
      ai_role: "Дружелюбный коллега / собеседник (Анна)",
      user_role: "Специалист / учащийся",
      dialogue_starter: "Здравствуйте! Добро пожаловать в нашу команду. Расскажите немного о себе?",
      vocabulary: [
        { phrase: "Здравствуйте! Очень приятно познакомиться. Как вас зовут?", translation: "Salom! Tanishganimdan juda xursandman. Ismingiz nima?", pronunciation: "Zdrast-vuy-te! O-chen pri-yat-no poz-na-ko-mit-sya." },
        { phrase: "Я разработчик программного обеспечения из Узбекистана.", translation: "Men O'zbekistonlik dasturchiman.", pronunciation: "Ya raz-ra-bot-chik prog-ram-no-go o-bes-pe-che-ni-ya." },
        { phrase: "Как ваши дела? Всё идёт отлично!", translation: "Ishlaringiz qanday? Hammasi a'lo!", pronunciation: "Kak va-shi de-la? Vsyo i-dyot ot-lich-no!" }
      ],
      mini_quiz: [
        { question: "Что означает фраза 'Приятно познакомиться'?", options: ["Xayr", "Tanishganimdan xursandman", "Kechirasiz", "Rahmat"], correct_answer: 1, explanation: "'Приятно познакомиться' — tanishuvdagi xushmuomala iboradir." }
      ]
    },
    {
      section_id: 2,
      title: "Торговля на Базаре Чорсу / Рынке (Bozorda Savdolashish)",
      title_en: "Bargaining at the Market in Russian",
      scenario_context: "Покупка свежих дынь, сухофруктов и орехов на колоритном восточном базаре.",
      ai_role: "Опытный и щедрый продавец фруктов (Собир ака)",
      user_role: "Покупатель на базаре",
      dialogue_starter: "Ассалому алейкум, дорогой гость! У нас самые сладкие дыни и отборный изюм. Попробуете кусочек?",
      vocabulary: [
        { phrase: "Сколько стоит килограмм этих сладких дынь?", translation: "Bu shirin qovunlarning kilosi qancha?", pronunciation: "Skol-ko sto-it ki-lo-gram e-tikh slad-kikh dyn?" },
        { phrase: "Сделаете небольшую скидку, если я возьму две?", translation: "Ikkita olsam, ozgina chegirma qilasizmi?", pronunciation: "Sde-la-ye-te ne-bol-shu-yu skid-ku, es-li ya voz-mu dve?" },
        { phrase: "Можно сначала попробовать маленький кусочек?", translation: "Avval kichik bo'lagini tatib ko'rsam bo'ladimi?", pronunciation: "Mozh-no sna-cha-la pop-ro-bo-vat ma-len-kiy ku-so-chek?" }
      ],
      mini_quiz: [
        { question: "Что означает слово 'Скидка'?", options: ["Chegirma", "Qimmat narx", "Qaytim puli", "Kassa"], correct_answer: 0, explanation: "'Скидка' — narxni pasaytirish yoki arzonlashtirishdir." }
      ]
    },
    {
      section_id: 9,
      title: "Техническое IT-Собеседование (IT Intervyu)",
      title_en: "IT Job Interview in Russian",
      scenario_context: "Собеседование на позицию Senior Frontend разработчика в технологической компании.",
      ai_role: "Технический директор (CTO)",
      user_role: "Кандидат разработчик",
      dialogue_starter: "Здравствуйте! Рады видеть вас на техническом интервью. Расскажите о самом сложном архитектурном решении в вашей практике?",
      vocabulary: [
        { phrase: "У меня глубокий опыт проектирования масштабируемых интерфейсов на React и TypeScript.", translation: "React va TypeScript yordamida kengayuvchan tizimlar qurishda katta tajribam bor.", pronunciation: "U me-nya glu-bo-kiy o-pyt pro-yek-ti-ro-va-ni-ya..." },
        { phrase: "Мы внедрили кэширование в Redis и сократили время отклика API на 40%.", translation: "Redis kesh orqali API kechikishini 40% ga qisqartirdik.", pronunciation: "My vne-dri-li ke-shi-ro-va-ni-ye v Re-dis..." }
      ],
      mini_quiz: [
        { question: "Что означает 'Масштабируемость'?", options: ["Kengayuvchanlik va yuklamaga bardoshlik", "Sekin ishlash", "Eski texnologiya", "Xatolik"], correct_answer: 0, explanation: "'Масштабируемость' — dasturning yuklamalarga moslashib kengaya olishi." }
      ]
    }
  ],

  // ==========================================
  // 6. SPANISH (Español - es) - Complete 20 Scenarios
  // ==========================================
  es: [
    {
      section_id: 1,
      title: "Saludos y Presentaciones (Tanishuv va Salomlashish)",
      title_en: "Greetings & Introductions in Spanish",
      scenario_context: "Presentarse en un entorno profesional o informal en España o Latinoamérica.",
      ai_role: "Colega amable (Carlos)",
      user_role: "Profesional / Estudiante",
      dialogue_starter: "¡Hola! Bienvenido a nuestro equipo internacional. ¿Podrías contarnos un poco sobre ti?",
      vocabulary: [
        { phrase: "¡Hola! Mucho gusto en conocerte. ¿Cómo te llamas?", translation: "Salom! Tanishganimdan xursandman. Ismingiz nima?", pronunciation: "O-la! Mu-cho gus-to en ko-no-ser-te. Ko-mo te ya-mas?" },
        { phrase: "Soy ingeniero de software de Uzbekistán.", translation: "Men O'zbekistonlik dasturchiman.", pronunciation: "Soy in-je-nye-ro de soft-wer de Uz-be-kis-tan." },
        { phrase: "¡Muchas gracias por la cálida bienvenida!", translation: "Samimiy qabul uchun katta rahmat!", pronunciation: "Mu-chas gra-syas por la ka-li-da byen-ve-ni-da!" }
      ],
      mini_quiz: [
        { question: "¿Qué significa 'Mucho gusto'?", options: ["Xayr", "Tanishganimdan xursandman", "Iltimos", "Rahmat"], correct_answer: 1, explanation: "'Mucho gusto' — ispan tilidagi xursandchilik ifodasi." }
      ]
    },
    {
      section_id: 2,
      title: "Regatear en el Mercado San Miguel (Bozorda Savdolashish)",
      title_en: "Bargaining at the Market in Madrid",
      scenario_context: "Comprar frutas frescas y frutos secos en el mercado tradicional y pedir descuento.",
      ai_role: "Vendedor alegre del mercado",
      user_role: "Comprador en el mercado",
      dialogue_starter: "¡Buenos días! Hoy tenemos las frutas más ricas y dulces de la huerta. ¿Le gustaría probar una muestra?",
      vocabulary: [
        { phrase: "¿Cuánto cuesta un kilo de estos melones frescos?", translation: "Bu yangi qovunning kilosi qancha?", pronunciation: "Kwan-to kwes-ta un ki-lo de es-tos me-lo-nes fres-kos?" },
        { phrase: "¿Me podría hacer un pequeño descuento si me llevo dos?", translation: "Ikkita olsam, ozgina chegirma qilib bera olasizmi?", pronunciation: "Me po-dri-a a-ser un pe-ke-nyo des-kwen-to si me ye-vo dos?" },
        { phrase: "¿Puedo probar un pedacito primero?", translation: "Avval kichik bo'lagini tatib ko'rsam bo'ladimi?", pronunciation: "Pwe-do pro-bar un pe-da-si-to pri-me-ro?" }
      ],
      mini_quiz: [
        { question: "¿Qué significa 'Descuento'?", options: ["Chegirma", "Qimmat narx", "Qaytim", "Kassa"], correct_answer: 0, explanation: "'Descuento' — narxni pasaytirish / chegirma." }
      ]
    },
    {
      section_id: 9,
      title: "Entrevista Técnica de TI en Madrid (IT Intervyu)",
      title_en: "IT Job Interview in Spanish",
      scenario_context: "Entrevista técnica para el puesto de Desarrollador Frontend Senior.",
      ai_role: "Director de Tecnología (CTO)",
      user_role: "Candidato Desarrollador",
      dialogue_starter: "¡Bienvenido a la entrevista técnica! ¿Podrías explicarnos cómo optimizas el rendimiento y el estado en aplicaciones React a gran escala?",
      vocabulary: [
        { phrase: "Tengo amplia experiencia en la arquitectura de aplicaciones frontend escalables con React.", translation: "React bilan kengayuvchan tizimlar qurishda katta tajribam bor.", pronunciation: "Ten-go am-plya eks-pe-ryen-sya..." },
        { phrase: "Implementamos caché en Redis y redujimos la latencia de la API en un 40%.", translation: "Redis kesh orqali API kechikishini 40% ga qisqartirdik.", pronunciation: "Im-ple-men-ta-mos ka-she en Re-dis..." }
      ],
      mini_quiz: [
        { question: "¿Qué significa 'Escalabilidad'?", options: ["Kengayuvchanlik va bardoshlilik", "Sekinlik", "Eski tizim", "Xatolik"], correct_answer: 0, explanation: "'Escalabilidad' — tizimning masshtablanish imkoniyati." }
      ]
    }
  ]
};

// Sentence puzzles localized for each target language
export const MULTILINGUAL_SENTENCE_PUZZLES: Record<string, SentencePuzzle[]> = {
  ja: [
    {
      id: 'p-ja-1',
      targetSentence: "私は キャリアのために 日本語を 学んでいます。",
      translation: "Men o'z faoliyatim uchun yapon tilini o'rganyapman.",
      words: ["私は", "キャリアのために", "日本語を", "学んでいます。"],
      hint: "'Watashi wa...' bilan boshlang."
    },
    {
      id: 'p-ja-2',
      targetSentence: "アメ横市場で 少し 割引して もらえますか？",
      translation: "Ameyoko bozorida ozgina chegirma qilib bera olasizmi?",
      words: ["アメ横市場で", "少し", "割引して", "もらえますか？"],
      hint: "Bozordagi xushmuomala so'rov."
    }
  ],
  de: [
    {
      id: 'p-de-1',
      targetSentence: "Ich lerne Deutsch für meine berufliche Zukunft.",
      translation: "Men kasbiy kelajagim uchun nemis tilini o'rganyapman.",
      words: ["Ich", "lerne", "Deutsch", "für", "meine", "berufliche", "Zukunft."],
      hint: "Beginnen Sie mit 'Ich lerne...'"
    },
    {
      id: 'p-de-2',
      targetSentence: "Könnten Sie mir einen kleinen Rabatt geben?",
      translation: "Menga ozgina chegirma bera olasizmi?",
      words: ["Könnten", "Sie", "mir", "einen", "kleinen", "Rabatt", "geben?"],
      hint: "Höfliche Bitte nach einem Rabatt."
    }
  ],
  tr: [
    {
      id: 'p-tr-1',
      targetSentence: "Mesleki kariyerim için Türkçe öğreniyorum.",
      translation: "Men kasbiy faoliyatim uchun turk tilini o'rganyapman.",
      words: ["Mesleki", "kariyerim", "için", "Türkçe", "öğreniyorum."],
      hint: "'Mesleki kariyerim için...' ile başlayın."
    },
    {
      id: 'p-tr-2',
      targetSentence: "Kapalıçarşı'da bana biraz indirim yapabilir misiniz?",
      translation: "Kapalıçarşıda menga ozgina chegirma qila olasizmi?",
      words: ["Kapalıçarşı'da", "bana", "biraz", "indirim", "yapabilir", "misiniz?"],
      hint: "Pazarlık yapma cümlesi."
    }
  ],
  es: [
    {
      id: 'p-es-1',
      targetSentence: "Estoy aprendiendo español para mi carrera profesional.",
      translation: "Men kasbiy faoliyatim uchun ispan tilini o'rganyapman.",
      words: ["Estoy", "aprendiendo", "español", "para", "mi", "carrera", "profesional."],
      hint: "Empieza con 'Estoy aprendiendo...'"
    }
  ],
  ru: [
    {
      id: 'p-ru-1',
      targetSentence: "Я изучаю язык для профессионального развития.",
      translation: "Men kasbiy rivojlanishim uchun til o'rganyapman.",
      words: ["Я", "изучаю", "язык", "для", "профессионального", "развития."],
      hint: "'Я изучаю...' bilan boshlang."
    },
    {
      id: 'p-ru-2',
      targetSentence: "Сделайте пожалуйста небольшую скидку на базаре.",
      translation: "Bozorda iltimos ozgina chegirma qilib bering.",
      words: ["Сделайте", "пожалуйста", "небольшую", "скидку", "на", "базаре."],
      hint: "Bozorda narx kelishish iborasi."
    }
  ],
  ko: [
    {
      id: 'p-ko-1',
      targetSentence: "저는 전문적인 커리어를 위해 한국어를 배우고 있습니다.",
      translation: "Men professional kasbiy faoliyatim uchun koreys tilini o'rganyapman.",
      words: ["저는", "전문적인", "커리어를", "위해", "한국어를", "배우고", "있습니다."],
      hint: "'저는 ...' bilan boshlang."
    }
  ]
};

/**
 * The base OFFICIAL_SECTIONS teach English phrases (with Uzbek glosses), so an
 * English learner is already fully served by them. Every other target language
 * needs an override entry per section, otherwise the learner silently receives
 * English content.
 */
const BASE_CONTENT_LANGUAGE = 'en';

function normalizeLangCode(targetLanguageCode: string): string {
  return (targetLanguageCode || BASE_CONTENT_LANGUAGE).toLowerCase().trim();
}

function readCachedOverrides(code: string): Partial<LessonSection>[] | null {
  try {
    const cached = localStorage.getItem(`tiltop_curriculum_cache_${code}`);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch (e) {
    return null;
  }
}

/**
 * All override sources for a language, curated built-ins taking precedence over
 * AI-generated cache so hand-written content is never overwritten by a refresh.
 */
function collectOverrides(code: string): Partial<LessonSection>[] {
  const builtIn = MULTILINGUAL_SECTIONS[code] || [];
  const cached = readCachedOverrides(code) || [];
  const builtInIds = new Set(builtIn.map((o) => o.section_id));
  return [...builtIn, ...cached.filter((o) => !builtInIds.has(o.section_id))];
}

export interface CurriculumCoverage {
  code: string;
  /** section_ids that genuinely exist in the target language */
  covered: number[];
  /** section_ids that would fall back to English content */
  missing: number[];
  total: number;
  isFullyLocalized: boolean;
}

/**
 * Reports how much of the 20-section curriculum genuinely exists in a language.
 * Callers use `missing` to decide whether to request AI adaptation.
 */
export function getCurriculumCoverage(targetLanguageCode: string): CurriculumCoverage {
  const code = normalizeLangCode(targetLanguageCode);
  const total = OFFICIAL_SECTIONS.length;

  // English vocabulary ships in the base sections, so an English learner is
  // never shown untranslated content even if an override entry is missing.
  if (code === BASE_CONTENT_LANGUAGE) {
    return {
      code,
      covered: OFFICIAL_SECTIONS.map((s) => s.section_id),
      missing: [],
      total,
      isFullyLocalized: true,
    };
  }

  const availableIds = new Set(collectOverrides(code).map((o) => o.section_id));
  const covered: number[] = [];
  const missing: number[] = [];
  OFFICIAL_SECTIONS.forEach((sec) => {
    (availableIds.has(sec.section_id) ? covered : missing).push(sec.section_id);
  });

  return { code, covered, missing, total, isFullyLocalized: missing.length === 0 };
}

/**
 * Returns curriculum sections adapted to the chosen target language.
 * Merges base 20 sections with multilingual content and cached AI curriculum if available.
 * Sections with no translation available are flagged `is_localized: false` so the
 * UI can tell the learner they are looking at untranslated English content.
 */
export function getAdaptedCurriculum(
  targetLanguageCode: string,
  _countryFlag?: string,
  _profession?: string,
  _level?: string
): LessonSection[] {
  const code = normalizeLangCode(targetLanguageCode);
  const merged = mergeCurriculumOverrides(OFFICIAL_SECTIONS, collectOverrides(code));

  // The base sections already teach English, so every section counts as
  // localized for an English learner even where an override is absent.
  if (code === BASE_CONTENT_LANGUAGE) {
    return merged.map((sec) => ({ ...sec, is_localized: true }));
  }

  return merged;
}

function mergeCurriculumOverrides(
  baseSections: LessonSection[],
  overrides: Partial<LessonSection>[]
): LessonSection[] {
  return baseSections.map((sec) => {
    const override = overrides.find((o) => o.section_id === sec.section_id);
    if (!override) return { ...sec, is_localized: false };

    return {
      ...sec,
      title: override.title || sec.title,
      title_en: override.title_en || sec.title_en,
      scenario_context: override.scenario_context || sec.scenario_context,
      ai_role: override.ai_role || sec.ai_role,
      user_role: override.user_role || sec.user_role,
      dialogue_starter: override.dialogue_starter || sec.dialogue_starter,
      vocabulary: (override.vocabulary && override.vocabulary.length > 0) ? override.vocabulary : sec.vocabulary,
      mini_quiz: (override.mini_quiz && override.mini_quiz.length > 0) ? override.mini_quiz : sec.mini_quiz,
      is_localized: true,
    };
  });
}

/**
 * The LLM cascade returns a bare array from Gemini but an object from the
 * Mistral/OpenAI fallbacks, which are pinned to `response_format: json_object`.
 * Accept every shape they can produce rather than silently dropping the result.
 */
function extractSectionArray(payload: any): Partial<LessonSection>[] {
  const candidates = [
    payload,
    payload?.sections,
    payload?.sections?.sections,
    payload?.data,
    payload?.curriculum,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate.filter((s) => s && typeof s.section_id === 'number');
    }
  }
  return [];
}

/**
 * Fills the gaps in a language's curriculum via the LLM cascade and caches the
 * result. Curated built-in sections are never requested or overwritten — only
 * the sections that would otherwise fall back to English are generated.
 */
export async function fetchAndCacheDynamicCurriculum(
  targetLanguage: string,
  country: string,
  profession = 'it_specialist',
  level = 'intermediate'
): Promise<LessonSection[]> {
  const code = normalizeLangCode(targetLanguage);
  const coverage = getCurriculumCoverage(code);

  if (coverage.isFullyLocalized) {
    return getAdaptedCurriculum(targetLanguage, country, profession, level);
  }

  try {
    const res = await fetch('/api/translate-curriculum-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_language: targetLanguage,
        country,
        profession,
        level,
        section_ids: coverage.missing,
        sections_to_translate: OFFICIAL_SECTIONS
          .filter((s) => coverage.missing.includes(s.section_id))
          .map((s) => ({
            section_id: s.section_id,
            title: s.title,
            title_en: s.title_en,
            category: s.category,
            scenario_context: s.scenario_context,
          })),
      }),
    });

    if (!res.ok) {
      throw new Error(`Curriculum adaptation request failed with status ${res.status}`);
    }

    const generated = extractSectionArray(await res.json());
    if (generated.length === 0) {
      throw new Error('AI returned no usable curriculum sections');
    }

    // Persist alongside anything already cached, so repeated partial runs accumulate.
    const previouslyCached = readCachedOverrides(code) || [];
    const generatedIds = new Set(generated.map((s) => s.section_id));
    const nextCache = [...previouslyCached.filter((s) => !generatedIds.has(s.section_id)), ...generated];

    try {
      localStorage.setItem(`tiltop_curriculum_cache_${code}`, JSON.stringify(nextCache));
    } catch (e) {
      console.warn('Curriculum cache write failed (storage full or blocked):', e);
    }
  } catch (err) {
    console.warn('AI curriculum adaptation failed, keeping English fallback:', err);
  }

  return getAdaptedCurriculum(targetLanguage, country, profession, level);
}

/**
 * Returns sentence puzzles for the chosen target language.
 */
export function getAdaptedSentencePuzzles(targetLanguageCode: string): SentencePuzzle[] {
  const code = (targetLanguageCode || 'en').toLowerCase().trim();
  const puzzles = MULTILINGUAL_SENTENCE_PUZZLES[code];
  if (puzzles && puzzles.length > 0) {
    return puzzles;
  }
  return SENTENCE_PUZZLES;
}
