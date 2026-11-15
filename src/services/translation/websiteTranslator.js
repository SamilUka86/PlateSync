/**
 * PlateSync - Global Website Translation Service
 * 
 * Provides seamless multi-language translation for the entire application across all pages.
 * Powered by client-side Google Website Translation Engine with support for 18+ languages,
 * persisted across app sessions, reloads, and mobile navigation.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', shortCode: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', shortCode: 'HI' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', shortCode: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', shortCode: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', shortCode: 'DE' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', shortCode: 'JA' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', shortCode: 'ZH' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', shortCode: 'PT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', shortCode: 'RU' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', shortCode: 'AR' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', shortCode: 'IT' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', shortCode: 'KO' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', shortCode: 'BN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', shortCode: 'MR' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', shortCode: 'TE' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', shortCode: 'TA' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', shortCode: 'GU' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', shortCode: 'PA' }
];

const STORAGE_KEY = 'platesync_app_language';

/**
 * Get the currently active language code
 */
export const getCurrentLanguageCode = () => {
  try {
    // 1. Check localStorage preference
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    // 2. Check googtrans cookie: /en/hi or /auto/es
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/([^/]+)\/([^;]+)/);
    if (match && match[2]) {
      return match[2];
    }
  } catch (e) {
    console.warn('Could not read translation language:', e);
  }
  return 'en';
};

/**
 * Get active language metadata object
 */
export const getCurrentLanguage = () => {
  const code = getCurrentLanguageCode();
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
};

/**
 * Set Google Translate cookie on all domain scopes
 */
export const setGoogleTranslateCookie = (langCode) => {
  try {
    const host = window.location.hostname;
    const value = `/en/${langCode}`;

    // Standard path cookie
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${host}`;

    // Root domain for subdomains/hosts
    if (host.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const parts = host.split('.');
      if (parts.length > 2) {
        const rootDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `googtrans=${value}; path=/; domain=${rootDomain}`;
      }
    }
  } catch (e) {
    console.warn('Error setting googtrans cookie:', e);
  }
};

/**
 * Clear Google Translate cookies completely
 */
export const clearGoogleTranslateCookie = () => {
  try {
    const host = window.location.hostname;
    const expire = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';

    document.cookie = `googtrans=; ${expire}; path=/`;
    document.cookie = `googtrans=; ${expire}; path=/; domain=${host}`;

    if (host.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const parts = host.split('.');
      if (parts.length > 2) {
        const rootDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `googtrans=; ${expire}; path=/; domain=${rootDomain}`;
      }
    }
  } catch (e) {
    console.warn('Error clearing googtrans cookie:', e);
  }
};

/**
 * Ensure Google Translate script is loaded and initialized
 */
export const ensureGoogleTranslateLoaded = () => {
  if (typeof window === 'undefined') return;

  // Check if already loaded
  if (window.google && window.google.translate) return;

  // Setup init callback
  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
        }
      } catch (err) {
        console.warn('Google Translate element init error:', err);
      }
    };
  }

  // Ensure mount container exists
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    document.body.appendChild(div);
  }

  // Load script if not already on page
  const scriptId = 'google-translate-script';
  if (!document.getElementById(scriptId)) {
    const s = document.createElement('script');
    s.id = scriptId;
    s.type = 'text/javascript';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
};

/**
 * Change the website language across all pages
 * 
 * @param {string} langCode e.g. 'en', 'hi', 'es', 'fr', 'de', 'ja'
 * @param {Function} [onSuccess] callback after changing
 */
export const changeWebsiteLanguage = (langCode, onSuccess) => {
  try {
    if (!langCode || langCode === 'en') {
      // Restore English original
      localStorage.setItem(STORAGE_KEY, 'en');
      clearGoogleTranslateCookie();

      // Trigger translate combo if present
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      
      // Reload to ensure DOM is cleanly restored without residue
      setTimeout(() => {
        window.location.reload();
      }, 150);
      return;
    }

    // Set target language
    localStorage.setItem(STORAGE_KEY, langCode);
    setGoogleTranslateCookie(langCode);

    // Check if Google Translate combo exists in DOM
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
      if (onSuccess) onSuccess(langCode);
    } else {
      // Ensure script is injected, then reload so cookie translates page immediately
      ensureGoogleTranslateLoaded();
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  } catch (err) {
    console.error('Error changing website language:', err);
    window.location.reload();
  }
};
