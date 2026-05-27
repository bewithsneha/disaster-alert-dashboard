import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Disaster Alerts": "Disaster Alerts",
      "Search alerts...": "Search alerts...",
      "Type": "Type",
      "All Types": "All Types",
      "Earthquake": "Earthquake",
      "Flood": "Flood",
      "Storm": "Storm",
      "Wildfire": "Wildfire",
      "Weather": "Weather",
      "Severity": "Severity",
      "All Severities": "All Severities",
      "High": "High",
      "Medium": "Medium",
      "Low": "Low",
      "Country": "Country",
      "e.g. Japan, USA": "e.g. Japan, USA",
      "Live Feed": "Live Feed",
      "No alerts found.": "No alerts found.",
      "Occurred at": "Occurred at",
      "Login": "Login",
      "Register": "Register",
      "Username": "Username",
      "Password": "Password",
      "Don't have an account?": "Don't have an account?",
      "Already have an account?": "Already have an account?",
      "Dashboard": "Dashboard",
      "Quake": "Quake",
      "Volcano": "Volcano",
      "Other": "Other",
      "Active": "Active",
      "Total Active": "Total Active",
      "High Severity": "High Severity"
    }
  },
  hi: {
    translation: {
      "Disaster Alerts": "आपदा अलर्ट",
      "Search alerts...": "अलर्ट खोजें...",
      "Type": "प्रकार",
      "All Types": "सभी प्रकार",
      "Earthquake": "भूकंप",
      "Flood": "बाढ़",
      "Storm": "तूफ़ान",
      "Wildfire": "जंगल की आग",
      "Weather": "मौसम",
      "Severity": "गंभीरता",
      "All Severities": "सभी गंभीरता",
      "High": "उच्च",
      "Medium": "मध्यम",
      "Low": "निम्न",
      "Country": "देश",
      "e.g. Japan, USA": "उदा. जापान, अमेरिका",
      "Live Feed": "लाइव फ़ीड",
      "No alerts found.": "कोई अलर्ट नहीं मिला।",
      "Occurred at": "समय",
      "Login": "लॉग इन करें",
      "Register": "रजिस्टर करें",
      "Username": "उपयोगकर्ता नाम",
      "Password": "पासवर्ड",
      "Don't have an account?": "क्या आपके पास खाता नहीं है?",
      "Already have an account?": "क्या आपके पास पहले से खाता है?",
      "Dashboard": "डैशबोर्ड",
      "Quake": "भूकंप",
      "Volcano": "ज्वालामुखी",
      "Other": "अन्य",
      "Active": "सक्रिय",
      "Total Active": "कुल सक्रिय",
      "High Severity": "उच्च गंभीरता"
    }
  },
  bn: {
    translation: {
      "Disaster Alerts": "দুর্যোগ সতর্কতা",
      "Search alerts...": "সতর্কতা খুঁজুন...",
      "Type": "ধরন",
      "All Types": "সব ধরন",
      "Earthquake": "ভূমিকম্প",
      "Flood": "বন্যা",
      "Storm": "ঝড়",
      "Wildfire": "দাবানল",
      "Weather": "আবহাওয়া",
      "Severity": "তীব্রতা",
      "All Severities": "সব তীব্রতা",
      "High": "উচ্চ",
      "Medium": "মাঝারি",
      "Low": "নিম্ন",
      "Country": "দেশ",
      "e.g. Japan, USA": "উদা. জাপান, মার্কিন যুক্তরাষ্ট্র",
      "Live Feed": "লাইভ ফিড",
      "No alerts found.": "কোনো সতর্কতা পাওয়া যায়নি।",
      "Occurred at": "সময়",
      "Login": "লগইন",
      "Register": "নিবন্ধন করুন",
      "Username": "ব্যবহারকারীর নাম",
      "Password": "পাসওয়ার্ড",
      "Don't have an account?": "অ্যাকাউন্ট নেই?",
      "Already have an account?": "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
      "Dashboard": "ড্যাশবোর্ড",
      "Quake": "ভূমিকম্প",
      "Volcano": "আগ্নেয়গিরি",
      "Other": "অন্যান্য",
      "Active": "সক্রিয়",
      "Total Active": "মোট সক্রিয়",
      "High Severity": "উচ্চ তীব্রতা"
    }
  },
  ta: {
    translation: {
      "Disaster Alerts": "பேரழிவு எச்சரிக்கைகள்",
      "Search alerts...": "எச்சரிக்கைகளை தேடு...",
      "Type": "வகை",
      "All Types": "அனைத்து வகைகள்",
      "Earthquake": "நிலநடுக்கம்",
      "Flood": "வெள்ளம்",
      "Storm": "புயல்",
      "Wildfire": "காட்டுத்தீ",
      "Weather": "வானிலை",
      "Severity": "தீவிரம்",
      "All Severities": "அனைத்து தீவிரமும்",
      "High": "உயர்",
      "Medium": "நடுத்தர",
      "Low": "குறைந்த",
      "Country": "நாடு",
      "e.g. Japan, USA": "எ.கா. ஜப்பான், அமெரிக்கா",
      "Live Feed": "நேரடி ஊட்டம்",
      "No alerts found.": "எச்சரிக்கைகள் இல்லை.",
      "Occurred at": "நிகழ்ந்தது",
      "Login": "உள்நுழைய",
      "Register": "பதிவு செய்",
      "Username": "பயனர்பெயர்",
      "Password": "கடவுச்சொல்",
      "Don't have an account?": "கணக்கு இல்லையா?",
      "Already have an account?": "ஏற்கனவே ஒரு கணக்கு உள்ளதா?",
      "Dashboard": "டாஷ்போர்டு",
      "Quake": "நிலநடுக்கம்",
      "Volcano": "எரிமலை",
      "Other": "மற்றவை",
      "Active": "செயலில்",
      "Total Active": "மொத்த செயலில்",
      "High Severity": "உயர் தீவிரம்"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
