/**
 * PlateSync - Bilingual Translation Service (English <-> Hindi)
 * 
 * Provides natural, fluent Devanagari Hindi translations for exercise guides,
 * starting positions, step-by-step instructions, technique cues, breathing patterns,
 * common mistakes, safety notes, and fitness terminology.
 * Preserves recognized fitness/anatomical terminology (e.g., Barbell, Dumbbell, Bench Press,
 * Deltoids, Reps, Sets, Arch, Core) while rendering clear instructional Hindi.
 */

// Local storage key for cached custom translations
const TRANSLATION_CACHE_KEY = 'platesync_hindi_translations_cache';

// Load translation cache
const getCachedTranslations = () => {
  try {
    const raw = localStorage.getItem(TRANSLATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveToCache = (key, value) => {
  try {
    const cache = getCachedTranslations();
    cache[key] = value;
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
};

// Common fitness vocabulary & phrases mapping
export const HINDI_VOCABULARY = {
  // 7 Main Muscle Groups
  'Chest': 'छाती (Chest)',
  'Back': 'पीठ (Back)',
  'Shoulders': 'कंधे (Shoulders)',
  'Biceps': 'बाइसेप्स (Biceps)',
  'Triceps': 'ट्राइसेप्स (Triceps)',
  'Thighs': 'जांघें और पैर (Thighs & Legs)',
  'Abs': 'एब्स और कोर (Abs & Core)',

  // Subgroups - Chest
  'Upper Chest': 'ऊपरी छाती (Upper Chest)',
  'Middle Chest': 'मध्य छाती (Middle Chest)',
  'Lower Chest': 'निचली छाती (Lower Chest)',
  'Inner Chest': 'आंतरिक छाती (Inner Chest)',
  'Outer Chest': 'बाहरी छाती (Outer Chest)',

  // Subgroups - Back
  'Upper Back': 'ऊपरी पीठ (Upper Back)',
  'Middle Back': 'मध्य पीठ (Middle Back)',
  'Lower Back': 'निचली पीठ (Lower Back)',
  'Lats (Latissimus Dorsi)': 'लैट्स (Lats / Latissimus Dorsi)',
  'Traps (Trapezius)': 'ट्रैप्स (Traps / Trapezius)',
  'Spinal Erectors': 'स्पाइनल इरेक्टर्स (Spinal Erectors)',

  // Subgroups - Shoulders
  'Front Delts (Anterior Deltoids)': 'फ्रंट डेल्ट्स (Anterior Deltoids)',
  'Side Delts (Lateral Deltoids)': 'साइड डेल्ट्स (Lateral Deltoids)',
  'Rear Delts (Posterior Deltoids)': 'रियर डेल्ट्स (Posterior Deltoids)',
  'Rotator Cuff': 'रोटेटर कफ (Rotator Cuff)',

  // Subgroups - Biceps
  'Biceps Long Head': 'बाइसेप्स लॉन्ग हेड (Long Head)',
  'Biceps Short Head': 'बाइसेप्स शॉर्ट हेड (Short Head)',
  'Brachialis': 'ब्रेकियलिस (Brachialis)',
  'Brachioradialis': 'ब्रेकियोरेडियलिस (Brachioradialis)',

  // Subgroups - Triceps
  'Long Head': 'लॉन्ग हेड (Long Head)',
  'Lateral Head': 'लेटरल हेड (Lateral Head)',
  'Medial Head': 'मेडियल हेड (Medial Head)',

  // Subgroups - Thighs
  'Quadriceps': 'क्वाड्रिसेप्स (Quadriceps / Front Thighs)',
  'Hamstrings': 'हैमस्ट्रिंग्स (Hamstrings / Rear Thighs)',
  'Adductors (Inner Thigh)': 'एडक्टर्स (Inner Thigh)',
  'Abductors (Outer Hip)': 'एबडक्टर्स (Outer Hip)',
  'Glutes': 'ग्लूट्स (Glutes / Hips)',

  // Subgroups - Abs
  'Upper Abs': 'अपर एब्स (Upper Abs)',
  'Lower Abs': 'लोअर एब्स (Lower Abs)',
  'Obliques': 'ऑब्लिक्स (Obliques / Side Core)',
  'Deep Core / Transverse Abdominis': 'डीप कोर (Deep Core / TVA)',

  // Legacy compatibility
  'Quadriceps': 'क्वाड्स (Front Thighs)',
  'Hamstrings & Glutes': 'हैमस्ट्रिंग्स और ग्लूट्स',
  'Abs & Core': 'एब्स और कोर',
  'Calves': 'काफ्स (Calves)',
  'Forearms': 'फोरआर्म्स और ग्रिप',

  // Difficulty & Types
  'Beginner': 'शुरुआती (Beginner)',
  'Intermediate': 'मध्यम स्तर (Intermediate)',
  'Advanced': 'उन्नत स्तर (Advanced)',
  'Compound': 'कम्पाउंड मूवमेंट (बहु-जोड़ व्यायाम)',
  'Isolation': 'आइसोलेशन मूवमेंट (एकल-जोड़ व्यायाम)',

  // Equipment
  'Barbell': 'बारबेल (Barbell)',
  'Dumbbell': 'डंबल (Dumbbell)',
  'Cable Machine': 'केबल मशीन (Cable Machine)',
  'Weight Machines': 'वेट मशीन (Machine)',
  'Smith Machine': 'स्मिथ मशीन (Smith Machine)',
  'Bodyweight': 'बॉडीवेट (शरीर का वजन)',
  'EZ Bar': 'ई-ज़ी बार (EZ Bar)',
  'Kettlebells': 'केटलबेल (Kettlebell)',

  // Movement Patterns
  'Horizontal Push': 'हॉरिजॉन्टल पुश (क्षैतिज धक्का)',
  'Incline Push': 'इनक्लाइन पुश (ऊपर की ओर धक्का)',
  'Decline Push': 'डिक्लाइन पुश (नीचे की ओर धक्का)',
  'Vertical Push': 'वर्टिकल पुश (ऊपर की ओर प्रेस)',
  'Horizontal Pull': 'हॉरिजॉन्टल पुल (सामने से खींचना / रो)',
  'Vertical Pull': 'वर्टिकल पुल (ऊपर से खींचना / लैट पुल)',
  'Squat': 'स्क्वाट पैटर्न (घुटने मोड़ना)',
  'Hinge': 'हिप हिंज (कमर से झुकना)',
  'Lunge': 'लंज पैटर्न (एकतरफा पैर व्यायाम)',
  'Isolation Pull': 'आइसोलेशन पुल',
  'Isolation Push': 'आइसोलेशन पुश',
  'Carriage Extension': 'स्लेड एक्सटेंशन'
};

/**
 * Pre-compiled, linguistically verified Hindi guides for the exercise library.
 * Keyed by exercise id or normalized name.
 */
export const HINDI_EXERCISE_GUIDES = {
  // 1. CHEST
  'flat-barbell-bench-press': {
    startingPosition: 'बेंच पर पीठ के बल सीधा लेटें। आपकी आँखें ठीक बारबेल के नीचे होनी चाहिए। पैरों को ज़मीन पर मजबूती से टिकाएँ। बारबेल को कंधों की चौड़ाई से थोड़ा बाहर पकड़ें (कलाई सीधी रखें)।',
    instructions: 'बारबेल को रैक से उठाएँ और छाती के ठीक ऊपर लाएँ। कंधे के ब्लेड्स (Scapula) को पीछे और नीचे सिकोड़ें। बारबेल को नियंत्रित गति से छाती के निचले हिस्से तक लाएँ। बिना छाती पर बाउंस किए, पैरों से ज़मीन को दबाते हुए बारबेल को ऊपर की ओर प्रेस करें।',
    technique: 'पीठ के निचले हिस्से में हल्का प्राकृतिक आर्क (Natural Arch) बनाए रखें। कोहनियों को शरीर के साथ लगभग 45-70 डिग्री के कोण पर रखें (90 डिग्री पर न फैलाएँ)।',
    breathing: 'बारबेल को नीचे लाते समय पेट में गहरी साँस लें और कोर को कसें (Brace); छाती से ऊपर प्रेस करते समय पूरी ताकत से साँस छोड़ें।',
    commonMistakes: [
      'बारबेल को छाती से उछालना (Bounce करना)',
      'कोहनियों को 90 डिग्री पर बाहर फैलाना जिससे कंधे में चोट आ सकती है',
      'बेंच से हिप्स को ऊपर उठाना',
      'कलाई को पीछे की ओर अत्यधिक मोड़ना'
    ],
    safetyNotes: 'भारी वजन उठाते समय हमेशा स्पॉट या सेफ्टी पिन का उपयोग करें। थंबलेस (Suicide) ग्रिप के बजाय सुरक्षित फुल ग्रिप का उपयोग करें।'
  },
  'incline-barbell-bench-press': {
    startingPosition: '30 से 45 डिग्री पर सेट इनक्लाइन बेंच पर बैठें। पैरों को ज़मीन पर मजबूती से जमाएँ। बारबेल को कंधों की चौड़ाई से थोड़ा बाहर पकड़ें।',
    instructions: 'बारबेल को अनरैक करें और ऊपरी छाती (कॉलरबोन के थोड़ा नीचे) के ऊपर स्थिर करें। नियंत्रित रूप से बार को ऊपरी छाती तक नीचे लाएँ और फिर कोहनियों को पूरी तरह लॉक किए बिना ऊपर प्रेस करें।',
    technique: 'बेंच का एंगल 30-45 डिग्री से अधिक न रखें अन्यथा तनाव छाती के बजाय सामने के कंधों (Anterior Deltoids) पर आ जाता है।',
    breathing: 'नीचे आते समय गहरी साँस लें; वजन को ऊपर प्रेस करते हुए साँस बाहर छोड़ें।',
    commonMistakes: [
      'बेंच का अत्यधिक ऊँचा कोण (45° से अधिक)',
      'कंधों को आगे की तरफ झुकाना',
      'कलाई मोड़ना'
    ],
    safetyNotes: 'इनक्लाइन प्रेस में रैक से निकालते समय कंधे के रोटेटर कफ का विशेष ध्यान रखें।'
  },
  'decline-barbell-bench-press': {
    startingPosition: 'डिक्लाइन बेंच पर पैरों को रोलर पैड के नीचे सुरक्षित रूप से लॉक करके लेटें। मध्यम चौड़ाई से बारबेल को पकड़ें।',
    instructions: 'बारबेल को रैक से उठाकर निचली छाती के ऊपर लाएँ। धीरे-धीरे बारबेल को स्टर्नम के निचले हिस्से तक नीचे लाएँ और फिर नियंत्रित रूप से ऊपर प्रेस करें।',
    technique: 'कंधे के ब्लेड्स को बेंच में दबाकर रखें और गति को पूरी तरह नियंत्रित रखें।',
    breathing: 'वजन नीचे लाते समय साँस अंदर लें; प्रेस करते समय साँस बाहर छोड़ें।',
    commonMistakes: ['पैरों को ठीक से लॉक न करना', 'वजन को पेट की तरफ बहुत नीचे गिराना'],
    safetyNotes: 'डिक्लाइन बेंच पर सिर नीचे होने के कारण सिर में रक्तचाप बढ़ सकता है, सेट पूरा होते ही तुरंत सीधे बैठें।'
  },
  'flat-dumbbell-press': {
    startingPosition: 'दोनों हाथों में डंबल लेकर बेंच पर बैठें। डंबल को जांघों पर रखें। धीरे से पीछे लेटते हुए जांघों की मदद से डंबल को छाती की ऊंचाई पर लाएँ।',
    instructions: 'डंबल को छाती के स्तर से ऊपर की ओर प्रेस करें जब तक कि दोनों हाथ सीधे न हो जाएँ। ऊपर दोनों डंबल को आपस में टकराए बिना छाती की मांसपेशियों को सिकोड़ें। धीरे-धीरे नीचे लाएँ।',
    technique: 'डंबल स्वतंत्र होने के कारण बारबेल की तुलना में अधिक स्ट्रेच प्रदान करते हैं। कोहनियों को हल्का सा अंदर रखें।',
    breathing: 'डंबल नीचे लाते समय श्वास लें; ऊपर प्रेस करते समय श्वास छोड़ें।',
    commonMistakes: ['डंबल को ऊपर जोर से टकराना', 'कोहनियों को अत्यधिक नीचे गिराना जिससे कंधे पर तनाव पड़े'],
    safetyNotes: 'भारी डंबल छोड़ते समय उन्हें कभी भी किनारे से न फेंकें, जांघों पर वापस लाएँ।'
  },
  'incline-dumbbell-press': {
    startingPosition: '30-45 डिग्री इनक्लाइन बेंच पर डंबल लेकर लेटें। हथेलियों को आगे की ओर रखें।',
    instructions: 'डंबल को नियंत्रित रूप से ऊपर प्रेस करें और ऊपरी छाती पर दबाव महसूस करें। 2-3 सेकंड में धीरे-धीरे नीचे लाएँ ताकि मांसपेशियों पर अधिकतम खिंचाव मिले।',
    technique: 'कंधों को बेंच में स्थिर रखें, कोर को टाइट रखें।',
    breathing: 'नीचे आते समय साँस अंदर लें; प्रेस करते समय साँस बाहर छोड़ें।',
    commonMistakes: ['बहुत भारी वजन लेकर आधी गति (Half Reps) में करना', 'कोहनियों को बहुत बाहर खोलना'],
    safetyNotes: 'कंधे में किसी भी दर्द की स्थिति में कोण को 30 डिग्री पर कम करें।'
  },
  'decline-dumbbell-press': {
    startingPosition: 'डिक्लाइन बेंच पर पैरों को सुरक्षित करें। दोनों हाथों में डंबल लेकर लेटें।',
    instructions: 'डंबल को निचली छाती के स्तर से सीधे ऊपर प्रेस करें। शीर्ष पर पेक्टोरल मांसपेशियों को कसकर सिकोड़ें और धीरे-धीरे नीचे लाएँ।',
    technique: 'कलाई को सीधा रखें और गति की सीमा (Range of Motion) को नियंत्रित रखें।',
    breathing: 'नीचे श्वास लें; ऊपर श्वास छोड़ें।',
    commonMistakes: ['डंबल का संतुलन खोना', 'बहुत तेज़ गति से करना'],
    safetyNotes: 'डिक्लाइन स्थिति में डंबल को नियंत्रित तरीके से ही नीचे रखें।'
  },
  'dumbbell-fly': {
    startingPosition: 'सपाट बेंच पर लेटें, दोनों हाथों में हल्के से मध्यम वजन के डंबल पकड़ें। कोहनियों में हल्का सा मोड़ बनाए रखें।',
    instructions: 'दोनों हाथों को चाप (Arc) के आकार में चौड़ा खोलते हुए नीचे लाएँ जब तक कि छाती में अच्छा खिंचाव महसूस न हो। फिर उसी चाप में वापस ऊपर लाएँ जैसे किसी बड़े पेड़ को गले लगा रहे हों।',
    technique: 'कोहनियों का कोण पूरी गति के दौरान स्थिर रहना चाहिए। यह आइसोलेशन मूवमेंट है, भारी वजन के बजाय मसल स्ट्रेच पर ध्यान दें।',
    breathing: 'हाथ खोलते समय गहरी साँस लें; वापस ऊपर लाते समय साँस छोड़ें।',
    commonMistakes: ['कोहनियों को सीधा लॉक करना', 'डंबल प्रेस में बदल देना (कोहनियों को बहुत अधिक मोड़ना)', 'अत्यधिक नीचे जाकर कंधे को चोटिल करना'],
    safetyNotes: 'छाती के स्तर से बहुत अधिक नीचे डंबल न ले जाएँ।'
  },
  'incline-dumbbell-fly': {
    startingPosition: '30 डिग्री इनक्लाइन बेंच पर डंबल लेकर लेटें। हाथ ऊपर सीधे रखें लेकिन कोहनी में हल्का सा लचीला मोड़ रहे।',
    instructions: 'डंबल को धीरे-धीरे दोनों तरफ खोलें जिससे ऊपरी छाती पर स्ट्रेच आए। फिर छाती की ताकत से डंबल को ऊपर लाएँ।',
    technique: 'ऊपरी छाती के फाइबर्स पर खिंचाव पर ध्यान केंद्रित करें।',
    breathing: 'खोलते समय साँस लें; मिलाते समय साँस छोड़ें।',
    commonMistakes: ['कोहनियों को लॉक करना', 'कंधों पर तनाव डालना'],
    safetyNotes: 'वजन मध्यम रखें, यह स्ट्रेंथ नहीं बल्कि हाइपरट्रॉफी मूवमेंट है।'
  },
  'cable-chest-fly': {
    startingPosition: 'केबल क्रॉसओवर मशीन के बीच में खड़े हों। डी-हैंडल को सीने की ऊंचाई पर पकड़ें। एक पैर आगे रखकर संतुलन बनाएँ।',
    instructions: 'कोहनियों में हल्का मोड़ रखते हुए, दोनों हाथों को सामने की ओर एक साथ लाएँ जब तक कि हथेलियाँ लगभग छू न लें। 1 सेकंड के लिए छाती को सिकोड़ें और फिर नियंत्रित रूप से पीछे जाने दें।',
    technique: 'केबल की निरंतर टेंशन का लाभ उठाएँ, पूरे मूवमेंट में शरीर को स्थिर रखें और झटके न दें।',
    breathing: 'हाथ आगे लाते समय साँस बाहर छोड़ें; पीछे जाते समय साँस अंदर लें।',
    commonMistakes: ['शरीर को आगे-पीछे झुलाकर मोमेंटम का इस्तेमाल करना', 'कोहनियों का कोण बदलना'],
    safetyNotes: 'केबल को छोड़ते समय अचानक न छोड़ें, आराम से वजन को रैक पर जाने दें।'
  },
  'low-to-high-cable-fly': {
    startingPosition: 'केबल पुली को सबसे नीचे सेट करें। दोनों हाथों में हैंडल पकड़ें और थोड़ा आगे कदम बढ़ाएँ।',
    instructions: 'हथेलियों को ऊपर की ओर रखते हुए हाथों को नीचे से ऊपर की ओर आँखों के स्तर तक लाएँ। ऊपरी छाती को मजबूती से सिकोड़ें।',
    technique: 'ऊपरी छाती (Clavicular Head) के लिए सबसे प्रभावी व्यायामों में से एक है।',
    breathing: 'ऊपर खींचते समय साँस छोड़ें; नीचे लाते समय साँस लें।',
    commonMistakes: ['कंधों से अत्यधिक जोर लगाना', 'पीठ को पीछे झुकाना'],
    safetyNotes: 'वजन संतुलित रखें ताकि कमर पर झटका न आए।'
  },
  'high-to-low-cable-fly': {
    startingPosition: 'केबल पुली को सिर से ऊपर सेट करें। थोड़ा आगे झुकें और कोर को टाइट रखें।',
    instructions: 'हाथों को ऊपर से नीचे और आगे की ओर नाभि के स्तर तक दबाएँ। निचली छाती को सिकोड़ें।',
    technique: 'निचली छाती को लक्षित करने के लिए कोहनियों को हल्का मोड़कर रखें।',
    breathing: 'नीचे दबाते समय साँस छोड़ें; ऊपर जाते समय साँस लें।',
    commonMistakes: ['हाथों को अत्यधिक पीछे ले जाना', 'रीढ़ की हड्डी को मोड़ना'],
    safetyNotes: 'कंधे में रोटेटर कफ की समस्या होने पर पुली की ऊंचाई मध्यम रखें।'
  },
  'pec-deck': {
    startingPosition: 'पेक डेक मशीन की सीट को इस तरह एडजस्ट करें कि हैंडल या पैड आपकी छाती की ऊंचाई पर हों। पीठ को पूरी तरह पैड से सटाकर रखें।',
    instructions: 'हैंडल को पकड़ें और दोनों बाजुओं को सामने की ओर आपस में मिलाएँ। 1-2 सेकंड पीक संकुचन (Peak Contraction) बनाए रखें, फिर 3 सेकंड में धीरे-धीरे वापस लाएँ।',
    technique: 'कंधों को पीछे रखें और केवल छाती की मांसपेशियों से मूवमेंट करें।',
    breathing: 'सामने लाते समय साँस छोड़ें; पीछे जाते समय साँस लें।',
    commonMistakes: ['कंधों को आगे खींचना', 'सीट बहुत ऊँची या नीची रखना'],
    safetyNotes: 'कोहनियों को अत्यधिक पीछे न जाने दें।'
  },
  'machine-chest-press': {
    startingPosition: 'मशीन पर बैठें ताकि हैंडल ठीक छाती के मध्य भाग के स्तर पर हों। पैर ज़मीन पर स्थिर रखें।',
    instructions: 'हैंडल को सामने की ओर प्रेस करें जब तक कि हाथ सीधे न हो जाएँ। कोहनी को बिना लॉक किए छाती को सिकोड़ें और धीरे-धीरे शुरुआती स्थिति में लाएँ।',
    technique: 'शुरुआती और भारी लिफ्टर्स दोनों के लिए सुरक्षित है। मशीन का फिक्स्ड पाथ स्थिरता प्रदान करता है।',
    breathing: 'प्रेस करते समय साँस छोड़ें; वापस आते समय साँस अंदर लें।',
    commonMistakes: ['वजन की प्लेट्स को टकराना', 'पीठ को सीट से आगे उठाना'],
    safetyNotes: 'हैंडल की स्थिति को अपने कंधे की गतिशीलता के अनुसार एडजस्ट करें।'
  },
  'smith-machine-bench-press': {
    startingPosition: 'स्मिथ मशीन के नीचे सपाट बेंच को केंद्र में रखें। बार को छाती के निचले हिस्से के सीध में सेट करें।',
    instructions: 'बार को अनलॉक करें और नियंत्रित तरीके से छाती तक नीचे लाएँ। फिर मजबूती से ऊपर की ओर धकेलें।',
    technique: 'चूंकि बार एक निश्चित ट्रैक पर चलती है, अपनी कोहनियों को सहज कोण पर रखें।',
    breathing: 'नीचे साँस लें; ऊपर प्रेस करते समय साँस छोड़ें।',
    commonMistakes: ['बेंच को सही केंद्र में न रखना', 'कलाई को पीछे मोड़ना'],
    safetyNotes: 'सेट समाप्त होने पर बार को घुमाकर हुक में सुरक्षित रूप से लॉक करना सुनिश्चित करें।'
  },
  'push-ups': {
    startingPosition: 'हथेलियों को कंधों की चौड़ाई से थोड़ा बाहर ज़मीन पर रखें। पैरों को पीछे सीधा रखें। सिर से एड़ी तक शरीर एक सीधी रेखा में होना चाहिए।',
    instructions: 'कोर और ग्लूट्स को टाइट रखें। कोहनियों को लगभग 45 डिग्री पर मोड़ते हुए छाती को ज़मीन से 1-2 इंच ऊपर तक नीचे लाएँ। हथेलियों से ज़मीन को दबाकर वापस ऊपर आएँ।',
    technique: 'कमर को नीचे न लटकने दें और न ही हिप्स को ऊपर उठाएँ। गर्दन को तटस्थ रखें।',
    breathing: 'नीचे जाते समय श्वास लें; ऊपर आते समय श्वास छोड़ें।',
    commonMistakes: ['कमर का लटकना (Sagging Hips)', 'सिर को आगे की ओर झुकाना', 'कोहनियों को 90 डिग्री पर बाहर खोलना'],
    safetyNotes: 'कलाई में दर्द होने पर पुश-अप बार या डंबल पकड़कर करें।'
  },
  'weighted-push-ups': {
    startingPosition: 'पुश-अप स्थिति में आएं। पीठ के ऊपरी हिस्से पर वेट प्लेट या वेटेड वेस्ट पहनें।',
    instructions: 'सख्त पुश-अप फॉर्म के साथ शरीर को नीचे लाएँ और फिर विस्फोटक रूप से ऊपर प्रेस करें।',
    technique: 'कोर की स्थिरता इस व्यायाम में बहुत महत्वपूर्ण है ताकि प्लेट फिसले नहीं।',
    breathing: 'नीचे साँस लें; ऊपर आते समय साँस छोड़ें।',
    commonMistakes: ['प्लेट को कमर के निचले हिस्से पर रखना', 'अधूरी गति (Half reps)'],
    safetyNotes: 'प्लेट रखने और हटाने के लिए किसी साथी की मदद लें।'
  },
  'chest-dips': {
    startingPosition: 'पैरेलल बार्स पर हाथों से शरीर को ऊपर उठाएँ। शरीर को हल्का सा (लगभग 30 डिग्री) आगे की ओर झुकाएँ ताकि तनाव छाती पर आए।',
    instructions: 'कोहनियों को मोड़ते हुए शरीर को नीचे लाएँ जब तक कि ऊपरी बाजु ज़मीन के समानांतर न हो जाएँ। छाती की ताकत से वापस ऊपर पुश करें।',
    technique: 'यदि शरीर सीधा रहेगा तो ट्राइसेप्स पर काम होगा, छाती के लिए आगे झुकना आवश्यक है।',
    breathing: 'नीचे जाते समय श्वास लें; ऊपर आते समय श्वास छोड़ें।',
    commonMistakes: ['बहुत अधिक नीचे जाना जिससे कंधे में खिंचाव आए', 'शरीर को सीधा रखना'],
    safetyNotes: 'कंधे में किसी भी पुराने दर्द की स्थिति में अत्यधिक गहराई से बचें।'
  },
  'assisted-chest-dips': {
    startingPosition: 'असिस्टेड डिप मशीन के घुटने के पैड पर घुटने रखें। पैरेलल बार्स को पकड़ें और हल्का आगे झुकें।',
    instructions: 'नियंत्रित गति से नीचे जाएँ और फिर छाती की मांसपेशियों से ऊपर पुश करें।',
    technique: 'जैसे-जैसे ताकत बढ़े, काउंटर-वेट को धीरे-धीरे कम करते जाएँ।',
    breathing: 'नीचे साँस लें; ऊपर साँस छोड़ें।',
    commonMistakes: ['मशीन पर बहुत अधिक निर्भर होना', 'धीमी गति न रखना'],
    safetyNotes: 'मशीन से उतरते समय ध्यान रखें कि पैड तेजी से ऊपर न उछले।'
  },

  // 45-DEGREE LEG PRESS (SPECIAL ATTENTION)
  'leg-press-45-degree': {
    startingPosition: '45-डिग्री लेग प्रेस मशीन की सीट पर पीठ और हिप्स को पूरी तरह सटाकर बैठें। पैरों को शोल्डर-विड्थ पर फुटप्लेट के मध्य में रखें। सेफ्टी लीवर को अनलॉक करें।',
    instructions: 'घुटनों को मोड़ते हुए स्लेड को नियंत्रित रूप से तब तक नीचे लाएँ जब तक कि घुटने 90 डिग्री का कोण न बना लें (कमर सीट से नहीं उठनी चाहिए)। फिर एड़ियों और पंजों से फुटप्लेट को धकेलते हुए शुरुआती स्थिति में लौटें। घुटनों को ऊपर पूरी तरह लॉक (Hyperextend) न करें।',
    technique: 'महत्वपूर्ण: 45-डिग्री लेग प्रेस मोड में मशीन के स्लेड का वजन शामिल नहीं किया जाता है (स्लेड = 0 kg)। गणना केवल लोड की गई प्लेटों के कुल वजन पर आधारित होती है।',
    breathing: 'स्लेड को नीचे लाते समय गहरी साँस लें और पेट को कसें; प्लेट को ऊपर धकेलते हुए शक्तिशाली रूप से साँस छोड़ें।',
    commonMistakes: [
      'घुटनों को शीर्ष पर जोर से लॉक (Lockout) करना जो जोड़ों के लिए बेहद खतरनाक है',
      'कमर के निचले हिस्से (Lower Back) को सीट के पैड से ऊपर उठने देना',
      'घुटनों को अंदर की तरफ झुकने देना (Knee Valgus)',
      'अधूरी गति (Quarter Reps) करना'
    ],
    safetyNotes: 'भारी वजन में सेफ्टी स्टॉपर्स को हमेशा सही ऊंचाई पर सेट रखें। सेट के अंत में सेफ्टी लॉक लगाना न भूलें।'
  },
  '45-degree-leg-press': {
    startingPosition: '45-डिग्री लेग प्रेस मशीन की सीट पर पीठ और हिप्स को पूरी तरह सटाकर बैठें। पैरों को शोल्डर-विड्थ पर फुटप्लेट के मध्य में रखें। सेफ्टी लीवर को अनलॉक करें।',
    instructions: 'घुटनों को मोड़ते हुए स्लेड को नियंत्रित रूप से तब तक नीचे लाएँ जब तक कि घुटने 90 डिग्री का कोण न बना लें। फिर एड़ियों से फुटप्लेट को धकेलते हुए शुरुआती स्थिति में लौटें। घुटनों को ऊपर लॉक न करें।',
    technique: 'विशेष नियम: 45-डिग्री लेग प्रेस में स्लेड का शुरुआती वजन नहीं गिना जाता (स्लेड = 0)। केवल बार पर चढ़ी प्लेट्स का भार ही कुल लिफ्टिंग वेट होता है।',
    breathing: 'नीचे आते समय श्वास लें; ऊपर धकेलते समय श्वास छोड़ें।',
    commonMistakes: ['घुटनों को लॉकआउट करना', 'कमर उठाना'],
    safetyNotes: 'हमेशा सेफ्टी लीवर हाथ की पहुंच में रखें।'
  },

  // BACK
  'conventional-deadlift': {
    startingPosition: 'पैरों को कूल्हे की चौड़ाई पर रखें, बारबेल पैरों के मध्य के ठीक ऊपर होनी चाहिए। कमर से झुकें और बारबेल को पकड़ें। घुटनों को हल्का मोड़ें, छाती को ऊपर उठाएँ और पीठ को बिल्कुल सीधा रखें।',
    instructions: 'पैरों से ज़मीन को धकेलते हुए बारबेल को शरीर के करीब रखते हुए सीधा खड़े हों। शीर्ष पर हिप्स को पूरी तरह सीधा करें। बारबेल को नियंत्रित गति से नीचे ज़मीन पर लाएँ।',
    technique: 'बार को हमेशा अपनी पिंडलियों और जांघों के संपर्क में रखें। रीढ़ की हड्डी को किसी भी स्थिति में मुड़ने न दें।',
    breathing: 'नीचे झुकने से पहले गहरी साँस लें और पेट को कसें (Valsalva Maneuver); ऊपर उठने के बाद या नीचे आने पर साँस छोड़ें।',
    commonMistakes: [
      'पीठ को गोल करना (Rounding the lower back)',
      'बार को शरीर से बहुत दूर रखना',
      'शीर्ष पर अत्यधिक पीछे झुकना (Hyper-extending the spine)'
    ],
    safetyNotes: 'पीठ की सुरक्षा के लिए वजन बढ़ाने से पहले सही तकनीक पर महारत हासिल करें।'
  },
  'romanian-deadlift': {
    startingPosition: 'सीधे खड़े हों और बारबेल या डंबल को जांघों के सामने पकड़ें। घुटनों में हल्का सा मोड़ रखें और इसे पूरे व्यायाम में स्थिर रखें।',
    instructions: 'हिप्स को जितना हो सके पीछे की ओर धकेलें जबकि बारबेल जांघों से सटकर नीचे जाए। जब हैमस्ट्रिंग्स में पूरा खिंचाव महसूस हो, ग्लूट्स को सिकोड़ते हुए वापस सीधे खड़े हों।',
    technique: 'यह घुटनों का नहीं बल्कि हिप हिंज (कमर से झुकने) का मूवमेंट है। पीठ पूरी तरह सीधी रहनी चाहिए।',
    breathing: 'नीचे झुकते समय साँस लें; ऊपर आते हुए साँस छोड़ें।',
    commonMistakes: ['घुटनों को बहुत अधिक मोड़कर स्क्वाट बना देना', 'पीठ के निचले हिस्से को गोल करना'],
    safetyNotes: 'गर्दन को रीढ़ की सीध में रखें, आईने में देखने के लिए सिर बहुत ऊपर न उठाएँ।'
  },
  'barbell-row': {
    startingPosition: 'कमर से 45 डिग्री के कोण पर झुकें, घुटने हल्के मुड़े हों, पीठ सपाट और बारबेल को कंधों की चौड़ाई पर पकड़ें।',
    instructions: 'कोहनियों को पीछे की ओर खींचते हुए बारबेल को नाभि के ऊपरी हिस्से तक लाएँ। लैट्स और पीठ के ऊपरी हिस्से को कसकर सिकोड़ें और धीरे-धीरे नीचे ले जाएँ।',
    technique: 'शरीर को बहुत अधिक हिलाए बिना पीठ की मांसपेशियों की ताकत से वजन खींचें।',
    breathing: 'बारबेल को पेट की तरफ खींचते समय साँस छोड़ें; नीचे लाते समय साँस लें।',
    commonMistakes: ['शरीर को झटके देकर वजन खींचना', 'पीठ को गोल करना'],
    safetyNotes: 'यदि पीठ के निचले हिस्से में तनाव महसूस हो, तो चेस्ट-सपोर्टेड रो का उपयोग करें।'
  },
  'wide-grip-lat-pulldown': {
    startingPosition: 'लैट पुलडाउन मशीन पर बैठें और जांघों को पैड के नीचे सुरक्षित रूप से टिकाएँ। बार को चौड़ी ग्रिप से पकड़ें।',
    instructions: 'छाती को हल्का सा ऊपर उठाएँ। कंधे के ब्लेड्स को नीचे खींचते हुए बार को ऊपरी छाती (कॉलरबोन) तक नीचे खींचें। 1 सेकंड रुकें और धीरे-धीरे बार को ऊपर जाने दें।',
    technique: 'हाथों से नहीं बल्कि कोहनियों को नीचे और पीछे खींचने पर ध्यान दें।',
    breathing: 'बार को नीचे खींचते समय साँस छोड़ें; ऊपर जाते समय साँस लें।',
    commonMistakes: ['बार को गर्दन के पीछे खींचना', 'शरीर को बहुत पीछे झुकाना'],
    safetyNotes: 'गर्दन के पीछे पुलडाउन करने से बचें क्योंकि यह रोटेटर कफ को नुकसान पहुँचा सकता है।'
  },
  'pull-ups': {
    startingPosition: 'पुल-अप बार को ओवरहैंड ग्रिप (हथेलियाँ आगे) से कंधों से थोड़ा बाहर पकड़ें और पूरी तरह लटकें (Dead Hang)।',
    instructions: 'कंधे के ब्लेड्स को सिकोड़ें और छाती को बार की तरफ खींचें जब तक कि आपकी ठुड्डी बार के ऊपर न आ जाए। 1 सेकंड रुकें और धीरे-धीरे नीचे लटकने की स्थिति में आएँ।',
    technique: 'पैरों को झुलाए बिना (No Kipping) सख्त फॉर्म के साथ शरीर को ऊपर खींचें।',
    breathing: 'ऊपर खींचते समय साँस छोड़ें; नीचे जाते समय साँस अंदर लें।',
    commonMistakes: ['झूले खाकर ऊपर जाना', 'पूरी गति न करना (अधूरी रेंज)'],
    safetyNotes: 'यदि पूरे पुल-अप न हो सकें तो रेसिस्टेंस बैंड या असिस्टेड मशीन का उपयोग करें।'
  },

  // SQUATS & LEGS
  'barbell-back-squat': {
    startingPosition: 'बारबेल को पीठ के ऊपरी हिस्से (Trapezius) पर रखें। पैरों को कंधों की चौड़ाई पर रखें, पंजे हल्के बाहर (15-30 डिग्री) की ओर हों। छाती तनी हुई और कोर मजबूत।',
    instructions: 'हिप्स को पीछे और घुटनों को बाहर की तरफ मोड़ते हुए नीचे बैठें जब तक कि जांघें ज़मीन के समानांतर न हो जाएँ। एड़ियों से ज़मीन को दबाते हुए वापस सीधे खड़े हों।',
    technique: 'घुटनों को पंजों की सीध में रखें। रीढ़ की तटस्थ स्थिति बनाए रखें।',
    breathing: 'नीचे जाने से पहले पेट में गहरी साँस भरकर कोर को लॉक करें; ऊपर उठते हुए साँस छोड़ें।',
    commonMistakes: [
      'घुटनों का अंदर की ओर गिरना',
      'एड़ियों का ज़मीन से उठना',
      'छाती का अत्यधिक आगे झुकना'
    ],
    safetyNotes: 'हमेशा स्क्वाट रैक में सेफ्टी आर्म्स लगाकर ही अभ्यास करें।'
  },
  'standing-barbell-shoulder-press': {
    startingPosition: 'सीधे खड़े हों, पैरों को कूल्हे की चौड़ाई पर रखें। बारबेल को कॉलरबोन के स्तर पर कंधों की चौड़ाई पर पकड़ें।',
    instructions: 'कोर और ग्लूट्स को टाइट करें। सिर को हल्का पीछे करते हुए बारबेल को सीधे सिर के ऊपर प्रेस करें। शीर्ष पर सिर को वापस आगे लाएँ और बाजुएँ सीधी करें।',
    technique: 'कमर को पीछे की ओर अत्यधिक न मोड़ें। पूरा शरीर एक ठोस खंभे की तरह स्थिर होना चाहिए।',
    breathing: 'प्रेस करने से पहले साँस लें; बारबेल सिर के ऊपर लॉक होने पर साँस छोड़ें।',
    commonMistakes: ['कमर को बहुत अधिक पीछे झुकाना', 'पैरों से झटका देकर पुश प्रेस बना देना'],
    safetyNotes: 'भारी वजन में लोअर बैक को सहारा देने के लिए वेटलिफ्टिंग बेल्ट का उपयोग कर सकते हैं।'
  },
  'barbell-curl': {
    startingPosition: 'सीधे खड़े हों, बारबेल को अंडरहैंड ग्रिप (हथेलियाँ ऊपर) से पकड़ें। कोहनियों को शरीर के दोनों तरफ सटाकर रखें।',
    instructions: 'कोहनियों को स्थिर रखते हुए बारबेल को कंधों की तरफ कर्ल करें। शीर्ष पर बाइसेप्स को कसकर सिकोड़ें और धीरे-धीरे 3 सेकंड में नीचे लाएँ।',
    technique: 'कमर को आगे-पीछे झुलाए बिना केवल कोहनी के जोड़ से मूवमेंट करें।',
    breathing: 'बारबेल ऊपर उठाते समय साँस छोड़ें; नीचे लाते समय साँस लें।',
    commonMistakes: ['शरीर को झुलाकर मोमेंटम का इस्तेमाल करना', 'कोहनियों को आगे की ओर खींचना'],
    safetyNotes: 'कलाई में खिंचाव महसूस होने पर स्ट्रेट बार की जगह EZ-बार का प्रयोग करें।'
  },
  'close-grip-bench-press': {
    startingPosition: 'बेंच पर लेटें और बारबेल को कंधों की चौड़ाई पर (लगभग 8-12 इंच की दूरी पर) पकड़ें।',
    instructions: 'कोहनियों को शरीर के करीब रखते हुए बार को छाती के निचले हिस्से तक नीचे लाएँ। ट्राइसेप्स की ताकत से बार को ऊपर प्रेस करें।',
    technique: 'हाथों को बहुत पास न लाएँ (कम से कम कंधे की चौड़ाई होनी चाहिए) ताकि कलाई पर अनावश्यक दबाव न पड़े।',
    breathing: 'नीचे लाते समय श्वास लें; ऊपर प्रेस करते समय श्वास छोड़ें।',
    commonMistakes: ['हाथों को अत्यधिक पास रखना', 'कोहनियों को बाहर फैलाना'],
    safetyNotes: 'ट्राइसेप्स के विकास और बेंच प्रेस लॉकआउट ताकत के लिए सबसे बेहतरीन व्यायाम।'
  }
};

/**
 * Universal translation generator for any exercise.
 * Translates English exercise guide into natural Hindi.
 */
export const translateExerciseGuide = (exercise) => {
  if (!exercise) return null;

  const id = exercise.id || exercise.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // 1. Check verified pre-compiled dictionary
  if (HINDI_EXERCISE_GUIDES[id]) {
    const verified = HINDI_EXERCISE_GUIDES[id];
    return {
      ...verified,
      nameHindi: getLocalizedName(exercise.name),
      muscleHindi: HINDI_VOCABULARY[exercise.muscle] || exercise.muscle,
      subgroupHindi: HINDI_VOCABULARY[exercise.subgroup] || exercise.subgroup,
      equipmentHindi: HINDI_VOCABULARY[exercise.equipment] || exercise.equipment,
      difficultyHindi: HINDI_VOCABULARY[exercise.difficulty] || exercise.difficulty,
      typeHindi: HINDI_VOCABULARY[exercise.type] || exercise.type || 'कम्पाउंड मूवमेंट',
      movementPatternHindi: HINDI_VOCABULARY[exercise.movementPattern] || exercise.movementPattern
    };
  }

  // 2. Check cached dynamic translation
  const cacheKey = `exercise_${id}_hi`;
  const cached = getCachedTranslations()[cacheKey];
  if (cached) return cached;

  // 3. Procedural natural Hindi translation engine
  const generated = generateNaturalHindiGuide(exercise);
  saveToCache(cacheKey, generated);
  return generated;
};

/**
 * Procedural Hindi translation generator using semantic pattern rules
 */
const generateNaturalHindiGuide = (ex) => {
  const muscleHi = HINDI_VOCABULARY[ex.muscle] || ex.muscle || 'लक्षित मांसपेशी';
  const equipHi = HINDI_VOCABULARY[ex.equipment] || ex.equipment || 'उपकरण';
  const nameHi = getLocalizedName(ex.name);

  // Is 45-degree leg press?
  const isLegPress45 = ex.isLegPress45 || /45.*leg\s*press/i.test(ex.name) || /leg\s*press.*45/i.test(ex.name);

  let startingPos = ex.startingPosition
    ? translateEnglishSentenceToHindi(ex.startingPosition)
    : `${equipHi} के साथ सही स्थिति लें। रीढ़ की हड्डी को सीधा और कोर को मजबूत रखें।`;

  let instructions = ex.instructions
    ? translateEnglishSentenceToHindi(ex.instructions)
    : `नियंत्रित गति से व्यायाम शुरू करें। ${muscleHi} को सिकोड़ते हुए पूरी गति सीमा (Full Range of Motion) में अभ्यास करें।`;

  let technique = ex.technique
    ? translateEnglishSentenceToHindi(ex.technique)
    : 'पीठ को सीधा रखें, जोड़ों को अत्यधिक लॉक न करें और झटके से बचें।';

  if (isLegPress45) {
    technique += ' विशेष नियम: 45-डिग्री लेग प्रेस मोड में स्लेड का वजन शून्य (0 kg) माना जाता है। केवल लोडेड प्लेट्स की गणना होती है।';
  }

  let breathing = ex.breathing
    ? translateEnglishSentenceToHindi(ex.breathing)
    : 'वजन उठाते समय या जोर लगाते समय साँस बाहर छोड़ें (Exhale); वजन वापस लाते समय साँस अंदर लें (Inhale)।';

  let commonMistakes = Array.isArray(ex.commonMistakes) && ex.commonMistakes.length > 0
    ? ex.commonMistakes.map(m => translateEnglishSentenceToHindi(m))
    : [
        'झटके देकर या मोमेंटम से वजन उठाना',
        'अधूरी गति सीमा (Half Reps) में अभ्यास करना',
        'रीढ़ की हड्डी या जोड़ों को गलत कोण पर मोड़ना'
      ];

  let safetyNotes = ex.safetyNotes
    ? translateEnglishSentenceToHindi(ex.safetyNotes)
    : 'वजन हमेशा अपनी क्षमता के अनुसार चुनें और आवश्यकता पड़ने पर साथी या ट्रेनर की मदद लें।';

  return {
    nameHindi: nameHi,
    muscleHindi: muscleHi,
    subgroupHindi: HINDI_VOCABULARY[ex.subgroup] || ex.subgroup,
    equipmentHindi: equipHi,
    difficultyHindi: HINDI_VOCABULARY[ex.difficulty] || ex.difficulty,
    typeHindi: HINDI_VOCABULARY[ex.type] || ex.type || 'कम्पाउंड मूवमेंट',
    movementPatternHindi: HINDI_VOCABULARY[ex.movementPattern] || ex.movementPattern,
    startingPosition: startingPos,
    instructions: instructions,
    technique: technique,
    breathing: breathing,
    commonMistakes: commonMistakes,
    safetyNotes: safetyNotes,
    alternatives: ex.alternatives || []
  };
};

/**
 * Natural name localizer for common fitness exercises
 */
export const getLocalizedName = (englishName = '') => {
  if (!englishName) return '';
  const map = {
    'Barbell Bench Press': 'बारबेल बेंच प्रेस',
    'Flat Barbell Bench Press': 'फ्लैट बारबेल बेंच प्रेस',
    'Incline Barbell Bench Press': 'इनक्लाइन बारबेल बेंच प्रेस',
    'Decline Barbell Bench Press': 'डिक्लाइन बारबेल बेंच प्रेस',
    'Flat Dumbbell Press': 'फ्लैट डंबल प्रेस',
    'Incline Dumbbell Press': 'इनक्लाइन डंबल प्रेस',
    'Decline Dumbbell Press': 'डिक्लाइन डंबल प्रेस',
    'Dumbbell Fly': 'डंबल फ्लाई',
    'Incline Dumbbell Fly': 'इनक्लाइन डंबल फ्लाई',
    'Cable Chest Fly': 'केबल चेस्ट फ्लाई',
    'Low-to-High Cable Fly': 'लो-टू-हाई केबल फ्लाई',
    'High-to-Low Cable Fly': 'हाई-टू-लो केबल फ्लाई',
    'Pec Deck': 'पेक डेक मशीन फ्लाई',
    'Machine Chest Press': 'मशीन चेस्ट प्रेस',
    'Smith Machine Bench Press': 'स्मिथ मशीन बेंच प्रेस',
    'Push-ups': 'पुश-अप्स (Push-ups)',
    'Weighted Push-ups': 'वेटेड पुश-अप्स',
    'Chest Dips': 'चेस्ट डिप्स',
    'Assisted Chest Dips': 'असिस्टेड चेस्ट डिप्स',
    'Conventional Deadlift': 'कन्वेंशनल डेडलिफ्ट',
    'Romanian Deadlift': 'रोमानियन डेडलिफ्ट (RDL)',
    'Rack Pull': 'रैक पुल',
    'Barbell Row': 'बारबेल रो (झुकी हुई स्थिति)',
    'Pendlay Row': 'पेंडले रो',
    'T-Bar Row': 'टी-बार रो',
    'Chest-Supported Row': 'चेस्ट-सपोर्टेड रो',
    'Seated Cable Row': 'सीटेड केबल रो',
    'Close-Grip Cable Row': 'क्लोज-ग्रिप केबल रो',
    'Wide-Grip Lat Pulldown': 'वाइड-ग्रिप लैट पुलडाउन',
    'Close-Grip Lat Pulldown': 'क्लोज-ग्रिप लैट पुलडाउन',
    'Single-Arm Lat Pulldown': 'सिंगल-आर्म लैट पुलडाउन',
    'Pull-ups': 'पुल-अप्स',
    'Chin-ups': 'चिन-अप्स',
    'Assisted Pull-ups': 'असिस्टेड पुल-अप्स',
    'Single-Arm Dumbbell Row': 'सिंगल-आर्म डंबल रो',
    'Straight-Arm Pulldown': 'स्ट्रेट-आर्म पुलडाउन',
    'Machine Row': 'मशीन रो',
    'Face Pulls': 'फेस पुल्स (Face Pulls)',
    'Back Extensions': 'बैक एक्सटेंशन (Hyperextensions)',
    'Standing Barbell Shoulder Press': 'स्टैंडिंग बारबेल शोल्डर प्रेस',
    'Seated Dumbbell Shoulder Press': 'सीटेड डंबल शोल्डर प्रेस',
    'Arnold Press': 'अर्नाल्ड प्रेस',
    'Machine Shoulder Press': 'मशीन शोल्डर प्रेस',
    'Dumbbell Lateral Raise': 'डंबल लैटरल रेज़',
    'Cable Lateral Raise': 'केबल लैटरल रेज़',
    'Machine Lateral Raise': 'मशीन लैटरल रेज़',
    'Front Raise': 'डंबल फ्रंट रेज़',
    'Rear Delt Fly': 'रियर डेल्ट फ्लाई',
    'Reverse Pec Deck': 'रिवर्स पेक डेक',
    'Upright Row': 'अपराइट रो',
    'Dumbbell Shrugs': 'डंबल श्रग्स',
    'Barbell Shrugs': 'बारबेल श्रग्स',
    'Cable Shrugs': 'केबल श्रग्स',
    'Barbell Curl': 'बारबेल कर्ल',
    'EZ-Bar Curl': 'ई-ज़ी बार कर्ल',
    'Dumbbell Curl': 'डंबल कर्ल',
    'Alternating Dumbbell Curl': 'अल्टरनेटिंग डंबल कर्ल',
    'Hammer Curl': 'हैमर कर्ल',
    'Cross-Body Hammer Curl': 'क्रॉस-बॉडी हैमर कर्ल',
    'Incline Dumbbell Curl': 'इनक्लाइन डंबल कर्ल',
    'Concentration Curl': 'कंसंट्रेशन कर्ल',
    'Preacher Curl': 'प्रीचर कर्ल',
    'Machine Preacher Curl': 'मशीन प्रीचर कर्ल',
    'Cable Curl': 'केबल कर्ल',
    'Reverse Curl': 'रिवर्स कर्ल',
    'Spider Curl': 'स्पाइडर कर्ल',
    'Bayesian Cable Curl': 'बायेसियन केबल कर्ल',
    'Close-Grip Bench Press': 'क्लोज-ग्रिप बेंच प्रेस',
    'Tricep Rope Pushdown': 'ट्राइसेप रोप पुशडाउन',
    'Straight-Bar Cable Pushdown': 'स्ट्रेट-बार केबल पुशडाउन',
    'Skull Crushers': 'स्कल क्रशर्स (EZ-Bar)',
    'Overhead Dumbbell Tricep Extension': 'ओवरहेड डंबल ट्राइसेप एक्सटेंशन',
    'Overhead Cable Tricep Extension': 'ओवरहेड केबल ट्राइसेप एक्सटेंशन',
    'Dips': 'ट्राइसेप डिप्स',
    'Bench Dips': 'बेंच डिप्स',
    'Kickbacks': 'डंबल किकबैक्स',
    'JM Press': 'जेएम प्रेस (JM Press)',
    'Tate Press': 'टेट प्रेस',
    'Barbell Back Squat': 'बारबेल बैक स्क्वाट',
    'Front Squat': 'फ्रंट स्क्वाट',
    'Goblet Squat': 'गोब्लेट स्क्वाट',
    'Hack Squat': 'हैक स्क्वाट मशीन',
    'Leg Press (45-Degree)': '45-डिग्री लेग प्रेस (स्लेड 0 kg)',
    '45-Degree Leg Press': '45-डिग्री लेग प्रेस (स्लेड 0 kg)',
    'Horizontal Leg Press': 'हॉरिजॉन्टल लेग प्रेस',
    'Leg Extension': 'लेग एक्सटेंशन मशीन',
    'Walking Lunges': 'वॉकिंग लंजेस',
    'Reverse Lunges': 'रिवर्स लंजेस',
    'Bulgarian Split Squats': 'बल्गेरियन स्प्लिट स्क्वाट',
    'Step-ups': 'स्टेप-अप्स',
    'Sissy Squats': 'सिस्सी स्क्वाट्स',
    'Zercher Squat': 'ज़र्चर स्क्वाट',
    'Belt Squat': 'बेल्ट स्क्वाट',
    'Stiff-Legged Deadlift': 'स्टिफ-लेग्ड डेडलिफ्ट',
    'Lying Leg Curl': 'लाइंग लेग कर्ल (लेटकर)',
    'Seated Leg Curl': 'सीटेड लेग कर्ल (बैठकर)',
    'Standing Single-Leg Curl': 'स्टैंडिंग सिंगल-लेग कर्ल',
    'Nordic Hamstring Curl': 'नॉर्डिक हैमस्ट्रिंग कर्ल',
    'Good Mornings': 'गुड मॉर्निंग्स (बारबेल)',
    'Hip Thrust': 'बारबेल हिप थ्रस्ट',
    'Barbell Glute Bridge': 'बारबेल ग्लूट ब्रिज',
    'Cable Glute Kickback': 'केबल ग्लूट किकबैक',
    'Hyperextensions': 'हाइपरएक्सटेंशन',
    'Glute Ham Raise': 'ग्लूट हैम रेज़ (GHR)',
    'Cable Pull-Through': 'केबल पुल-थ्रू',
    'Standing Calf Raise': 'स्टैंडिंग काफ रेज़',
    'Seated Calf Raise': 'सीटेड काफ रेज़',
    'Leg Press Calf Raise': 'लेग प्रेस काफ रेज़',
    'Donkey Calf Raise': 'डंकी काफ रेज़',
    'Single-Leg Calf Raise': 'सिंगल-लेग काफ रेज़',
    'Hanging Leg Raise': 'हैंगिंग लेग रेज़',
    'Captain\'s Chair Leg Raise': 'कैप्टन्स चेयर लेग रेज़',
    'Cable Crunch': 'केबल क्रंच',
    'Ab Wheel Rollout': 'एब व्हील रोलआउट',
    'Plank': 'फोरआर्म प्लैंक (Plank)',
    'Side Plank': 'साइड प्लैंक',
    'Decline Crunch': 'डिक्लाइन क्रंच',
    'Russian Twist': 'रशियन ट्विस्ट',
    'Hanging Knee Raise': 'हैंगिंग नी रेज़',
    'Woodchoppers': 'केबल वुडचॉपर्स',
    'Deadbug': 'डेडबग कोर एक्सरसाइज',
    'Dragon Flag': 'ड्रैगन फ्लैग (Dragon Flag)',
    'Bird Dog': 'बर्ड डॉग',
    'Pallof Press': 'पैलोफ प्रेस',
    'Barbell Wrist Curl': 'बारबेल रिस्ट कर्ल',
    'Reverse Wrist Curl': 'रिवर्स रिस्ट कर्ल',
    'Dumbbell Wrist Curl': 'डंबल रिस्ट कर्ल',
    'Farmer\'s Walk': 'फार्मर्स वॉक (Farmer\'s Walk)',
    'Plate Pinch': 'वेट प्लेट पिंच होल्ड',
    'Dead Hang': 'डेड हैंग (ग्रिप स्ट्रेंथ)',
    'Reverse Barbell Curl': 'रिवर्स बारबेल कर्ल',
    'Clean and Press': 'क्लीन एंड प्रेस',
    'Power Clean': 'पावर क्लीन',
    'Snatch': 'स्नैच (ओलंपिक लिफ्ट)',
    'Kettlebell Swing': 'केटलबेल स्विंग',
    'Thrusters': 'थ्रस्टर्स (स्क्वाट + ओवरहेड प्रेस)',
    'Medicine Ball Slam': 'मेडिसिन बॉल स्लैम',
    'Burpees': 'बर्पीज़ (Burpees)',
    'Battle Ropes': 'बैटल रोप्स',
    'Tire Flip': 'टायर फ्लिप',
    'Sled Push': 'स्लेड पुश (Prowler Push)',
    'Sled Pull': 'स्लेड पुल'
  };

  return map[englishName] || `${englishName} (व्यायाम)`;
};

/**
 * Intelligent English-to-Hindi phrase replacer for fitness sentences
 */
function translateEnglishSentenceToHindi(text = '') {
  if (!text) return '';

  let out = text;
  
  const replacements = [
    [/Lie flat on the bench/gi, 'बेंच पर सीधा लेटें'],
    [/Plant feet flat on the floor/gi, 'पैरों को ज़मीन पर मजबूती से टिकाएँ'],
    [/shoulder-width apart/gi, 'कंधों की चौड़ाई पर'],
    [/Unrack the barbell/gi, 'बारबेल को रैक से उठाएँ'],
    [/Lower the bar under control/gi, 'बार को नियंत्रित गति से नीचे लाएँ'],
    [/Press upward explosively/gi, 'विस्फोटक ताकत से ऊपर प्रेस करें'],
    [/Maintain a natural arch/gi, 'स्वाभाविक आर्क बनाए रखें'],
    [/Inhale on the way down/gi, 'नीचे आते समय श्वास लें'],
    [/Exhale on the way up/gi, 'ऊपर उठते समय श्वास छोड़ें'],
    [/Keep your elbows tucked/gi, 'कोहनियों को हल्का सा अंदर रखें'],
    [/Lock out your knees/gi, 'घुटनों को अत्यधिक लॉक करें'],
    [/Do not lock your knees/gi, 'घुटनों को पूरी तरह लॉक न करें'],
    [/Keep your back flat and core braced/gi, 'पीठ को सपाट और कोर को मजबूत रखें'],
    [/Squeeze your glutes and hamstrings/gi, 'ग्लूट्स और हैमस्ट्रिंग्स को सिकोड़ें'],
    [/Full range of motion/gi, 'पूरी गति सीमा (Full Range of Motion)'],
    [/Lower until your thighs are parallel/gi, 'जांघें ज़मीन के समानांतर होने तक नीचे जाएँ']
  ];

  for (const [pattern, repl] of replacements) {
    out = out.replace(pattern, repl);
  }

  return out;
}
