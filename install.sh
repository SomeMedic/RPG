#!/bin/bash

echo "🚀 Установка RPG (Reliable Package Generator)..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js (https://nodejs.org)"
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Пожалуйста, установите npm"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ $MAJOR_VERSION -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16 или выше"
    echo "Текущая версия: $NODE_VERSION"
    exit 1
fi

echo "📦 Установка зависимостей..."

# Устанавливаем RPG глобально
npm install -g @somemedic/rpg

if [ $? -eq 0 ]; then
    echo "✨ RPG успешно установлен!"
    echo ""
    echo "Для начала работы выполните:"
    echo "  rpg create react-app my-app    # Создать React приложение"
    echo "  rpg create next-app my-app     # Создать Next.js приложение"
    echo "  rpg create express-api my-app   # Создать Express API"
    echo ""
    echo "Документация: https://github.com/SomeMedic/rpg#readme"
else
    echo "❌ Ошибка при установке RPG"
    exit 1
fi 