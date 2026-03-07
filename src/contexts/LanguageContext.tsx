import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Language, TranslationKey, translations } from "../i18n/translations";

interface LanguageContextData {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LANGUAGE_STORAGE_KEY = "@insight:language";

function detectDeviceLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageTag ?? "pt";
  if (locale.startsWith("pt")) return "PortuguesBR";
  if (locale.startsWith("es")) return "Spanish";
  return "English";
}

const LanguageContext = createContext<LanguageContextData>(
  {} as LanguageContextData,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Começa com o idioma do dispositivo para evitar flash de idioma errado
  const [language, setLanguageState] = useState<Language>(
    detectDeviceLanguage(),
  );

  useEffect(() => {
    // Se o usuário já escolheu um idioma antes, usa esse
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((saved) => {
      if (saved) setLanguageState(saved as Language);
    });
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  function t(key: TranslationKey): string {
    return (
      (translations[language] as any)[key] ??
      (translations.PortuguesBR as any)[key] ??
      key
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
