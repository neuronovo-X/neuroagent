import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles } from 'lucide-react';
import { AgentConfig } from '../stores/mindloopStore';

interface AgentCardProps {
  agent: AgentConfig;
  isActive: boolean;
  isLoading: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, isLoading }) => {
  // Проверяем, неактивен ли агент по конфигурации
  const isAgentInactive = !agent.isActive;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        y: -3,
        transition: { duration: 0.2 }
      }}
      className={`
        relative glass-panel-elevated transition-all duration-500 group cursor-pointer overflow-hidden
        ${isActive 
          ? 'ring-2 ring-opacity-50 shadow-2xl' 
          : 'hover:shadow-xl'
        }
        ${isAgentInactive ? 'opacity-60' : ''}
      `}
      style={{ 
        background: isActive 
          ? `linear-gradient(135deg, ${agent.color}25 0%, ${agent.color}10 50%, transparent 100%)`
          : isAgentInactive 
          ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.2) 0%, rgba(55, 65, 81, 0.1) 50%, transparent 100%)'
          : undefined
      }}
    >      
      {/* Эффект свечения для активного агента */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl opacity-10 blur-xl pointer-events-none"
          style={{ background: agent.color }}
        />
      )}
      
      {/* Активный индикатор - СТАБИЛЬНЫЙ */}
      {isActive && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-lg z-20"
          style={{ 
            background: agent.color,
            boxShadow: `0 0 8px ${agent.color}`
          }}
        />
      )}
      
      {/* Заголовок и аватар */}
      <div className="flex items-center space-x-4 mb-4 relative z-10">
        {/* ПРЕМИАЛЬНЫЙ АВАТАР */}
        <div className="relative">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-2xl relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${agent.color}, ${agent.color}aa)` 
            }}
            animate={isActive ? { 
              boxShadow: [
                `0 0 20px ${agent.color}40`,
                `0 0 30px ${agent.color}60`,
                `0 0 20px ${agent.color}40`
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {agent.name.charAt(0)}
            
            {/* Загрузочный оверлей */}
            {isLoading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Пульсирующее кольцо */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 opacity-60"
              style={{ borderColor: agent.color }}
              animate={{ 
                scale: [1, 1.4, 1], 
                opacity: [0.6, 0, 0.6] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        {/* Информация об агенте */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`font-bold text-base transition-all duration-300 leading-tight ${
              isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
            }`}>
              {agent.name}
            </h3>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            )}
          </div>
          
          {/* Модель - СТИЛЬНЫЙ БЕЙДЖ */}
          <motion.div 
            className="inline-flex items-center px-2 py-1 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xs text-gray-300 font-mono font-medium">
              {agent.model.split('/').pop()?.split('-')[0] || 'AI'}
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* Описание */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-2 relative z-10 group-hover:text-gray-200 transition-colors">
        {agent.description}
      </p>
      
      {/* Статус - УЛУЧШЕННЫЙ */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-sm bg-white/5 border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{ 
                background: isAgentInactive
                  ? '#6b7280'
                  : isActive 
                  ? `linear-gradient(135deg, #10b981, ${agent.color})` 
                  : '#6b7280' 
              }}
              animate={isActive && !isAgentInactive ? { 
                boxShadow: [
                  `0 0 5px ${agent.color}`,
                  `0 0 10px ${agent.color}`,
                  `0 0 5px ${agent.color}`
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={`text-xs font-medium transition-colors ${
              isAgentInactive
                ? 'text-gray-500'
                : isActive 
                ? 'text-green-300' 
                : 'text-gray-400'
            }`}>
              {isAgentInactive ? 'Неактивен' : isActive ? 'Размышляет' : 'Ожидает'}
            </span>
          </motion.div>
        </div>
        
        {/* Индикатор активности */}
        {isActive && !isAgentInactive && (
          <motion.div
            className="flex items-center space-x-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-3 h-3" style={{ color: agent.color }} />
            <span className="text-xs text-gray-300">Активен</span>
          </motion.div>
        )}
        
        {/* Индикатор для неактивного агента */}
        {isAgentInactive && (
          <motion.div
            className="flex items-center space-x-1"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-gray-500">Только по кнопке</span>
          </motion.div>
        )}
      </div>
      
      {/* Декоративный градиент внизу */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px opacity-60"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)` 
        }}
        animate={isActive ? { opacity: [0.3, 0.8, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Анимированная полоса загрузки */}
      {isActive && isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
          style={{ background: agent.color }}
          animate={{ 
            width: ['0%', '100%', '0%'],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

export default AgentCard; 