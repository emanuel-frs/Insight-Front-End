import {
  AudioTypeEnum,
  InsightTypeEnum,
  LanguageEnum,
  ThemeEnum,
  UserConfig,
} from "../types/userConfig";
import api from "./api";

// Mapas de int → string para cada enum
const INSIGHT_TYPE_STR: Record<InsightTypeEnum, string> = {
  [InsightTypeEnum.Psicologia]: "Psicologia",
  [InsightTypeEnum.Financas]: "Financas",
  [InsightTypeEnum.Saude]: "Saude",
  [InsightTypeEnum.Tecnologia]: "Tecnologia",
  [InsightTypeEnum.Carreira]: "Carreira",
  [InsightTypeEnum.Relacionamentos]: "Relacionamentos",
  [InsightTypeEnum.Produtividade]: "Produtividade",
  [InsightTypeEnum.Autoconhecimento]: "Autoconhecimento",
};

const THEME_STR: Record<ThemeEnum, string> = {
  [ThemeEnum.Light]: "Light",
  [ThemeEnum.Dark]: "Dark",
  [ThemeEnum.System]: "System",
};

const LANGUAGE_STR: Record<LanguageEnum, string> = {
  [LanguageEnum.PortuguesBR]: "PortuguesBR",
  [LanguageEnum.English]: "English",
  [LanguageEnum.Spanish]: "Spanish",
};

const AUDIO_TYPE_STR: Record<AudioTypeEnum, string> = {
  [AudioTypeEnum.Musica]: "Musica",
  [AudioTypeEnum.Asmr]: "Asmr",
  [AudioTypeEnum.Ambiente]: "Ambiente",
};

function serializePayload(payload: Record<string, any>) {
  const body: Record<string, any> = { ...payload };

  if (body.interestedInsightTypes != null)
    body.interestedInsightTypes = body.interestedInsightTypes.map(
      (t: InsightTypeEnum) => INSIGHT_TYPE_STR[t],
    );

  if (body.theme != null) body.theme = THEME_STR[body.theme as ThemeEnum];

  if (body.language != null)
    body.language = LANGUAGE_STR[body.language as LanguageEnum];

  if (body.audioType != null)
    body.audioType = AUDIO_TYPE_STR[body.audioType as AudioTypeEnum];

  return body;
}

export const userConfigService = {
  async get(): Promise<UserConfig> {
    const res = await api.get("/api/UserConfigs");
    return res.data.data;
  },

  async create(payload: {
    language: LanguageEnum;
    theme: ThemeEnum;
    audioEnabled: boolean;
    audioType: AudioTypeEnum;
    interestedInsightTypes: InsightTypeEnum[];
  }): Promise<UserConfig> {
    const body = serializePayload(payload);
    console.log("[UserConfig] POST body:", JSON.stringify(body));
    const res = await api.post("/api/UserConfigs", body);
    return res.data.data;
  },

  async update(payload: {
    language?: LanguageEnum;
    theme?: ThemeEnum;
    audioEnabled?: boolean;
    audioType?: AudioTypeEnum;
    interestedInsightTypes?: InsightTypeEnum[];
  }): Promise<UserConfig> {
    const body = serializePayload(payload);
    console.log("[UserConfig] PUT body:", JSON.stringify(body));
    const res = await api.put("/api/UserConfigs", body);
    return res.data.data;
  },
};
