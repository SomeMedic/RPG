#!/bin/bash

echo "🚀 Installing RPG (Rapid Package Generator)..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please, install Node.js (https://nodejs.org)"
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed. Please, install npm"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ $MAJOR_VERSION -lt 16 ]; then
    echo "❌ Node.js 16 or higher required"
    echo "Current version: $NODE_VERSION"
    exit 1
fi

echo "📦 Installing dependencies..."

# Устанавливаем RPG глобально
npm install -g @somemedic/rpg

if [ $? -eq 0 ]; then
    echo "✨ RPG installed successfully!"
    echo ""
    echo "To start working, run:"
    echo "  rpg create react-app my-app    # Create React app"
    echo "  rpg create next-app my-app     # Create Next.js app"
    echo "  rpg create express-api my-app   # Create Express API"
    echo ""
    echo "Documentation: https://github.com/SomeMedic/rpg#readme"
else
    echo "❌ Error installing RPG"
    exit 1
fi 