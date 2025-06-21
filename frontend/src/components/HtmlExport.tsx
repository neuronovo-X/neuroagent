import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { MindloopCycle } from '../stores/mindloopStore';

interface HtmlExportProps {
  cycle?: MindloopCycle;
  cycles?: MindloopCycle[];
  buttonText?: string;
  variant?: 'single' | 'all';
}

const HtmlExport: React.FC<HtmlExportProps> = ({ 
  cycle, 
  cycles, 
  buttonText, 
  variant = 'all' 
}) => {

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgentName = (role: string): string => {
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

  const getAgentColor = (role: string): string => {
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

  const generateHtmlContent = (cycleData: MindloopCycle): string => {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>НейроАгент - Цикл #${cycleData.number}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .cycle-info {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .cycle-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .cycle-topic {
            font-size: 1.2rem;
            margin-bottom: 15px;
            background: rgba(255,255,255,0.3);
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #fbbf24;
        }
        
        .cycle-meta {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
            border-radius: 2px;
        }
        
        .thought-card {
            background: #f8fafc;
            border-radius: 15px;
            margin-bottom: 30px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
        }
        
        .thought-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }
        
        .thought-header {
            padding: 20px;
            color: white;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .agent-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .thought-content {
            padding: 25px;
        }
        
        .context-section {
            background: #f1f5f9;
            border-left: 4px solid #06b6d4;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 0 10px 10px 0;
        }
        
        .context-title {
            font-weight: 600;
            color: #0f766e;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .reasoning-section {
            margin-bottom: 20px;
        }
        
        .reasoning-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .reasoning-content {
            line-height: 1.8;
            color: #374151;
            white-space: pre-line;
        }
        
        .essence-section {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .essence-title {
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .essence-content {
            line-height: 1.6;
            white-space: pre-line;
        }
        
        .footer {
            background: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-brand {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .footer-meta {
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .action-buttons {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        .action-btn {
            background: rgba(139, 92, 246, 0.9);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .action-btn:hover {
            background: rgba(139, 92, 246, 1);
            transform: translateY(-2px);
        }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .thought-card:hover { transform: none; }
            .action-buttons { display: none; }
        }
        
        @media (max-width: 768px) {
            .header { padding: 20px; }
            .content { padding: 20px; }
            .cycle-meta { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="action-buttons">
        <button class="action-btn" onclick="window.print()">🖨️ Печать</button>
        <button class="action-btn" onclick="navigator.share ? navigator.share({title: document.title, url: window.location.href}) : alert('Функция поделиться не поддерживается')">📤 Поделиться</button>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="logo">🧠 НейроАгент</div>
                <div class="subtitle">Система коллективного сознания</div>
                
                <div class="cycle-info">
                    <div class="cycle-title">Цикл #${cycleData.number}</div>
                    <div class="cycle-topic">📋 ${cycleData.topic}</div>
                    <div class="cycle-meta">
                        <div>🕐 Начало: ${formatDate(cycleData.startTime ?? cycleData.timestamp)}</div>
                        ${cycleData.endTime ? `<div>✅ Завершение: ${formatDate(cycleData.endTime)}</div>` : ''}
                        <div>💭 Размышлений: ${cycleData.thoughts.length}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="content">
            <h2 class="section-title">Размышления Агентов</h2>
            
            ${cycleData.thoughts.map(thought => `
                <div class="thought-card">
                    <div class="thought-header" style="background: ${getAgentColor(thought.agentRole)};">
                        <div class="agent-icon">🤖</div>
                        <div>
                            <div>${getAgentName(thought.agentRole)}</div>
                            <div style="font-size: 0.85rem; opacity: 0.9;">${formatDate(thought.timestamp)}</div>
                        </div>
                    </div>
                    
                    <div class="thought-content">
                        <!-- Полный контекст цикла скрыт для интегратора -->
                        
                        <div class="reasoning-section">
                            <div class="reasoning-title">🧠 Рассуждение</div>
                            <div class="reasoning-content">${thought.reasoning}</div>
                        </div>
                        
                        <div class="essence-section">
                            <div class="essence-title">✨ Суть</div>
                            <div class="essence-content">${thought.essence}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <div class="footer-brand">НейроАгент - Нейроново × ЛАИ</div>
            <div class="footer-meta">Экспорт создан: ${formatDate(Date.now())}</div>
        </div>
    </div>
</body>
</html>`;
  };

  const generateAllCyclesHtml = (cyclesData: MindloopCycle[]): string => {
    const totalThoughts = cyclesData.reduce((sum, cycle) => sum + cycle.thoughts.length, 0);
    
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>НейроАгент - Полная История</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .cycle-summary {
            background: #f8fafc;
            border-radius: 15px;
            margin-bottom: 30px;
            overflow: hidden;
            border-left: 5px solid #8b5cf6;
        }
        
        .cycle-header {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            padding: 20px;
        }
        
        .cycle-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .cycle-topic {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .cycle-content {
            padding: 20px;
        }
        
        .thought-summary {
            margin-bottom: 15px;
            padding: 15px;
            background: white;
            border-radius: 10px;
            border-left: 3px solid #06b6d4;
        }
        
        .thought-agent {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .thought-preview {
            color: #6b7280;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .footer {
            background: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="action-buttons">
        <button class="action-btn" onclick="window.print()">🖨️ Печать</button>
        <button class="action-btn" onclick="navigator.share ? navigator.share({title: document.title, url: window.location.href}) : alert('Функция поделиться не поддерживается')">📤 Поделиться</button>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="logo">🧠 НейроАгент</div>
            <div class="subtitle">Полная История Коллективного Разума</div>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${cyclesData.length}</div>
                    <div class="stat-label">Циклов</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${totalThoughts}</div>
                    <div class="stat-label">Размышлений</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">7</div>
                    <div class="stat-label">Агентов</div>
                </div>
            </div>
        </div>
        
        <div class="content">
            ${cyclesData.map(cycle => `
                <div class="cycle-summary">
                    <div class="cycle-header">
                        <div class="cycle-title">Цикл #${cycle.number}</div>
                        <div class="cycle-topic">${cycle.topic}</div>
                    </div>
                    
                    <div class="cycle-content">
                        ${cycle.thoughts.slice(0, 3).map(thought => `
                            <div class="thought-summary">
                                <div class="thought-agent">${getAgentName(thought.agentRole)}</div>
                                <div class="thought-preview">${thought.essence.substring(0, 200)}${thought.essence.length > 200 ? '...' : ''}</div>
                            </div>
                        `).join('')}
                        
                        ${cycle.thoughts.length > 3 ? `
                            <div style="text-align: center; color: #6b7280; font-style: italic; margin-top: 15px;">
                                ... и еще ${cycle.thoughts.length - 3} размышлений
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 10px;">НейроАгент - Нейроново × ЛАИ</div>
            <div style="font-size: 0.9rem; opacity: 0.7;">Экспорт создан: ${formatDate(Date.now())}</div>
        </div>
    </div>
</body>
</html>`;
  };

  const handleExport = async () => {
    try {
      let htmlContent: string;
      let filename: string;

      if (variant === 'single' && cycle) {
        htmlContent = generateHtmlContent(cycle);
        filename = `neuroagent-цикл-${cycle.number}.html`;
      } else if (variant === 'all' && cycles) {
        htmlContent = generateAllCyclesHtml(cycles);
        filename = `neuroagent-полная-история.html`;
      } else {
        console.error('Неверные параметры для экспорта HTML');
        return;
      }

      // Создаем и скачиваем файл
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при создании HTML:', error);
      alert('Ошибка при создании HTML файла. Проверьте консоль для деталей.');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      className="modern-btn modern-btn-secondary"
      title={variant === 'single' ? 'Экспорт цикла в HTML' : 'Экспорт всей истории в HTML'}
    >
      <Download className="w-4 h-4" />
      {buttonText || 'HTML'}
    </motion.button>
  );
};

export default HtmlExport; 