import { Plugin, PluginContext } from '../../core/plugins/Plugin.js';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

const plugin: Plugin = {
  name: 'rpg-plugin-cli',
  version: '1.0.0',
  description: 'Улучшенный CLI интерфейс',
  hooks: {},
  async init(context: PluginContext) {
    if (!context.program) return;

    // Создаем градиент в камуфляжных цветах
    const camoGradient = gradient([
      '#4B5320', // Olive
      '#544F3D', // Khaki
      '#3B3C36', // Dark Olive
      '#4A5D23', // Army Green
      '#515744'  // Field Gray
    ]);

    // Создаем ASCII арт
    const asciiArt = figlet.textSync('RPG', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });

    // Формируем описание справки
    const helpDescription = `
${camoGradient(asciiArt)}

RPG (Rapid Package Grabber) - современный пакетный менеджер
Версия: ${chalk.hex('#4B5320').bold('1.0.0')}

Основные команды:
  ${chalk.hex('#544F3D')('init')}          Инициализация нового проекта
  ${chalk.hex('#544F3D')('install')}       Установка пакетов
  ${chalk.hex('#544F3D')('uninstall')}     Удаление пакетов
  ${chalk.hex('#544F3D')('update')}        Обновление пакетов
  ${chalk.hex('#544F3D')('list')}          Просмотр установленных пакетов
  ${chalk.hex('#544F3D')('create')}        Создание нового проекта из шаблона

Опции:
  ${chalk.hex('#515744')('-v, --version')} Показать версию
  ${chalk.hex('#515744')('-h, --help')}    Показать справку по команде

Примеры использования:
  ${chalk.hex('#4A5D23')('rpg init')}                    Создать новый проект
  ${chalk.hex('#4A5D23')('rpg install express')}         Установить пакет
  ${chalk.hex('#4A5D23')('rpg install -D typescript')}   Установить dev-зависимость
  ${chalk.hex('#4A5D23')('rpg update')}                  Обновить все пакеты
  ${chalk.hex('#4A5D23')('rpg create react-app my-app')} Создать React приложение

Для получения подробной справки по команде используйте:
rpg [команда] --help
`;

    // Показываем справку только если это не дочерний процесс
    if (!process.env.RPG_CHILD && (process.argv.length <= 2 || process.argv.includes('--help') || process.argv.includes('-h'))) {
      console.log(helpDescription);
    }
  }
};

export default plugin; 