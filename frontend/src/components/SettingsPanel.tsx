import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Settings, 
  Sparkles, 
  ChevronDown, 
  ChevronRight,
  Edit3, 
  Trash2, 
  Plus, 
  RotateCcw,
  Bot,
  Zap,
  Users,
  Database,
  Shield
} from 'lucide-react';
import { useMindloopStore } from '../stores/mindloopStore';
import { AgentRole, AIModel } from '../stores/mindloopStore';

interface SettingsPanelProps {
  onClose: () => void;
}

type TabType = 'general' | 'agents' | 'models' | 'create' | 'advanced';

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [expandedAgents, setExpandedAgents] = useState<Set<AgentRole>>(new Set());
  const [editingPrompts, setEditingPrompts] = useState<Set<AgentRole>>(new Set());
  const [tempPrompts, setTempPrompts] = useState<Record<AgentRole, string>>({} as Record<AgentRole, string>);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [showCreateModelModal, setShowCreateModelModal] = useState(false);
  
  // Состояние для создания нового агента
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    model: '',
    systemPrompt: ''
  });

  // Состояние для создания новой модели  
  const [newModel, setNewModel] = useState({
    id: '',
    name: '',
    provider: '',
    context: '',
    description: ''
  });

  const { 
    apiKey, 
    setApiKey, 
    autoAdvance, 
    setAutoAdvance, 
    cycleDelay, 
    setCycleDelay,
    agents,
    updateAgentModel,
    updateAgentActivity,

    addCustomModel,
    removeCustomModel,
    getAllModels,
    updateAgentPrompt,
    initializeAgents,
    addCustomAgent,
    removeCustomAgent,
    applyModelPreset,
    getModelPresets
  } = useMindloopStore();

  const tabs = [
    { id: 'general', label: 'Основные', icon: Settings, color: 'from-blue-500 to-cyan-500' },
    { id: 'agents', label: 'Агенты', icon: Bot, color: 'from-purple-500 to-pink-500' },
    { id: 'models', label: 'Модели', icon: Database, color: 'from-green-500 to-emerald-500' },
    { id: 'create', label: 'Создать', icon: Plus, color: 'from-pink-500 to-rose-500' },
    { id: 'advanced', label: 'Дополнительно', icon: Shield, color: 'from-orange-500 to-red-500' }
  ];

  const agentColors = [
    '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', 
    '#f59e0b', '#ec4899', '#06b6d4'
  ];

  const getAgentIcon = (role: AgentRole) => {
    const icons = {
      observer: '👁️',
      geometer: '📐', 
      physicist: '⚛️',
      perceptive: '🔍',
      philosopher: '🧠',
      integrator: '🔗',
      trickster: '🎭'
    };
    return icons[role] || '🤖';
  };

  const handleSaveSettings = () => {
    console.log('Настройки сохранены');
    onClose();
  };

  const handleCreateAgent = () => {
    if (!newAgentData.name || !newAgentData.model || !newAgentData.systemPrompt) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const role = newAgentData.name.toLowerCase()
      .replace(/[^a-zа-я0-9]/gi, '')
      .substring(0, 20);

    const newAgent = {
      role: role,
      name: newAgentData.name,
      description: newAgentData.description,
      color: newAgentData.color,
      systemPrompt: newAgentData.systemPrompt,
      model: newAgentData.model,
      receivesFrom: null,
      sendsTo: null,
      isActive: true
    };

    addCustomAgent(newAgent);
    
    setNewAgentData({
      name: '',
      description: '',
      color: '#3b82f6',
      model: '',
      systemPrompt: ''
    });
    setShowCreateAgentModal(false);
    
    console.log('Новый агент создан:', newAgent);
  };

  const handleAddCustomModel = () => {
    if (newModel.id && newModel.name && newModel.provider && newModel.context) {
      const customModel: AIModel = {
        ...newModel,
        isCustom: true,
        isFree: false
      };
      addCustomModel(customModel);
      setNewModel({ id: '', name: '', provider: '', context: '', description: '' });
      setShowCreateModelModal(false);
    }
  };

  const groupedModels = () => {
    const models = getAllModels();
    return {
      free: models.filter(m => m.isFree && !m.isCustom),
      premium: models.filter(m => !m.isFree && !m.isCustom),
      custom: models.filter(m => m.isCustom)
    };
  };

  const renderGeneralTab = () => (
    <div className="space-y-8">
      {/* API Ключ */}
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-emerald-500/20"
      style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">API Ключ</h3>
            <p className="text-sm text-gray-400">OpenRouter API для работы с моделями ИИ</p>
          </div>
        </div>
        
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите ваш OpenRouter API ключ"
          className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
        />
      </motion.div>

      {/* Автопродвижение */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-orange-500/20"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))'
        }}
      >
            <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
              <h3 className="text-lg font-bold text-white">Автопродвижение</h3>
              <p className="text-sm text-gray-400">Автоматический переход между агентами</p>
                </div>
              </div>
              
              <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              autoAdvance ? 'bg-orange-500' : 'bg-gray-600'
            }`}
          >
            <motion.div
              animate={{ x: autoAdvance ? 32 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
            />
              </motion.button>
            </div>
      </motion.div>

      {/* Задержка циклов */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-cyan-500/20"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05))'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
            <h3 className="text-lg font-bold text-white">Задержка циклов</h3>
            <p className="text-sm text-gray-400">{cycleDelay}мс между переходами агентов</p>
                </div>
              </div>
              
                <div className="relative">
                  <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={cycleDelay}
            onChange={(e) => setCycleDelay(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1с</span>
            <span>5.5с</span>
            <span>10с</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAgentsTab = () => (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div>
        <h2 className="text-2xl font-bold text-white">Управление агентами</h2>
        <p className="text-gray-400">Настройка активности и конфигураций агентов</p>
                </div>
                
      {/* Сетка агентов */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Object.values(agents).map((agent, index) => {
          const currentModel = getAllModels().find(m => m.id === agent.model);
          
          return (
            <motion.div
              key={agent.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-black/30 rounded-xl border transition-all duration-300 ${
                agent.isActive ? 'border-white/20 hover:border-white/30' : 'border-gray-600/20 opacity-60'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg"
                      style={{ backgroundColor: agent.color }}
                    >
                      {getAgentIcon(agent.role)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{agent.name}</h4>
                      <p className="text-sm text-gray-400">{agent.description}</p>
                    </div>
                  </div>
                  
                  {/* Переключатель активности */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateAgentActivity(agent.role, !agent.isActive)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      agent.isActive ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: agent.isActive ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </motion.button>
            </div>

                {/* Информация о модели */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-3 py-1 bg-white/10 rounded-lg text-gray-300 font-medium">
                    {currentModel?.provider || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {currentModel?.name || agent.model.split('/').pop()}
                  </span>
                  {currentModel?.isFree && <span className="text-xs text-green-400">🆓</span>}
                  {!currentModel?.isFree && <span className="text-xs text-yellow-400">💎</span>}
                </div>
                
                {/* Кнопки действий */}
                <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newExpanded = new Set(expandedAgents);
                      if (newExpanded.has(agent.role)) {
                        newExpanded.delete(agent.role);
                      } else {
                        newExpanded.add(agent.role);
                      }
                      setExpandedAgents(newExpanded);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Настройки
                    {expandedAgents.has(agent.role) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                </motion.button>
              
                  {/* Кнопка удаления для пользовательских агентов */}
                  {!['observer', 'geometer', 'physicist', 'perceptive', 'philosopher', 'integrator', 'trickster'].includes(agent.role) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm(`Удалить агента "${agent.name}"?`)) {
                          removeCustomAgent(agent.role);
                        }
                      }}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                          </div>
                        </div>
                        
              {/* Развернутые настройки */}
              <AnimatePresence>
                    {expandedAgents.has(agent.role) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    className="border-t border-white/10 p-6 space-y-4"
                      >
                    {/* Выбор модели */}
                          <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Модель ИИ</label>
                            <select
                              value={agent.model}
                              onChange={(e) => updateAgentModel(agent.role, e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                      >
                        <optgroup label="🆓 БЕСПЛАТНЫЕ">
                          {groupedModels().free.map((model) => (
                            <option key={model.id} value={model.id}>
                              🆓 {model.provider} - {model.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="💎 ПРЕМИУМ">
                          {groupedModels().premium.map((model) => (
                            <option key={model.id} value={model.id}>
                              💎 {model.provider} - {model.name}
                            </option>
                          ))}
                        </optgroup>
                        {groupedModels().custom.length > 0 && (
                          <optgroup label="⚙️ ПОЛЬЗОВАТЕЛЬСКИЕ">
                            {groupedModels().custom.map((model) => (
                              <option key={model.id} value={model.id}>
                                ⚙️ {model.provider} - {model.name}
                                </option>
                              ))}
                          </optgroup>
                        )}
                            </select>
                          </div>
                          
                    {/* Редактирование промпта */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Системный промпт</label>
                        {!editingPrompts.has(agent.role) ? (
                          <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                                             setEditingPrompts(prev => new Set(Array.from(prev).concat([agent.role])));
                              setTempPrompts(prev => ({
                                ...prev,
                                [agent.role]: agent.systemPrompt
                              }));
                            }}
                            className="px-3 py-2 rounded-lg text-white text-xs font-medium transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-blue-500/20"
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                            Редактировать
                          </motion.button>
                        ) : (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                updateAgentPrompt(agent.role, tempPrompts[agent.role] || '');
                                setEditingPrompts(prev => {
                                  const next = new Set(prev);
                                  next.delete(agent.role);
                                  return next;
                                });
                              }}
                              className="px-3 py-2 rounded-lg text-white text-xs font-medium transition-all duration-300 shadow-md hover:shadow-emerald-500/20"
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              Сохранить
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setEditingPrompts(prev => {
                                  const next = new Set(prev);
                                  next.delete(agent.role);
                                  return next;
                                });
                              }}
                              className="px-3 py-2 rounded-lg text-white text-xs font-medium transition-all duration-300 shadow-md hover:shadow-gray-500/20"
                              style={{
                                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                                boxShadow: '0 4px 12px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              Отмена
                            </motion.button>
                          </div>
                        )}
                      </div>
                      
                      {editingPrompts.has(agent.role) ? (
                        <textarea
                          value={tempPrompts[agent.role] || ''}
                          onChange={(e) => setTempPrompts(prev => ({
                            ...prev,
                            [agent.role]: e.target.value
                          }))}
                          className="w-full h-32 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-mono leading-relaxed focus:border-blue-400 focus:outline-none resize-none"
                          placeholder="Введите системный промпт..."
                        />
                      ) : (
                        <div className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-gray-300 font-mono leading-relaxed max-h-32 overflow-y-auto">
                          {agent.systemPrompt || 'Промпт не задан'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                      </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderModelsTab = () => (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Управление моделями</h2>
          <p className="text-gray-400">Пресеты моделей и пользовательские настройки</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModelModal(true)}
          className="px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <Plus className="w-4 h-4" />
          Добавить модель
        </motion.button>
      </div>

      {/* ПРЕСЕТЫ МОДЕЛЕЙ */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">🎯 Пресеты моделей</h3>
        <div className="grid gap-4">
          {getModelPresets().map((preset) => (
            <motion.div 
              key={preset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => {
                applyModelPreset(preset.id);
                console.log(`Применен пресет: ${preset.name}`);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg">{preset.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(preset.models).slice(0, 3).map(([role, model]) => (
                      <span key={role} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {model.split('/')[1]?.split(':')[0] || model}
                      </span>
                    ))}
                    {Object.keys(preset.models).length > 3 && (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">
                        +{Object.keys(preset.models).length - 3} еще
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 rounded-lg text-white font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Применить
                </motion.button>
              </div>
            </motion.div>
                ))}
              </div>
            </div>

      {/* Статистика моделей */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{groupedModels().free.length}</div>
          <div className="text-sm text-gray-300">🆓 Бесплатные</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{groupedModels().premium.length}</div>
          <div className="text-sm text-gray-300">💎 Премиум</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{groupedModels().custom.length}</div>
          <div className="text-sm text-gray-300">⚙️ Пользовательские</div>
        </div>
                </div>

      {/* Список пользовательских моделей */}
      {groupedModels().custom.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Ваши модели</h3>
          <div className="space-y-3">
            {groupedModels().custom.map((model) => (
              <motion.div 
                key={model.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 border border-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-white">{model.name}</h4>
                  <p className="text-sm text-gray-400">
                    ID: {model.id} • Контекст: {model.context}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeCustomModel(model.id)}
                  className="p-2.5 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-red-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCreateTab = () => (
    <div className="space-y-8">
      {/* Создание агента */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-pink-500/20"
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05))'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Создание агента</h3>
            <p className="text-sm text-gray-400">Добавление пользовательского ИИ-агента в систему</p>
                </div>
              </div>
              
                  <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateAgentModal(true)}
          className="w-full px-4 py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-pink-500/20"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <Plus className="w-5 h-5" />
          Создать нового агента
        </motion.button>
      </motion.div>

      {/* Создание модели */}
                    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-green-500/20"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Создание модели</h3>
            <p className="text-sm text-gray-400">Добавление пользовательской ИИ-модели</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModelModal(true)}
          className="w-full px-4 py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/20"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <Plus className="w-5 h-5" />
          Добавить новую модель
                  </motion.button>
      </motion.div>

      {/* Статистика создания */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-blue-500/20"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))'
        }}
      >
        <h3 className="text-lg font-bold text-white mb-4">📊 Статистика</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {Object.keys(agents).length}
            </div>
            <div className="text-sm text-gray-400">Всего агентов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {getAllModels().filter(m => m.isCustom).length}
            </div>
            <div className="text-sm text-gray-400">Пользовательских моделей</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
                  <div>
        <h2 className="text-2xl font-bold text-white mb-2">Дополнительные настройки</h2>
        <p className="text-gray-400">Сброс конфигураций и системные операции</p>
      </div>

      {/* Кнопки сброса */}
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Активируем всех агентов кроме трикстера
            Object.keys(agents).forEach(role => {
              if (role !== 'trickster') {
                updateAgentActivity(role as AgentRole, true);
              }
            });
            console.log('Все агенты (кроме Трикстера) активированы');
          }}
          className="w-full px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-5 h-5" />
            <span className="font-medium">Активировать всех агентов</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            initializeAgents();
            console.log('Конфигурация агентов сброшена');
          }}
          className="w-full px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <RotateCcw className="w-5 h-5" />
            <span className="font-medium">Сбросить конфигурацию агентов</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Применяем стабильный бесплатный пресет
            applyModelPreset('free');
            console.log('✅ Применен стабильный бесплатный пресет');
            alert('Применен стабильный пресет бесплатных моделей!');
          }}
          className="w-full px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Применить стабильный пресет</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Исправляем модели на рабочие бесплатные
            Object.keys(agents).forEach(role => {
              const agentRole = role as AgentRole;
              const correctModel = agentRole === 'trickster' ? 'meta-llama/llama-3.2-1b-instruct:free' : 'meta-llama/llama-3.1-8b-instruct:free';
              updateAgentModel(agentRole, correctModel);
            });
            console.log('✅ Все модели исправлены на рабочие бесплатные');
            alert('Модели агентов исправлены на рабочие бесплатные!');
          }}
          className="w-full px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Исправить модели вручную</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Очистить кэш и перезагрузить</span>
          </div>
        </motion.button>
                  </div>
                </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Фон */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Модальное окно */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl mx-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Хеадер */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Настройки системы</h2>
                <p className="text-gray-400">Конфигурация НейроАгент</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
                </div>
                
          {/* Табы */}
          <div className="flex space-x-2 mt-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
              </div>
            </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'general' && renderGeneralTab()}
              {activeTab === 'agents' && renderAgentsTab()}
              {activeTab === 'models' && renderModelsTab()}
              {activeTab === 'create' && renderCreateTab()}
              {activeTab === 'advanced' && renderAdvancedTab()}
            </motion.div>
          </AnimatePresence>
                </div>

        {/* Футер */}
        <div className="p-6 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            className="w-full px-6 py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/20"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <Save className="w-5 h-5" />
            Сохранить настройки
          </motion.button>
                </div>
      </motion.div>

      {/* Модальное окно создания агента */}
      <AnimatePresence>
        {showCreateAgentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Создать нового агента</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateAgentModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Имя агента *</label>
                    <input
                      type="text"
                      value={newAgentData.name}
                      onChange={(e) => setNewAgentData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                      placeholder="Например: Аналитик"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Цвет</label>
                    <div className="flex space-x-2">
                      {agentColors.map(color => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewAgentData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-lg ${
                            newAgentData.color === color ? 'ring-2 ring-white' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
                  <input
                    type="text"
                    value={newAgentData.description}
                    onChange={(e) => setNewAgentData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                    placeholder="Краткое описание функций агента"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Модель ИИ *</label>
                  <select
                    value={newAgentData.model}
                    onChange={(e) => setNewAgentData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Выберите модель</option>
                    <optgroup label="🆓 БЕСПЛАТНЫЕ">
                      {groupedModels().free.map((model) => (
                        <option key={model.id} value={model.id}>
                          🆓 {model.provider} - {model.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="💎 ПРЕМИУМ">
                      {groupedModels().premium.map((model) => (
                        <option key={model.id} value={model.id}>
                          💎 {model.provider} - {model.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Системный промпт *</label>
                  <textarea
                    value={newAgentData.systemPrompt}
                    onChange={(e) => setNewAgentData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    className="w-full h-32 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none resize-none"
                    placeholder="Опишите роль и задачи агента..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateAgent}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Создать агента</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateAgentModal(false)}
                  className="px-6 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-gray-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    boxShadow: '0 8px 20px rgba(107, 114, 128, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Отмена
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно создания модели */}
      <AnimatePresence>
        {showCreateModelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Добавить новую модель</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModelModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID модели *</label>
                  <input
                    type="text"
                    value={newModel.id}
                    onChange={(e) => setNewModel(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                    placeholder="custom/my-model"
                  />
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название *</label>
                  <input
                    type="text"
                    value={newModel.name}
                    onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                    placeholder="My Custom Model"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Провайдер *</label>
                  <input
                    type="text"
                    value={newModel.provider}
                    onChange={(e) => setNewModel(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                    placeholder="Custom Provider"
                  />
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Контекст *</label>
                  <input
                    type="text"
                    value={newModel.context}
                    onChange={(e) => setNewModel(prev => ({ ...prev, context: e.target.value }))}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                    placeholder="128K"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
                <textarea
                  value={newModel.description}
                  onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-20 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none resize-none"
                  placeholder="Описание модели (опционально)"
                />
            </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddCustomModel}
                  disabled={!newModel.id || !newModel.name || !newModel.provider || !newModel.context}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Добавить модель
                </motion.button>
            <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModelModal(false)}
                  className="px-6 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-gray-500/20"
                  style={{
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    boxShadow: '0 8px 20px rgba(107, 114, 128, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Отмена
            </motion.button>
        </div>
      </motion.div>
    </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPanel; 