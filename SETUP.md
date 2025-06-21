# 🚀 Быстрая Установка НейроАгент

## 📋 Требования

- **Node.js** 16+ ([скачать](https://nodejs.org/))
- **npm** 7+ (устанавливается с Node.js)
- **Современный браузер** (Chrome, Firefox, Safari, Edge)

## ⚡ Суперпростой Запуск

### Windows
```bash
# Просто дважды кликните:
start.bat
```

### Linux/macOS
```bash
# Сделать исполняемым (однократно):
chmod +x start.sh

# Запуск:
./start.sh
```

## 🔧 Ручная Установка

Если автоматические скрипты не работают:

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/neuronovo-X/neuroagent.git
   cd neuroagent
   ```

2. **Установите зависимости:**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

3. **Запустите проект:**
   ```bash
   npm start
   ```

4. **Откройте браузер:**
   ```
   http://localhost:3000
   ```

## ⚙️ Настройка

1. **Получите API ключ OpenRouter:**
   - Перейдите на [OpenRouter.ai](https://openrouter.ai/)
   - Зарегистрируйтесь и получите бесплатный ключ

2. **Добавьте ключ в приложение:**
   - Откройте НейроАгент
   - Нажмите на шестеренку (Настройки)
   - Вставьте ваш API ключ

3. **Выберите пресет моделей:**
   - 🆓 **Бесплатные модели** - для экономного использования
   - 💎 **Рекомендуемые модели** - оптимальный баланс
   - 🚀 **Премиум модели** - максимальное качество

## 🔧 Решение Проблем

### ❌ Ошибки установки:
```bash
# Очистить кэш npm:
npm cache clean --force

# Удалить node_modules и переустановить:
rm -rf frontend/node_modules
cd frontend
npm install --legacy-peer-deps
```

### ❌ Порт 3000 занят:
```bash
# Используйте другой порт:
PORT=3001 npm start
```

### ❌ Проблемы с правами (Linux/macOS):
```bash
# Дать права на выполнение:
chmod +x start.sh
```

## 📞 Поддержка

- **GitHub Issues:** [github.com/neuronovo-X/neuroagent/issues](https://github.com/neuronovo-X/neuroagent/issues)
- **Email:** support@neuroagent.com

---

**🎉 Готово!** Теперь вы можете использовать НейроАгент для создания коллективного анализа любых тем! 