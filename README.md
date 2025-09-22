# 🏥 NEL3 MEDS - Workspace Completo

Workspace contendo todos os projetos da NEL3 MEDS para gestão médica e financeira.

## 📁 Estrutura do Workspace

```
Backoffice NEL3/
├── app-love-finance/              # 📱 Aplicativo móvel NEL3
│   ├── src/                       # Código fonte do app
│   ├── screenshots-*/             # Screenshots do app
│   └── dist/                      # Build de produção
├── nel3backoffice/                # 🖥️ Sistema de backoffice
│   └── health-partner-pro-main/   # Sistema de gestão de parceiros
└── README.md                      # Este arquivo
```

## 🚀 Projetos Incluídos

### 📱 NEL3 App (app-love-finance)
**Aplicativo móvel de gestão médica**

- **Tecnologias**: React, TypeScript, Vite, Capacitor, shadcn-ui, Tailwind CSS
- **Funcionalidades**:
  - Sistema de autenticação biométrica
  - Dashboard com métricas financeiras
  - Gestão de consultas e agenda
  - Sistema PIX integrado
  - Antecipação de recebíveis
  - Upload de notas fiscais
  - Interface responsiva e moderna

**Como executar:**
```bash
cd app-love-finance
npm install
npm run dev
```

### 🖥️ NEL3 Backoffice (nel3backoffice/health-partner-pro-main)
**Sistema administrativo de gestão de parceiros**

- **Tecnologias**: React, TypeScript, Vite, shadcn-ui, Tailwind CSS
- **Funcionalidades**:
  - Dashboard executivo com KPIs
  - Gestão de parceiros e afiliados
  - Sistema de aprovações
  - Relatórios financeiros
  - Operações de cobrança e reconciliação
  - Interface administrativa responsiva

**Como executar:**
```bash
cd nel3backoffice/health-partner-pro-main
npm install
npm run dev
```

## 🛠️ Tecnologias Utilizadas

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

### NEL3 App
- ✅ Autenticação biométrica
- ✅ Dashboard financeiro
- ✅ Gestão de agenda médica
- ✅ Sistema PIX completo
- ✅ Antecipação de recebíveis
- ✅ Upload de documentos
- ✅ Simulador de antecipação
- ✅ Histórico de transações

### NEL3 Backoffice
- ✅ Dashboard executivo com KPIs
- ✅ Gestão de parceiros e afiliados
- ✅ Sistema de aprovações
- ✅ Relatórios financeiros
- ✅ Operações de cobrança e reconciliação
- ✅ Interface administrativa responsiva

## 🔧 Scripts Disponíveis

### NEL3 App
```bash
cd app-love-finance
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

### NEL3 Backoffice
```bash
cd nel3backoffice/health-partner-pro-main
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 📱 Deploy

### NEL3 App (Mobile)
```bash
cd app-love-finance

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

### NEL3 Backoffice (Web)
```bash
cd nel3backoffice/health-partner-pro-main

# Build para produção
npm run build

# Deploy
# Os arquivos em dist/ podem ser enviados para qualquer serviço de hosting
```

## 🎨 Screenshots

O projeto `app-love-finance` inclui screenshots completos em alta qualidade:
- **Desktop**: `screenshots-fixed-desktop/`
- **Mobile**: `screenshots-fixed-mobile/`
- **Ultra HQ**: `screenshots-ultra-hq-desktop/`

## 🔐 Credenciais de Acesso

### NEL3 App
- **Email**: admin@admin
- **Senha**: 123123

## 📝 Notas de Desenvolvimento

- Ambos os projetos utilizam a mesma stack tecnológica para consistência
- O NEL3 App possui funcionalidades específicas para mobile (Capacitor)
- O NEL3 Backoffice é focado em interface administrativa desktop
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

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato com a equipe de desenvolvimento da NEL3 MEDS.

---

**Desenvolvido com ❤️ pela equipe NEL3 MEDS**
