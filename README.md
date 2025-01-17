# RPG (Rapid Package Generator)

Современный пакетный мета-менеджер с поддержкой шаблонов проектов и удобным CLI интерфейсом, созданный для управления зависимостями и автоматического создания шаблонных проектов.

## Установка

### Автоматическая установка

#### Windows
```powershell
# Запустите PowerShell от имени администратора и выполните:
iwr -useb https://raw.githubusercontent.com/SomeMedic/rpg/master/install.ps1 | iex
```

#### Linux/macOS
```bash
curl -fsSL https://raw.githubusercontent.com/SomeMedic/rpg/master/install.sh | bash
```

### Ручная установка
```bash
npm install -g @somemedic/rpg
```

## Основные команды

### Создание проекта

```bash
rpg create <template> [name] [-f|--force]
```

Доступные шаблоны:
- `react-app` - React + TypeScript + Vite
- `next-app` - Next.js + TypeScript + Tailwind CSS
- `express-api` - Express.js + TypeScript + Prisma + JWT
- `vue-app` - Vue 3 + TypeScript + Pinia
- `nest-api` - Nest.js + TypeScript + TypeORM + Swagger
- `electron-app` - Electron + React + TypeScript
- `react-native-app` - React Native + TypeScript + Navigation

### Управление зависимостями

```bash
# Установка пакетов
rpg install [...packages]     # Установить пакеты
rpg install -D [...packages]  # Установить dev-зависимости

# Удаление пакетов
rpg uninstall [...packages]   # Удалить пакеты
rpg uninstall -y             # Удалить без подтверждения

# Обновление пакетов
rpg update [...packages]      # Обновить пакеты
rpg update -y                # Обновить без подтверждения

# Просмотр зависимостей
rpg list                     # Список всех зависимостей
rpg list -D                  # Только dev-зависимости
rpg list -p                  # Только prod-зависимости
rpg list -j                  # Вывод в JSON формате
```

### Запуск скриптов

```bash
rpg run <script>             # Запустить скрипт из package.json
rpg run dev                  # Запустить dev сервер
rpg run build               # Собрать проект
rpg run test                # Запустить тесты
```

## Особенности

- 🎨 Красивый CLI интерфейс
- 📦 Поддержка deps.json для разделения зависимостей
- 🚀 Готовые шаблоны для популярных фреймворков
- ⚡️ Быстрая установка зависимостей
- 🔄 Автоматическое обновление пакетов
- 📋 Подробный вывод информации о зависимостях
- 🛡️ Проверка совместимости версий
- 🔍 Интерактивный выбор пакетов

## Конфигурация

RPG использует два файла для управления зависимостями:
- `package.json` - стандартный файл npm
- `deps.json` - дополнительный файл для более гибкого управления зависимостями

Пример `deps.json`:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

## Лицензия

MIT 
