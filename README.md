# Cronograma de Estudo Personalizado

Uma ferramenta web completa para gerar cronogramas de estudo personalizados, desenvolvida para estudantes que precisam organizar seus estudos de forma eficiente e adaptada às suas necessidades específicas.

## Visão Geral

Esta aplicação web permite criar cronogramas de estudo personalizados baseados em:
- Disponibilidade de tempo do usuário
- Priorização de matérias através de sistema de pesos
- Modo contagem regressiva para provas específicas
- Modo contínuo para estudo regular

## Funcionalidades Principais

### Cronograma Personalizado
- Adaptação às necessidades e disponibilidade do usuário
- Sistema de pesos para priorização de matérias
- Rotação inteligente para evitar repetição consecutiva

### Modos de Operação
- **Contagem Regressiva**: Para provas com data específica
- **Contínuo**: Para estudo regular sem prazo definido

### Configurações Flexíveis
- Seleção de dias da semana disponíveis
- Definição de horas de estudo por dia (1-12h)
- Sistema de pesos de 1 a 10 para cada matéria

### Exportação e Persistência
- Exportação para Excel (.xlsx) editável
- Exportação para PDF para impressão
- Salvamento local com histórico de cronogramas
- Carregamento de cronogramas anteriores

### Interface e Usabilidade
- Design responsivo para desktop e mobile
- Interface intuitiva e moderna
- Guia completo de uso integrado
- FAQ e exemplos práticos

## Instalação e Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado

### Instalação
1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` em qualquer navegador
3. A aplicação estará pronta para uso

### Uso Básico

#### 1. Configurações Iniciais
- **Data da Prova** (opcional): Define modo contagem regressiva
- **Horas por Dia**: Quantidade de horas de estudo diárias
- **Dias Disponíveis**: Seleção dos dias da semana

#### 2. Configuração de Matérias
- Adicionar matérias com nome e peso
- Peso 1: Matéria mais fácil/pequena
- Peso 10: Matéria mais difícil/extensa

#### 3. Geração do Cronograma
- Cálculo automático da distribuição proporcional
- Rotação para evitar repetição consecutiva
- Otimização para dias disponíveis

#### 4. Exportação e Salvamento
- Exportar para Excel para edição posterior
- Exportar para PDF para impressão
- Salvar cronograma localmente

## Algoritmo de Distribuição

### Cálculo de Pesos
```
Peso Relativo = Peso da Matéria / Soma de Todos os Pesos
Horas por Matéria = Peso Relativo × Total de Horas Disponíveis
```

### Exemplo de Cálculo
- **Matérias**: Matemática (peso 3), História (peso 1), Química (peso 2)
- **Total de pesos**: 6
- **Total de horas**: 30h
- **Distribuição**:
  - Matemática: (3/6) × 30h = 15h
  - História: (1/6) × 30h = 5h
  - Química: (2/6) × 30h = 10h

### Modo Contagem Regressiva
- Cálculo de dias entre data atual e prova
- Consideração apenas dos dias selecionados
- Distribuição proporcional até a data da prova

### Modo Contínuo
- Geração de cronograma para 30 dias
- Distribuição equilibrada baseada nos pesos
- Ideal para estudo regular sem prazo específico

## Arquitetura Técnica

### Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Bibliotecas**: SheetJS (Excel), jsPDF (PDF)
- **Armazenamento**: localStorage para persistência
- **Design**: CSS Grid, Flexbox, Media Queries

### Funcionalidades Técnicas
- Cálculo dinâmico de distribuição de tempo
- Rotação inteligente de matérias
- Exportação de dados para múltiplos formatos
- Persistência local de dados
- Interface responsiva

## Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Tablet (iPad, Android)
- Mobile (iOS, Android)

### Recursos
- Funciona offline após carregamento inicial
- Não requer servidor ou conexão contínua
- Dados salvos localmente no navegador

## Licença

Este projeto está sob uma licença não comercial. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

## Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no repositório
- Consulte a seção FAQ na aplicação
- Verifique o guia de uso integrado

## Changelog

### Versão Atual
- Sistema de pesos para priorização
- Modos contagem regressiva e contínuo
- Exportação Excel e PDF
- Histórico local de cronogramas
- Interface responsiva
- Blog com conteúdo educacional

---

**Desenvolvido para estudantes que buscam organização e eficiência em seus estudos.**