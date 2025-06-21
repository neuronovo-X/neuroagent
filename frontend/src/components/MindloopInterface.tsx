import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  History, 
  MessageSquare,
  Zap,
  Target,
  Shuffle,
  Send,
  MessageCircle,
  RefreshCw,
  Repeat,
  Edit3
} from 'lucide-react';
import { useMindloopStore } from '../stores/mindloopStore';
import ThoughtStream from './ThoughtStream';
import CycleHistory from './CycleHistory';
import SettingsPanel from './SettingsPanel';

const MindloopInterface: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showNewCycleBox, setShowNewCycleBox] = useState(false);
  const [newCycleTopic, setNewCycleTopic] = useState('');

  // Refs для прокрутки к секциям
  const settingsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const {
    currentCycle,
    cycleHistory,
    agents,
    isRunning,
    isLoading,
    error,
    statusMessage,
    continuousMode,
    startCentralizedCycle,
    addUserComment,
    triggerTrickster,
    pauseCycle,
    stopCycle,
    updateAgentActivity,
    apiKey,
    enableContinuousMode,
    startContinuousCycle,
    suggestContinuation,
    startContinuationCycle
  } = useMindloopStore();

  const totalThoughts = cycleHistory.reduce((sum, cycle) => sum + cycle.thoughts.length, 0);
  const activeAgents = Object.values(agents).filter(agent => agent.isActive).length;

  const handleStart = () => {
    console.log('🚀 handleStart вызван');
    console.log('Тема:', topic.trim());
    console.log('API ключ установлен:', !!apiKey);
    console.log('Текущее состояние isRunning:', isRunning);
    
    if (!apiKey || apiKey.trim() === '') {
      alert('Необходимо установить API ключ в настройках! Откройте настройки и введите ваш OpenRouter API ключ.');
      return;
    }
    
    if (topic.trim()) {
      console.log('✅ Запускаем централизованный цикл');
      startCentralizedCycle(topic.trim());
      setTopic('');
    } else {
      console.log('❌ Пустая тема');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  const handleAddComment = () => {
    if (userComment.trim() && currentCycle) {
      addUserComment(userComment.trim());
      setUserComment('');
      setShowCommentBox(false);
    }
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleStartNewCycle = () => {
    if (newCycleTopic.trim()) {
      startCentralizedCycle(newCycleTopic.trim());
      setNewCycleTopic('');
      setShowNewCycleBox(false);
    }
  };

  const handleNewCycleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleStartNewCycle();
    }
  };

  const handleSuggestContinuation = async () => {
    await suggestContinuation();
  };

  const handleStartContinuation = () => {
    if (currentCycle?.continuationSuggestion) {
      startContinuationCycle(currentCycle.continuationSuggestion);
    }
  };

  // Функция для плавной прокрутки к секции
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  };

  // Обработчики кнопок навигации
  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    if (!showSettings) {
      setTimeout(() => scrollToSection(settingsRef), 100);
    }
  };

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      setTimeout(() => scrollToSection(historyRef), 100);
    }
  };

  // Функция для сортировки агентов - стандартные сначала, новые в конце
  const getSortedAgents = () => {
    const standardAgentOrder = ['observer', 'geometer', 'physicist', 'perceptive', 'philosopher', 'integrator', 'trickster'];
    const agentEntries = Object.entries(agents);
    
    // Разделяем на стандартных и пользовательских
    const standardAgents = agentEntries.filter(([role]) => standardAgentOrder.includes(role));
    const customAgents = agentEntries.filter(([role]) => !standardAgentOrder.includes(role));
    
    // Сортируем стандартных по заданному порядку
    standardAgents.sort(([roleA], [roleB]) => {
      return standardAgentOrder.indexOf(roleA) - standardAgentOrder.indexOf(roleB);
    });
    
    // Возвращаем стандартных агентов, затем пользовательских
    return [...standardAgents, ...customAgents];
  };

  return (
    <>
      {/* === СОВРЕМЕННЫЙ ХЕАДЕР === */}
      <div className="modern-header">
        <div className="brand-section">
          <div className="brand-icon">
            🧠
          </div>
          <div className="brand-text">
            <h1 className="brand-title">НейроАгент</h1>
            <p className="brand-subtitle">Нейроново × ЛАИ</p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">{cycleHistory.length}</div>
            <div className="stat-label">Циклы</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{totalThoughts}</div>
            <div className="stat-label">Мысли</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{activeAgents}</div>
            <div className="stat-label">Активны</div>
          </div>
        </div>

        <div className="controls-section">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHistoryClick}
            className="px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            title="История циклов"
          >
            <History className="w-5 h-5" />
            <span>История</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSettingsClick}
            className="px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-slate-500/20"
            style={{
              background: 'linear-gradient(135deg, #64748b, #475569)',
              boxShadow: '0 6px 16px rgba(100, 116, 139, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            title="Настройки системы"
          >
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </motion.button>
        </div>
      </div>

      {/* === СТАТУС СООБЩЕНИЯ === */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mx-4 mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 font-medium">{statusMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* === СЕКЦИЯ УПРАВЛЕНИЯ === */}
      <div className="control-section">
        <div className="control-header">
          <Target className="control-icon" />
          <h2 className="control-title">Запуск исследования</h2>
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите тему для коллективного анализа..."
          className="topic-input"
        />

        <div className="flex items-center gap-4">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={!topic.trim() || !apiKey}
              className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                (!topic.trim() || !apiKey) 
                  ? {
                      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                      boxShadow: '0 8px 24px rgba(107, 114, 128, 0.3)'
                    }
                  : {
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }
              }
              title={!apiKey ? 'Установите API ключ в настройках' : !topic.trim() ? 'Введите тему для анализа' : 'Запустить коллективный анализ'}
            >
              <Play className="w-6 h-6" />
              Запустить исследование
            </motion.button>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseCycle}
                className="px-5 py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-amber-500/20"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                title="Приостановить цикл"
              >
                <Pause className="w-4 h-4" />
                <span>Пауза</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopCycle}
                className="px-5 py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                title="Остановить цикл"
              >
                <Square className="w-4 h-4" />
                <span>Стоп</span>
              </motion.button>

              {/* Специальные кнопки */}
              {currentCycle && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerTrickster}
                  disabled={isLoading}
                  className="px-5 py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  title="Добавить хаос в дискурс"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Shuffle className="w-4 h-4" />
                  </motion.div>
                  <span>🎭 Хаос</span>
                </motion.button>
              )}

              {currentCycle && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="px-5 py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  title="Добавить комментарий в цикл"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 Комментарий</span>
                </motion.button>
              )}
            </div>
          )}

          {currentCycle && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Цикл #{currentCycle.number}: {currentCycle.topic}</span>
              
              {currentCycle.cyclePhase === 'analysis' && (
                <span className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs">
                  🔍 Анализ (Раунд {currentCycle.roundNumber})
                </span>
              )}
              
              {currentCycle.cyclePhase === 'execution' && (
                <span className="ml-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs">
                  ⚡ Выполнение (Раунд {currentCycle.roundNumber})
                </span>
              )}
              
              {currentCycle.cyclePhase === 'synthesis' && (
                <span className="ml-2 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-xs">
                  🔄 Синтез (Раунд {currentCycle.roundNumber})
                </span>
              )}
              
              {currentCycle.cyclePhase === 'evaluation' && (
                <span className="ml-2 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-xs">
                  🎯 Оценка завершенности (Раунд {currentCycle.roundNumber})
                </span>
              )}
              
              {currentCycle.cyclePhase === 'waiting' && (
                <span className="ml-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                  ⏳ Ожидает завершения ({currentCycle.totalRounds} раундов)
                </span>
              )}
              
              <span className="ml-2 px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-pink-400 text-xs">
                🎭 Хаос доступен
              </span>
              
              {/* Индикатор непрерывного режима */}
              {continuousMode && (
                <span className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs">
                  🔄 Непрерывный режим
                </span>
              )}
            </div>
          )}

          {/* === КНОПКИ ЗАВЕРШЕННОГО ЦИКЛА === */}
          {currentCycle && currentCycle.cyclePhase === 'waiting' && currentCycle.isComplete && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Цикл завершен</h3>
                  <p className="text-sm text-gray-400">Выберите действие для продолжения</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Кнопка нового цикла */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewCycleBox(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-xl text-green-400 hover:text-green-300 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  Новый цикл
                </motion.button>

                {/* Кнопка продолжения на основе синтеза */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startContinuousCycle()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Продолжить анализ
                </motion.button>

                {/* Кнопка предложения продолжения */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSuggestContinuation}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-xl text-purple-400 hover:text-purple-300 transition-all duration-300 disabled:opacity-50"
                >
                  <Target className="w-4 h-4" />
                  Предложить направления
                </motion.button>

                {/* Кнопка непрерывного режима */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => enableContinuousMode(!continuousMode)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-300 ${
                    continuousMode 
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400 hover:text-orange-300' 
                      : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  {continuousMode ? 'Отключить автоциклы' : 'Включить автоциклы'}
                </motion.button>
              </div>

              {/* Предложение продолжения */}
              {currentCycle.continuationSuggestion && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">Предложение для продолжения:</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{currentCycle.continuationSuggestion}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartContinuation}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 rounded-xl text-amber-400 hover:text-amber-300 transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />
                    Запустить предложенный цикл
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === БЛОК ВВОДА КОММЕНТАРИЯ === */}
        <AnimatePresence>
          {showCommentBox && currentCycle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="comment-box"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                margin: '1rem 0'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Добавить комментарий</h3>
                  <p className="text-sm text-gray-300">Ваше вмешательство в цикл #{currentCycle.number}</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  onKeyPress={handleCommentKeyPress}
                  placeholder="Введите ваш комментарий или направление для агентов..."
                  className="w-full h-24 bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>💡 Ctrl+Enter для отправки</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowCommentBox(false);
                        setUserComment('');
                      }}
                      className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 shadow-md hover:shadow-gray-500/20"
                      style={{
                        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Отмена
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={!userComment.trim()}
                      className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-emerald-500/20"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Добавить комментарий
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === БЛОК ВВОДА НОВОГО ЦИКЛА === */}
        <AnimatePresence>
          {showNewCycleBox && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="new-cycle-box"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                margin: '1rem 0'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Запустить новый цикл</h3>
                  <p className="text-sm text-gray-300">Введите тему для нового исследования</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={newCycleTopic}
                  onChange={(e) => setNewCycleTopic(e.target.value)}
                  onKeyPress={handleNewCycleKeyPress}
                  placeholder="Введите тему для нового цикла анализа..."
                  className="w-full h-24 bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>💡 Ctrl+Enter для запуска</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowNewCycleBox(false);
                        setNewCycleTopic('');
                      }}
                      className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 shadow-md hover:shadow-gray-500/20"
                      style={{
                        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Отмена
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartNewCycle}
                      disabled={!newCycleTopic.trim()}
                      className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-indigo-500/20"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Запустить цикл
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === ОТОБРАЖЕНИЕ ОШИБОК === */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">Ошибка:</span>
            </div>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </motion.div>
        )}

        {/* === ИНДИКАТОР ЗАГРУЗКИ === */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-3 text-blue-400"
          >
            <div className="loading-spinner" />
            <span>Агент размышляет...</span>
          </motion.div>
        )}
      </div>

      {/* === КОЛЛЕКТИВНОЕ СОЗНАНИЕ === */}
      <div className="agents-section">
        <div className="agents-header">
          <div className="agents-title">
            <h2>Коллективное сознание</h2>
          </div>
          <p>Специализированные ИИ-агенты для многоуровневого анализа</p>
        </div>

        <div className="agents-grid">
          {getSortedAgents().map(([role, agent]) => {
            // Защищенные агенты (нельзя отключить)
            const protectedAgents = ['observer', 'integrator', 'trickster'];
            const isProtected = protectedAgents.includes(role);
            
            return (
              <motion.div
                key={role}
                className="modern-agent-card animate-slide-up"
                style={{ '--agent-color': agent.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.random() * 0.2 }}
              >
                <div className="agent-header">
                  <div className="agent-avatar" style={{ background: agent.color }}>
                    {agent.name.charAt(0)}
                    <div className={`agent-status ${agent.isActive ? 'active' : 'waiting'}`} />
                  </div>
                  <div className="agent-info">
                    <h3>{agent.name}</h3>
                    <p>{agent.model}</p>
                  </div>
                  
                  {/* Переключатель активности для непротектированных агентов */}
                  {!isProtected && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateAgentActivity(role as any, !agent.isActive)}
                      disabled={isRunning}
                      className={`agent-toggle-button ${agent.isActive ? 'active' : 'inactive'} ${
                        isRunning ? 'disabled' : ''
                      }`}
                      title={`${agent.isActive ? 'Отключить' : 'Включить'} агента`}
                    >
                      <motion.div
                        animate={{ x: agent.isActive ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="agent-toggle-slider"
                      />
                    </motion.button>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                  {agent.description}
                </p>
                
                {/* Статус агента */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    {agent.isActive ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>Активен</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        <span>Отключен</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Индикатор защищенного агента */}
                  {isProtected && (
                    <div className="text-xs text-yellow-400 flex items-center gap-1">
                      <span>🔒</span>
                      <span>Системный</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === ПОТОК МЫСЛЕЙ === */}
      {currentCycle && (
        <div className="thoughts-section">
          <div className="thoughts-header">
            <div className="thoughts-title">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <span>Поток мыслей в ожидании</span>
            </div>
          </div>
          
          <ThoughtStream />
        </div>
      )}

      {/* === МОДАЛЬНЫЕ ОКНА === */}
      <AnimatePresence>
        {showSettings && (
          <div ref={settingsRef}>
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <div ref={historyRef}>
            <CycleHistory 
              cycles={cycleHistory}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MindloopInterface; 