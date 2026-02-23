import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Language } from "../i18n/translations";
import { userConfigService } from "../services/userConfigService";
import {
  AudioTypeEnum,
  InsightTypeEnum,
  LanguageEnum,
  ThemeEnum,
  UserConfig,
} from "../types/userConfig";

function parseConfig(raw: any): UserConfig {
  const INSIGHT_STR_TO_INT: Record<string, InsightTypeEnum> = {
    Psicologia: InsightTypeEnum.Psicologia,
    Financas: InsightTypeEnum.Financas,
    Saude: InsightTypeEnum.Saude,
    Tecnologia: InsightTypeEnum.Tecnologia,
    Carreira: InsightTypeEnum.Carreira,
    Relacionamentos: InsightTypeEnum.Relacionamentos,
    Produtividade: InsightTypeEnum.Produtividade,
    Autoconhecimento: InsightTypeEnum.Autoconhecimento,
  };
  return {
    ...raw,
    interestedInsightTypes: (raw.interestedInsightTypes ?? []).map(
      (t: string) => INSIGHT_STR_TO_INT[t] ?? t,
    ),
    theme:
      (
        {
          Light: ThemeEnum.Light,
          Dark: ThemeEnum.Dark,
          System: ThemeEnum.System,
        } as any
      )[raw.theme] ?? raw.theme,
    language:
      (
        {
          PortuguesBR: LanguageEnum.PortuguesBR,
          English: LanguageEnum.English,
          Spanish: LanguageEnum.Spanish,
        } as any
      )[raw.language] ?? raw.language,
    audioType:
      (
        {
          Musica: AudioTypeEnum.Musica,
          Asmr: AudioTypeEnum.Asmr,
          Ambiente: AudioTypeEnum.Ambiente,
        } as any
      )[raw.audioType] ?? raw.audioType,
  };
}

const THEME_MAP: Record<ThemeEnum, "Light" | "Dark" | "System"> = {
  [ThemeEnum.Light]: "Light",
  [ThemeEnum.Dark]: "Dark",
  [ThemeEnum.System]: "System",
};

const LANGUAGE_MAP: Record<LanguageEnum, Language> = {
  [LanguageEnum.PortuguesBR]: "PortuguesBR",
  [LanguageEnum.English]: "English",
  [LanguageEnum.Spanish]: "Spanish",
};

export function useUserConfig() {
  const { setThemePreference } = useTheme();
  const { setLanguage } = useLanguage();
  const { token } = useAuth();
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await userConfigService.get();
        const parsed = parseConfig(data);
        setConfig(parsed);
        setThemePreference(THEME_MAP[parsed.theme]);
        setLanguage(LANGUAGE_MAP[parsed.language ?? LanguageEnum.PortuguesBR]);
      } catch {
        try {
          const created = await userConfigService.create({
            language: LanguageEnum.PortuguesBR,
            theme: ThemeEnum.System,
            audioEnabled: false,
            audioType: AudioTypeEnum.Ambiente,
            interestedInsightTypes: [],
          });
          setConfig(parseConfig(created));
        } catch (e) {
          console.error("[UserConfig] POST falhou:", e);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  async function updateConfig(payload: Partial<UserConfig>) {
    if (!config) return;
    try {
      const updated = await userConfigService.update(payload);
      const parsed = parseConfig(updated);
      setConfig(parsed);
      if (payload.theme !== undefined) {
        setThemePreference(THEME_MAP[payload.theme as ThemeEnum]);
      }
      if (payload.language !== undefined) {
        setLanguage(LANGUAGE_MAP[payload.language as LanguageEnum]);
      }
      return parsed;
    } catch (e: any) {
      console.error("[UserConfig] PUT falhou:", e?.response?.data);
      throw e;
    }
  }

  return { config, isLoading, updateConfig };
}
