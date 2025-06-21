import React from 'react';
import jsPDF from 'jspdf';
import { Download, FileText, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { MindloopCycle, AgentConfig } from '../stores/mindloopStore';

interface PdfExportProps {
  cycles: MindloopCycle[];
  agents: Record<string, Pick<AgentConfig, 'name' | 'color'>>;
}

const PdfExport: React.FC<PdfExportProps> = ({ cycles, agents }) => {

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDF = async () => {
    if (cycles.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    // Настройка шрифтов
    pdf.setFont('helvetica');

    // === ШАПКА ДОКУМЕНТА ===
    // Фон шапки (градиент эмуляция)
    pdf.setFillColor(139, 92, 246); // purple
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    pdf.setFillColor(236, 72, 153); // pink  
    pdf.rect(pageWidth * 0.6, 0, pageWidth * 0.4, 50, 'F');

    // Логотип (эмуляция)
    pdf.setFillColor(255, 255, 255);
    pdf.circle(margin + 15, 25, 12, 'F');
    pdf.setFillColor(139, 92, 246);
    pdf.setFontSize(14);
    pdf.setTextColor(139, 92, 246);
    pdf.text('🧠', margin + 10, 30);

    // Заголовок
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('НейроАгент', margin + 35, 30);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Система коллективного сознания', margin + 35, 38);

    // "Сделано в Нейроново"
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Сделано в Нейроново', pageWidth - margin - 40, 25);
    
    // Дата экспорта
    pdf.setFontSize(8);
    pdf.text(`Экспорт: ${formatDate(Date.now())}`, pageWidth - margin - 40, 35);

    yPosition = 65;

    // === ОСНОВНОЙ КОНТЕНТ ===
    pdf.setTextColor(0, 0, 0);
    
    // Заголовок отчета
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Полная история циклов мышления', margin, yPosition);
    yPosition += lineHeight * 2;

    // Общая статистика
    const totalThoughts = cycles.reduce((sum, cycle) => sum + cycle.thoughts.length, 0);
    const totalDuration = cycles.reduce((sum, cycle) => {
      const startTime = cycle.startTime ?? cycle.timestamp;
      if (cycle.endTime && startTime) {
        return sum + (cycle.endTime - startTime);
      }
      return sum;
    }, 0);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Всего циклов: ${cycles.length}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Всего размышлений: ${totalThoughts}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Общее время: ${Math.round(totalDuration / 1000 / 60)} минут`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Проходим по каждому циклу
    for (let cycleIndex = 0; cycleIndex < cycles.length; cycleIndex++) {
      const cycle = cycles[cycleIndex];
      // Проверка на новую страницу
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      // Заголовок цикла
      pdf.setFillColor(248, 250, 252); // gray-50
      pdf.rect(margin - 5, yPosition - 5, pageWidth - margin * 2 + 10, 15, 'F');
      
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Цикл #${cycle.number}: ${cycle.topic}`, margin, yPosition + 5);
      yPosition += lineHeight * 2;

      // Информация о цикле
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Начало: ${formatDate(cycle.startTime ?? cycle.timestamp)}`, margin, yPosition);
      if (cycle.endTime) {
        pdf.text(`Завершение: ${formatDate(cycle.endTime)}`, margin + 80, yPosition);
      }
      pdf.text(`Размышлений: ${cycle.thoughts.length}`, margin + 160, yPosition);
      yPosition += lineHeight * 1.5;

      // Размышления агентов
      for (const thought of cycle.thoughts) {
        const agent = agents[thought.agentRole];
        if (!agent) continue;

        // Проверка на новую страницу
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        // Заголовок агента
        pdf.setFillColor(agent.color.includes('#') ? 
          parseInt(agent.color.slice(1, 3), 16) : 139,
          agent.color.includes('#') ? 
          parseInt(agent.color.slice(3, 5), 16) : 92,
          agent.color.includes('#') ? 
          parseInt(agent.color.slice(5, 7), 16) : 246
        );
        pdf.rect(margin, yPosition, pageWidth - margin * 2, 10, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${agent.name} (${formatDate(thought.timestamp)})`, margin + 2, yPosition + 6);
        yPosition += 12;

        // Получено от предыдущего - скрыто для интегратора

        // Рассуждение
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const reasoningLines = pdf.splitTextToSize(`Рассуждение: ${thought.reasoning}`, pageWidth - margin * 2 - 10);
        
        // Проверяем, поместится ли рассуждение на странице
        if (yPosition + reasoningLines.length * lineHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(reasoningLines, margin + 5, yPosition);
        yPosition += lineHeight * reasoningLines.length + 3;

        // Суть
        pdf.setTextColor(139, 92, 246);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const essenceLines = pdf.splitTextToSize(`Суть: ${thought.essence}`, pageWidth - margin * 2 - 10);
        pdf.text(essenceLines, margin + 5, yPosition);
        yPosition += lineHeight * essenceLines.length + 8;
      }

      // Синтез цикла
      const synthesis = cycle.synthesis || cycle.intermediateOutput;
      if (synthesis) {
        pdf.setFillColor(253, 230, 138); // yellow-200
        pdf.rect(margin, yPosition, pageWidth - margin * 2, 10, 'F');
        
        pdf.setTextColor(146, 64, 14); // yellow-800
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Синтез цикла', margin + 2, yPosition + 6);
        yPosition += 12;

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const synthesisLines = pdf.splitTextToSize(synthesis, pageWidth - margin * 2 - 10);
        pdf.text(synthesisLines, margin + 5, yPosition);
        yPosition += lineHeight * synthesisLines.length + 15;
      }
    }

    // === ФУТЕР НА ПОСЛЕДНЕЙ СТРАНИЦЕ ===
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Сгенерировано НейроАгентом - Система коллективного сознания', margin, pageHeight - 15);
    pdf.text(`🧠 Нейроново | ${formatDate(Date.now())}`, margin, pageHeight - 8);

    // Сохранение файла
    const fileName = `НейроАгент_История_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generatePDF}
      disabled={cycles.length === 0}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      <span>Экспорт в PDF</span>
      <FileText className="w-4 h-4" />
    </motion.button>
  );
};

export default PdfExport; 