# NEL3 MEDS - Projetos de Gestão Médica

Este repositório contém dois projetos principais relacionados à gestão médica e financeira:

## 📁 Estrutura do Projeto

```
Nel3 Meds/
├── health-partner-pro-main/    # Sistema de gestão de parceiros de saúde
├── nel3-app/                   # Aplicativo móvel de gestão médica
└── README.md                   # Este arquivo
```

## 🏥 Health Partner Pro

**Sistema de gestão de parceiros de saúde**

- **Tecnologias**: React, TypeScript, Vite, shadcn-ui, Tailwind CSS
- **URL do Projeto**: https://lovable.dev/projects/94c723bb-306d-47e6-8d4e-61b285700d3d
- **Funcionalidades**:
  - Dashboard com KPIs e métricas
  - Gestão de parceiros e afiliados
  - Sistema de aprovações
  - Relatórios e operações
  - Interface administrativa completa

### Como executar:

```bash
cd health-partner-pro-main
npm install
npm run dev
```

## 📱 NEL3 App

**Aplicativo móvel de gestão médica**

- **Tecnologias**: React, TypeScript, Vite, Capacitor, shadcn-ui, Tailwind CSS
- **URL do Projeto**: https://lovable.dev/projects/f214b8cd-27f4-4694-b313-5d28de4e257e
- **Credenciais de Acesso**:
  - **Email**: admin@admin
  - **Senha**: 123123
- **Funcionalidades**:
  - Sistema de autenticação biométrica
  - Dashboard com métricas financeiras
  - Gestão de consultas e agenda
  - Sistema PIX integrado
  - Antecipação de recebíveis
  - Upload de notas fiscais
  - Interface responsiva e moderna

### Como executar:

```bash
cd nel3-app
npm install
npm run dev
```

### Para build mobile (Android/iOS):

```bash
# Instalar dependências do Capacitor
npm install @capacitor/cli @capacitor/core @capacitor/android @capacitor/ios

# Build para produção
npm run build

# Adicionar plataformas
npx cap add android
npx cap add ios

# Sincronizar e abrir no Android Studio / Xcode
npx cap sync
npx cap open android
npx cap open ios
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Recharts** - Gráficos e visualizações

### Mobile
- **Capacitor** - Bridge para aplicativos nativos
- **Playwright** - Testes automatizados

### Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📋 Funcionalidades Principais

### Health Partner Pro
- ✅ Dashboard executivo com KPIs
- ✅ Gestão de parceiros e afiliados
- ✅ Sistema de aprovações
- ✅ Relatórios financeiros
- ✅ Operações de cobrança e reconciliação
- ✅ Interface administrativa responsiva

### NEL3 App
- ✅ Autenticação biométrica
- ✅ Dashboard financeiro
- ✅ Gestão de agenda médica
- ✅ Sistema PIX completo
- ✅ Antecipação de recebíveis
- ✅ Upload de documentos
- ✅ Simulador de antecipação
- ✅ Histórico de transações

## 🔧 Scripts Disponíveis

### Health Partner Pro
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

### NEL3 App
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 📱 Deploy

### Health Partner Pro
Acesse o [Lovable Project](https://lovable.dev/projects/94c723bb-306d-47e6-8d4e-61b285700d3d) e clique em Share -> Publish.

### NEL3 App
Acesse o [Lovable Project](https://lovable.dev/projects/f214b8cd-27f4-4694-b313-5d28de4e257e) e clique em Share -> Publish.

## 🌐 Domínios Personalizados

Ambos os projetos suportam domínios personalizados através do Lovable:
- Navegue para Project > Settings > Domains
- Clique em Connect Domain
- Siga as instruções para configurar seu domínio

## 📝 Notas de Desenvolvimento

- Ambos os projetos utilizam a mesma stack tecnológica para consistência
- O NEL3 App possui funcionalidades específicas para mobile (Capacitor)
- O Health Partner Pro é focado em interface administrativa desktop
- Ambos possuem sistemas de autenticação integrados
- Os projetos são independentes e podem ser executados separadamente

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e destinado ao uso interno da NEL3 MEDS.
