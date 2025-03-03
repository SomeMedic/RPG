# История изменений

Все значимые изменения в этом проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект следует [Semantic Versioning](https://semver.org/lang/ru/).

## [1.0.0] - 2024-03-XX

### Добавлено
- Основной функционал менеджера пакетов
- Команда `install` для установки пакетов
- Команда `uninstall` для удаления пакетов
- Команда `update` для обновления пакетов
- Команда `list` для просмотра установленных пакетов
- Команда `run` для запуска скриптов
- Команда `create` для создания новых проектов
- Шаблоны проектов:
  - `react-app`: React + TypeScript + Vite
  - `next-app`: Next.js + TypeScript + Tailwind CSS
  - `express-api`: Express.js + TypeScript + Prisma + JWT
  - `vue-app`: Vue 3 + TypeScript + Pinia
- Система плагинов для расширения функциональности
- Поддержка Windows, Linux и macOS
- Красивый CLI интерфейс
- Установочные скрипты для разных платформ

### Изменено
- Улучшен вывод сообщений в консоль
- Добавлена поддержка UTF-8 в PowerShell

### Исправлено
- Исправлены проблемы с кодировкой в Windows
- Исправлены конфликты между плагинами
- Исправлена обработка аргументов командной строки