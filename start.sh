#!/bin/bash

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

clear

echo -e "${PURPLE}"
echo "  ███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗  █████╗  ██████╗ ███████╗███╗   ██╗████████╗"
echo "  ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔═══██╗██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝"
echo "  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   "
echo "  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   "
echo "  ██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   "
echo "  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   "
echo -e "${NC}"
echo
echo -e "${CYAN}                              СДЕЛАНО В НЕЙРОНОВО x ЛАИ${NC}"
echo -e "${WHITE}                         Искусственное Коллективное Сознание${NC}"
echo -e "${YELLOW}                                   Версия 9.2.7${NC}"
echo
echo "================================================================================================"

# Функция для логирования
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# Проверка наличия Node.js
log_step "Проверка системы..."

if ! command -v node &> /dev/null; then
    log_error "Node.js не установлен!"
    echo
    echo -e "${YELLOW}📥 Установите Node.js:${NC}"
    echo "   • Ubuntu/Debian: sudo apt install nodejs npm"
    echo "   • CentOS/RHEL: sudo yum install nodejs npm"
    echo "   • macOS: brew install node"
    echo "   • Или скачайте с https://nodejs.org/"
    echo
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js найден (версия: $NODE_VERSION)"

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    log_error "npm не найден!"
    exit 1
fi

NPM_VERSION=$(npm --version)
log_success "npm найден (версия: $NPM_VERSION)"

# Проверка структуры проекта
if [ ! -d "frontend" ]; then
    log_error "Папка frontend не найдена!"
    echo "   Убедитесь что скрипт запущен из корневой папки проекта"
    exit 1
fi

log_success "Структура проекта корректна"
echo

# Переход в папку frontend
cd frontend

log_step "Установка зависимостей..."
echo "   Это может занять несколько минут при первом запуске..."
echo

if [ ! -d "node_modules" ]; then
    log_info "Первая установка зависимостей..."
    npm install --legacy-peer-deps --no-audit --no-fund
else
    log_info "Обновление зависимостей..."
    npm install --legacy-peer-deps --no-audit --no-fund --silent
fi

if [ $? -ne 0 ]; then
    echo
    log_error "Не удалось установить зависимости!"
    echo
    echo -e "${YELLOW}💡 Возможные решения:${NC}"
    echo "   1. Проверьте подключение к интернету"
    echo "   2. Очистите кэш npm: npm cache clean --force"
    echo "   3. Удалите папку node_modules и попробуйте снова"
    echo "   4. Обновите Node.js до последней версии"
    echo
    exit 1
fi

echo
log_success "Зависимости установлены успешно!"
echo

log_step "Запуск НейроАгент..."
echo -e "${GREEN}   💻 Приложение откроется в браузере автоматически на http://localhost:3000${NC}"
echo -e "${YELLOW}   ⏹️  Для остановки нажмите Ctrl+C в этом терминале${NC}"
echo -e "${CYAN}   🔧 Настройки доступны в правом верхнем углу${NC}"
echo
echo -e "${RED}⚠️  НЕ ЗАКРЫВАЙТЕ ЭТОТ ТЕРМИНАЛ ПОКА РАБОТАЕТЕ С ПРИЛОЖЕНИЕМ!${NC}"
echo

# Запуск приложения
npm start

echo
log_success "НейроАгент завершен"
echo "   Спасибо за использование НейроАгент!" 