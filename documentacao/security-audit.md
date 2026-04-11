# Auditoria de Segurança - FitPro360 🔐

## Visão Geral
Auditoria de segurança de código e persistência de dados do aplicativo **FitPro360**, garantindo conformidade com práticas modernas de desenvolvimento mobile, privacidade e Health Data.

## 1. Auditoria de Dependências (`npm audit`)
Foi rodada uma averiguação em todas as dependências provindas do Node Package Manager.
- **Vulnerabilidades Críticas:** 0
- **Vulnerabilidades Altas:** 0
- **Vulnerabilidades Médias/Baixas:** 0
- **Status Geral:** Pacotes Expo e Core React Native estão íntegros e dentro do range seguro estabelecido pelo SDK.

## 2. Hardcoded Secrets (Vazamento de Chaves)
Foi realizado um _RegEx Pattern Search_ buscando por `api_key`, `secret`, `password` ou `token` acoplados nos arquivos base.
- **Resultado:** O projeto base (MVP) não contém nenhuma chave transacionada via código em tela ou em serviços.
- **Ação Preventiva:** Criamos um mapa inteligente com o arquivo `.env.example` e atualizamos o `.gitignore` para bloquear eventuais commits das infraestruturas de backend (Futuramente Supabase / Google Maps) no repositório.

## 3. Criptografia em Repouso (Encryption At Rest) - Data Privacy
A feature central do aplicativo que lida com o maior fator de sensibilidade (PII/PHI - Altura, Peso, Condições de Saúde, Doenças, Medicamentos e Rotina do Usuário) estava inicialmente gravando em texto-plano usando o `AsyncStorage`.
- **Risco:** Celulares com root (Android) ou Jailbreak (iOS) permitem expor todo esse conteúdo de saúde para malwares ou scripts externos que consigam ler o diretório do app.
- **Correção Aplicada:** Realizamos downgrade do armazenamento desse objeto transicionando para o **expo-secure-store**. Agora o perfil vital de saúde (`@fitpro360_user`) é salvo usando uma criptografia forte simétrica que usa os hardwares seguros de cada sistema operacional (KeyStore no Android e Keychain no iOS).

## Parecer Técnico
A estabilidade atual provê forte segurança contra vazamentos via código (GitHub) e vazamentos locais do histórico sensível de saúde. A estrutura está robusta para as próximas escaladas cloud com tokens autenticados.
