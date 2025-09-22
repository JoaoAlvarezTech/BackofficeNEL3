# 🏥 NEL3 Backoffice - Sistema de Gestão de Parceiros de Saúde

Sistema administrativo completo para gestão de parceiros de saúde, afiliados e operações financeiras da NEL3 MEDS.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Recharts** - Gráficos e visualizações

## 📋 Funcionalidades

### 🏠 Dashboard
- KPIs executivos e métricas de performance
- Gráficos de receita e operações
- Atividades recentes
- Visão geral do sistema

### 👥 Gestão de Parceiros
- Cadastro e edição de parceiros
- Sistema de aprovações
- KYC (Know Your Customer)
- Relatórios de parceiros

### 🤝 Gestão de Afiliados
- Cadastro de usuários/afiliados
- Sistema de aprovações
- Edição de perfis
- Controle de acesso

### 📊 Operações Financeiras
- Gestão de cobranças
- Taxas e tarifas
- Reconciliação de pagamentos
- Liquidações

### 📄 Gestão de Documentos
- Aprovação de notas fiscais
- Upload de documentos
- Controle de status

### 🔔 Sistema de Notificações
- Alertas do sistema
- Notificações de aprovações
- Comunicação interna

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/JoaoAlvarezTech/BackofficeNEL3.git

# Navegue para o diretório
cd BackofficeNEL3

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 🗂️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/       # Componentes do dashboard
│   ├── layout/          # Layout e sidebar
│   └── ui/              # Componentes de interface (shadcn/ui)
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
├── hooks/               # Hooks customizados
├── lib/                 # Utilitários e configurações
│   ├── mockdb.ts        # Dados mockados para desenvolvimento
│   ├── utils.ts         # Funções utilitárias
│   └── validators.ts    # Schemas de validação
├── pages/               # Páginas da aplicação
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Partners.tsx     # Gestão de parceiros
│   ├── Affiliates.tsx   # Gestão de afiliados
│   ├── Operations*.tsx  # Páginas de operações
│   └── ...
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔧 Ferramentas de Debug

O projeto inclui ferramentas úteis para desenvolvimento:

- **debug-data.html** - Visualizar dados mockados do localStorage
- **clear-storage.html** - Limpar dados do navegador
- **fix-invoices.html** - Corrigir dados de notas fiscais
- **force-regenerate.html** - Forçar regeneração de dados

## 🎨 Interface

- Design moderno e responsivo
- Tema claro/escuro
- Componentes acessíveis
- Interface intuitiva para administradores

## 🔐 Autenticação

Sistema de autenticação integrado com:
- Login seguro
- Controle de sessão
- Proteção de rotas
- Contexto de usuário

## 📱 Responsividade

Interface totalmente responsiva, otimizada para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

### Deploy no Vercel/Netlify

```bash
# Build
npm run build

# Deploy
# Os arquivos em dist/ podem ser enviados para qualquer serviço de hosting
```

## 🤝 Contribuição

1. Fork o projeto
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