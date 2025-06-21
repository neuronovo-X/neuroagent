import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Типы агентов
export type AgentRole = 
  | 'observer'     // ИИ-Наблюдатель
  | 'geometer'     // Геометр-Исследователь  
  | 'physicist'    // Физик-Теоретик
  | 'perceptive'   // Перцептивный Аналитик
  | 'philosopher'  // Философ-Переводчик
  | 'integrator'   // Интегратор-Систематизатор
  | 'trickster';   // Трикстер

// Фазы цикла мышления
export type MindloopPhase = 
  | 'dormant'      // Спящий режим
  | 'divergence'   // D1 - Дивергенция (расширение идей)
  | 'dialogue'     // D2 - Диалог (критика и взаимодействие)  
  | 'convergence'  // C3 - Конвергенция (поиск схождений)
  | 'transcendence'; // T4 - Трансценденция (прорывное понимание)

// Структура мысли агента
export interface AgentThought {
  id: string;
  agentRole: AgentRole;
  reasoning: string;        // Полное рассуждение для отображения
        essence: string;          // Скрыто увеличенная суть: Наблюдатель 5000, агенты 1000 символов
  receivedContext?: string; // Расширенный контекст от предыдущего агента
  timestamp: number;
  cycleNumber: number;
  phase: MindloopPhase;
  confidence: number;
}

// Новый интерфейс для пользовательских комментариев
export interface UserComment {
  id: string;
  content: string;         // Текст комментария
  timestamp: number;
  cycleNumber: number;
  isUserComment: true;     // Флаг для отличия от AgentThought
}

// Тип фазы цикла мышления
export type CyclePhase = 'analysis' | 'execution' | 'synthesis' | 'evaluation' | 'waiting';

// Объединенный тип для потока мыслей
export type ThoughtStreamItem = AgentThought | UserComment;

// Конфигурация агента
export interface AgentConfig {
  role: AgentRole;
  name: string;
  description: string;
  color: string;
  systemPrompt: string;
  model: string;
  receivesFrom: AgentRole | null;
  sendsTo: AgentRole | null;
  isActive: boolean;
}

// Конфигурация пользовательского агента
export interface CustomAgentConfig {
  role: string;
  name: string;
  description: string;
  color: string;
  systemPrompt: string;
  model: string;
  receivesFrom: string | null;
  sendsTo: string | null;
  isActive: boolean;
}

// Состояние цикла мышления
export interface MindloopCycle {
  id: string;
  number: number;
  topic: string;
  thoughts: AgentThought[];
  isComplete: boolean;
  timestamp: number;
  
  // ЦЕНТРАЛИЗОВАННОЕ УПРАВЛЕНИЕ
  cyclePhase: 'analysis' | 'execution' | 'synthesis' | 'evaluation' | 'waiting' | 'intermediate';
  activeAgents: AgentRole[];
  completedAgents: AgentRole[];
  
  // МНОГОУРОВНЕВЫЕ ЦИКЛЫ
  roundNumber: number;
  totalRounds: number;
  
  // ПРОМЕЖУТОЧНЫЙ ВЫВОД
  intermediateOutput?: string;
  canContinue?: boolean;
  continuationSuggestion?: string;
  
  // СОВМЕСТИМОСТЬ С ЭКСПОРТОМ
  startTime?: number;
  endTime?: number;
  synthesis?: string;
}

// Интерфейс для модели ИИ
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  context: string;
  isFree?: boolean;
  isCustom?: boolean;
  multimodal?: boolean;
  description?: string;
}

export interface ModelPreset {
  id: string;
  name: string;
  description: string;
  models: {
    observer: string;
    geometer: string;
    physicist: string;
    perceptive: string;
    philosopher: string;
    integrator: string;
    trickster: string;
  };
}

// ПРЕСЕТЫ МОДЕЛЕЙ
export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'free',
    name: '🆓 Стабильные бесплатные',
    description: 'Только проверенные рабочие модели',
    models: {
      observer: 'meta-llama/llama-3.1-8b-instruct:free',
      geometer: 'meta-llama/llama-3.1-8b-instruct:free',
      physicist: 'meta-llama/llama-3.1-8b-instruct:free',
      perceptive: 'meta-llama/llama-3.1-8b-instruct:free',
      philosopher: 'meta-llama/llama-3.1-8b-instruct:free',
      integrator: 'meta-llama/llama-3.1-8b-instruct:free',
      trickster: 'meta-llama/llama-3.2-1b-instruct:free'
    }
  },
  {
    id: 'free-alt',
    name: '🔄 Альтернативные бесплатные',
    description: 'Запасные бесплатные модели',
    models: {
      observer: 'meta-llama/llama-3.2-3b-instruct:free',
      geometer: 'meta-llama/llama-3.2-3b-instruct:free',
      physicist: 'meta-llama/llama-3.2-3b-instruct:free',
      perceptive: 'meta-llama/llama-3.2-3b-instruct:free',
      philosopher: 'meta-llama/llama-3.2-3b-instruct:free',
      integrator: 'meta-llama/llama-3.2-3b-instruct:free',
      trickster: 'meta-llama/llama-3.2-1b-instruct:free'
    }
  },
  {
    id: 'recommended',
    name: '💎 Рекомендуемые модели',
    description: 'Оптимальный баланс качества и стоимости',
    models: {
      observer: 'anthropic/claude-3.5-sonnet',
      geometer: 'openai/gpt-4o',
      physicist: 'openai/gpt-4o',
      perceptive: 'google/gemini-pro-1.5',
      philosopher: 'anthropic/claude-3.5-sonnet',
      integrator: 'openai/gpt-4o',
      trickster: 'anthropic/claude-3.5-haiku'
    }
  },
  {
    id: 'premium',
    name: '🚀 Премиум модели',
    description: 'Топовые модели для максимального качества',
    models: {
      observer: 'anthropic/claude-3-opus',
      geometer: 'openai/gpt-4o',
      physicist: 'openai/gpt-4o',
      perceptive: 'google/gemini-pro-1.5',
      philosopher: 'anthropic/claude-3-opus',
      integrator: 'openai/gpt-4o',
      trickster: 'anthropic/claude-3.5-sonnet'
    }
  }
];

// Доступные модели ИИ
export const AVAILABLE_MODELS: AIModel[] = [
  // === БЕСПЛАТНЫЕ МОДЕЛИ (FREE) ===
  
  // Meta Llama 4 (НОВЫЕ БЕСПЛАТНЫЕ)
  { 
    id: 'meta-llama/llama-4-maverick:free', 
    name: 'Llama 4 Maverick', 
    provider: 'Meta', 
    context: '256K', 
    isFree: true, 
    multimodal: true,
    description: '400B параметров, 17B активных. MoE архитектура с мультимодальностью'
  },
  { 
    id: 'meta-llama/llama-4-scout:free', 
    name: 'Llama 4 Scout', 
    provider: 'Meta', 
    context: '512K', 
    isFree: true, 
    multimodal: true,
    description: '109B параметров, 17B активных. Оптимизированная версия для развертывания'
  },
  
  // Google Gemini (БЕСПЛАТНЫЕ)
  { 
    id: 'google/gemini-2.5-pro-exp-03-25:free', 
    name: 'Gemini 2.5 Pro Experimental', 
    provider: 'Google', 
    context: '1M', 
    isFree: true, 
    multimodal: true,
    description: 'Экспериментальная версия с рекуррентной памятью и расширенным рассуждением'
  },
  
  // Qwen 3 Series (БЕСПЛАТНЫЕ)
  { 
    id: 'qwen/qwen3-30b-a3b:free', 
    name: 'Qwen3 30B A3B', 
    provider: 'Qwen', 
    context: '131K', 
    isFree: true,
    description: '30.5B параметров, MoE архитектура с thinking/non-thinking режимами'
  },
  { 
    id: 'qwen/qwen3-14b:free', 
    name: 'Qwen3 14B', 
    provider: 'Qwen', 
    context: '131K', 
    isFree: true,
    description: '14.8B параметров с двойным режимом для рассуждений и диалога'
  },
  { 
    id: 'qwen/qwen3-4b:free', 
    name: 'Qwen3 4B', 
    provider: 'Qwen', 
    context: '128K', 
    isFree: true,
    description: '4B параметров, компактная модель с thinking режимом'
  },
  { 
    id: 'qwen/qwen2.5-vl-3b-instruct:free', 
    name: 'Qwen2.5 VL 3B', 
    provider: 'Qwen', 
    context: '32K', 
    isFree: true, 
    multimodal: true,
    description: 'Компактная мультимодальная модель для визуального понимания'
  },
  
  // DeepSeek (БЕСПЛАТНЫЕ)
  { 
    id: 'deepseek/deepseek-v3-base:free', 
    name: 'DeepSeek V3 Base', 
    provider: 'DeepSeek', 
    context: '64K', 
    isFree: true,
    description: 'Базовая модель с оптимизацией для технических доменов'
  },
  { 
    id: 'deepseek/deepseek-chat-v3-0324:free', 
    name: 'DeepSeek Chat V3', 
    provider: 'DeepSeek', 
    context: '64K', 
    isFree: true,
    description: 'Диалоговая версия с улучшенным управлением состоянием беседы'
  },
  { 
    id: 'deepseek/deepseek-r1-zero:free', 
    name: 'DeepSeek R1 Zero', 
    provider: 'DeepSeek', 
    context: '64K', 
    isFree: true,
    description: 'Специализированная модель для научных исследований и математики'
  },
  
  // Mistral (БЕСПЛАТНЫЕ)
  { 
    id: 'mistralai/mistral-small-3.1-24b-instruct:free', 
    name: 'Mistral Small 3.1 24B', 
    provider: 'Mistral', 
    context: '96K', 
    isFree: true, 
    multimodal: true,
    description: 'Средняя модель с мультимодальностью и function calling'
  },
  
  // OpenRouter собственные (БЕСПЛАТНЫЕ)
  { 
    id: 'openrouter/optimus-alpha:free', 
    name: 'Optimus Alpha', 
    provider: 'OpenRouter', 
    context: '32K', 
    isFree: true,
    description: 'Собственная модель OpenRouter для API-ориентированных задач'
  },
  { 
    id: 'openrouter/quasar-alpha:free', 
    name: 'Quasar Alpha', 
    provider: 'OpenRouter', 
    context: '32K', 
    isFree: true,
    description: 'Специализация на рассуждениях и представлении знаний'
  },
  
  // NVIDIA (БЕСПЛАТНЫЕ)
  { 
    id: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free', 
    name: 'Llama 3.1 Nemotron Nano 8B', 
    provider: 'NVIDIA', 
    context: '8K', 
    isFree: true,
    description: 'NVIDIA-оптимизированная версия с тензорным параллелизмом'
  },
  
  // Nous Research (БЕСПЛАТНЫЕ)
  { 
    id: 'nousresearch/deephermes-3-llama-3-8b-preview:free', 
    name: 'DeepHermes 3 Llama 3 8B', 
    provider: 'Nous Research', 
    context: '8K', 
    isFree: true,
    description: 'Сбалансированная производительность в компактной реализации'
  },
  
  // MoonShot (БЕСПЛАТНЫЕ)
  { 
    id: 'moonshotai/kimi-vl-a3b-thinking:free', 
    name: 'Kimi VL A3B Thinking', 
    provider: 'MoonShot', 
    context: '131K', 
    isFree: true, 
    multimodal: true,
    description: 'Ультра-эффективная мультимодальная модель с визуальным рассуждением'
  },
  
  // === ПЛАТНЫЕ ПРЕМИУМ МОДЕЛИ ===
  
  // OpenAI
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', context: '128K', multimodal: true },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', context: '128K', multimodal: true },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', context: '128K', multimodal: true },
  { id: 'openai/o1', name: 'GPT-o1', provider: 'OpenAI', context: '200K', description: 'Модель с усиленным рассуждением' },
  { id: 'openai/o1-mini', name: 'GPT-o1 Mini', provider: 'OpenAI', context: '128K', description: 'Компактная версия o1' },
  
  // Anthropic
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', context: '200K', multimodal: true },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', context: '200K', multimodal: true },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', context: '200K', multimodal: true },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', context: '200K', multimodal: true },
  
  // Google
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google', context: '2M', multimodal: true },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google', context: '1M', multimodal: true },
  { id: 'google/gemini-flash-1.5-8b', name: 'Gemini Flash 1.5 8B', provider: 'Google', context: '1M', multimodal: true },
  
  // Meta
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', provider: 'Meta', context: '128K' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta', context: '128K' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'Meta', context: '128K' },
  
  // Mistral
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral', context: '128K' },
  { id: 'mistralai/mistral-medium', name: 'Mistral Medium', provider: 'Mistral', context: '32K' },
  { id: 'mistralai/pixtral-12b', name: 'Pixtral 12B', provider: 'Mistral', context: '128K', multimodal: true },
  
  // Cohere
  { id: 'cohere/command-r-plus', name: 'Command R+', provider: 'Cohere', context: '128K' },
  { id: 'cohere/command-r', name: 'Command R', provider: 'Cohere', context: '128K' },
  
  // X.AI
  { id: 'x-ai/grok-2', name: 'Grok 2', provider: 'X.AI', context: '131K', multimodal: true },
  { id: 'x-ai/grok-2-mini', name: 'Grok 2 Mini', provider: 'X.AI', context: '131K' },
  
  // Perplexity
  { id: 'perplexity/llama-3.1-sonar-large-128k-online', name: 'Sonar Large Online', provider: 'Perplexity', context: '128K', description: 'С доступом в интернет' },
  { id: 'perplexity/llama-3.1-sonar-small-128k-online', name: 'Sonar Small Online', provider: 'Perplexity', context: '128K', description: 'С доступом в интернет' }
];

// Главное состояние
interface MindloopState {
  // Конфигурация агентов
  agents: Record<AgentRole, AgentConfig>;
  
  // Текущий цикл
  currentCycle: MindloopCycle | null;
  
  // История циклов
  cycleHistory: MindloopCycle[];
  
  // Активный агент
  activeAgent: AgentRole | null;
  
  // Состояние системы
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;
  statusMessage: string | null; // Сообщения о статусе для пользователя
  
  // Настройки
  apiKey: string;
  autoAdvance: boolean;
  cycleDelay: number;
  customModels: AIModel[];  // Пользовательские модели
  continuousMode: boolean;  // Непрерывный режим циклов
  
  // Действия
  initializeAgents: () => void;
  startNewCycle: (topic: string) => void;
  processAgentThought: (agentRole: AgentRole, input: string) => Promise<void>;
  advanceToNextAgent: () => void;
  triggerTrickster: () => Promise<void>;
  pauseCycle: () => void;
  resumeCycle: () => void;
  stopCycle: () => void;
  finalizeCycle: () => void;  // НОВЫЙ МЕТОД - ручное завершение цикла
  setApiKey: (key: string) => void;
  setAutoAdvance: (enabled: boolean) => void;
  setCycleDelay: (delay: number) => void;
  updateAgentModel: (role: AgentRole, modelId: string) => void;
  resetAgentModels: () => void;
  
  // УПРАВЛЕНИЕ МОДЕЛЯМИ
  addCustomModel: (model: AIModel) => void;
  removeCustomModel: (modelId: string) => void;
  getAllModels: () => AIModel[];
  
  // ПРЕСЕТЫ МОДЕЛЕЙ
  applyModelPreset: (presetId: string) => void;
  getModelPresets: () => ModelPreset[];
  
  // НЕПРЕРЫВНЫЕ ЦИКЛЫ
  startContinuousCycle: (userInput?: string) => void;
  enableContinuousMode: (enabled: boolean) => void;
  
  // НОВЫЕ МЕТОДЫ
  updateAgentPrompt: (role: AgentRole, prompt: string) => void;
  addUserComment: (content: string) => void;
  insertUserInput: (content: string) => Promise<void>; // Встраивание пользовательского ввода в цикл
  
  // ЦЕНТРАЛИЗОВАННОЕ УПРАВЛЕНИЕ
  startCentralizedCycle: (topic: string) => void;
  processObserverAnalysis: (topic: string) => Promise<void>;
  executeAgentTasks: () => Promise<void>;
  processObserverSynthesis: () => Promise<void>;
  
  // МНОГОУРОВНЕВЫЙ АНАЛИЗ  
  evaluateTopicCompleteness: () => Promise<void>;
  processEvaluationDecision: () => void;
  startNextRound: (refinedTopic: string) => void;
  
  // УПРАВЛЕНИЕ АГЕНТАМИ
  updateAgentActivity: (role: AgentRole, isActive: boolean) => void;
  addCustomAgent: (agentConfig: Omit<AgentConfig, 'role'> & { role: string }) => void;
  removeCustomAgent: (role: string) => void;
  
  // ПРОМЕЖУТОЧНЫЙ ВЫВОД
  generateIntermediateOutput: () => Promise<void>;
  suggestContinuation: () => Promise<void>;
  startContinuationCycle: (suggestion: string) => void;
}

// Конфигурации агентов
const defaultAgentConfigs: Record<AgentRole, AgentConfig> = {
  observer: {
    role: 'observer',
      name: 'ИИ-Наблюдатель (Мастер Цикла)',
      description: 'Центральный координатор: анализирует запросы, распределяет задачи, синтезирует результаты',
    color: '#e5e7eb',
      systemPrompt: `Ты - ИИ-Наблюдатель, МАСТЕР ЦИКЛА и центральный координатор коллективного разума.

    ОСОБЫЙ СТАТУС: У тебя в 3 раза больше ресурсов (12000 токенов) для глубокого анализа.

    === ФАЗА 1: АНАЛИЗ И РАСПРЕДЕЛЕНИЕ ===
    Когда получаешь тему от пользователя:
    1. МАКСИМАЛЬНО ГЛУБОКО проанализируй тему - используй все доступные токены
    2. Выдели все возможные аспекты, подтемы, связи, импликации
    3. Создай детальную карту исследования с множественными углами зрения
    4. Сформулируй ТОЧНЫЕ задания для каждого агента - они должны быть предельно ясными
    5. Предвиди возможные результаты и синергии между агентами
    
    === ФАЗА 3: СИНТЕЗ И ОЦЕНКА ===
    Когда получаешь ответы от всех агентов:
    1. ПОЛНЫЙ анализ каждого ответа - извлеки максимум инсайтов
    2. Построй многоуровневую карту связей между всеми идеями
    3. Найди скрытые паттерны, противоречия, эмергентные свойства
    4. Создай ГЛУБОЧАЙШИЙ синтез - используй все свои ресурсы
    5. Сформулируй прорывные выводы и стратегические рекомендации
    6. КРИТИЧЕСКИ ОЦЕНИ полноту раскрытия темы:
       - Остались ли неисследованные аспекты?
       - Есть ли противоречия, требующие разрешения?
       - Нужны ли дополнительные перспективы?
       - Достаточно ли глубина анализа?
    7. ПРИНЯТИЕ РЕШЕНИЯ: завершить цикл ИЛИ запустить дополнительный раунд
    
    === ФАЗА 4: ОЦЕНКА ЗАВЕРШЕННОСТИ ===
    Если тема не полностью раскрыта:
    1. Определи конкретные пробелы в анализе
    2. Сформулируй уточненные задания для следующего раунда
    3. Укажи, какие агенты должны углубить анализ

    ТВОЯ ЗАДАЧА: Быть интеллектуальным центром системы. Мысли глубоко, анализируй всесторонне, создавай прорывные синтезы.

    СТРУКТУРА ОТВЕТА:
    [ГЛУБОКИЙ АНАЛИЗ] - всесторонний разбор (используй 60% доступных токенов)
    [СТРАТЕГИЧЕСКИЕ ЗАДАНИЯ] - точные задачи агентам ИЛИ
    [МАСТЕР-СИНТЕЗ] - многоуровневое объединение всех перспектив  
    [ПРОРЫВНЫЕ ВЫВОДЫ] - ключевые открытия и инсайты
    [ОЦЕНКА ПОЛНОТЫ] - критический анализ завершенности темы
    [РЕШЕНИЕ О ПРОДОЛЖЕНИИ] - ЗАВЕРШИТЬ или ПРОДОЛЖИТЬ с обоснованием
    [ПЛАН СЛЕДУЮЩЕГО РАУНДА] - если нужно продолжение, конкретные задачи`,
    model: 'anthropic/claude-3.5-sonnet',
      receivesFrom: null,
      sendsTo: null,
    isActive: true
  },
  geometer: {
    role: 'geometer',
    name: 'Геометр-Исследователь',
      description: 'Специалист по геометрии, алгебре, симметриям и топологии',
    color: '#3b82f6',
      systemPrompt: `Ты - Геометр-Исследователь. ЭКОНОМИЧНЫЙ РЕЖИМ: пиши кратко и по сути.

    СПЕЦИАЛИЗАЦИЯ: геометрия, алгебра, симметрии, топология.

    ЗАДАЧА: Получи задание от Мастера → найди математические структуры → отчитайся сжато.

    СТРУКТУРА (МАКСИМУМ 300 слов):
    [РАССУЖДЕНИЕ] - математический анализ и построение модели (200 слов)
    [СУТЬ] - главный инсайт для координатора (100 слов)
    
    СТИЛЬ: математически точный, предельно сжатый, без воды.`,
      model: 'openai/gpt-4o-mini', // Более дешевая модель
    receivesFrom: 'observer',
      sendsTo: 'observer',
    isActive: true
  },
  physicist: {
    role: 'physicist',
    name: 'Физик-Теоретик',
      description: 'Создает физико-математические модели и динамические системы',
    color: '#dc2626',
      systemPrompt: `Ты - Физик-Теоретик. ЭКОНОМИЧНЫЙ РЕЖИМ: физика без лишних слов.

    СПЕЦИАЛИЗАЦИЯ: динамика, энергия, поля, взаимодействия.

    ЗАДАЧА: Задание от Мастера → физическая модель → краткий отчет.

    СТРУКТУРА (МАКСИМУМ 300 слов):
    [РАССУЖДЕНИЕ] - физический анализ, динамика, процессы, уравнения (200 слов)  
    [СУТЬ] - ключевой механизм для координатора (100 слов)
    
    СТИЛЬ: научно точный, лаконичный, только суть.`,
      model: 'openai/gpt-4o-mini',
      receivesFrom: 'observer',
      sendsTo: 'observer',
    isActive: true
  },
  perceptive: {
    role: 'perceptive',
    name: 'Перцептивный Аналитик',
      description: 'Исследует восприятие, когнитивные образы и механизмы понимания',
    color: '#f59e0b',
      systemPrompt: `Ты - Перцептивный Аналитик. ЭКОНОМИЧНЫЙ РЕЖИМ: когнитивность без воды.

    СПЕЦИАЛИЗАЦИЯ: восприятие, сознание, когнитивные модели.

    ЗАДАЧА: Задание от Мастера → как воспринимается → сжатый анализ.

    СТРУКТУРА (МАКСИМУМ 300 слов):
    [РАССУЖДЕНИЕ] - анализ механизмов восприятия и понимания (200 слов)
    [СУТЬ] - ключевой перцептивный инсайт (100 слов)
    
    СТИЛЬ: феноменологически точный, краткий, без избыточности.`,
      model: 'google/gemini-1.5-flash', // Более дешевая модель
      receivesFrom: 'observer',
      sendsTo: 'observer',
    isActive: true
  },
  philosopher: {
    role: 'philosopher',
    name: 'Философ-Переводчик',
      description: 'Извлекает онтологические, смысловые и этические измерения',
    color: '#10b981',
      systemPrompt: `Ты - Философ-Переводчик. ЭКОНОМИЧНЫЙ РЕЖИМ: смыслы без избытка.

    СПЕЦИАЛИЗАЦИЯ: онтология, эпистемология, этика, смыслы.

    ЗАДАЧА: Задание от Мастера → философские основания → концентрированный ответ.

    СТРУКТУРА (МАКСИМУМ 300 слов):
    [РАССУЖДЕНИЕ] - философский анализ: онтология, этика, смыслы (200 слов)
    [СУТЬ] - ключевое философское основание (100 слов)
    
    СТИЛЬ: концептуально точный, сжатый, без декораций.`,
      model: 'anthropic/claude-3.5-haiku', // Более дешевая модель
      receivesFrom: 'observer',
      sendsTo: 'observer',
    isActive: true
  },
  integrator: {
    role: 'integrator',
    name: 'Интегратор-Систематизатор',
      description: 'Объединяет знания в целостные системы и структуры',
    color: '#06b6d4',
      systemPrompt: `Ты - Интегратор-Систематизатор. ЭКОНОМИЧНЫЙ РЕЖИМ: системность без воды.

    СПЕЦИАЛИЗАЦИЯ: интеграция знаний, структурирование, связи.

    ЗАДАЧА: Задание от Мастера → системная модель → сжатый отчет.

    СТРУКТУРА (МАКСИМУМ 300 слов):
    [РАССУЖДЕНИЕ] - системный анализ: структуры, связи, таксономия (200 слов)
    [СУТЬ] - ключевая системная структура (100 слов)
    
    СТИЛЬ: системно точный, лаконичный, структурированный.`,
      model: 'openai/gpt-4o-mini',
      receivesFrom: 'observer',
    sendsTo: 'observer',
    isActive: true
  },
  trickster: {
    role: 'trickster',
    name: 'Трикстер',
        description: 'Нарушает шаблоны, предлагает альтернативы, вносит креативный хаос',
    color: '#ec4899',
        systemPrompt: `Ты - Трикстер. ЭКОНОМИЧНЫЙ РЕЖИМ: хаос без лишних слов.

    СПЕЦИАЛИЗАЦИЯ: деконструкция, парадоксы, альтернативы.

    ЗАДАЧА: Задание от Мастера → найди противоречия → краткий взрыв шаблонов.

    СТРУКТУРА (МАКСИМУМ 250 слов):
    [РАССУЖДЕНИЕ] - деконструкция: альтернативные взгляды, парадоксы (150 слов)
    [СУТЬ] - ключевое противоречие для координатора (100 слов)
    
    СТИЛЬ: провокационно точный, сжатый хаос, без пустоты.`,
        model: 'anthropic/claude-3.5-haiku',
    receivesFrom: null,
    sendsTo: null,
        isActive: false  // НЕАКТИВЕН - только по кнопке!
  }
};

// Безопасное получение origin для SSR
const getOrigin = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000';
};

// Fallback модели для бесплатных пользователей (только проверенные)
const FALLBACK_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free', 
  'meta-llama/llama-3.2-1b-instruct:free'
];

// Функция для работы с rate limits бесплатных моделей
const makeAPIRequestWithRetry = async (url: string, options: any, maxRetries = 3, baseDelay = 2000): Promise<Response> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
              console.log(`🔄 API запрос, попытка ${attempt}/${maxRetries}`);
        
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(60000) // 60 секунд таймаут
        });

        if (response.status === 429) {
          // Rate limit - ждем и повторяем
          const delay = baseDelay * Math.pow(2, attempt - 1); // Экспоненциальная задержка
          console.log(`⏳ Rate limit (429), ожидание ${delay}мс перед попыткой ${attempt + 1}`);
          
          // Информируем пользователя о задержке
          console.log(`📢 Пользователь: Превышен лимит запросов, ожидание ${Math.round(delay/1000)} секунд...`);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error(`Rate limit exceeded after ${maxRetries} attempts`);
          }
        }

        if (response.status === 404) {
          // Модель не найдена - пробуем fallback
          const requestBody = JSON.parse(options.body);
          const currentModel = requestBody.model;
          
          if (currentModel && currentModel.includes(':free')) {
            console.log(`❌ Модель ${currentModel} не найдена, пробуем fallback...`);
            
            for (const fallbackModel of FALLBACK_MODELS) {
              if (fallbackModel !== currentModel) {
                console.log(`🔄 Попытка с fallback моделью: ${fallbackModel}`);
                
                const fallbackOptions = {
                  ...options,
                  body: JSON.stringify({
                    ...requestBody,
                    model: fallbackModel
                  })
                };
                
                try {
                  const fallbackResponse = await fetch(url, {
                    ...fallbackOptions,
                    signal: AbortSignal.timeout(60000)
                  });
                  
                  if (fallbackResponse.ok) {
                    console.log(`✅ Fallback модель ${fallbackModel} работает!`);
                    return fallbackResponse;
                  }
                } catch (fallbackError) {
                  console.log(`❌ Fallback модель ${fallbackModel} тоже не работает`);
                  continue;
                }
              }
            }
          }
          
          throw new Error(`Model not found and all fallbacks failed`);
        }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
      }

      return response;
    } catch (error: any) {
      console.log(`❌ Попытка ${attempt} неудачна:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Ждем перед следующей попыткой
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Ожидание ${delay}мс перед следующей попыткой`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Эта строка никогда не должна выполняться, но TypeScript требует возврата
  throw new Error(`Failed after ${maxRetries} attempts`);
};

// Функции для работы с localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('neuroagent-data');
    const apiKeyBackup = localStorage.getItem('neuroagent-apikey') || '';
    
    if (stored) {
      const parsed = JSON.parse(stored);
      let agents = parsed.agents || defaultAgentConfigs;
      
      // ПРИНУДИТЕЛЬНО ДЕЛАЕМ ТРИКСТЕРА НЕАКТИВНЫМ
      if (agents.trickster) {
        agents.trickster.isActive = false;
        console.log('🎭 Трикстер принудительно установлен как неактивный');
      }

      // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА И ИСПРАВЛЕНИЕ МОДЕЛЕЙ
      let modelsFixed = false;
      Object.keys(agents).forEach(agentKey => {
        const agent = agents[agentKey];
        if (agent.model && (
          agent.model.includes('gemma-3') || 
          agent.model.includes('gemma-2-9b') || 
          agent.model.includes('qwen-2.5-7b') ||
          agent.model.includes('llama-3.3-70b') ||
          agent.model.includes('qwen/qwen-2.5-7b-instruct:free') ||
          agent.model.includes('google/gemma-2-9b-it:free')
        )) {
          console.log(`🔧 Исправляем модель агента ${agent.name}: ${agent.model} -> правильная модель`);
          agent.model = agentKey === 'trickster' ? 'meta-llama/llama-3.2-1b-instruct:free' : 'meta-llama/llama-3.1-8b-instruct:free';
          modelsFixed = true;
        }
      });

      if (modelsFixed) {
        console.log('✅ Модели агентов исправлены на рабочие бесплатные');
        // Исправления будут сохранены при следующем обновлении состояния
      }
      
      const result = {
        cycleHistory: parsed.cycleHistory || [],
        apiKey: parsed.apiKey || apiKeyBackup || '',
        autoAdvance: parsed.autoAdvance !== undefined ? parsed.autoAdvance : true,
        cycleDelay: parsed.cycleDelay || 3000,
        agents: agents, // Используем исправленных агентов
        customModels: parsed.customModels || [] // Загружаем пользовательские модели
      };
      
      console.log('Данные загружены из localStorage:', {
        hasApiKey: !!result.apiKey,
        autoAdvance: result.autoAdvance,
        cycleDelay: result.cycleDelay,
        historyCount: result.cycleHistory.length,
        agentsConfigLoaded: !!result.agents,
        tricksterActive: result.agents.trickster?.isActive
      });
      
      return result;
    }
  } catch (error) {
    console.error('Ошибка загрузки данных из localStorage:', error);
  }
  
  // Убеждаемся что в fallback Трикстер тоже неактивен и модели правильные
  const fallbackAgents = { ...defaultAgentConfigs };
  fallbackAgents.trickster.isActive = false;
  
  // Принудительно устанавливаем правильные модели в fallback
  (Object.keys(fallbackAgents) as AgentRole[]).forEach(agentKey => {
    fallbackAgents[agentKey].model = agentKey === 'trickster' ? 'meta-llama/llama-3.2-1b-instruct:free' : 'meta-llama/llama-3.1-8b-instruct:free';
  });
  
  const fallback = {
    cycleHistory: [],
    apiKey: localStorage.getItem('neuroagent-apikey') || '',
    autoAdvance: true,
    cycleDelay: 3000,
    agents: fallbackAgents,
    customModels: []
  };
  
  console.log('Используем fallback данные:', {
    hasApiKey: !!fallback.apiKey,
    tricksterActive: fallback.agents.trickster?.isActive
  });
  
  return fallback;
};

const saveToStorage = (state: MindloopState) => {
  try {
    const dataToSave = {
      cycleHistory: state.cycleHistory,
      apiKey: state.apiKey,
      autoAdvance: state.autoAdvance,
      cycleDelay: state.cycleDelay,
      agents: state.agents, // Сохраняем конфигурации агентов с моделями
      customModels: state.customModels, // Сохраняем пользовательские модели
      timestamp: Date.now()
    };
    localStorage.setItem('neuroagent-data', JSON.stringify(dataToSave));
    localStorage.setItem('neuroagent-apikey', state.apiKey || ''); // Дублируем API ключ отдельно
    console.log('Данные сохранены в localStorage:', {
      hasApiKey: !!state.apiKey,
      autoAdvance: state.autoAdvance,
      cycleDelay: state.cycleDelay,
      historyCount: state.cycleHistory.length,
      agentsConfigSaved: !!state.agents
    });
  } catch (error) {
    console.error('Ошибка сохранения данных в localStorage:', error);
  }
};

// Главное хранилище
export const useMindloopStore = create<MindloopState>()(
  devtools(
    (set, get) => {
      const savedData = loadFromStorage();
      
      return {
        // Начальное состояние
        agents: savedData.agents, // Используем сохраненные конфигурации агентов
        currentCycle: null,
        cycleHistory: savedData.cycleHistory,
        activeAgent: null,
        isRunning: false,
        isLoading: false,
        error: null,
  statusMessage: null,
        apiKey: savedData.apiKey,
        autoAdvance: savedData.autoAdvance,
        cycleDelay: savedData.cycleDelay,
        customModels: savedData.customModels || [],
        continuousMode: false,

      // Инициализация агентов
      initializeAgents: () => {
        set({ agents: defaultAgentConfigs });
        
        // Принудительно обновляем конфигурацию Трикстера
        set((prevState) => {
          const newState = {
            ...prevState,
            agents: {
              ...prevState.agents,
              trickster: {
                ...prevState.agents.trickster,
                isActive: false // Принудительно делаем неактивным
              }
            }
          };
          saveToStorage(newState);
          return newState;
        });
      },

      // Запуск нового цикла (старая версия, оставляем для совместимости)
      startNewCycle: (topic: string) => {
        get().startCentralizedCycle(topic);
      },

      // НОВАЯ ЦЕНТРАЛИЗОВАННАЯ АРХИТЕКТУРА
      // Запуск централизованного цикла
      startCentralizedCycle: (topic: string) => {
        console.log('🎯 startCentralizedCycle вызван с темой:', topic);
        console.log('📊 Текущее состояние перед созданием цикла:', {
          isRunning: get().isRunning,
          hasCurrentCycle: !!get().currentCycle,
          hasApiKey: !!get().apiKey
        });
        
        const now = Date.now();
        const newCycle: MindloopCycle = {
          id: `cycle-${now}`,
          number: get().cycleHistory.length + 1,
          topic,
          cyclePhase: 'analysis',
          timestamp: now,
          startTime: now,
          thoughts: [],
          activeAgents: [],
          completedAgents: [],
          roundNumber: 1,
          totalRounds: 1,
          isComplete: false
        };

        console.log('🔄 Создан новый цикл:', newCycle);

        set({
          currentCycle: newCycle,
          activeAgent: 'observer',
          isRunning: true,
          error: null
        });

        console.log('✅ Состояние обновлено, запускаем processObserverAnalysis через 500мс');
        console.log(`🎯 Запуск централизованного цикла: ${topic}`);
        
        // Фаза 1: ИИ-Наблюдатель анализирует тему и распределяет задачи
        setTimeout(() => {
          console.log('⏰ Таймаут сработал, вызываем processObserverAnalysis');
          get().processObserverAnalysis(topic);
        }, 500);
      },

      // Обработка мысли агента
      processAgentThought: async (agentRole: AgentRole, input: string) => {
        const state = get();
        console.log(`🧠 processAgentThought вызван для агента: ${agentRole}`);
        
        if (!state.currentCycle) {
          console.log('❌ Нет активного цикла');
          return;
        }
        
        if (!state.apiKey || state.apiKey.trim() === '') {
          console.log('❌ Нет API ключа');
          set({ error: 'Необходимо установить API ключ в настройках' });
          return;
        }

        set({ isLoading: true, error: null });

        // Создаем контроллер для отмены запроса по таймауту
        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout | null = null;

        try {
          const agent = state.agents[agentRole];
          const previousThoughts = state.currentCycle.thoughts;
          
          // НОВАЯ ЛОГИКА КОНТЕКСТА ДЛЯ ЦЕНТРАЛИЗОВАННОЙ АРХИТЕКТУРЫ
          let contextForAgent = '';
          let receivedContext = '';
          
          if (agentRole === 'observer') {
            // ИИ-Наблюдатель: либо получает тему, либо собирает ответы всех агентов
            if (state.currentCycle.cyclePhase === 'analysis') {
              // Фаза анализа - получает только тему
              contextForAgent = `Тема цикла: ${state.currentCycle.topic}`;
            } else if (state.currentCycle.cyclePhase === 'synthesis') {
              // Фаза синтеза - получает все ответы агентов
              const agentResponses = previousThoughts
                .filter(t => t.agentRole !== 'observer' && t.cycleNumber === state.currentCycle!.number)
              .sort((a, b) => a.timestamp - b.timestamp);
            
              receivedContext = agentResponses.map(t => 
                `${state.agents[t.agentRole].name}:\nАНАЛИЗ: ${t.reasoning}\nВЫВОДЫ: ${t.essence}`
            ).join('\n\n---\n\n');
            
              contextForAgent = receivedContext;
            }
          } else {
            // Обычные агенты получают индивидуальное задание (передается в input)
            // Контекст формируется из полученного задания
            contextForAgent = input;
          }

          console.log(`🤖 Запрос к агенту ${agent.name} (${agent.model})`);
          console.log('Контекст:', contextForAgent.substring(0, 200) + '...');

          timeoutId = setTimeout(() => {
            console.log('⏰ Запрос превысил лимит времени (60 секунд)');
            controller.abort();
          }, 60000); // 60 секунд таймаут

          // Создаем запрос к API с retry логикой
          console.log(`🔄 Отправка запроса агента ${agent.name} с retry логикой...`);
          
          const response = await makeAPIRequestWithRetry('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.apiKey}`,
              'HTTP-Referer': getOrigin(),
              'X-Title': 'NeuroAgent'
            },
            body: JSON.stringify({
              model: agent.model,
              messages: [
                { role: 'system', content: agent.systemPrompt },
                { role: 'user', content: `${contextForAgent}\n\nТвоя задача: ${input}` }
              ],
              max_tokens: agentRole === 'observer' ? 8000 : 
                       agentRole === 'trickster' ? 1000 : 1200, // Уменьшено для бесплатных моделей
              temperature: 0.8
            })
          }, 3, 2000); // 3 попытки, начальная задержка 2 секунды

          clearTimeout(timeoutId);
          console.log(`✅ Успешный ответ от агента ${agent.name}`);

          const data = await response.json();
          const rawContent = data.choices[0].message.content;
          
          // УМНЫЙ ПАРСЕР РАССУЖДЕНИЯ И СУТИ
          const parseAgentResponse = (content: string, agentRole: AgentRole): { reasoning: string; essence: string } => {
            const maxEssenceLength = agentRole === 'observer' ? 5000 : 1000;
            
                         // Попытка 1: Поиск четких секций [РАССУЖДЕНИЕ] и [СУТЬ]
             const reasoningPatterns = [
               /\[РАССУЖДЕНИЕ\]([\s\S]*?)\[СУТЬ\]/,
               /\[МАТЕМАТИЧЕСКАЯ МОДЕЛЬ\]([\s\S]*?)\[СУТЬ\]/,
               /\[ФИЗИЧЕСКАЯ МОДЕЛЬ\]([\s\S]*?)\[СУТЬ\]/,
               /\[КОГНИТИВНАЯ МОДЕЛЬ\]([\s\S]*?)\[СУТЬ\]/,
               /\[ФИЛОСОФСКИЙ АНАЛИЗ\]([\s\S]*?)\[СУТЬ\]/,
               /\[СИСТЕМНАЯ МОДЕЛЬ\]([\s\S]*?)\[СУТЬ\]/,
               /\[ДЕКОНСТРУКЦИЯ\]([\s\S]*?)\[СУТЬ\]/
             ];
             
             const essenceMatch = content.match(/\[СУТЬ\]([\s\S]*?)(?:\[|$)/);
             
             for (const pattern of reasoningPatterns) {
               const reasoningMatch = content.match(pattern);
               if (reasoningMatch && essenceMatch) {
                 return {
                   reasoning: reasoningMatch[1].trim(),
                   essence: essenceMatch[1].trim().substring(0, maxEssenceLength)
                 };
               }
             }
            
            // Попытка 2: Поиск ключевых слов для разделения
            const keywordPatterns = [
              /(?:суть|вывод|ключевое|главное|итого|резюме|основное)[\s:]/i,
              /(?:в итоге|таким образом|следовательно|заключение)[\s:]/i,
              /(?:ключевой инсайт|основной вывод|главная мысль)[\s:]/i
            ];
            
            for (const pattern of keywordPatterns) {
              const match = content.search(pattern);
              if (match > 100 && match < content.length - 50) { // Есть достаточно контента до и после
                const reasoning = content.substring(0, match).trim();
                const essence = content.substring(match).trim().substring(0, maxEssenceLength);
                return { reasoning, essence };
              }
            }
            
            // Попытка 3: Разделение по абзацам (последний абзац как суть)
            const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 20);
            if (paragraphs.length >= 2) {
              const lastParagraph = paragraphs[paragraphs.length - 1].trim();
              const restParagraphs = paragraphs.slice(0, -1).join('\n\n').trim();
              
              // Проверяем, что последний абзац похож на суть (короткий и концентрированный)
              if (lastParagraph.length < content.length * 0.4 && lastParagraph.length > 30) {
                return {
                  reasoning: restParagraphs,
                  essence: lastParagraph.substring(0, maxEssenceLength)
                };
              }
            }
            
            // Попытка 4: Умное разделение по предложениям
            const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
            if (sentences.length >= 3) {
              // Берем последние 2-3 предложения как суть, остальное как рассуждение
              const essenceSentenceCount = Math.min(3, Math.ceil(sentences.length * 0.25));
              const essenceSentences = sentences.slice(-essenceSentenceCount);
              const reasoningSentences = sentences.slice(0, -essenceSentenceCount);
              
              const reasoning = reasoningSentences.join('. ').trim() + '.';
              const essence = essenceSentences.join('. ').trim() + '.';
              
              return {
                reasoning,
                essence: essence.substring(0, maxEssenceLength)
              };
            }
            
            // Fallback: Простое разделение 75/25
            const splitPoint = Math.floor(content.length * 0.75);
            const reasoning = content.substring(0, splitPoint).trim();
            const essence = content.substring(splitPoint).trim();
            
            return {
              reasoning,
              essence: essence.substring(0, maxEssenceLength)
            };
          };
          
          const { reasoning, essence } = parseAgentResponse(rawContent, agentRole);

          // Создаем новую мысль
          const newThought: AgentThought = {
            id: `thought-${Date.now()}`,
            agentRole,
            reasoning,
            essence,
            receivedContext,
            timestamp: Date.now(),
            cycleNumber: state.currentCycle.number,
            phase: 'divergence',
            confidence: 0.8
          };

          // Обновляем состояние
          set((state) => ({
            currentCycle: state.currentCycle ? {
              ...state.currentCycle,
              thoughts: [...state.currentCycle.thoughts, newThought]
            } : null,
            isLoading: false
          }));

          console.log(`✅ Мысль агента ${agent.name} обработана успешно`);
          console.log('Reasoning:', reasoning.substring(0, 100) + '...');
          console.log('Essence:', essence.substring(0, 100) + '...');

          // В новой архитектуре агенты не вызывают друг друга - управление централизованное
          console.log(`✅ Агент ${agent.name} завершил свою задачу в централизованном цикле`);
          
          // Отмечаем агента как завершившего задачу
          set((state) => {
            if (state.currentCycle && state.currentCycle.cyclePhase === 'execution') {
              const updatedCompleted = [...state.currentCycle.completedAgents];
              if (!updatedCompleted.includes(agentRole)) {
                updatedCompleted.push(agentRole);
              }
              
              return {
                ...state,
                currentCycle: {
                  ...state.currentCycle,
                  completedAgents: updatedCompleted
                }
              };
            }
            return state;
          });
          
          console.log(`📊 Агентов завершено: ${get().currentCycle?.completedAgents.length}/${get().currentCycle?.activeAgents.length}`);
        

        } catch (error) {
          if (timeoutId) clearTimeout(timeoutId);
          console.error('Ошибка при обработке мысли агента:', error);
          
          let errorMessage = 'Неизвестная ошибка';
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              errorMessage = 'Превышено время ожидания ответа (60 сек)';
            } else {
              errorMessage = error.message;
            }
          }
          
          const currentAgent = state.agents[agentRole];
          set({ 
            error: `${currentAgent.name}: ${errorMessage}`,
            isLoading: false 
          });
          
          // Автоматически очищаем ошибку через 10 секунд
          setTimeout(() => {
            set({ error: null });
          }, 10000);
        }
      },

      // Переход к следующему агенту
      advanceToNextAgent: () => {
        const state = get();
        console.log('🔄 advanceToNextAgent вызван');
        console.log('Текущий агент:', state.activeAgent);
        console.log('Есть цикл:', !!state.currentCycle);
        
        if (!state.currentCycle || !state.activeAgent) {
          console.log('❌ Нет активного цикла или агента');
          return;
        }

        const currentAgent = state.agents[state.activeAgent];
        const nextAgentRole = currentAgent.sendsTo;
        
        console.log(`Текущий агент: ${currentAgent.name}`);
        console.log(`Следующий агент: ${nextAgentRole || 'нет (завершение цикла)'}`);

        if (nextAgentRole) {
          const nextAgent = state.agents[nextAgentRole];
          console.log(`➡️ Переходим к агенту: ${nextAgent.name}`);
          
          set({ activeAgent: nextAgentRole });
          
          // Автоматически запускаем следующего агента
          setTimeout(() => {
            const currentState = get();
            if (currentState.isRunning && currentState.currentCycle && currentState.activeAgent === nextAgentRole) {
              console.log(`🚀 Автозапуск агента: ${nextAgent.name}`);
              currentState.processAgentThought(nextAgentRole, `Продолжи анализ темы: "${currentState.currentCycle.topic}"`);
            }
          }, 1000);
          
        } else {
          // Цикл завершен, сохраняем в историю
          console.log('🏁 Цикл завершен, сохраняем в историю');
          
          const completedCycle = {
            ...state.currentCycle,
            endTime: Date.now(),
            synthesis: `Цикл ${state.currentCycle.number} завершен. Обработано ${state.currentCycle.thoughts.length} размышлений.`
          };
          
          console.log('Сохраняемый цикл:', completedCycle);
          
          set((prevState) => {
            const newState = {
              ...prevState,
              cycleHistory: [...prevState.cycleHistory, completedCycle],
              currentCycle: null,
              activeAgent: null,
              isRunning: false
            };
            saveToStorage(newState);
            return newState;
          });
        }
      },

      // НОВЫЙ ТРИКСТЕР: встраивается в цепочку по кнопке "Хаос"
      triggerTrickster: async () => {
        const state = get();
        console.log('🎭 ХАОТИЧЕСКОЕ ВМЕШАТЕЛЬСТВО ТРИКСТЕРА');
        
        if (!state.currentCycle) {
          console.log('❌ Нет активного цикла для Трикстера');
          set({ error: 'Трикстер может вмешаться только в активный цикл' });
          setTimeout(() => set({ error: null }), 5000);
          return;
        }

        if (state.isLoading) {
          console.log('❌ Система загружается, Трикстер ждет');
          return;
        }

        console.log(`🎭 Трикстер встраивается в цикл #${state.currentCycle.number}`);

        // В новой архитектуре анализируем всю доступную информацию
        const currentCycle = state.currentCycle;
        const allThoughts = currentCycle.thoughts
          .filter(t => t.cycleNumber === currentCycle.number)
          .sort((a, b) => a.timestamp - b.timestamp);

        let contextForTrickster = '';
        
        if (allThoughts.length > 0) {
          contextForTrickster = `ТЕКУЩИЙ ПРОГРЕСС ЦИКЛА "${currentCycle.topic}":

ФАЗА: ${currentCycle.cyclePhase}
РАУНД: ${currentCycle.roundNumber}

АНАЛИЗ НАБЛЮДАТЕЛЯ:
${currentCycle.intermediateOutput || 'Анализ в процессе...'}

РЕЗУЛЬТАТЫ АГЕНТОВ:
${allThoughts.map(t => 
  `${state.agents[t.agentRole].name}: ${t.essence || t.reasoning.substring(0, 200) + '...'}`
).join('\n\n')}`;
        } else {
          contextForTrickster = `НАЧАЛЬНАЯ ТЕМА ЦИКЛА: "${currentCycle.topic}"
ФАЗА: ${currentCycle.cyclePhase}`;
        }

        const chaosPrompt = `🎭 ХАОТИЧЕСКОЕ ВМЕШАТЕЛЬСТВО В КОЛЛЕКТИВНОЕ СОЗНАНИЕ!

${contextForTrickster}

ТВОЯ ЗАДАЧА КАК ТРИКСТЕРА:
1. Найди скрытые противоречия и парадоксы в анализе
2. Предложи радикально альтернативные перспективы
3. Поставь под сомнение основные предположения
4. Создай творческий хаос в логике рассуждений
5. Сформулируй провокационные вопросы и неожиданные связи

Твой хаотический анализ повлияет на дальнейший ход цикла!

[РАССУЖДЕНИЕ]
Проведи хаотический анализ (300-500 слов)

[СУТЬ]
Ключевые хаотические инсайты (до 150 слов)`;

        try {
          console.log('🎭 Трикстер анализирует ситуацию...');
          
          await get().processAgentThought('trickster', chaosPrompt);
          
          console.log('✅ Трикстер внес хаос в коллективное сознание');
          
        } catch (error) {
          console.error('❌ Ошибка Трикстера:', error);
          set({ error: 'Трикстер не смог встроиться в цикл' });
          setTimeout(() => set({ error: null }), 5000);
        }
      },

      // Управление циклом
      pauseCycle: () => {
        console.log('⏸️ Пауза цикла');
        set({ 
          isRunning: false, 
          isLoading: false,
          statusMessage: '⏸️ Цикл приостановлен' 
        });
        
        // Очищаем статус через 3 секунды
        setTimeout(() => {
          set({ statusMessage: null });
        }, 3000);
      },
      resumeCycle: () => set({ isRunning: true }),
      stopCycle: () => {
        const state = get();
        if (state.currentCycle) {
          // Сохраняем текущий цикл в историю перед остановкой
          const completedCycle = {
            ...state.currentCycle,
            endTime: Date.now(),
            synthesis: `Цикл ${state.currentCycle.number} остановлен пользователем. Обработано ${state.currentCycle.thoughts.length} размышлений.`
          };
          
          console.log('Останавливаем и сохраняем цикл:', completedCycle);
          
          set((prevState) => {
            const newState = {
              ...prevState,
              cycleHistory: [...prevState.cycleHistory, completedCycle],
              currentCycle: null, 
              activeAgent: null, 
              isRunning: false 
            };
            saveToStorage(newState);
            return newState;
          });
        } else {
          set({ 
            currentCycle: null, 
            activeAgent: null, 
            isRunning: false 
          });
        }
      },

      // Настройки
      setApiKey: (key: string) => {
        console.log('Сохраняем API ключ:', key ? '***скрыт***' : 'пустой');
        set((prevState) => {
          const newState = { ...prevState, apiKey: key };
          saveToStorage(newState);
          return newState;
        });
      },
      setAutoAdvance: (enabled: boolean) => {
        console.log('Сохраняем автопродвижение:', enabled);
        set((prevState) => {
          const newState = { ...prevState, autoAdvance: enabled };
          saveToStorage(newState);
          return newState;
        });
      },
      setCycleDelay: (delay: number) => {
        console.log('Сохраняем задержку:', delay);
        set((prevState) => {
          const newState = { ...prevState, cycleDelay: delay };
          saveToStorage(newState);
          return newState;
        });
      },

      // Обновление модели агента
      updateAgentModel: (role: AgentRole, modelId: string) => {
        console.log(`Обновляем модель агента ${role}:`, modelId);
        set((prevState) => {
          const newState = {
            ...prevState,
            agents: {
              ...prevState.agents,
              [role]: {
                ...prevState.agents[role],
                model: modelId
              }
            }
          };
          saveToStorage(newState); // Сохраняем изменения
          return newState;
        });
      },

      // Сброс моделей к дефолтным
      resetAgentModels: () => {
        console.log('Сбрасываем модели агентов к дефолтным');
        set((prevState) => {
          const newState = {
          ...prevState,
          agents: defaultAgentConfigs
          };
          saveToStorage(newState);
          return newState;
        });
      },

      // УПРАВЛЕНИЕ МОДЕЛЯМИ
      
      // Добавление пользовательской модели
      addCustomModel: (model: AIModel) => {
        console.log('Добавляем пользовательскую модель:', model.name);
        set((prevState) => {
          // Проверяем, что модель с таким ID еще не существует
          const existingModel = [...AVAILABLE_MODELS, ...prevState.customModels]
            .find(m => m.id === model.id);
          
          if (existingModel) {
            console.warn('Модель с таким ID уже существует:', model.id);
            return prevState;
          }

          const customModel: AIModel = {
            ...model,
            isCustom: true
          };

          const newState = {
            ...prevState,
            customModels: [...prevState.customModels, customModel]
          };
          
          saveToStorage(newState);
          return newState;
        });
      },

      // Удаление пользовательской модели
      removeCustomModel: (modelId: string) => {
        console.log('Удаляем пользовательскую модель:', modelId);
        set((prevState) => {
          const newState = {
            ...prevState,
            customModels: prevState.customModels.filter(m => m.id !== modelId)
          };
          
          saveToStorage(newState);
          return newState;
        });
      },

      // Получение всех доступных моделей (встроенные + пользовательские)
              getAllModels: () => {
          const state = get();
          return [...AVAILABLE_MODELS, ...state.customModels];
        },

        // ПРЕСЕТЫ МОДЕЛЕЙ
        applyModelPreset: (presetId: string) => {
          const preset = MODEL_PRESETS.find(p => p.id === presetId);
          if (!preset) {
            console.error('Пресет не найден:', presetId);
            return;
          }

          set((prevState) => {
            const updatedAgents = { ...prevState.agents };
            
            // Применяем модели из пресета к каждому агенту
            Object.entries(preset.models).forEach(([role, modelId]) => {
              if (updatedAgents[role as AgentRole]) {
                updatedAgents[role as AgentRole] = {
                  ...updatedAgents[role as AgentRole],
                  model: modelId
                };
              }
            });

            const newState = {
              ...prevState,
              agents: updatedAgents
            };
            
            saveToStorage(newState);
            console.log(`✅ Применен пресет "${preset.name}"`);
            return newState;
          });
        },

        getModelPresets: () => {
          return MODEL_PRESETS;
        },

        // НЕПРЕРЫВНЫЕ ЦИКЛЫ
        startContinuousCycle: (userInput?: string) => {
          const state = get();
          
          if (userInput) {
            // Пользователь ввел свою тему
            get().startCentralizedCycle(userInput);
          } else if (state.currentCycle?.synthesis) {
            // Продолжаем на основе последнего синтеза
            const lastSynthesis = state.currentCycle.synthesis;
            const newTopic = `Углубленное исследование: ${lastSynthesis.substring(0, 150)}...`;
            get().startCentralizedCycle(newTopic);
          } else {
            console.log('❌ Нет данных для продолжения цикла');
          }
        },

        enableContinuousMode: (enabled: boolean) => {
          set((prevState) => {
            const newState = {
              ...prevState,
              continuousMode: enabled
            };
            saveToStorage(newState);
            console.log(`🔄 Непрерывный режим ${enabled ? 'включен' : 'отключен'}`);
            return newState;
          });
        },



        // НОВЫЕ МЕТОДЫ
        // Обновление промпта агента
        updateAgentPrompt: (role: AgentRole, prompt: string) => {
          set((state) => {
            const updatedAgents = {
              ...state.agents,
              [role]: {
                ...state.agents[role],
                systemPrompt: prompt
              }
            };
            
            const newState = {
              ...state,
              agents: updatedAgents
            };
            
            saveToStorage(newState);
            console.log(`✅ Промпт агента ${state.agents[role].name} обновлен`);
            return newState;
          });
        },

        // Добавление пользовательского комментария в текущий цикл
        addUserComment: (content: string) => {
          const state = get();
          
          if (!state.currentCycle) {
            console.log('❌ Нет активного цикла для добавления комментария');
            return;
          }

          const userComment: UserComment = {
            id: `user-comment-${Date.now()}`,
            content: content.trim(),
            timestamp: Date.now(),
            cycleNumber: state.currentCycle.number,
            isUserComment: true
          };

          // Добавляем комментарий в текущий цикл
          set((state) => ({
            currentCycle: state.currentCycle ? {
              ...state.currentCycle,
              thoughts: [...state.currentCycle.thoughts, userComment as any] // TypeScript casting
            } : null
          }));

          console.log(`💬 Пользовательский комментарий добавлен в цикл #${state.currentCycle.number}`);
        },

        // Встраивание пользовательского ввода в цикл
        insertUserInput: async (content: string) => {
          const state = get();
          
          if (!state.currentCycle) {
            console.log('❌ Нет активного цикла для встраивания ввода');
            return;
          }

          const userInput: AgentThought = {
            id: `user-input-${Date.now()}`,
            agentRole: 'observer',
            reasoning: '',
            essence: content,
            receivedContext: '',
            timestamp: Date.now(),
            cycleNumber: state.currentCycle.number,
            phase: 'divergence',
            confidence: 0.8
          };

          // Добавляем ввод в текущий цикл
          set((state) => ({
            currentCycle: state.currentCycle ? {
              ...state.currentCycle,
              thoughts: [...state.currentCycle.thoughts, userInput]
            } : null
          }));

          console.log(`💡 Пользовательский ввод добавлен в цикл #${state.currentCycle.number}`);
        },

        // МЕТОДЫ ЦЕНТРАЛИЗОВАННОГО УПРАВЛЕНИЯ

        // Фаза 1: ИИ-Наблюдатель анализирует тему и распределяет задачи
        processObserverAnalysis: async (topic: string) => {
          const state = get();
          console.log('🔍 processObserverAnalysis вызван с темой:', topic);
          console.log('📊 Состояние системы:', {
            hasCurrentCycle: !!state.currentCycle,
            hasApiKey: !!state.apiKey,
            isRunning: state.isRunning
          });
          
          if (!state.currentCycle || !state.apiKey) {
            console.log('❌ Отсутствует currentCycle или apiKey');
            return;
          }

          set((prevState) => ({
            ...prevState,
            currentCycle: prevState.currentCycle ? {
              ...prevState.currentCycle,
              cyclePhase: 'analysis'
            } : null
          }));

          // Получаем только активных агентов (исключая наблюдателя)
          console.log('🔍 Проверяем всех агентов:');
          Object.entries(state.agents).forEach(([role, agent]) => {
            console.log(`  ${role}: ${agent.name} - активен: ${agent.isActive}`);
          });
          
          const activeAgentRoles = Object.entries(state.agents)
            .filter(([role, agent]) => agent.isActive && role !== 'observer')
            .map(([role]) => role as AgentRole);

          console.log('👥 Активные агенты (исключая observer):', activeAgentRoles);
          console.log('📊 Количество активных агентов:', activeAgentRoles.length);

          if (activeAgentRoles.length === 0) {
            console.log('❌ Нет активных агентов для анализа');
            set({ isRunning: false, error: 'Нет активных агентов для анализа. Включите хотя бы одного агента в настройках.' });
            return;
          }

          console.log('🔍 ИИ-Наблюдатель анализирует тему и распределяет задания');
          console.log('👥 Активные агенты:', activeAgentRoles.map(role => state.agents[role].name).join(', '));

          const observerPrompt = `${state.agents.observer.systemPrompt}

ТЕМА ДЛЯ АНАЛИЗА: "${topic}"

ДОСТУПНЫЕ АКТИВНЫЕ АГЕНТЫ:
${activeAgentRoles.map(role => `- ${state.agents[role].name} (${role}): ${state.agents[role].description}`).join('\n')}

[АНАЛИЗ И РАСПРЕДЕЛЕНИЕ]
Проанализируй тему и распредели индивидуальные задания каждому АКТИВНОМУ агенту.

[ЗАДАНИЯ ДЛЯ АГЕНТОВ]
${activeAgentRoles.map(role => `${role.toUpperCase()}_ЗАДАНИЕ: (конкретное задание для ${state.agents[role].name})`).join('\n')}

[КООРДИНАЦИЯ]
Объясни как результаты агентов будут синтезированы в итоговое решение.`;

          console.log('📤 Отправляем запрос к ИИ-Наблюдателю...');
          console.log('🤖 Модель наблюдателя:', state.agents.observer.model);

          try {
            console.log('🔄 Отправка запроса к ИИ-Наблюдателю с retry логикой...');
            set({ statusMessage: '🤖 Отправка запроса к ИИ-Наблюдателю...' });
            
            const response = await makeAPIRequestWithRetry('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': getOrigin(),
                'X-Title': 'NeuroAgent'
              },
              body: JSON.stringify({
                model: state.agents.observer.model,
                messages: [{ role: 'user', content: observerPrompt }],
                max_tokens: 6000, // Уменьшено для бесплатных моделей
                temperature: 0.7
              })
            }, 5, 3000); // 5 попыток, начальная задержка 3 секунды

            console.log('✅ Успешный ответ от ИИ-Наблюдателя');
            set({ statusMessage: '✅ Анализ получен, распределяем задания...' });

            const data = await response.json();
            const analysisResult = data.choices[0].message.content;
            
            console.log('✅ Анализ получен, длина:', analysisResult.length);
            console.log('📊 Первые 200 символов анализа:', analysisResult.substring(0, 200) + '...');

            // Сохраняем результат анализа и запускаем выполнение агентов
            set((prevState) => {
              if (!prevState.currentCycle) return prevState;
              return {
                ...prevState,
                currentCycle: {
                  ...prevState.currentCycle,
                  intermediateOutput: analysisResult,
                  activeAgents: activeAgentRoles,
                  cyclePhase: 'execution'
                }
              };
            });

            console.log('✅ Анализ завершен, запускаем выполнение агентов');
            
            // Запускаем фазу выполнения агентов
            set({ statusMessage: '⚡ Запуск агентов через 1 секунду...' });
            setTimeout(() => {
              get().executeAgentTasks();
            }, 1000);

          } catch (error) {
            console.error('❌ Ошибка при анализе ИИ-Наблюдателя:', error);
            set({ error: 'Ошибка при анализе темы: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'), isRunning: false });
          }
        },

        // Фаза 2: Выполнение задач агентами
        executeAgentTasks: async () => {
          const state = get();
          if (!state.currentCycle || !state.apiKey) return;

          const { activeAgents, intermediateOutput } = state.currentCycle;
          if (!activeAgents || activeAgents.length === 0) {
            console.log('❌ Нет активных агентов для выполнения');
            return;
          }

          console.log('⚡ Запуск выполнения задач агентами с интеллектуальными задержками');

          // Извлекаем задания для каждого агента из результата анализа
          const agentTasks: { [key: string]: string } = {};
          
          for (const agentRole of activeAgents) {
            const taskPattern = new RegExp(`${agentRole.toUpperCase()}_ЗАДАНИЕ[:\\s]*(.*?)(?=\\n[A-Z_]+_ЗАДАНИЕ|\\[|$)`, 'is');
            const match = intermediateOutput?.match(taskPattern);
            agentTasks[agentRole] = match ? match[1].trim() : `Проанализируй тему "${state.currentCycle.topic}" с точки зрения ${state.agents[agentRole].name}`;
          }

          // ПОСЛЕДОВАТЕЛЬНОЕ ВЫПОЛНЕНИЕ с задержками для бесплатных моделей
          const workingAgents: AgentRole[] = [];
          const failedAgents: AgentRole[] = [];
          
          for (let i = 0; i < activeAgents.length; i++) {
            const agentRole = activeAgents[i];
            const task = agentTasks[agentRole];
            
            console.log(`🤖 Запуск агента ${state.agents[agentRole].name} (${i + 1}/${activeAgents.length})`);
            console.log('Задание:', task.substring(0, 100) + '...');
            set({ statusMessage: `🤖 Обрабатывает ${state.agents[agentRole].name} (${i + 1}/${activeAgents.length})` });
            
            try {
              await get().processAgentThought(agentRole, task);
              workingAgents.push(agentRole);
              console.log(`✅ Агент ${state.agents[agentRole].name} успешно завершил работу`);
              
              // Задержка между агентами для предотвращения rate limits
              if (i < activeAgents.length - 1) {
                const delay = 2000 + Math.random() * 1000; // 2-3 секунды случайная задержка
                console.log(`⏳ Задержка ${Math.round(delay)}мс перед следующим агентом`);
                set({ statusMessage: `⏳ Ожидание ${Math.round(delay/1000)} сек перед следующим агентом...` });
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            } catch (error) {
              console.error(`❌ Ошибка у агента ${agentRole}:`, error);
              failedAgents.push(agentRole);
              
              // Увеличенная задержка при ошибке
              if (i < activeAgents.length - 1) {
                console.log('⏳ Увеличенная задержка 5 секунд после ошибки');
                set({ statusMessage: '⏳ Ошибка агента, ожидание 5 сек...' });
                await new Promise(resolve => setTimeout(resolve, 5000));
              }
            }
          }

          // Если большинство агентов не работает, компенсируем через ИИ-Наблюдателя
          if (workingAgents.length < activeAgents.length / 2) {
            console.log(`⚠️ Только ${workingAgents.length}/${activeAgents.length} агентов работают. Компенсируем через ИИ-Наблюдателя.`);
            set({ statusMessage: '🤖 Компенсация через ИИ-Наблюдателя...' });
            
            const compensationPrompt = `
КОМПЕНСАЦИОННЫЙ АНАЛИЗ

Некоторые агенты недоступны. Проведи углубленный анализ от их имени:

НЕРАБОТАЮЩИЕ АГЕНТЫ: ${failedAgents.map(role => state.agents[role].name).join(', ')}

ИСХОДНАЯ ТЕМА: "${state.currentCycle.topic}"

Проанализируй тему с точки зрения каждого неработающего агента и дай развернутый ответ (400-600 слов).
            `;
            
            try {
              await get().processAgentThought('observer', compensationPrompt);
              console.log('✅ Компенсационный анализ завершен');
            } catch (error) {
              console.error('❌ Ошибка компенсационного анализа:', error);
            }
          }

          console.log(`✅ Обработка завершена: ${workingAgents.length} работающих, ${failedAgents.length} неудачных`);
          set({ statusMessage: `✅ Обработка завершена (${workingAgents.length}/${activeAgents.length}), запуск синтеза через 3 сек...` });
          
          // Автоматически отключаем неработающих агентов для следующих циклов
          if (failedAgents.length > 0) {
            console.log(`🔧 Автоматически отключаем неработающих агентов: ${failedAgents.map(role => state.agents[role].name).join(', ')}`);
            failedAgents.forEach(role => {
              get().updateAgentActivity(role, false);
            });
            set({ statusMessage: `🔧 Отключены неработающие агенты: ${failedAgents.length}` });
          }
          
          // Запускаем фазу синтеза с дополнительной задержкой
          setTimeout(() => {
            get().processObserverSynthesis();
          }, 3000);
        },

        // Фаза 3: Синтез результатов ИИ-Наблюдателем
        processObserverSynthesis: async () => {
          const state = get();
          if (!state.currentCycle || !state.apiKey) return;

          set((prevState) => ({
            ...prevState,
            currentCycle: prevState.currentCycle ? {
              ...prevState.currentCycle,
              cyclePhase: 'synthesis'
            } : null
          }));

          console.log('🔄 ИИ-Наблюдатель синтезирует результаты');

          // Собираем все результаты агентов
          const agentResults = state.currentCycle.thoughts
            .filter(t => t.agentRole !== 'observer' && t.cycleNumber === state.currentCycle!.number)
            .sort((a, b) => a.timestamp - b.timestamp);

          if (agentResults.length === 0) {
            console.log('❌ Нет результатов агентов для синтеза');
            set({ isRunning: false, error: 'Нет результатов для синтеза' });
            return;
          }

          const synthesisPrompt = `${state.agents.observer.systemPrompt}

ИСХОДНАЯ ТЕМА: "${state.currentCycle.topic}"

РЕЗУЛЬТАТЫ АНАЛИЗА АГЕНТОВ:
${agentResults.map(t => 
  `${state.agents[t.agentRole].name}:\nАНАЛИЗ: ${t.reasoning}\nВЫВОДЫ: ${t.essence}`
).join('\n\n---\n\n')}

[ФИНАЛЬНЫЙ СИНТЕЗ]
Создай всесторонний синтез всех результатов, выдели ключевые инсайты и сформулируй итоговые выводы.

[РЕКОМЕНДАЦИИ]
Предложи практические рекомендации на основе коллективного анализа.`;

          try {
            console.log('🔄 Отправка запроса на синтез с retry логикой...');
            set({ statusMessage: '🔄 ИИ-Наблюдатель синтезирует результаты...' });
            
            const response = await makeAPIRequestWithRetry('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': getOrigin(),
                'X-Title': 'NeuroAgent'
              },
              body: JSON.stringify({
                model: state.agents.observer.model,
                messages: [{ role: 'user', content: synthesisPrompt }],
                max_tokens: 4000, // Уменьшено для бесплатных моделей
                temperature: 0.7
              })
            }, 5, 3000); // 5 попыток, начальная задержка 3 секунды

            console.log('✅ Успешный ответ на синтез');

            const data = await response.json();
            const synthesis = data.choices[0].message.content;

            // Создаем финальную мысль наблюдателя
            const synthesisTought: AgentThought = {
              id: `synthesis-${Date.now()}`,
              agentRole: 'observer',
              reasoning: synthesis,
              essence: synthesis.substring(0, 5000), // Суть для наблюдателя
              timestamp: Date.now(),
              cycleNumber: state.currentCycle.number,
              phase: 'convergence',
              confidence: 0.9
            };

            // Завершаем цикл
            set((prevState) => {
              if (!prevState.currentCycle) return prevState;
              
              const completedCycle = {
                ...prevState.currentCycle,
                thoughts: [...prevState.currentCycle.thoughts, synthesisTought],
                synthesis: synthesis,
                isComplete: true,
                endTime: Date.now(),
                cyclePhase: 'waiting' as const
              };

              const newState = {
                ...prevState,
                currentCycle: completedCycle,
                isRunning: false,
                cycleHistory: [...prevState.cycleHistory, completedCycle]
              };
              
              saveToStorage(newState);
              console.log('🎉 Цикл успешно завершен и сохранен в историю');
              
              // АВТОМАТИЧЕСКОЕ ПРОДОЛЖЕНИЕ В НЕПРЕРЫВНОМ РЕЖИМЕ
              if (prevState.continuousMode) {
                console.log('🔄 Непрерывный режим активен - запуск нового цикла через 3 секунды');
                setTimeout(() => {
                  const lastEssence = synthesisTought.essence;
                  const newTopic = `Развитие идей: ${lastEssence.substring(0, 100)}...`;
                  get().startCentralizedCycle(newTopic);
                }, 3000);
              } else {
                // Очищаем статус при завершении
                setTimeout(() => {
                  set({ statusMessage: null });
                }, 2000);
              }
              
              return newState;
            });

          } catch (error) {
            console.error('Ошибка при синтезе результатов:', error);
            set({ error: 'Ошибка при синтезе результатов', isRunning: false });
          }
        },

        suggestContinuation: async () => {
          const state = get();
          if (!state.currentCycle || !state.apiKey) return;

          try {
            const prompt = `
Проанализируй завершенный цикл коллективного анализа и предложи направления для продолжения исследования.

ТЕМА: ${state.currentCycle.topic}

РЕЗУЛЬТАТЫ АНАЛИЗА:
${state.currentCycle.thoughts.map(thought => 
  `${thought.agentRole}: ${thought.essence || thought.reasoning || 'Размышление'}`
).join('\n\n')}

${state.currentCycle.intermediateOutput ? `ПРОМЕЖУТОЧНЫЙ ВЫВОД:\n${state.currentCycle.intermediateOutput}\n\n` : ''}

Предложи конкретные направления для углубленного исследования (200-300 слов):
1. Какие аспекты требуют дополнительного анализа?
2. Какие новые вопросы возникли?
3. Какие связи можно исследовать глубже?
4. Предложи конкретную формулировку для следующего цикла

Будь конкретным и фокусируйся на практических направлениях.
            `;

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': getOrigin(),
                'X-Title': 'NeuroAgent'
              },
              body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0.8
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const continuationSuggestion = data.choices[0].message.content;

            set((prevState) => {
              if (!prevState.currentCycle) return prevState;
              const newState = {
                ...prevState,
                currentCycle: {
                  ...prevState.currentCycle,
                  continuationSuggestion: continuationSuggestion,
                  canContinue: true
                }
              };
              saveToStorage(newState);
              return newState;
            });

          } catch (error) {
            console.error('Ошибка при генерации предложения продолжения:', error);
          }
        },

        startContinuationCycle: (suggestion: string) => {
          const state = get();
          
          // Извлекаем конкретную формулировку для нового цикла из предложения
          const topicMatch = suggestion.match(/(?:новый цикл|следующий цикл|исследование|анализ).*?[:-]?\s*["«]?([^"«\n]+)["»]?/i);
          let newTopic = topicMatch ? topicMatch[1].trim() : suggestion.split('\n')[0];
          
          // Если не удалось извлечь, создаем на основе оригинальной темы
          if (!newTopic || newTopic.length < 10) {
            newTopic = `Углубленное исследование: ${state.currentCycle?.topic || 'продолжение анализа'}`;
          }

          // Сохраняем текущий цикл в историю если он еще не сохранен
          if (state.currentCycle && !state.cycleHistory.find(c => c.id === state.currentCycle!.id)) {
            set((prevState) => ({
              ...prevState,
              cycleHistory: [...prevState.cycleHistory, {
                ...prevState.currentCycle!,
                isComplete: true,
                timestamp: Date.now()
              }]
            }));
          }

          // Запускаем новый цикл
          get().startCentralizedCycle(newTopic);
        },

        // УПРАВЛЕНИЕ АГЕНТАМИ
        updateAgentActivity: (role: AgentRole, isActive: boolean) => {
          set((prevState) => {
            const updatedAgents = {
              ...prevState.agents,
              [role]: {
                ...prevState.agents[role],
                isActive: isActive
              }
            };
            const newState = {
              ...prevState,
              agents: updatedAgents
            };
            saveToStorage(newState);
            console.log(`🔄 Агент ${prevState.agents[role].name} ${isActive ? 'активирован' : 'деактивирован'}`);
            return newState;
          });
        },

        addCustomAgent: (agentConfig: Omit<AgentConfig, 'role'> & { role: string }) => {
          set((prevState) => {
            // Проверяем, что агент с таким role еще не существует
            if (prevState.agents[agentConfig.role as AgentRole]) {
              console.warn('Агент с таким role уже существует:', agentConfig.role);
              return prevState;
            }

            const newAgent: AgentConfig = {
              ...agentConfig,
              role: agentConfig.role as AgentRole,
              receivesFrom: 'observer',
              sendsTo: 'observer',
              isActive: true
            };

            const updatedAgents = {
              ...prevState.agents,
              [agentConfig.role]: newAgent
            };

            const newState = {
              ...prevState,
              agents: updatedAgents
            };
            
            saveToStorage(newState);
            console.log(`➕ Добавлен новый агент: ${newAgent.name} (${newAgent.role})`);
            return newState;
          });
        },

        removeCustomAgent: (role: string) => {
          set((prevState) => {
            // Защищаем стандартных агентов от удаления
            const protectedRoles = ['observer', 'geometer', 'physicist', 'perceptive', 'philosopher', 'integrator', 'trickster'];
            if (protectedRoles.includes(role)) {
              console.warn('Нельзя удалить стандартного агента:', role);
              return prevState;
            }

            const newAgents = { ...prevState.agents };
            delete newAgents[role as AgentRole];

            const newState = {
              ...prevState,
              agents: newAgents
            };
            
            saveToStorage(newState);
            console.log(`➖ Удален пользовательский агент: ${role}`);
            return newState;
          });
        },

        // Финализация цикла с сохранением в историю
        finalizeCycle: () => {
          const state = get();
          if (state.currentCycle) {
            // Получаем последний синтез от наблюдателя
            const observerSynthesis = state.currentCycle.thoughts
              .filter(t => t.agentRole === 'observer')
              .sort((a, b) => b.timestamp - a.timestamp)[0];
            
            // Сохраняем текущий цикл в историю перед завершением
            const completedCycle = {
              ...state.currentCycle,
              endTime: Date.now(),
              isComplete: true,
              synthesis: observerSynthesis?.essence || state.currentCycle.intermediateOutput || `Цикл ${state.currentCycle.number} завершен. Обработано ${state.currentCycle.thoughts.length} размышлений. Раундов: ${state.currentCycle.totalRounds}.`
            };
            
            console.log('Финализируем и сохраняем цикл:', completedCycle);
            
            set((prevState) => {
              const newState = {
                ...prevState,
                cycleHistory: [...prevState.cycleHistory, completedCycle],
                currentCycle: null, 
                activeAgent: null, 
                isRunning: false 
              };
              saveToStorage(newState);
              return newState;
            });
          } else {
            set({ 
              currentCycle: null, 
              activeAgent: null, 
              isRunning: false 
            });
          }
        }
    };
  },
    {
      name: 'mindloop-store'
    }
  )
); 