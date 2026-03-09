import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Language } from "../i18n/translations";
import { isNetworkError } from "../services/api";
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
  const [networkError, setNetworkError] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setNetworkError(false);
    try {
      const data = await userConfigService.get();
      const parsed = parseConfig(data);
      setConfig(parsed);
      setThemePreference(THEME_MAP[parsed.theme]);
      setLanguage(LANGUAGE_MAP[parsed.language ?? LanguageEnum.PortuguesBR]);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
        return;
      }
      // Config não existe ainda — tenta criar
      try {
        const created = await userConfigService.create({
          language: LanguageEnum.PortuguesBR,
          theme: ThemeEnum.System,
          audioEnabled: false,
          audioType: AudioTypeEnum.Ambiente,
          interestedInsightTypes: [],
        });
        setConfig(parseConfig(created));
      } catch (createErr) {
        if (isNetworkError(createErr)) {
          setNetworkError(true);
        } else {
          console.error("[UserConfig] POST falhou:", createErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

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

  return { config, isLoading, updateConfig, networkError, reload: load };
}
