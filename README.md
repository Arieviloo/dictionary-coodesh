# 📱 Dictionary Coodesh — Desafio Técnico

Este é um desafio técnico para avaliar habilidades como Mobile Developer, consumindo a Free Dictionary API para listagem, consulta e gerenciamento de vocabulário em inglês.

---

## 🏗️ 1. Arquitetura e Decisões de Design (Injeção de Dependência)

### Problema / Hipótese Inicial
Aplicativos corporativos e desafios técnicos de nível sênior exigem desacoplamento estrito entre a camada de interface (UI) e a camada de negócios/dados, facilitando testes unitários e manutenção a longo prazo.

### Decisão
Adoção de uma **Arquitetura Limpa (Clean Architecture)** simplificada para React Native, estruturada em camadas independentes (`stores`, `hooks`, `services`, `modules/components`).

### Injeção de Dependência (DI)
Para atender ao requisito de Injeção de Dependência sem a complexidade excessiva de frameworks pesados de DI em JavaScript, optou-se por utilizar o **Zustand** (`useWordStore`) como um container de estado global injetável e desacoplado:
- Os componentes de UI não conhecem a regra de persistência (Firebase/AsyncStorage); eles apenas consomem as ações expostas pela store.
- O consumo de dados externos da API de dicionário foi isolado em custom hooks (`useWordDetails`), aplicando o padrão de inversão de controle para que a interface permaneça limpa e focada exclusivamente na renderização.

---

## ⚡ 2. Performance e Escolha de Componentes (FlashList)

### Problema / Hipótese Inicial
Dicionários contêm dezenas de milhares de palavras. O uso de componentes de listagem tradicionais (`FlatList`) em dispositivos móveis de entrada pode causar quedas de framerate (*jank*) ao rolar grandes volumes de dados.

### Decisão
Integração do **`@shopify/flash-list`** para renderização de alta performance. O FlashList reutiliza células de forma muito mais eficiente que o FlatList padrão do React Native, garantindo rolagem fluida a 60 FPS mesmo com listas massivas.

---

## 🔊 3. Investigação e Resolução do Desafio de Áudio (Expo Go vs. Development Build)

### Histórico de Investigação:

1. **Tentativa Inicial (`expo-av`):**
   - *Hipótese:* Utilizar o `expo-av` para reproduzir áudios de pronúncia fornecidos por APIs externas.
   - *Obstáculo:* O Expo Go padrão não inclui nativamente todos os módulos binários do `expo-av`, resultando no erro de tempo de execução `Runtime not ready / Cannot find native module ExponentAV`.

2. **Segunda Tentativa (Web Audio API / `new Audio()`):**
   - *Hipótese:* Substituir por classes globais de áudio da Web (`new Audio()`).
   - *Obstáculo:* O motor JavaScript do React Native (Hermes/JSC) não possui a classe global `Audio` do navegador, gerando erro de referência (`ReferenceError: Property 'Audio' doesn't exist`).

3. **Solução Definitiva (`expo-speech`):**
   - *Decisão Final:* Migração para a biblioteca **`expo-speech`** (Síntese de Voz / Text-to-Speech nativa do sistema operacional).
   - *Vantagens:*
     - Funciona 100% no Expo Go sem exigir compilações nativas complexas (*Development Builds*), permitindo que qualquer avaliador teste o app imediatamente.
     - Elimina a dependência de conectividade com URLs de áudio externas que frequentemente caem ou expiram.
     - Configuração explícita do sotaque para inglês americano (`language: 'en-US'`) com taxa de velocidade ajustada (`rate: 0.9`) para otimizar o aprendizado e a clareza fonética.

---

## 🔍 4. Melhorias de UX e Preservação de Estado (Scroll & Search)

### Problema Identificado
Durante os testes de usabilidade, notou-se que ao buscar termos específicos ou navegar entre abas, o fluxo de navegação sofria interrupções e exigia rolagem manual excessiva.

### Soluções Implementadas:
1. **Barra de Pesquisa Instantânea (`TextInput` + `useMemo` + `startsWith`):**
   - Adicionada uma barra de busca no topo da `HomeScreen` com filtragem em tempo real utilizando `.startsWith()`, garantindo que os resultados tragam exatamente as palavras que iniciam com os caracteres digitados.
   - Rolagem automática para o topo (`scrollToOffset`) tanto ao digitar quanto ao apagar ou trocar de aba.
2. **Preservação de Posicionamento e Comportamento Nativo:**
   - Implementação do **`BackHandler`** para gerenciar o botão físico de voltar do Android com segurança na tela de detalhes.
   - Indicadores visuais dinâmicos (estrelas ⭐ no topo direito dos cards) para palavras favoritadas.

---

## 🛠️ 5. Stack Tecnológica Utilizada

- **Framework:** Expo (SDK 58) / React Native (0.88.1) / React 19
- **Linguagem:** TypeScript
- **Gerenciamento de Estado:** Zustand
- **Gerenciamento de Requisições:** TanStack React Query & Axios
- **Listagem Otimizada:** `@shopify/flash-list`
- **Síntese de Voz (Pronúncia):** `expo-speech`
- **Backend & Autenticação:** Firebase (Auth & Firestore)
- **Testes:** Jest & React Native Testing Library

---

## 🚀 Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Arieviloo/dictionary-coodesh
   cd dictionary-coodesh
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação com o Expo:
   ```bash
   npx expo start
   ```

---

## 🔐 Configuração e Acesso (Firebase)

Para facilitar a avaliação imediata deste desafio técnico, o projeto já está configurado com um ambiente sandbox do Firebase dedicado aos testes. Isso permite que você clone, instale e execute a aplicação imediatamente, sem a necessidade de criar um projeto próprio ou configurar variáveis de ambiente do zero.

   Nota de Segurança: Como este é um ambiente isolado de testes e sandbox, você pode utilizar qualquer e-mail e senha fictícios para testar o fluxo de cadastro e login diretamente na tela inicial.

--- 

## 👨‍💻 Autor

Desenvolvido por Jadiê Oliveira como parte da avaliação técnica.