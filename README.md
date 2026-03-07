# InSight — Mobile App

> Feed de insights personalizados com gestos intuitivos, favoritos, perfil e onboarding completo.

---

## Sobre o projeto

**InSight** é um aplicativo mobile desenvolvido em React Native (Expo) que entrega insights diários sobre temas como Psicologia, Finanças, Saúde, Carreira, Tecnologia e mais. O usuário navega pelos cards com gestos — arrasta para cima para ler, desliza para favoritar ou ignorar — e o feed se adapta ao que ele já viu.

Este repositório contém o **frontend mobile**. O backend (.NET + MongoDB) está em repositório separado — veja a seção [Backend](#backend).

---

## Funcionalidades

- 🔐 **Autenticação** — Login e cadastro com JWT
- 🃏 **Feed de cards** — Stack de insights com gestos (swipe up, direita, esquerda)
- ❤️ **Favoritos** — Salva insights deslizando para a direita
- 🚫 **Ignorar** — Desliza para esquerda e o insight não aparece mais
- 📖 **Leitura completa** — Expande o card com animação de morfismo
- 👤 **Perfil** — Visualiza dados da conta e edita o nome
- ⚙️ **Configurações** — Interesses, tema (Claro/Escuro/Sistema) e idioma
- 🌍 **Internacionalização** — Português, Inglês e Espanhol com detecção automática do dispositivo
- 🎓 **Onboarding** — Slides de boas-vindas + seleção de interesses na primeira abertura
- 📚 **Tutorial** — Guia interativo do feed e da sidebar na primeira visita
- 🌙 **Tema escuro/claro** — Persistido com AsyncStorage

---

## Tecnologias

| Categoria     | Tecnologia                   |
| ------------- | ---------------------------- |
| Framework     | React Native + Expo SDK 52   |
| Navegação     | Expo Router (file-based)     |
| Animações     | React Native Reanimated 3    |
| Gestos        | React Native Gesture Handler |
| Estado        | React Context API            |
| HTTP          | Axios                        |
| Storage local | AsyncStorage                 |
| Localização   | expo-localization            |
| Ícones        | react-icons                  |
| Gradientes    | expo-linear-gradient         |

---

## Pré-requisitos

- Node.js >= 18
- npm >= 9 ou yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (para emulador Android) **ou** Xcode (para simulador iOS)
- EAS CLI para gerar APK/IPA: `npm install -g eas-cli`

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/insight-app.git
cd insight-app

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com a URL do seu backend

# 4. Inicie o servidor de desenvolvimento
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS) ou pressione:

- `a` — abre no emulador Android
- `i` — abre no simulador iOS

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://sua-api.com
```

> ⚠️ Nunca commite o `.env` com valores reais. O `.gitignore` já o exclui.

---

## Estrutura de pastas

```
insight-app/
├── app/                        # Rotas (Expo Router)
│   ├── (auth)/                 # Telas de autenticação
│   │   ├── _layout.tsx
│   │   └── index.tsx           # Login / Cadastro
│   └── (app)/                  # Telas autenticadas
│       ├── _layout.tsx
│       ├── index.tsx           # Feed principal
│       ├── favorites.tsx       # Favoritos
│       ├── settings.tsx        # Configurações
│       ├── profile.tsx         # Perfil
│       └── onboarding.tsx      # Onboarding (primeira vez)
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── InsightCard.tsx
│   │   ├── RichText.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarTutorial.tsx
│   │   └── HomeTutorial.tsx
│   ├── contexts/               # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useInsights.ts
│   │   └── useUserConfig.ts
│   ├── services/               # Chamadas à API
│   │   ├── api.ts              # Instância Axios
│   │   ├── authService.ts
│   │   ├── favoriteService.ts
│   │   ├── insightViewService.ts
│   │   └── userService.ts
│   ├── i18n/
│   │   └── translations.ts     # Strings PT / EN / ES
│   └── types/
│       └── userConfig.ts       # Enums e tipos do domínio
├── assets/
│   ├── images/                 # Logo e splash
│   └── insight_images/         # Imagens por categoria
├── .env.example
├── app.json                    # Configuração do Expo
├── eas.json                    # Configuração de build (EAS)
└── README.md
```

---

## Gerando o APK (Android)

O projeto usa **EAS Build** (Expo Application Services).

### 1. Configure o EAS

```bash
eas login
eas build:configure
```

Isso cria o `eas.json`. Verifique se ele contém:

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### 2. Build de preview (APK direto para instalar)

```bash
eas build --platform android --profile preview
```

O link para download do `.apk` aparece no terminal e no painel [expo.dev](https://expo.dev).

### 3. Build de produção (AAB para Play Store)

```bash
eas build --platform android --profile production
```

---

## Logo e Splash Screen

Os assets ficam em `assets/images/`:

| Arquivo             | Uso                      | Tamanho recomendado |
| ------------------- | ------------------------ | ------------------- |
| `icon.png`          | Ícone do app             | 1024×1024 px        |
| `splash.png`        | Splash screen            | 1284×2778 px        |
| `adaptive-icon.png` | Ícone adaptativo Android | 1024×1024 px        |
| `logo_white.png`    | Logo tema escuro         | livre               |
| `logo_blue.png`     | Logo tema claro          | livre               |

Configure em `app.json`:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B101F"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0B101F"
      }
    }
  }
}
```

---

## Backend

O backend da aplicação está em repositório separado:

> 🔗 **[insight-api](https://github.com/seu-usuario/insight-api)** — .NET 8 + MongoDB

No repositório do backend você encontrará:

- Arquitetura e estrutura do projeto
- Instruções de configuração e execução local
- Variáveis de ambiente necessárias
- Documentação dos endpoints (Swagger)
- Instruções de deploy

---

## Tutorial da aplicação

Na primeira abertura o usuário passa por:

1. **Seleção de idioma** — detectado automaticamente pelo dispositivo
2. **Onboarding** — 4 slides explicando as funcionalidades
3. **Tutorial do feed** — overlay com 3 passos sobre os gestos
4. **Tutorial da sidebar** — callouts sobre cada item do menu

Todos os tutoriais são marcados no `AsyncStorage` e não aparecem novamente.

Para **resetar os tutoriais** em desenvolvimento, limpe o AsyncStorage ou remova as chaves:

```
@insight:onboarding_done
@insight:tutorial_done
@insight:sidebar_tutorial_done
```

---

## Contribuindo

Pull requests são bem-vindos. Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

## Licença

MIT
