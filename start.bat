@echo off
chcp 65001 >nul
cls

echo.
echo  ███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗  █████╗  ██████╗ ███████╗███╗   ██╗████████╗
echo  ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔═══██╗██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
echo  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   
echo  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   
echo  ██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   
echo  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   
echo.
echo                              СДЕЛАНО В НЕЙРОНОВО x ЛАИ
echo                         Искусственное Коллективное Сознание
echo                                   Версия 9.2.7
echo.
echo ================================================================================================

REM Проверка наличия Node.js
echo 🔍 Проверка системы...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ ОШИБКА: Node.js не установлен!
    echo.
    echo 📥 Скачайте Node.js с https://nodejs.org/
    echo    Рекомендуется версия LTS
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js найден
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Версия: %NODE_VERSION%

REM Проверка наличия npm
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ ОШИБКА: npm не найден!
    pause
    exit /b 1
)

echo ✅ npm найден
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    Версия: %NPM_VERSION%

REM Проверка структуры проекта
if not exist "frontend\" (
    echo ❌ ОШИБКА: Папка frontend не найдена!
    echo    Убедитесь что скрипт запущен из корневой папки проекта
    pause
    exit /b 1
)

echo ✅ Структура проекта корректна
echo.

REM Переход в папку frontend
cd frontend

echo 📦 Установка зависимостей...
echo    Это может занять несколько минут при первом запуске...
echo.

if not exist "node_modules\" (
    echo 🔄 Первая установка зависимостей...
    call npm install --legacy-peer-deps --no-audit --no-fund
) else (
    echo 🔄 Обновление зависимостей...
    call npm install --legacy-peer-deps --no-audit --no-fund --silent
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ОШИБКА: Не удалось установить зависимости!
    echo.
    echo 💡 Возможные решения:
    echo    1. Проверьте подключение к интернету
    echo    2. Очистите кэш npm: npm cache clean --force
    echo    3. Удалите папку node_modules и попробуйте снова
    echo    4. Обновите Node.js до последней версии
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Зависимости установлены успешно!
echo.
echo 🚀 Запуск НейроАгент...
echo    💻 Приложение откроется в браузере автоматически на http://localhost:3000
echo    ⏹️  Для остановки нажмите Ctrl+C в этом окне
echo    🔧 Настройки доступны в правом верхнем углу
echo.
echo ⚠️  НЕ ЗАКРЫВАЙТЕ ЭТО ОКНО ПОКА РАБОТАЕТЕ С ПРИЛОЖЕНИЕМ!
echo.

call npm start

echo.
echo 👋 НейроАгент завершен
echo    Спасибо за использование НейроАгент!
pause 