# FitPro360 🏋️‍♂️🥗

FitPro360 é um aplicativo mobile "all-in-one" inovador focado em transformar a saúde e rotina de treinamentos dos usuários. Desenvolvido com **React Native** e **Expo (SDK 54)**, o app conta com geração automatizada de treinos, elaboração de dietas inteligentes, tracking de GPS e integração via sensores e Bluetooth. 

Sua arquitetura foi projetada para focar em máxima performance offline e UX fluida, entregando uma interface premium focada no conceito visual de *Glassmorphism*.

## 🚀 Features Core (MVP)

- **🏃‍♂️ Gerador de Treinos Personalizados:** Algoritmo que concebe cronogramas adequados para os níveis do usuário em mais de 12 modalidades (Musculação, Calistenia, HIIT, Corrida, etc).
- **🍏 Nutrição e Dietas Automatizadas:** Cálculo autônomo da Taxa Metabólica Basal (TMB - método Mifflin-St Jeor), gerando divisão inteligente de macronutrientes e sugestões diárias.
- **📍 Rastreamento GPS e Mapas:** Monitoramento em tempo real (Geolocalização) com o Haversine Formula para tracking de pace na corrida e localizador de Academias, Parques e Feiras.
- **⌚ Integração com Sensores e Bluetooth (Wearables):** Conectividade BLE (Smartwatches/Monitores) e leitura de pedômetro do próprio smartphone para mensurar os passos e estimativa calórica.
- **👩‍⚕️ Portal do Profissional:** Telas com vistas projetadas para conectar Nutricionistas, Médicos e Personal Trainers acompanharem de perto as métricas e progressões dos seus alunos/pacientes.
- **🎨 Glassmorphism e Tema Dinâmico:** Construído integralmente com design altamente profissional, abusando de desfoques, gradientes em cores neon (Verde `#00D4AA` e Laranja `#FF6B35`) e sombras volumétricas fluidas.

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend Mobile** | React Native (0.81.5) |
| **Framework/Build** | Expo (SDK 54.x) |
| **Navegação** | Expo Router (File-based routing) |
| **Gerenciamento Local** | AsyncStorage |
| **Sensores e GPS** | `expo-location`, `expo-sensors` |
| **Design / Efeitos** | `expo-blur`, `expo-linear-gradient` |
| **Bluetooth (BLE)** | Configurado base PLX IoT |
| **Gráficos e Mapas** | `react-native-svg`, Maps API |
| **Android Build** | Offline Gradle (Temurin JDK 17) |

## 📁 Arquitetura do Projeto

```text
fitpro360/
├── app/                  # Rotas (Expo Router) 
│   ├── (auth)/           # Telas de Onboarding, etc
│   ├── (tabs)/           # Dashboard, Treinos, Nutrição, Perfil e Mapa
│   └── profissional/     # Visão B2B/Profissionais de saúde
├── assets/               # Imagens, App Icons Gen-AI, Splash Screens
├── components/           # Componentes UI (GlassCards, Inputs, Lists)
├── constants/            # Tokens de Sistema Moderno (Theme, Colors)
├── data/                 # Data Sets mockados (Exercícios, Alimentos)
├── documentacao/         # Estratégia B2B, Marketing, SEO Lojas
├── services/             # Lógica de Integração nativa e algoritmos
└── android/              # Configurações de Build nativo (App Android C++)
```

## ⚙️ Como rodar localmente (Desenvolvimento)

Certifique-se de possuir o Node.js v18/v20+ e a CLI do expo na sua máquina.

1. Instale as dependências:
```bash
npm install
```

2. Rode em ambiente de desenvolvimento (Browser ou simulador mobile com Expo Go):
```bash
npm run start
# Aperte 'w' para Web, 'a' para Android emulator ou escaneie o QRCode
```

3. Geração de APK Final (Android Native Local):
Foi disponibilizado também o `build-apk-local.ps1` com configurações diretas para contornar limitações em dependências Android, que faz build usando *JDK 17* puro (sem requerer nuvem).

## 📇 Documentação Estratégica Inclusa
Para a modelagem completa de negócio e lançamento em produção as documentações do FitPro360 foram arquitetadas na pasta `/documentacao`:
- *Estratégia de Produto:* Analíticos, Tiers Freemium, KPIs;
- *Plano de Marketing:* ASO, Cronograma e parcerias;
- *Identidade Visual:* Manuais da Marca e Design System;
- *ASO Lojas:* Copy de marketing direto das Stores (App Store/Play Store).

---
*Construído com automação sistêmica de Assistência Agêntica Avançada sobre Stack Universal.*
