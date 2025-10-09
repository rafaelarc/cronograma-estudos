# 📚 Cronograma de Estudo Personalizado

Uma ferramenta web completa para gerar cronogramas de estudo personalizados, tanto para quem tem prova quanto para quem estuda continuamente.

## ✨ Funcionalidades

- **Cronograma Personalizado**: Adaptado às suas necessidades e disponibilidade
- **Modo Contagem Regressiva**: Para quem tem prova marcada
- **Modo Contínuo**: Para estudo regular sem data específica
- **Priorização por Peso**: Matérias com maior peso recebem mais tempo
- **Dias Personalizáveis**: Escolha quais dias da semana estudar
- **Exportação**: Salve em Excel (.xlsx) ou PDF
- **Histórico Local**: Salve e carregue cronogramas anteriores
- **Guia Completo**: Tutorial detalhado com dicas e exemplos práticos
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Como Usar

### 📖 Guia Completo de Uso
A ferramenta inclui um **guia detalhado** com:
- Explicação completa de como funciona o sistema
- Instruções passo a passo para cada configuração
- Exemplos práticos de cálculo de pesos
- Dicas para melhores resultados
- Perguntas frequentes (FAQ)
- Tutorial do algoritmo de distribuição

**Para acessar:** Clique na aba "📖 Guia de Uso" no topo da página.

### 1. Configurações Básicas
- **Data da Prova** (opcional): Se informada, o cronograma será gerado contando regressivamente até a prova
- **Horas por Dia**: Quantas horas você quer estudar diariamente (1-12h)
- **Dias Disponíveis**: Marque os dias da semana que você pode estudar

### 2. Adicionar Matérias
- Clique em "+ Adicionar Matéria" para incluir novas disciplinas
- **Nome da Matéria**: Ex: Matemática, História, Química
- **Peso**: Prioridade/dificuldade/tamanho do conteúdo (1-10)
  - Peso 1: Matéria mais fácil/pequena
  - Peso 10: Matéria mais difícil/grande

### 3. Gerar Cronograma
- Clique em "Gerar Cronograma"
- O sistema calculará automaticamente:
  - Distribuição proporcional das horas por matéria
  - Rotação para evitar repetir a mesma matéria em sequência
  - Otimização para os dias disponíveis

### 4. Exportar e Salvar
- **📊 Exportar Excel**: Baixa arquivo .xlsx editável
- **📄 Exportar PDF**: Baixa documento para impressão/compartilhamento
- **💾 Salvar Cronograma**: Salva localmente para carregar depois

## 🧮 Como Funciona a Lógica

### Cálculo de Pesos
```
Peso Relativo = Peso da Matéria / Soma de Todos os Pesos
Horas por Matéria = Peso Relativo × Total de Horas Disponíveis
```

### Exemplo Prático
- **Matérias**: Matemática (peso 3), História (peso 1), Química (peso 2)
- **Total de pesos**: 6
- **Total de horas**: 30h
- **Distribuição**:
  - Matemática: (3/6) × 30h = 15h
  - História: (1/6) × 30h = 5h
  - Química: (2/6) × 30h = 10h

### Modo Contagem Regressiva
- Calcula dias entre hoje e a data da prova
- Considera apenas os dias da semana selecionados
- Distribui as horas proporcionalmente até a prova

### Modo Contínuo
- Gera cronograma para 30 dias
- Distribuição equilibrada baseada nos pesos
- Ideal para estudo regular sem prazo específico

## 💾 Salvamento Local

- Todos os cronogramas são salvos no navegador (localStorage)
- Não há necessidade de cadastro ou login
- Dados ficam disponíveis mesmo após fechar o navegador
- Possibilidade de carregar cronogramas anteriores

## 🎨 Design e Usabilidade

- **Interface Intuitiva**: Fácil de usar, sem complicações
- **Design Moderno**: Visual atrativo e profissional
- **Responsivo**: Funciona perfeitamente em celulares e tablets
- **Acessível**: Cores contrastantes e navegação clara

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e moderno
- **JavaScript ES6+**: Lógica de cálculo e interatividade
- **SheetJS**: Exportação para Excel
- **jsPDF**: Exportação para PDF
- **localStorage**: Persistência de dados

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop, Tablet, Mobile
- ✅ Windows, macOS, Linux, Android, iOS
- ✅ Funciona offline após carregar a página

## 🚀 Como Executar

1. Baixe todos os arquivos (`index.html`, `styles.css`, `script.js`)
2. Abra o arquivo `index.html` em qualquer navegador
3. Comece a usar imediatamente!

## 📋 Exemplo de Uso

### Cenário: Prova em 2 semanas
1. **Data da Prova**: 15 dias no futuro
2. **Horas por Dia**: 3h
3. **Dias Disponíveis**: Segunda, Quarta, Sexta
4. **Matérias**:
   - Matemática (peso 4)
   - Português (peso 2)
   - História (peso 1)

**Resultado**: Cronograma com 9 dias de estudo, distribuindo 27 horas totais proporcionalmente às matérias.

---

**Desenvolvido para estudantes que querem organizar seus estudos de forma eficiente e personalizada!** 🎓
