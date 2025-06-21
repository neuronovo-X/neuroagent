import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowDown, Brain, Sparkles, Activity, MessageCircle } from 'lucide-react';
import { useMindloopStore, ThoughtStreamItem, UserComment } from '../stores/mindloopStore';

const ThoughtStream: React.FC = () => {
  const { currentCycle, agents, activeAgent, isLoading } = useMindloopStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Автоскролл к новым мыслям только если пользователь внизу
  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current && currentCycle?.thoughts.length) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [currentCycle?.thoughts, isAtBottom]);

  // Отслеживаем позицию скролла
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const threshold = 100;
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      setIsAtBottom(atBottom);
    }
  };

  // Принудительная прокрутка вниз
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAtBottom(true);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAgentIcon = (role: string) => {
    const icons: { [key: string]: string } = {
      'observer': '👁️',
      'geometer': '📐',
      'physicist': '⚛️',
      'perceptive': '🔍',
      'philosopher': '🧠',
      'integrator': '🔗',
      'trickster': '🎭'
    };
    return icons[role] || '🤖';
  };

  const getThoughts = (): ThoughtStreamItem[] => {
    if (!currentCycle) return [];
    // Сортируем от старых к новым (снизу вверх)
    return (currentCycle.thoughts as ThoughtStreamItem[]).sort((a, b) => a.timestamp - b.timestamp);
  };

  const isUserComment = (item: ThoughtStreamItem): item is UserComment => {
    return 'isUserComment' in item && item.isUserComment === true;
  };

  if (!currentCycle) {
    return (
      <div className="relative h-full overflow-hidden">
        {/* Красивый фон с градиентом */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl"></div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center max-w-md px-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Поток мыслей в ожидании
            </h3>
            
            <p className="text-gray-300 leading-relaxed text-lg">
              Запустите исследование, чтобы увидеть как коллективное сознание анализирует вашу тему
            </p>
            
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 flex justify-center space-x-2"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const thoughts = getThoughts();

  return (
    <div className="relative h-full overflow-hidden">
      {/* Красивый фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl"></div>
      
      <div className="relative h-full flex flex-col">
        {/* Красивый заголовок */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Поток мыслей
                </h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-400">Цикл #{currentCycle.number}</span>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">
                    Раунд {currentCycle.roundNumber}/{currentCycle.totalRounds}
                  </span>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">{thoughts.length} размышлений</span>
                  {isLoading && (
                    <>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                        <span className="text-sm text-green-400">Активно</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {!isAtBottom && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToBottom}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
                title="К новым сообщениям"
              >
                <div className="flex items-center space-x-2">
                  <ArrowDown className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Новые</span>
                </div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Промежуточный вывод */}
        {currentCycle?.intermediateOutput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-blue-500/30 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400">Промежуточный вывод</h3>
                <p className="text-sm text-gray-400">Результаты анализа на текущий момент</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-gray-300 leading-relaxed">
              {currentCycle.intermediateOutput}
            </div>
          </motion.div>
        )}

        {/* Предложение продолжения */}
        {currentCycle?.continuationSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-green-500/30 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-400">Предложение продолжения</h3>
                <p className="text-sm text-gray-400">Направления для дальнейшего исследования</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-gray-300 leading-relaxed">
              {currentCycle.continuationSuggestion}
            </div>
          </motion.div>
        )}

        {/* Список мыслей */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          <AnimatePresence>
            {thoughts.map((item, index) => {
              // Проверяем, является ли элемент пользовательским комментарием
              if (isUserComment(item)) {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="group"
                  >
                    <div className="relative">
                      {/* Карточка пользовательского комментария */}
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:border-green-500/50">
                        {/* Заголовок пользователя */}
                        <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/20 border-b border-green-500/20 p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <MessageCircle className="w-6 h-6 text-white" />
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-bold text-green-300">
                                  💬 Пользователь
                                </h3>
                                <p className="text-sm text-green-400/80">
                                  Комментарий в цикле
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-green-400/60">
                                {formatTimestamp(item.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Содержимое комментария */}
                        <div className="p-6">
                          <div className="bg-black/20 rounded-2xl p-6 border border-green-500/20">
                            <div className="text-white leading-relaxed whitespace-pre-wrap">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Обычная мысль агента
              const agent = agents[item.agentRole];
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                >
                  <div className="relative">
                    {/* Карточка мысли */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:border-white/30">
                      {/* Заголовок агента */}
                      <div 
                        className="p-6 text-white relative overflow-hidden"
                        style={{ 
                          background: `linear-gradient(135deg, ${agent.color}E6, ${agent.color}CC)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl">
                              {getAgentIcon(item.agentRole)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{agent.name}</h3>
                              <p className="text-sm opacity-90">{agent.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm opacity-90 font-medium">
                              {formatTimestamp(item.timestamp)}
                            </div>
                            <div className="text-xs opacity-70">
                              Размышление #{index + 1}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Содержимое */}
                      <div className="p-6 space-y-6">
                        {/* Получено от предыдущего - скрыто для интегратора */}

                        {/* Рассуждение - скрыто для ИИ-Наблюдателя */}
                        {item.agentRole !== 'observer' && (
                          <div>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Brain className="w-4 h-4 text-purple-400" />
                              </div>
                              <h4 className="font-semibold text-purple-400">🧠 Рассуждение</h4>
                            </div>
                            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                              {item.reasoning}
                            </div>
                          </div>
                        )}

                        {/* Суть */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {item.agentRole === 'observer' ? '👁️ Решение Мастера' : '✨ Суть'}
                            </h4>
                          </div>
                          <div className="text-gray-100 leading-relaxed whitespace-pre-wrap font-medium">
                            {item.essence}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Индикатор загрузки */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center p-8"
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
                  ></motion.div>
                  <div>
                    <p className="text-purple-400 font-semibold">Размышляет...</p>
                    <p className="text-sm text-gray-400">
                      {activeAgent ? agents[activeAgent]?.name : 'Коллективное сознание'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThoughtStream; 