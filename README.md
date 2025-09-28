# Portal LATECE - Laboratório de Tecnologia Assistiva

Portal web para o Laboratório de Tecnologia Assistiva (LATECE) da UFRN, desenvolvido com foco em acessibilidade e inclusão.

## 🎯 Objetivo

Desenvolver um portal web que atue como um polo de pesquisa, formação e disseminação de conhecimento em Tecnologia Assistiva (TA), seguindo todos os padrões técnicos, de design e de segurança da UFRN.

## ✨ Funcionalidades

### Portal Público
- **Página Inicial**: Apresentação do LATECE e destaques de notícias
- **Sobre**: Informações detalhadas sobre o laboratório e seus objetivos
- **Equipe**: Listagem dos membros da equipe com biografias
- **Equipamentos**: Catálogo dinâmico de equipamentos e recursos de TA
- **Publicações**: Repositório virtual de artigos e pesquisas
- **Notícias**: Sistema de blog para notícias e eventos

### Painel Administrativo
- **Dashboard**: Visão geral com estatísticas e atividade recente
- **Gerenciamento de Conteúdo**: CRUD para notícias, equipamentos, publicações e equipe
- **Autenticação**: Sistema seguro de login com diferentes níveis de acesso
- **Configurações**: Painel de configurações do sistema

### Acessibilidade
- **Alto Contraste**: Modo de alto contraste para melhor visibilidade
- **Navegação por Teclado**: Suporte completo à navegação via teclado
- **Leitores de Tela**: Compatibilidade com principais leitores de tela
- **vLIBRAS**: Integração com o plugin de tradução para Libras
- **Controles de Fonte**: Ajuste de tamanho de fonte
- **Atalhos de Teclado**: Atalhos para funcionalidades de acessibilidade

## 🛠️ Stack Tecnológico

### Frontend
- **Nuxt.js 3.x** - Framework Vue.js
- **Vue.js 3.x** - Framework JavaScript
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS
- **SCSS** - Pré-processador CSS
- **Pinia** - Gerenciamento de estado
- **Font Awesome 6.x** - Ícones

### Backend
- **Node.js 20.x** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

### Acessibilidade
- **WCAG 2.1** - Diretrizes de acessibilidade
- **vLIBRAS** - Plugin de tradução para Libras
- **ARIA** - Atributos de acessibilidade
- **Keyboard Navigation** - Navegação por teclado

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 20.x
- NPM 10.x
- PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd latece-portal
```

2. Instale as dependências do frontend:
```bash
cd latece
npm install
```

3. Instale as dependências do backend:
```bash
cd ../backend
npm install
```

4. Configure as variáveis de ambiente:
```bash
cp backend/env.example backend/.env
# Edite o arquivo .env com suas configurações
```

5. Configure o banco de dados:
```bash
# Execute os scripts SQL para criar as tabelas
psql -U postgres -d latece < database/schema.sql
```

### Execução

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Inicie o frontend:
```bash
cd latece
npm run dev
```

3. Acesse o portal:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Estrutura do Projeto

```
latece-portal/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Rotas da API
│   │   └── index.ts        # Ponto de entrada
│   └── package.json
├── latece/                 # Frontend
│   ├── assets/            # Assets (SCSS, imagens)
│   ├── components/        # Componentes Vue
│   ├── layouts/           # Layouts
│   ├── pages/             # Páginas
│   ├── plugins/           # Plugins
│   ├── stores/            # Stores Pinia
│   ├── types/             # Tipos TypeScript
│   └── nuxt.config.ts     # Configuração Nuxt
└── README.md
```

## 🎨 Identidade Visual

### Cores Primárias
- **Azul Principal**: #1D8A9F
- **Azul Claro**: #64B8D1
- **Cinza Escuro**: #333333
- **Branco**: #FFFFFF

### Cores Secundárias
- **Verde Oliva**: #928B45
- **Mostarda**: #B6A752
- **Terracota**: #C77A5B
- **Laranja Queimado**: #D29C6C
- **Verde Musgo**: #7B855D
- **Verde Água Escuro**: #369D85

### Tipografia
- **Títulos**: Montserrat Bold
- **Textos**: Montserrat Regular/Medium

## 🔒 Segurança

- **OWASP Top 10**: Seguindo as melhores práticas de segurança
- **nuxt-security**: Módulo de segurança para cabeçalhos HTTP
- **JWT**: Autenticação segura com tokens
- **Validação**: Validação de dados em todas as entradas
- **CSP**: Content Security Policy configurado

## ♿ Acessibilidade

### Recursos Implementados
- **Alto Contraste**: Modo de alto contraste ativável
- **Navegação por Teclado**: Suporte completo
- **Leitores de Tela**: Compatibilidade com NVDA, JAWS, VoiceOver
- **vLIBRAS**: Tradução automática para Libras
- **Controles de Fonte**: Ajuste de tamanho de fonte
- **Atalhos de Teclado**:
  - `Alt + M`: Pular para conteúdo principal
  - `Alt + C`: Alternar alto contraste
  - `Alt + +`: Aumentar fonte
  - `Alt + -`: Diminuir fonte
  - `Alt + 0`: Resetar fonte

### Conformidade
- **WCAG 2.1 AA**: Nível de conformidade
- **Lei Brasileira de Inclusão**: Atendimento à LBI
- **Padrões UFRN**: Conformidade com diretrizes institucionais

## 📱 Responsividade

O portal é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🧪 Testes

### Testes de Acessibilidade
- **axe-core**: Testes automatizados de acessibilidade
- **Lighthouse**: Auditoria de acessibilidade
- **Testes Manuais**: Validação com leitores de tela

### Testes de Responsividade
- **Chrome DevTools**: Testes em diferentes resoluções
- **Dispositivos Reais**: Testes em tablets e smartphones

## 📚 Documentação

- **API Documentation**: Documentação da API REST
- **Component Library**: Biblioteca de componentes
- **Style Guide**: Guia de estilo e identidade visual
- **Accessibility Guide**: Guia de acessibilidade

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe LATECE UFRN
- **Design**: Identidade visual baseada nas diretrizes da UFRN
- **Acessibilidade**: Consultoria em acessibilidade digital

## 📞 Contato

- **Email**: latece@ufrn.edu.br
- **Website**: [Portal LATECE](https://latece.ufrn.br)
- **UFRN**: Universidade Federal do Rio Grande do Norte

---

Desenvolvido com ❤️ para promover inclusão e acessibilidade através da tecnologia.