# 🔐 Gerador de Senhas Seguras

Um gerador de senhas moderno, seguro e acessível construído com Next.js 14, TypeScript e Tailwind CSS.

## ✨ Características

### 🛡️ Segurança
- **Criptografia Segura**: Utiliza Web Crypto API para geração verdadeiramente aleatória
- **Fallback Robusto**: Sistema de fallback para ambientes sem Web Crypto API
- **Análise de Força**: Avaliação em tempo real da força da senha
- **Prevenção de Padrões**: Detecta e evita sequências e repetições

### 🎨 Interface
- **Design Moderno**: Interface limpa e intuitiva
- **Modo Escuro**: Suporte completo a tema escuro/claro
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações Suaves**: Transições e feedback visual elegantes

### ♿ Acessibilidade
- **WCAG 2.1 AA**: Conformidade com padrões de acessibilidade
- **Navegação por Teclado**: Suporte completo para navegação sem mouse
- **Screen Readers**: Otimizado para leitores de tela
- **Skip Links**: Links de pulo para navegação rápida
- **Alto Contraste**: Cores otimizadas para visibilidade

### ⚡ Performance
- **Next.js 14**: App Router e Server Components
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Otimizações**: Bundle otimizado e carregamento rápido

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Heroicons
- **Criptografia**: Web Crypto API
- **Linting**: ESLint + Prettier

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou pnpm

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/paulloacg/password-generator.git
cd password-generator
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm start

# Linting
npm run lint

# Formatação de código
npm run format

# Verificar formatação
npm run format:check
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── OptionsForm.tsx    # Formulário de opções
│   ├── PasswordOutput.tsx # Exibição da senha
│   ├── SkipLink.tsx       # Link de acessibilidade
│   ├── StrengthMeter.tsx  # Medidor de força
│   └── Toast.tsx          # Sistema de notificações
└── lib/                   # Utilitários e lógica
    ├── charset.ts         # Conjuntos de caracteres
    ├── generator.ts       # Lógica de geração
    ├── random.ts          # Funções de aleatoriedade
    └── strength.ts        # Análise de força
```

## 🔧 Configuração

### Opções de Geração

- **Comprimento**: 4-128 caracteres
- **Tipos de Caracteres**:
  - Letras minúsculas (a-z)
  - Letras maiúsculas (A-Z)
  - Números (0-9)
  - Símbolos (!@#$%^&*)
- **Opções Avançadas**:
  - Excluir caracteres similares (0, O, l, I)
  - Excluir caracteres ambíguos ({, }, [, ], etc.)
  - Garantir todos os tipos selecionados

### Análise de Força

O sistema avalia a força da senha baseado em:
- Comprimento da senha
- Variedade de caracteres
- Ausência de padrões repetitivos
- Ausência de sequências
- Cálculo de entropia
- Estimativa de tempo para quebra

## 🎯 Funcionalidades

### Geração de Senhas
- Geração instantânea e segura
- Múltiplas opções de customização
- Validação em tempo real
- Regeneração com um clique

### Análise de Segurança
- Medidor visual de força
- Cálculo de entropia
- Estimativa de tempo para quebra
- Sugestões de melhoria
- Composição detalhada

### Experiência do Usuário
- Cópia com um clique
- Feedback visual imediato
- Notificações informativas
- Interface responsiva
- Modo escuro/claro

## 🔒 Segurança

### Geração Aleatória
- **Primário**: Web Crypto API (`crypto.getRandomValues()`)
- **Fallback**: `Math.random()` com aviso ao usuário
- **Validação**: Verificação de disponibilidade da API

### Prevenção de Vulnerabilidades
- Não armazena senhas geradas
- Não envia dados para servidores
- Execução completamente client-side
- Limpeza automática da memória

## ♿ Acessibilidade

### Conformidade WCAG 2.1 AA
- Contraste adequado de cores
- Navegação por teclado
- Suporte a screen readers
- Textos alternativos
- Estrutura semântica

### Recursos Implementados
- Skip links para navegação rápida
- Atributos ARIA apropriados
- Foco visível e lógico
- Redução de movimento (prefers-reduced-motion)
- Textos descritivos

## 🌐 Suporte a Navegadores

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Web Crypto API
- Suportado em todos os navegadores modernos
- Fallback automático para navegadores antigos
- Aviso visual quando fallback é usado

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Botões e controles otimizados para toque
- **Viewport**: Configuração adequada para todos os dispositivos

## 🧪 Testes

### Testes Manuais
- Geração de senhas com diferentes configurações
- Validação de força em cenários diversos
- Teste de acessibilidade com screen readers
- Verificação de responsividade

### Cenários Testados
- Geração com Web Crypto API
- Fallback para Math.random()
- Diferentes combinações de caracteres
- Senhas de comprimentos extremos
- Navegação por teclado

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload da pasta .next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Siga os padrões de código (ESLint + Prettier)
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Respeite as diretrizes de acessibilidade

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Paulo A. C. Gomes**
- GitHub: [@paulloacg](https://github.com/paulloacg)
- LinkedIn: [Paulo Gomes](https://linkedin.com/in/paulloacg)
- Email: pauloac2.0@gmail.com

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Heroicons](https://heroicons.com/) - Ícones SVG
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Criptografia

---

<div align="center">
  <p>Feito com ❤️ e ☕</p>
  <p>Se este projeto te ajudou, considere dar uma ⭐!</p>
</div>
