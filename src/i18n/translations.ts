export type Language = "PortuguesBR" | "English" | "Spanish";

export const translations = {
  PortuguesBR: {
    // Sidebar
    home: "Início",
    favorites: "Favoritos",
    settings: "Configurações",
    profile: "Perfil",
    logout: "Sair",
    comingSoon: "em breve",

    // Settings
    settingsTitle: "Configurações",
    back: "← Voltar",
    yourInterests: "Seus interesses",
    interestsSubtitle:
      "Selecione os temas que mais te interessam. Deixe vazio para ver todos.",
    appearance: "Aparência",
    appearanceSubtitle: "Escolha como o app deve aparecer.",
    themeLight: "Claro",
    themeDark: "Escuro",
    themeSystem: "Sistema",
    ambientAudio: "Áudio ambiente",
    ambientAudioSubtitle: "Toque um som enquanto lê seus insights.",
    audioMusic: "Música",
    audioAsmr: "ASMR",
    audioAmbient: "Ambiente",
    language: "Idioma",
    languageSubtitle: "Escolha o idioma da interface.",
    save: "Salvar",

    // Home
    noInsights: "Nenhum insight disponível",

    // Insight types
    typePsicologia: "Psicologia",
    typeFinancas: "Finanças",
    typeSaude: "Saúde",
    typeTecnologia: "Tecnologia",
    typeCarreira: "Carreira",
    typeRelacionamentos: "Relacionamentos",
    typeProdutividade: "Produtividade",
    typeAutoconhecimento: "Autoconhecimento",

    // Auth
    loginTitle: "Entrar",
    registerTitle: "Criar conta",
    email: "E-mail",
    password: "Senha",
    name: "Nome",
    loginButton: "Entrar",
    registerButton: "Criar conta",
    switchToRegister: "Não tem conta? Cadastre-se",
    switchToLogin: "Já tem conta? Entre",

    // Misc
    minutes: "min",
  },

  English: {
    home: "Home",
    favorites: "Favorites",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    comingSoon: "soon",

    settingsTitle: "Settings",
    back: "← Back",
    yourInterests: "Your interests",
    interestsSubtitle:
      "Select the topics you're most interested in. Leave empty to see all.",
    appearance: "Appearance",
    appearanceSubtitle: "Choose how the app should look.",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    ambientAudio: "Ambient audio",
    ambientAudioSubtitle: "Play a sound while reading your insights.",
    audioMusic: "Music",
    audioAsmr: "ASMR",
    audioAmbient: "Ambient",
    language: "Language",
    languageSubtitle: "Choose the interface language.",
    save: "Save",

    noInsights: "No insights available",

    typePsicologia: "Psychology",
    typeFinancas: "Finance",
    typeSaude: "Health",
    typeTecnologia: "Technology",
    typeCarreira: "Career",
    typeRelacionamentos: "Relationships",
    typeProdutividade: "Productivity",
    typeAutoconhecimento: "Self-knowledge",

    loginTitle: "Sign in",
    registerTitle: "Create account",
    email: "Email",
    password: "Password",
    name: "Name",
    loginButton: "Sign in",
    registerButton: "Create account",
    switchToRegister: "No account? Sign up",
    switchToLogin: "Already have an account? Sign in",

    minutes: "min",
  },

  Spanish: {
    home: "Inicio",
    favorites: "Favoritos",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Salir",
    comingSoon: "pronto",

    settingsTitle: "Configuración",
    back: "← Volver",
    yourInterests: "Tus intereses",
    interestsSubtitle:
      "Selecciona los temas que más te interesan. Déjalo vacío para ver todos.",
    appearance: "Apariencia",
    appearanceSubtitle: "Elige cómo debe verse la app.",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    ambientAudio: "Audio ambiente",
    ambientAudioSubtitle: "Reproduce un sonido mientras lees tus insights.",
    audioMusic: "Música",
    audioAsmr: "ASMR",
    audioAmbient: "Ambiente",
    language: "Idioma",
    languageSubtitle: "Elige el idioma de la interfaz.",
    save: "Guardar",

    noInsights: "No hay insights disponibles",

    typePsicologia: "Psicología",
    typeFinancas: "Finanzas",
    typeSaude: "Salud",
    typeTecnologia: "Tecnología",
    typeCarreira: "Carrera",
    typeRelacionamentos: "Relaciones",
    typeProdutividade: "Productividad",
    typeAutoconhecimento: "Autoconocimiento",

    loginTitle: "Iniciar sesión",
    registerTitle: "Crear cuenta",
    email: "Correo",
    password: "Contraseña",
    name: "Nombre",
    loginButton: "Iniciar sesión",
    registerButton: "Crear cuenta",
    switchToRegister: "¿No tienes cuenta? Regístrate",
    switchToLogin: "¿Ya tienes cuenta? Inicia sesión",

    minutes: "min",
  },
} as const;

export type TranslationKey = keyof typeof translations.PortuguesBR;
