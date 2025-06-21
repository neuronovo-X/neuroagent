import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MessageSquare, ChevronRight, Eye, Calendar, Target, Users, Activity, Download, Sparkles, Zap } from 'lucide-react';
import { MindloopCycle } from '../stores/mindloopStore';
import HtmlExport from './HtmlExport';

interface CycleHistoryProps {
  cycles: MindloopCycle[];
  onClose: () => void;
}

const CycleHistory: React.FC<CycleHistoryProps> = ({ cycles, onClose }) => {
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());

  const formatDuration = (start: number, end?: number) => {
    const duration = (end || Date.now()) - start;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleCycle = (cycleId: string) => {
    const newExpanded = new Set(expandedCycles);
    if (newExpanded.has(cycleId)) {
      newExpanded.delete(cycleId);
    } else {
      newExpanded.add(cycleId);
    }
    setExpandedCycles(newExpanded);
  };

  const getAgentName = (role: string) => {
    const agentNames: { [key: string]: string } = {
      'observer': 'ИИ-Наблюдатель',
      'geometer': 'Геометр-Исследователь',
      'physicist': 'Физик-Теоретик',
      'perceptive': 'Перцептивный Аналитик',
      'philosopher': 'Философ-Переводчик',
      'integrator': 'Интегратор-Систематизатор',
      'trickster': 'Трикстер'
    };
    return agentNames[role] || role;
  };

  const getAgentColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'observer': '#e5e7eb',
      'geometer': '#3b82f6',
      'physicist': '#dc2626',
      'perceptive': '#f59e0b',
      'philosopher': '#10b981',
      'integrator': '#06b6d4',
      'trickster': '#ec4899'
    };
    return colors[role] || '#6b7280';
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

  const totalThoughts = cycles.reduce((sum, cycle) => sum + cycle.thoughts.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-8 overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.15))',
        backdropFilter: 'blur(25px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-7xl history-modal my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          minHeight: 'fit-content',
          height: 'auto'
        }}
      >
        {/* === ЗАГОЛОВОК === */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2))',
            }}
          />
          <div className="relative p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <MessageSquare className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    История циклов мышления
                  </h2>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium text-lg">{cycles.length} циклов</span>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-medium text-lg">{totalThoughts} размышлений</span>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium text-lg">7 агентов</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {cycles.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HtmlExport 
                      cycles={cycles} 
                      variant="all"
                      buttonText="📄 Экспорт всей истории"
                    />
                  </motion.div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* === СОДЕРЖИМОЕ === */}
        {cycles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.15))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <MessageSquare className="w-16 h-16 text-blue-400" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                История пуста
              </h3>
              
              <p className="text-gray-300 text-xl leading-relaxed">
                Завершенные циклы мышления появятся здесь
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-8 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <AnimatePresence>
              {[...cycles].reverse().map((cycle, index) => (
                <motion.div
                  key={cycle.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    {/* Заголовок цикла */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => toggleCycle(cycle.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                              style={{
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                              }}
                            >
                              #{cycle.number}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-3 truncate">
                                {cycle.topic}
                              </h3>
                              
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-blue-300">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">{formatDateTime(cycle.startTime ?? cycle.timestamp)}</span>
                                </div>
                                
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                
                                <div className="flex items-center gap-2 text-purple-300">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="font-medium">{cycle.thoughts.length} размышлений</span>
                                </div>
                                
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                
                                <div className="flex items-center gap-2 text-green-300">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">{formatDuration(cycle.startTime ?? cycle.timestamp, cycle.endTime)}</span>
                                </div>

                                {/* Индикатор раундов */}
                                {cycle.totalRounds && cycle.totalRounds > 1 && (
                                  <>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="flex items-center gap-2 text-orange-300">
                                      <Zap className="w-4 h-4" />
                                      <span className="font-medium">{cycle.totalRounds} раундов</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <motion.div
                              animate={{ rotate: expandedCycles.has(cycle.id) ? 90 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-blue-400"
                            >
                              <ChevronRight className="w-8 h-8" />
                            </motion.div>
                          </div>
                        </motion.button>
                        
                        {/* Кнопки действий */}
                        <div className="flex items-center gap-3 ml-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <HtmlExport 
                              cycle={cycle} 
                              variant="single" 
                              buttonText="📄 Экспорт"
                            />
                          </motion.div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCycle(cycle.id)}
                            className="px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                            style={{
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.15))',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            <Eye className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">
                              {expandedCycles.has(cycle.id) ? 'Скрыть' : 'Показать'}
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Развернутое содержимое */}
                    <AnimatePresence>
                      {expandedCycles.has(cycle.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="p-6 space-y-6">
                            {cycle.thoughts.map((thought, thoughtIndex) => (
                              <motion.div
                                key={thought.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: thoughtIndex * 0.1 }}
                                className="rounded-xl overflow-hidden"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2))',
                                  backdropFilter: 'blur(20px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                {/* Заголовок агента */}
                                <div 
                                  className="p-5 text-white"
                                  style={{ 
                                    background: `linear-gradient(135deg, ${getAgentColor(thought.agentRole)}CC, ${getAgentColor(thought.agentRole)}99)`
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl">
                                        {getAgentIcon(thought.agentRole)}
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-lg">{getAgentName(thought.agentRole)}</h4>
                                        <p className="text-sm opacity-90">{formatDateTime(thought.timestamp)}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="text-right">
                                      <span className="text-sm opacity-70 bg-white/10 px-3 py-1 rounded-lg">
                                        Размышление #{thoughtIndex + 1}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Содержимое мысли */}
                                <div className="p-6 space-y-6">
                                  {/* Рассуждение */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-purple-400" />
                                      </div>
                                      <h5 className="font-bold text-purple-400 text-lg">🧠 Рассуждение</h5>
                                    </div>
                                    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap bg-black/20 rounded-xl p-4 border border-white/10">
                                      {thought.reasoning}
                                    </div>
                                  </div>

                                  {/* Суть */}
                                  <div className="rounded-xl p-6"
                                    style={{
                                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1))',
                                      border: '1px solid rgba(139, 92, 246, 0.3)'
                                    }}
                                  >
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{
                                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                                        }}
                                      >
                                        <Sparkles className="w-4 h-4 text-white" />
                                      </div>
                                      <h5 className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-lg">✨ Суть</h5>
                                    </div>
                                    <div className="text-gray-100 leading-relaxed whitespace-pre-wrap font-medium">
                                      {thought.essence}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CycleHistory; 