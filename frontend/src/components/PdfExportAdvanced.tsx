import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { MindloopCycle } from '../stores/mindloopStore';

interface PdfExportAdvancedProps {
  cycle?: MindloopCycle;
  cycles?: MindloopCycle[];
  buttonText?: string;
  variant?: 'single' | 'all';
}

const PdfExportAdvanced: React.FC<PdfExportAdvancedProps> = ({ 
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

  // Улучшенная функция разбиения текста с учетом ширины страницы
  const splitTextForPDF = (pdf: jsPDF, text: string, maxWidth: number): string[] => {
    // Используем встроенную функцию jsPDF для правильного разбиения
    try {
      return pdf.splitTextToSize(text, maxWidth);
    } catch (error) {
      // Fallback: простое разбиение по словам
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        // Примерная оценка ширины (1 символ ≈ 2.5 единиц)
        if (testLine.length * 2.5 > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    }
  };

  // Безопасное добавление текста с поддержкой русского
  const addTextSafely = (pdf: jsPDF, text: string, x: number, y: number, options?: any): void => {
    try {
      // Пытаемся добавить русский текст напрямую
      pdf.text(text, x, y, options);
    } catch (error) {
      console.warn('Ошибка добавления русского текста, используем fallback:', error);
      // Fallback: простая замена проблемных символов
      const cleanText = text
        .replace(/[«»]/g, '"')
        .replace(/[–—]/g, '-')
        .replace(/[…]/g, '...');
      
      try {
        pdf.text(cleanText, x, y, options);
      } catch (error2) {
        // Крайний случай: только ASCII
        const asciiText = text.replace(/[^\x00-\x7F]/g, '?');
        pdf.text(asciiText, x, y, options);
      }
    }
  };

  const generateSingleCyclePDF = (cycleData: MindloopCycle): jsPDF => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let yPosition = margin;

    // Настройка шрифта для лучшей поддержки Unicode
    pdf.setFont('helvetica');

    // === ШАПКА ДОКУМЕНТА ===
    pdf.setFillColor(139, 92, 246);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    pdf.setFillColor(236, 72, 153);
    pdf.rect(pageWidth * 0.7, 0, pageWidth * 0.3, 45, 'F');

    // Заголовок
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    addTextSafely(pdf, 'НейроАгент', margin, 25);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    addTextSafely(pdf, 'Система коллективного сознания', margin, 35);

    // Брендинг
    pdf.setFontSize(9);
    addTextSafely(pdf, 'Сделано в Нейроново', pageWidth - margin - 35, 20);
    addTextSafely(pdf, `Экспорт: ${formatDate(Date.now())}`, pageWidth - margin - 35, 30);

    yPosition = 55;

    // === ИНФОРМАЦИЯ О ЦИКЛЕ ===
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    
    addTextSafely(pdf, `Цикл #${cycleData.number}`, margin, yPosition);
    yPosition += 10;
    
    // Тема с переносом строк
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    const topicLines = splitTextForPDF(pdf, `Тема: ${cycleData.topic}`, contentWidth);
    for (const line of topicLines) {
      addTextSafely(pdf, line, margin, yPosition);
      yPosition += 8;
    }
    yPosition += 5;

    // Информация о цикле
    pdf.setFontSize(10);
    addTextSafely(pdf, `Начало: ${formatDate(cycleData.startTime ?? cycleData.timestamp)}`, margin, yPosition);
    if (cycleData.endTime) {
      addTextSafely(pdf, `Завершение: ${formatDate(cycleData.endTime)}`, margin + 80, yPosition);
    }
    addTextSafely(pdf, `Размышлений: ${cycleData.thoughts.length}`, margin + 160, yPosition);
    yPosition += 15;

    // === РАЗМЫШЛЕНИЯ АГЕНТОВ ===
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    addTextSafely(pdf, 'РАЗМЫШЛЕНИЯ АГЕНТОВ', margin, yPosition);
    yPosition += 10;

    for (const thought of cycleData.thoughts) {
      // Проверка на новую страницу
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }

      // Заголовок агента
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 3, contentWidth, 12, 'F');
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      
      const agentInfo = `${getAgentName(thought.agentRole)} - ${formatDate(thought.timestamp)}`;
      addTextSafely(pdf, agentInfo, margin + 2, yPosition + 5);
      yPosition += 15;

      // Получено от предыдущего - скрыто для интегратора

      // Рассуждение с правильным переносом
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      addTextSafely(pdf, '🧠 РАССУЖДЕНИЕ:', margin + 5, yPosition);
      yPosition += lineHeight;
      
      pdf.setFont('helvetica', 'normal');
      const reasoningLines = splitTextForPDF(pdf, thought.reasoning, contentWidth - 10);
      
      for (const line of reasoningLines) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        addTextSafely(pdf, line, margin + 5, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 5;

      // Суть с правильным переносом
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      addTextSafely(pdf, '✨ СУТЬ:', margin + 5, yPosition);
      yPosition += lineHeight;
      
      pdf.setFont('helvetica', 'normal');
      const essenceLines = splitTextForPDF(pdf, thought.essence, contentWidth - 10);
      
      for (const line of essenceLines) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        addTextSafely(pdf, line, margin + 5, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 15;
    }

    // === ФУТЕР ===
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      addTextSafely(pdf, `Страница ${i} из ${pageCount}`, pageWidth - margin - 30, pageHeight - 10);
      addTextSafely(pdf, 'НейроАгент - Нейроново × ЛАИ', margin, pageHeight - 10);
    }

    return pdf;
  };

  const generateAllCyclesPDF = (cyclesData: MindloopCycle[]): jsPDF => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    pdf.setFont('helvetica');

    // === ШАПКА ===
    pdf.setFillColor(139, 92, 246);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    addTextSafely(pdf, 'НейроАгент - Полная История', margin, 25);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    addTextSafely(pdf, `Экспорт всех циклов: ${formatDate(Date.now())}`, margin, 35);

    yPosition = 60;

    // === СТАТИСТИКА ===
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    addTextSafely(pdf, 'ОБЩАЯ СТАТИСТИКА', margin, yPosition);
    yPosition += 10;

    const totalThoughts = cyclesData.reduce((sum, cycle) => sum + cycle.thoughts.length, 0);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    addTextSafely(pdf, `Всего циклов: ${cyclesData.length}`, margin, yPosition);
    addTextSafely(pdf, `Всего размышлений: ${totalThoughts}`, margin + 80, yPosition);
    yPosition += 15;

    // === ЦИКЛЫ ===
    for (const cycle of cyclesData) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }

      // Заголовок цикла с переносом
      pdf.setFillColor(240, 240, 255);
      pdf.rect(margin, yPosition - 3, contentWidth, 15, 'F');
      
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      
      const cycleTitleLines = splitTextForPDF(pdf, `Цикл #${cycle.number}: ${cycle.topic}`, contentWidth - 10);
      for (const line of cycleTitleLines) {
        addTextSafely(pdf, line, margin + 2, yPosition + 8);
        yPosition += 8;
      }
      yPosition += 10;

      // Краткие размышления с переносом
      for (const thought of cycle.thoughts.slice(0, 3)) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        addTextSafely(pdf, `${getAgentName(thought.agentRole)}:`, margin + 5, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        const shortEssence = thought.essence.substring(0, 200) + (thought.essence.length > 200 ? '...' : '');
        const lines = splitTextForPDF(pdf, shortEssence, contentWidth - 10);
        
        for (let i = 0; i < Math.min(lines.length, 2); i++) {
          addTextSafely(pdf, lines[i], margin + 5, yPosition);
          yPosition += 5;
        }
        yPosition += 5;
      }
      
      if (cycle.thoughts.length > 3) {
        pdf.setTextColor(128, 128, 128);
        pdf.setFontSize(8);
        addTextSafely(pdf, `... и еще ${cycle.thoughts.length - 3} размышлений`, margin + 5, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10;
    }

    return pdf;
  };

  const handleExport = async () => {
    try {
      let pdf: jsPDF;
      let filename: string;

      if (variant === 'single' && cycle) {
        pdf = generateSingleCyclePDF(cycle);
        filename = `neuroagent-цикл-${cycle.number}.pdf`;
      } else if (variant === 'all' && cycles) {
        pdf = generateAllCyclesPDF(cycles);
        filename = `neuroagent-полная-история.pdf`;
      } else {
        console.error('Неверные параметры для экспорта PDF');
        return;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF. Проверьте консоль для деталей.');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      className="modern-btn modern-btn-secondary"
      title={variant === 'single' ? 'Экспорт цикла в PDF' : 'Экспорт всей истории в PDF'}
    >
      <FileText className="w-4 h-4" />
      {buttonText || 'PDF'}
    </motion.button>
  );
};

export default PdfExportAdvanced; 