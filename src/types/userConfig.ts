export enum InsightTypeEnum {
  Psicologia = 0,
  Financas = 1,
  Saude = 2,
  Tecnologia = 3,
  Carreira = 4,
  Relacionamentos = 5,
  Produtividade = 6,
  Autoconhecimento = 7,
}

export enum ThemeEnum {
  Light = 0,
  Dark = 1,
  System = 2,
}

export enum LanguageEnum {
  PortuguesBR = 0,
  English = 1,
  Spanish = 2,
}

export enum AudioTypeEnum {
  Musica = 0,
  Asmr = 1,
  Ambiente = 2,
}

export interface UserConfig {
  id: string;
  userId: string;
  language: LanguageEnum;
  theme: ThemeEnum;
  audioEnabled: boolean;
  audioType: AudioTypeEnum;
  interestedInsightTypes: InsightTypeEnum[];
  createdAt: string;
  updatedAt?: string;
}

export const INSIGHT_TYPE_LABELS: Record<InsightTypeEnum, string> = {
  [InsightTypeEnum.Psicologia]: "Psicologia",
  [InsightTypeEnum.Financas]: "Finanças",
  [InsightTypeEnum.Saude]: "Saúde",
  [InsightTypeEnum.Tecnologia]: "Tecnologia",
  [InsightTypeEnum.Carreira]: "Carreira",
  [InsightTypeEnum.Relacionamentos]: "Relacionamentos",
  [InsightTypeEnum.Produtividade]: "Produtividade",
  [InsightTypeEnum.Autoconhecimento]: "Autoconhecimento",
};

export const ALL_INSIGHT_TYPES = Object.values(InsightTypeEnum).filter(
  (v) => typeof v === "number",
) as InsightTypeEnum[];
